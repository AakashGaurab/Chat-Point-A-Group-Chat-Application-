const express = require("express");
const http = require("http")
const socketio = require("socket.io");
const formateMessage = require("./messages");
const { userJoin, getRoomUsers, getCurrentUser, userLeave } = require('./users')
const app = express();
const server = http.createServer(app);
const io = socketio(server);
const cors = require("cors");
const {data} = require("./routes/message");
const {msg_model} = require("./models/message_model");
const boatName = 'chat point'

app.use(express.json());
app.use("/data",data);

app.get("/",(req,res)=>{
    res.json('The Chat server')
})
io.on("connection", (socket) => {
    console.log("One user joined")
    socket.on('joinRoom', ({ username, room }) => {
        const user = userJoin(socket.id, username, room)
        socket.join(user.room)
        socket.emit('message', formateMessage(boatName, 'welcome to chat point'))
        socket.broadcast.to(user.room).emit('message', formateMessage(boatName, `${user.username} has joined the chat`))
        io.to(user.room).emit('roomUsers', { room: user.room, users: getRoomUsers(user.room) })
    })
    socket.on('chatMessage', async (msg) => {
        const user = getCurrentUser(socket.id);
        let formatted_msg = formateMessage(user.username, msg);
        console.log(user,formatted_msg);
        await msg_model.insertMany([formatted_msg]);
        io.to(user.room).emit('message', formateMessage(user.username, msg))
    })
    socket.on('disconnect', () => {
        const user = userLeave(socket.id)
        io.to(user.room).emit('message', formateMessage(boatName, `${user.username} has left the chat`))
        io.to(user.room).emit('roomUsers', {
            room: user.room, users: getRoomUsers(user.room)
        })
    })
})

const port = 4500;
server.listen(port, () => { console.log("Server is running on port" + port) });