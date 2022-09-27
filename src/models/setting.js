const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Setting = new Schema({
    theme: { type: String, default: '0' },
    darkMode: { type: Boolean, default: false },
});

module.exports = mongoose.model('Setting', Setting);
