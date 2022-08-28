import React from "react";
import "./Message.css";

const messages = ({ user, message, classs }) => {
  if (user) {
    return (
      <div className={`messageBox ${classs}`}>{`${user}: ${message}`}</div>
    );
  } else {
    return <div className={`messageBox ${classs}`}>{`you: ${message}`}</div>;
  }
};

export default messages;
