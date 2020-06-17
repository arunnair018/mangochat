import React, { useState, useEffect, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import SendIcon from "@material-ui/icons/Send";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Paper from "@material-ui/core/Paper";
import socketIOClient from "socket.io-client";
import cookie from "js-cookie";
import Typing from "./typing";

import {
  useGetGlobalMessages,
  useSendGlobalMessage,
  useGetConversationMessages,
  useSendConversationMessage,
} from "../../services/chatService";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100%",
  },
  headerRow: {
    maxHeight: 60,
    zIndex: 5,
  },
  paper: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    color: theme.palette.primary.dark,
  },
  messageContainer: {
    height: "100%",
  },
  messagesRow: {
    maxHeight: "70vh",
    overflowY: "auto",
  },
  newMessageRow: {
    width: "100%",
    padding: theme.spacing(0, 2, 1),
  },
  inputRow: {
    display: "flex",
    alignItems: "flex-end",
  },
  form: {
    width: "100%",
  },
  avatar: {
    margin: theme.spacing(1, 1.5),
  },
  listItem: {
    width: "100%",
  },
  listItemText: {
    backgroundColor: "lightgrey",
    padding: 20,
    borderRadius: 30,
    wordWrap: "break-word",
  },
  listItemTextgreen: {
    backgroundColor: "lightgreen",
    padding: 20,
    borderRadius: 30,
    textAlign: "right",
    wordWrap: "break-word",
  },
  submit: {
    margin: "10%",
    backgroundColor: "lightblue",
  },
}));

const ChatBox = (props) => {
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [lastMessage, setLastMessage] = useState(null);

  const getGlobalMessages = useGetGlobalMessages();
  const sendGlobalMessage = useSendGlobalMessage();
  const getConversationMessages = useGetConversationMessages();
  const sendConversationMessage = useSendConversationMessage();
  const socket = socketIOClient();
  let chatBottom = useRef(null);
  const classes = useStyles();

  useEffect(() => {
    reloadMessages();
    scrollToBottom();
  }, [lastMessage, props.scope, props.conversationId]);

  useEffect(() => {
    socket.on("messages", (data) => setLastMessage(data));
    socket.on(`${cookie.get("user_id")}`, (data) => setLastMessage(data));
  }, []);

  const reloadMessages = () => {
    if (props.scope === "Global Chat") {
      getGlobalMessages().then((res) => {
        setMessages(res);
      });
    } else if (props.scope !== null && props.conversationId !== null) {
      getConversationMessages(props.user._id).then((res) => setMessages(res));
    } else {
      setMessages([]);
    }
  };

  const scrollToBottom = () => {
    chatBottom.current.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleType = (e) => {
    setNewMessage(e.target.value);
    socket.emit("typing", { to: `${props.user._id}_type`, val: true });

    socket.emit("typing", { to: `${props.user._id}_type`, val: false });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (props.scope === "Global Chat") {
      sendGlobalMessage(newMessage).then(() => {
        setNewMessage("");
      });
    } else {
      sendConversationMessage(props.user._id, newMessage).then((res) => {
        setNewMessage("");
      });
    }
  };

  return (
    <Grid container className={classes.root}>
      <Grid item xs={12} className={classes.headerRow}>
        <Paper className={classes.paper} square elevation={2}>
          <Typography color='inherit' variant='h6'>
            {props.scope}
          </Typography>
        </Paper>
      </Grid>
      <Grid item xs={12}>
        <Grid container className={classes.messageContainer}>
          <Grid item xs={12} className={classes.messagesRow}>
            {messages && (
              <List>
                {messages.map((m) => (
                  <ListItem
                    key={m._id}
                    className={classes.listItem}
                    alignItems='flex-start'
                  >
                    <ListItemText
                      className={
                        m.fromObj[0].name === cookie.get("username")
                          ? classes.listItemTextgreen
                          : classes.listItemText
                      }
                      primary={
                        <React.Fragment>
                          <React.Fragment>{m.body}</React.Fragment>
                        </React.Fragment>
                      }
                      secondary={
                        m.fromObj[0].name === cookie.get("username")
                          ? `(${m.time.slice(0, 5)})`
                          : `${m.fromObj[0].name} (${m.time.slice(0, 5)})`
                      }
                    />
                    <p>
                      {m.fromObj[0].name === cookie.get("username")
                        ? m.status
                        : ""}
                    </p>
                  </ListItem>
                ))}
              </List>
            )}
            <div ref={chatBottom} />
          </Grid>
          <Grid item xs={12} className={classes.inputRow}>
            <form onSubmit={handleSubmit} className={classes.form}>
              <Grid
                container
                className={classes.newMessageRow}
                alignItems='flex-end'
              >
                <Grid item xs={11}>
                  <TextField
                    id='message'
                    label='Message'
                    variant='outlined'
                    margin='dense'
                    fullWidth
                    value={newMessage}
                    onChange={handleType}
                  />
                </Grid>
                <Grid item xs={1}>
                  <IconButton type='submit' className={classes.submit}>
                    <SendIcon />
                  </IconButton>
                </Grid>
              </Grid>
              <Typing />
            </form>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ChatBox;
