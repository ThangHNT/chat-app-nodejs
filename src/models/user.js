const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = new Schema({
    username: { type: String, maxLength: 30, required: true, unique: true, minLength: 3 },
    password: { type: String, maxLength: 30, required: true, minLength: 8 },
    email: { type: String, maxLength: 30, minLength: 10 },
    avatar: { type: String },
});

module.exports = mongoose.model('User', User);
