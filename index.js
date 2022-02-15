const express = require("express");
const app = express();
const http = require("http");
const port = process.env.PORT || 3000;
const server = http.createServer(app);
const { Server } = require("socket.io");
// const { Socket } = require("engine.io");
const io = new Server(server);
// const mongoose = require("mongoose");
const users = {};


app.use('/static', express.static('static'));
app.use(express.urlencoded());

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", Socket => {
  Socket.on("new-user-joined", (name) => {
    users[Socket.id] = name;
    Socket.broadcast.emit('user-joined', name)
  });

  Socket.on('send', message => {
    Socket.broadcast.emit('receive', { message: message, name: users[Socket.id] })
  });

  Socket.on('disconnect', message => {
    Socket.broadcast.emit('left', users[Socket.id])
    delete users[Socket.id]
  });


});

server.listen(port, () => {
  console.log("listening on *:3000");
});


// main().catch((err) => console.log(err));

// async function main() {
//   await mongoose.connect("mongodb://localhost:27017/chat-app");
//   console.log("chat-app is connected");
// }
