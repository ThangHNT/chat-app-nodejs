const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Setting = new Schema({
    theme: { type: String, default: '0' },
    user1: { type: Schema.Types.ObjectId, ref: 'User' },
    user2: { type: Schema.Types.ObjectId, ref: 'User' },
    darkMode: { type: Boolean, default: false },
});

module.exports = mongoose.model('Setting', Setting);
