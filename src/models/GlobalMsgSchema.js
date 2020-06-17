const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema for Users
const GlobalMessageSchema = new Schema({
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
});

GlobalMessageSchema.pre("save", async function (next) {
  const msg = this;
  const date = new Date();

  msg.date =
    date.getDate() +
    "-" +
    parseInt(date.getMonth() + 1) +
    "-" +
    date.getFullYear();

  msg.time =
    ('0'+date.getHours()).slice(-2) + ":" + ('0'+date.getMinutes()).slice(-2) + ":" + date.getSeconds();

  next(); // call the next middleware
});

module.exports = GlobalMessage = mongoose.model(
  "global_messages",
  GlobalMessageSchema
);
