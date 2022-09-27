const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Setting = new Schema({
    receiver: { type: Schema.Types.ObjectId, ref: 'User' },
    sender: { type: Schema.Types.ObjectId, ref: 'User' },
    theme: { type: String, default: '0' },
});

module.exports = mongoose.model('Setting', Setting);
