const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Message = new Schema(
    {
        sender: { type: Schema.Types.ObjectId, ref: 'User' },
        receiver: { type: Schema.Types.ObjectId, ref: 'User' },
        text: { type: String, maxLength: 1000 },
        type: { type: String, required: true, default: 'text' },
        img: { type: String },
        file: {
            content: { type: String },
            filename: { type: String },
            size: { type: String },
        },
    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model('Message', Message);
