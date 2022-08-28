import React, { useEffect, useState } from "react";
import { user } from "../Join/Join.js";
import socketIO from "socket.io-client";
import "./Chat.css";
import sendLogo from "../../image/send.png";
import Message from "../messages/Message.js";
import ReactScrollToBottom from "react-scroll-to-bottom"
import closeIcon from "../../image/closeIcon.png"


const ENDPOINT = "https://group-chat-ap.herokuapp.com/";

let socket;

const Chat = () => {
  const [id, setid] = useState("");
  const [messages, setmessages] = useState([]);

  const send = () => {
    const message = document.getElementById("chatInput").value;
    socket.emit("message", { message, id });
    document.getElementById("chatInput").value = "";
  };

  console.log(messages)

  //for connect the socket
  useEffect(() => {
    socket = socketIO(ENDPOINT, { transports: ["websocket"] });

    socket.on("connect", () => {
      setid(socket.id);
    });

    socket.emit("joined", { user });

    return () => {
    };
  }, []);
  
  //welcome msg after connect the socket
  useEffect(() => {
    socket.on("welcome", (data) => {
      setmessages([...messages, data])
      console.log(data.user, data.message);
    });
    return () => {
      socket.off()
    };
  }, [messages]);


  //user joined message
  useEffect(() => {
    socket.on("userJoined", (data) => {
      setmessages([...messages, data])
      console.log(data.user, data.message);
    });
    return () => {
      socket.off()
    };
  }, [messages]);


  //user leaved message
  useEffect(() => {
    socket.on("leave", (data) => {
      setmessages([...messages, data])
      console.log(data.user, data.message);
    });
    return () => {
      socket.off()
    };
  }, [messages]);


  //user's sent messages 
  useEffect(() => {
    socket.on("sendmessage", (data) => {
      setmessages([...messages, data])
      console.log(data.user, data.message, data.id);
    });
    return () => {
      socket.off()
    };
  }, [messages]);


  //off socket when user left
  useEffect(() => {
    return () => {
      socket.emit("disconnect")
      socket.off()
    }
  }, [])


  return (
    <div className="chatPage">
      <div className="chatContainer">
        <div className="header">
          <h2>GROUP CHAT</h2>
          <a href="/" ><img src= {closeIcon} alt="close" /></a>
        </div>
        <ReactScrollToBottom className="chatBox">
          {messages.map((item, i) => < Message key={i} user={item.id===id?"": item.user} message={item.message} classs={item.id===id?"right": "left"}/> )};
        </ReactScrollToBottom>

        <div className="inputBox">
          <input onKeyPress={(event)=> event.key === 'Enter'? send(): null} type="text" id="chatInput" />
          <button onClick={send} className="sendBtn">
            <img src={sendLogo} alt="Send" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
