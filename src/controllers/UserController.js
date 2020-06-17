"use strict";

var utils = require("../utils/writer.js"); //import write to create response
var User = require("../services/UserService"); //import user services

//to list all users
module.exports.list_user = (req, res) => {
  User.list_user(req, res)
    .then((response) => {
      utils.writeJson(res, response);
    })
    .catch((response) => {
      utils.writeJson(res, response);
    });
};

//to create a new user
module.exports.create_user = (req, res) => {
  User.create_user(req.body)
    .then((response) => {
      utils.writeJson(res, response);
    })
    .catch((response) => {
      res.status(400).send(response);
    });
};

//to list details of a particular user
module.exports.read_user = (req, res) => {
  var user_name = req.params.username;
  User.read_user(user_name)
    .then((response) => {
      utils.writeJson(res, response);
    })
    .catch((response) => {
      utils.writeJson(res, response);
    });
};

//to update details of particular user
module.exports.update_user = (req, res) => {
  var user_name = req.params.username;
  var body = req.body;
  User.update_user(user_name, body)
    .then((response) => {
      utils.writeJson(res, response);
    })
    .catch((response) => {
      utils.writeJson(res, response);
    });
};

//to delete a particular user
module.exports.delete_user = (req, res) => {
  var user_name = req.params.username;
  User.delete_user(user_name)
    .then((response) => {
      utils.writeJson(res, response);
    })
    .catch((response) => {
      utils.writeJson(res, response);
    });
};

//for login a user
module.exports.login = (req, res) => {
  User.login(req.body)
    .then((response) => {
      utils.writeJson(res, response);
    })
    .catch((response) => {
      res.status(401).send(response);
    });
};

//for logging out a user
module.exports.logout = async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token != req.token;
    });
    await req.user.save();
    res.status(200).send({
      message: "successfully logged out",
    });
  } catch (error) {
    res.status(500).send(error);
  }
};
