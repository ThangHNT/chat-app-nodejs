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
        credentials: true,
    },
    maxHttpBufferSize: 1e8,
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
    // console.log(users);

    socket.broadcast.emit('user just connected', {
        socketId: socket.id,
        userId: socket.userId,
    });

    // console.log(io.allSockets());

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

    socket.on('send reaction icon', ({ sender, receiver, to, from, icon, messageId }) => {
        // console.log(messageId);
        socket.to(to).to(from).emit('private reaction message', {
            messageId,
            icon,
            sender,
            receiver,
        });
    });

    socket.on('block-user', ({ sender, to, from, receiver }) => {
        // console.log(sender, receiver);
        socket.to(to).to(from).emit('user is blocked', { sender, receiver });
    });

    socket.on('unblock-user', ({ sender, to, from, receiver }) => {
        // console.log(sender, receiver);
        socket.to(to).to(from).emit('user is unblocked', { sender, receiver });
    });

    socket.on('remove reaction icon', ({ from, to, receiver, messageId }) => {
        socket.to(to).to(from).emit('remove reaction icon private', { receiver, messageId });
    });

    socket.on('change theme', ({ sender, theme, to, from }) => {
        socket.to(to).to(from).emit('change theme private', { user: sender, theme });
    });

    socket.on('change background', ({ sender, background, to, from }) => {
        // console.log(sender);
        socket.to(to).to(from).emit('change background private', { user: sender, backgroundImage: background });
    });

    socket.on('revoke message', ({ to, from, sender, messageId }) => {
        // console.log(data);
        socket.to(to).to(from).emit('revoke message private', { sender, messageId });
    });

    socket.on('disconnect', async () => {
        // console.log('Client disconnected:', socket.id);
        socket.broadcast.emit('user disconnected', socket.id);
    });
});
