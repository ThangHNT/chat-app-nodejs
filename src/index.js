const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const route = require('./routes/index');
const app = express();
const socket = require('socket.io');
require('dotenv').config();
app.use(cors());
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

io.on('connection', (socket) => {
    const users = [];
    for (let [id, socket] of io.of('/').sockets) {
        users.push({
            userID: id,
            username: socket.username,
        });
    }
    socket.emit('users', users);
    socket.broadcast.emit('user connected', {
        userID: socket.id,
        username: socket.username,
    });
});

io.use((socket, next) => {
    const username = socket.handshake.auth.username;
    if (!username) {
        return next(new Error('invalid username'));
    }
    socket.username = username;
    next();
});
