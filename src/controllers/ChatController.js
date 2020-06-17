"use strict";

// Import Modules
const mongoose = require("mongoose");
const Message = require("../models/MessageSchema");
const Conversation = require("../models/ConversationSchema");
const GlobalMessage = require("../models/GlobalMsgSchema");
const ObjectId = require("mongoose").Types.ObjectId;

const statusDelivered = (userid) => {
  Message.update(
    { $and: [{ to: ObjectId(userid) }, { status: "sent" }] },
    { $set: { status: "delivered" } },
    { multi: true },
    (err, msg) => {
      if (err) {
        console.log("errored");
      } else {
        console.log(msg);
      }
    }
  );
};

const statusSeen = (toid, fromid) => {
  Message.update(
    {
      $and: [
        { $and: [{ to: ObjectId(toid) }, { from: ObjectId(fromid) }] },
        { status: "sent" },
      ],
    },
    { $set: { status: "seen" } },
    { multi: true },
    (err, msg) => {
      if (err) {
        console.log("errored");
      } else {
        console.log(msg);
      }
    }
  );
};

// GET global messages
module.exports.pullGlobal = (req, res) => {
  GlobalMessage.aggregate([
    {
      // lookup perform table join
      $lookup: {
        from: "users",
        localField: "from",
        foreignField: "_id",
        as: "fromObj",
      },
    },
  ]) // project to exclude fields whih are not required
    .project({
      "fromObj.password": 0,
      "fromObj.__v": 0,
      "fromObj.email": 0,
      "fromObj.tokens": 0,
    }) // execute the query
    .exec((err, messages) => {
      if (err) {
        console.log(err);
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ message: "Failure" }));
        res.sendStatus(500);
      } else {
        res.send(messages);
      }
    });
};

// POST  global message
module.exports.pushGlobal = (req, res) => {
  // form new global message object from req
  let message = new GlobalMessage({
    from: req.user._id,
    body: req.body.body,
  });

  // broadcast message to everyone
  req.io.sockets.emit("messages", req.body.body);

  // save message to db
  message.save((err) => {
    if (err) {
      console.log(err);
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ message: "Failure" }));
      res.sendStatus(500);
    } else {
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ message: "Success" }));
    }
  });
};

// GET conversation list
module.exports.pullConversation = (req, res) => {
  // set from
  let from = mongoose.Types.ObjectId(req.user._id);
  Conversation.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "recipients",
        foreignField: "_id",
        as: "recipientObj",
      },
    },
  ]) // match to filter table
    .match({ recipients: { $all: [{ $elemMatch: { $eq: from } }] } })
    .project({
      "recipientObj.password": 0,
      "recipientObj.__v": 0,
      "recipientObj.email": 0,
      "recipientObj.tokens": 0,
    })
    .exec((err, conversations) => {
      if (err) {
        console.log(err);
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ message: "Failure" }));
        res.sendStatus(500);
      } else {
        res.send(conversations);
      }
    });
};

// GET inividual messages (based on to and from)
module.exports.pullMsg = (req, res) => {
  statusSeen(req.user._id, req.query.userId);
  req.io.sockets.emit(req.query.userId);
  // set users from req
  let user1 = mongoose.Types.ObjectId(req.user._id);
  let user2 = mongoose.Types.ObjectId(req.query.userId);
  Message.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "to",
        foreignField: "_id",
        as: "toObj",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "from",
        foreignField: "_id",
        as: "fromObj",
      },
    },
  ])
    .match({
      $or: [
        { $and: [{ to: user1 }, { from: user2 }] },
        { $and: [{ to: user2 }, { from: user1 }] },
      ],
    })
    .project({
      "toObj.password": 0,
      "toObj.__v": 0,
      "toObj.email": 0,
      "toObj.tokens": 0,
      "fromObj.password": 0,
      "fromObj.__v": 0,
      "fromObj.email": 0,
      "fromObj.tokens": 0,
    })
    .exec((err, messages) => {
      if (err) {
        console.log(err);
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ message: "Failure" }));
        res.sendStatus(500);
      } else {
        res.send(messages);
      }
    });
};

// POST individual message
module.exports.pushMsg = (req, res) => {
  // set sender and reciever
  let from = mongoose.Types.ObjectId(req.user._id);
  let to = mongoose.Types.ObjectId(req.body.to);

  Conversation.findOneAndUpdate(
    {
      recipients: {
        $all: [{ $elemMatch: { $eq: from } }, { $elemMatch: { $eq: to } }],
      },
    },
    {
      recipients: [req.user._id, req.body.to],
      lastMessage: req.body.body,
      date: Date.now(),
    },
    { upsert: true, new: true, setDefaultsOnInsert: true },
    function (err, conversation) {
      if (err) {
        console.log(err);
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ message: "Failure" }));
        res.sendStatus(500);
      } else {
        let message = new Message({
          conversation: conversation._id,
          to: req.body.to,
          from: req.user._id,
          body: req.body.body,
          status: "sent",
        });

        // send message through socket
        req.io.sockets.emit(from, req.body.body);
        req.io.sockets.emit(to, req.body.body);

        message.save((err) => {
          if (err) {
            console.log(err);
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ message: "Failure" }));
            res.sendStatus(500);
          } else {
            res.setHeader("Content-Type", "application/json");
            res.end(
              JSON.stringify({
                message: "Success",
                conversationId: conversation._id,
              })
            );
          }
        });
      }
    }
  );
};
