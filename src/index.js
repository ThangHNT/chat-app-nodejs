const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const route = require('./routes/index');
const fs = require('fs');
const app = express();
const path = require('path');
const socket = require('socket.io');
require('dotenv').config();
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: '100mb' }));

async function connect() {
    try {
        await mongoose.connect('mongodb://localhost:27017/chat');
        console.log('Connect successfully');
    } catch (err) {
        console.log('connect failed');
    }
}

connect();
route(app);

const server = app.listen(process.env.PORT, () => {
    console.log(`App listen on http://localhost:${process.env.PORT}`);
});

const io = socket(server, {
    cors: {
        orgin: 'http://localhost:5000',
    },
});

io.use((socket, next) => {
    const userId = socket.handshake.auth.userId;
    if (!userId) {
        console.log('loi set id');
        return next(new Error('invalid user-id'));
    }
    socket.userId = userId;
    next();
});

io.on('connection', (socket) => {
    const users = [];
    for (let [id, socket] of io.of('/').sockets) {
        users.push({ socketId: id, userId: socket.userId });
    }
    socket.emit('users', users);

    socket.broadcast.emit('user just connected', {
        socketId: socket.id,
        userId: socket.userId,
    });

    console.log(io.allSockets());

    socket.on('send message', ({ sender, receiver, to, from, content }) => {
        // console.log('to', to);
        // console.log('from', from);
        socket.to(to).to(from).emit('private message', {
            content,
            to,
            from,
            sender,
            receiver,
        });
    });

    socket.on('disconnect', async () => {
        console.log('Client disconnected:', socket.id);
        socket.broadcast.emit('user disconnected', socket.id);
    });
});
