const express = require("express");
const app = express();
const http = require('http');
const cors = require("cors");
const { Server } = require("socket.io")

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// on => event(Listen), we can emit in client side!
io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);

    // Event to join in a particular room!
    socket.on("join_room", (data) => {
        socket.join(data);
        console.log(`User with ID: ${socket.id} joined room: ${data}`)
    })

    // Event to send_message.
    socket.on("send_message", (data) => {
        // Emit the sended message to other user in that room.
        socket.to(data.room).emit("receive_message", data);
    })

    socket.on("disconnect", () => {
        console.log(`User Disconnected: ${socket.id}`);
    })
})

server.listen(3001, () => {
    console.log("Server is listening")
})