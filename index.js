const http = require("http");
const express = require("express");
const port = process.env.PORT || 4500;
const app = express(); 
const cors = require("cors");
const server = http.createServer(app);
const socketIO = require("socket.io");
const path = require("path");
const io = socketIO(server);

const users = [{}];

app.use(cors());

app.use(express.static(path.join(__dirname, "./frontend/build")))

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./frontend/build/index.html"))
});


//socket

io.on("connection", (socket) => {
  console.log("new connection")

  socket.on("joined", ({ user }) => {
    users[socket.id] = user;
    console.log(`${user} has joined`)
    socket.emit("welcome", {user: `${user},`, message : `welcome to the chat `})
    socket.broadcast.emit("userJoined", {user: `${user},`, message : `has joined the chat`})
  })

  socket.on('disconnect', () => {
    socket.broadcast.emit('leave', {user : `${users[socket.id]}`, message : `has left the chat`})
    console.log("user left")
  })
  
  socket.on('message', ({message,id}) => {
    io.emit('sendmessage', { user: users[id], message, id });
  })
  

})


//server
server.listen(port, () => {
  console.log(`server is working on http://localhost:${port}`);
});
