const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Message = new Schema({
    sender: { type: Schema.Types.ObjectId, ref: 'User' },
    reciever: { type: Schema.Types.ObjectId, ref: 'User' },
    text: { type: String, required: true },
    img: { data: Buffer, contentType: String },
});
