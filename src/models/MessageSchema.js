const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema for Users
const MessageSchema = new Schema({
  conversation: {
    type: Schema.Types.ObjectId,
    ref: "conversations",
  },
  to: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
  from: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
  body: {
    type: String,
    required: true,
  },
  date: {
    type: String,
  },
  time: {
    type: String,
  },
  status: {
    type: String,
    default: "sending...",
  },
});

MessageSchema.pre("save", async function (next) {
  const msg = this;
  const date = new Date();

  msg.date =
    date.getDate() +
    "-" +
    parseInt(date.getMonth() + 1) +
    "-" +
    date.getFullYear();

  msg.time =
    date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();

  next(); // call the next middleware
});

module.exports = Message = mongoose.model("messages", MessageSchema);
