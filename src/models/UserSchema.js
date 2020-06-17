"use strict";

const mongoose = require("mongoose"); //import mongoose lib
const validator = require("validator"); //import validator lib
const bcrypt = require("bcryptjs"); //import bcrypt lib
const jwt = require("jsonwebtoken"); //import jwttoken lib

// user schema defination
const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    unique: true, // unique username
    type: String,
    required: true, // required feild
    trim: true, // trim the edge spaces
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true, //lowercase all character
    validate: [validator.isEmail, "invalid email"], // check email validity
  },
  password: {
    type: String,
    required: true,
    minLength: 8,
  },
  tokens: [
    {
      // array to store tokens
      token: {
        type: String,
        required: true,
      },
    },
  ],
  date: {
    type: String,
    default: Date.now,
  },
});

// pre save function to hash the password before saving the user model
userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

// Generate an auth token for the user
//for expiration pass in sign function  "exp: Math.floor(Date.now() / 1000) + (60 * 15)",
userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign(
    {
      _id: user._id,
    },
    "secret"
  );
  user.tokens = user.tokens.concat({
    token,
  });
  await user.save();
  return token;
};

// Search for a user by email and match password.
userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({
    email,
  });
  if (!user) {
    return {
      error: "Invalid login credentials",
    };
  }
  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    return {
      error: "Invalid login credentials",
    };
  }
  return user;
};

// model the schema
const User = mongoose.model("User", userSchema);

module.exports = User;
