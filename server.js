const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const User = require("./src/models/UserSchema");
const Message = require("./src/models/MessageSchema");
const Global = require("./src/models/GlobalMsgSchema");
const Conversation = require("./src/models/ConversationSchema");
const socket = require("socket.io");
const router = require("./src/routes/routerv1");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config();

// Express object
const app = express();

// Body Parser middleware to parse request bodies
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());

// CORS middleware
app.use(cors());

// Port that the webserver listens to
const port = process.env.PORT || 5000;

// Web server
const server = app.listen(port, () => {
  console.log(`server listening on ${port}`);
});

// Create and bind socket to server
const io = socket(server);
io.origins("*:*"); // cors for socket

io.on("connection", (socket) => {
  socket.on("typing", (data) => {
    io.emit(data.to, data.val);
  });
});

// MongoDB Database configuration
const db_username = process.env.MONGOUSER;
const db_password = process.env.MONGOPASS;
const url = `mongodb+srv://${db_username}:${db_password}@cluster0-d435h.mongodb.net/test?retryWrites=true&w=majority`;
mongoose
  .connect(url, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Successfully Connected..."))
  .catch((err) => console.log(err));

// Attach socket object to every req --middleware
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Pass all request to router
router(app);

// Serve static files from the React app
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client/build")));
}
