const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = new Schema({
    username: { type: String, maxLength: 30, required: true, minLength: 3 },
    nickname: { type: String, maxLength: 30, default: '' },
    password: { type: String, maxLength: 100, required: true, minLength: 1 },
    email: { type: String, maxLength: 30, minLength: 5 },
    avatar: { type: String },
    blockList: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    setting: { type: Schema.Types.ObjectId, ref: 'Setting' },
});

module.exports = mongoose.model('User', User);
