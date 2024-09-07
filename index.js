const http = require("http");
const express = require("express");
const port = process.env.PORT || 4500;
const app = express(); 
const cors = require("cors");
const server = http.createServer(app);
const socketIO = require("socket.io");
const path = require("path");
const io = socketIO(server);

const users = [];

app.use(cors());

app.use(express.static(path.join(__dirname, "./frontend/build")))

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./frontend/build/index.html"))
});


//socket

io.on("connection", (socket) => {

  socket.on("joined", ({ user }) => {
    users[socket.id] = user;
    socket.emit("welcome", {user: `${user}`, message : `welcome to the chat `}) // emiting a message to current socket (user) only
    socket.broadcast.emit("userJoined", {user: `${user}`, message : `has joined the chat`}) // emitting a message to all sockets except current one
  })

  socket.on('disconnect', () => {
    socket.broadcast.emit('leave', {user : `${users[socket.id]}`, message : `has left the chat`})
  })
  
  socket.on('message', ({message,id}) => {
    io.emit('sendmessage', { user: users[id], message, id }); // emitting a message to all sockets including current one
  })
  

})


//server
server.listen(port, () => {
  console.log(`server is working on http://localhost:${port}`);
});
