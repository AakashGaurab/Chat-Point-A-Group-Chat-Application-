const express = require("express");
const http = require("http")
const socketio = require("socket.io");
const formateMessage = require("./messages");
const { userJoin, getRoomUsers, getCurrentUser, userLeave } = require('./users')
const app = express();
const server = http.createServer(app);
const io = socketio(server);

const boatName = 'chat server'

io.on("connection", (socket) => {
    console.log("One client joined")
    socket.on('joinRoom', ({ username, room }) => {
        const user = userJoin(socket.id, username, room)
        socket.join(user.room)
        socket.emit('message', formateMessage(boatName, 'welcome to chat server'))
        socket.broadcast.to(user.room).emit('message', formateMessage(boatName, `${user.username} has joined the chat`))
        io.to(user.room).emit('roomUsers', { room: user.room, users: getRoomUsers(user.room) })
    })
    socket.on('chatMessage', (msg) => {
        const user = getCurrentUser(socket.id)
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