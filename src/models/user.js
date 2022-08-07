const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = new Schema({
    username: { type: String, maxLength: 30, required: true, unique: true, minLength: 3 },
    password: { type: String, maxLength: 100, required: true, minLength: 1 },
    email: { type: String, maxLength: 30, minLength: 5 },
    avatar: { type: String },
});

module.exports = mongoose.model('User', User);
