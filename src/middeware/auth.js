const jwt = require("jsonwebtoken"); //import jsonwebtoken library
const User = require("../models/UserSchema"); //import user schema

//authentication function
const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Basic ", ""); //get token from header
    const data = jwt.verify(token, "secret"); //decode token for data
    //get user from decoded data
    const user = await User.findOne({
      _id: data._id,
      "tokens.token": token,
    });
    //if user not found throw error
    if (!user) {
      throw new Error();
    }
    //add user and token to request
    req.user = user;
    req.token = token;
    next(); //call next middleware
  } catch (error) {
    //if error send response with code 401 and error message.
    res.status(401).send({
      error: "You are not authorized to access this resource...",
    });
  }
};

module.exports = auth; //export function
