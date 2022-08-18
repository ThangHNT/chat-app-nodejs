const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const route = require('./routes/index');

const app = express();
require('dotenv').config();

app.use(cors());
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

app.listen(process.env.PORT, () => {
    console.log(`App listen on http://localhost:${process.env.PORT}`);
});
