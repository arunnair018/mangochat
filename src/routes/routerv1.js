"use strict";

const user = require("../controllers/UserController");
const auth = require("../middeware/auth");
const chat = require("../controllers/ChatController");

module.exports = (app) => {
  //users api's
  app.route("/api/users").get(auth, user.list_user).post(user.create_user);

  //authentication api's
  app.route("/users/login").post(user.login);
  app.route("/users/logout").post(auth, user.logout);

  //chat api's
  app
    .route("/api/global")
    .get(auth, chat.pullGlobal)
    .post(auth, chat.pushGlobal);
  app.route("/api/conversations").get(auth, chat.pullConversation);
  app.route("/api/conversations/query").get(auth, chat.pullMsg);
  app.route("/api/messages").post(auth, chat.pushMsg);
};
