const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
require('dotenv').config();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('xin chao');
});

const server = app.listen(process.env.PORT, () => {
    console.log(`App listen on http://localhost:${process.env.PORT}`);
});
