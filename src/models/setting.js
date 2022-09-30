const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Setting = new Schema({
    chat: {
        theme: { type: Map, default: new Map() },
    },
    general: {
        darkMode: { type: Boolean, default: false },
        texttingSound: { type: Boolean, default: false },
        sendMessageSound: { type: Boolean, default: false },
        notificationSound: { type: Boolean, default: false },
    },
});

module.exports = mongoose.model('Setting', Setting);
