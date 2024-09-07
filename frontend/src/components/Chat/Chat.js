import React, { useEffect, useRef, useState } from "react";
import socketIO from "socket.io-client";
import "./Chat.css";
import sendLogo from "../../image/send.png";
import Message from "../messages/Message.js";
import ReactScrollToBottom from "react-scroll-to-bottom"
import closeIcon from "../../image/closeIcon.png"
import { useUser } from "../../UserContext.js";

const ENDPOINT = "https://group-chat-gwtq.onrender.com/";
// const ENDPOINT = "http://localhost:4500/";

let socket;

const Chat = () => {
  const { user } = useUser();
  const [id, setid] = useState("");
  const [messages, setmessages] = useState([]);
  const inputRef = useRef(null)

  const send = () => {
    const message = document.getElementById("chatInput").value;
    socket.emit("message", { message, id });
    document.getElementById("chatInput").value = "";
  };

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
    });
    return () => {
      socket.off()
    };
  }, [messages]);


  //user joined message
  useEffect(() => {
    socket.on("userJoined", (data) => {
      setmessages([...messages, data])
    });
    return () => {
      socket.off()
    };
  }, [messages]);


  //user leaved message
  useEffect(() => {
    socket.on("leave", (data) => {
      setmessages([...messages, data])
    });
    return () => {
      socket.off()
    };
  }, [messages]);


  //user's sent messages 
  useEffect(() => {
    socket.on("sendmessage", (data) => {
      setmessages([...messages, data])
    });
    return () => {
      socket.off()
    };
  }, [messages]);


  //off socket when user left (when user close that page --> its run in unmounting evnet)
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
          <input onKeyPress={(event)=> event.key === 'Enter'&&inputRef.current.value? send(): null} type="text" ref={inputRef} id="chatInput" />
          <button onClick={()=> !inputRef.current.value ? null:send()}  className="sendBtn">
            <img src={sendLogo} alt="Send" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
