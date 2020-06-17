import React, { useState, useEffect } from "react";
import cookie from "js-cookie";
import socketIOClient from "socket.io-client";

const Typing = () => {
  const [type, settype] = useState(false);

  useEffect(() => {
    const socket = socketIOClient();
    socket.on(`${cookie.get("user_id")}_type`, (data) => {
      settype(data);
    });
    return () => {
      socket.close();
    };
  }, [type]);

  const typing = "typing...";
  return <p>{type ? typing : ""}</p>;
};

export default Typing;
