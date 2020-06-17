"use strict";

const mongoose = require("mongoose"); //import mongoose library
const User = mongoose.model("User"); //import user schema

// list all users
exports.list_user = (req, res) => {
  const id = req.user._id;
  return new Promise((resolve, reject) => {
    User.aggregate()
      .match({ _id: { $not: { $eq: id } } })
      .project({
        password: 0,
        __v: 0,
        date: 0,
        email: 0,
        tokens: 0,
      })
      .exec((err, users) => {
        if (err) {
          console.log(err);
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ message: "Failure" }));
          res.sendStatus(500);
        } else {
          res.send(users);
        }
      });
  });
};

//to create a new user
exports.create_user = (body) => {
  return new Promise(async (resolve, reject) => {
    var new_user = new User(body); // create new user instance form body of request
    const user = await new_user.save().catch((err) => {
      reject(err.keyValue);
    }); //save user
    if (user) {
      const token = await user.generateAuthToken(); //generate jwt token for user
      const username = user.username; // store username
      const id = user._id; //store user id
      resolve({
        id,
        token,
        username,
      }); //respond with data
    }
  });
};

//logging in a user
exports.login = (body) => {
  return new Promise(async (resolve, reject) => {
    const { email, password } = body; // store email and password
    const user = await User.findByCredentials(email, password); // find user by email and password
    if (user.error) {
      reject(user);
      return;
    } else {
      const token = await user.generateAuthToken(); //generate jwt token
      const username = user.username;
      const id = user._id;
      resolve({
        id,
        token,
        username,
      }); // respond with data
    }
  });
};
