import React, { useRef, useState } from "react";
import "./Join.css";
import { Link } from "react-router-dom";
import { useUser } from "../../UserContext"; // import the context hook

const Join = () => {
  const { setUser } = useUser(); // use context to set the user
  const inputRef  = useRef(null)

  return (
    <div className="JoinPage">
      <div className="JoinContainer">
        <h1>JOIN GROUP CHAT</h1>
        <input
          onChange={(e) => setUser(e.target.value)}
          placeholder="Enter Your Name"
          type="text"
          ref={inputRef}
          id="joinInput"
        />
        <Link
          onClick={(event)=> !inputRef.current.value ? event.preventDefault():null}
          to="/chat"
        >
          <button className="joinbtn">
            Login In
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Join;
