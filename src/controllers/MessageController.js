const Message = require('../models/message');
const User = require('../models/user');

const checkMessageDeleted = (arr, userId) => {
    const ans = [];
    arr.forEach((msg) => {
        if (msg.userDeletedMessage) {
            const checkMsg = msg.userDeletedMessage.has(userId);
            if (!checkMsg) ans.push(msg);
        }
    });
    return ans;
};

class MessageController {
    getMessages(req, res, next) {
        const { sender, receiver } = req.body;
        let arr = [];
        Message.find({ sender: sender, receiver: receiver }, function (err, messages) {
            Message.find({ sender: receiver, receiver: sender }, function (err, messages2) {
                if (messages.length > 0 || messages2.length > 0) {
                    const arr1 = checkMessageDeleted(messages, sender);
                    const data1 = arr1.map((item) => {
                        const obj = {
                            id: item._id,
                            type: item.type,
                            text: item.text,
                            img: item.img,
                            file: item.file,
                            sender: item.sender,
                            time: item.createdAt.getTime(),
                            reactionIcon: item.reactionIcon,
                        };
                        return obj;
                    });
                    const arr2 = checkMessageDeleted(messages2, sender);
                    // console.log(arr1, arr2);
                    const data2 = arr2.map((item) => {
                        const obj = {
                            id: item._id,
                            type: item.type,
                            text: item.text,
                            img: item.img,
                            file: item.file,
                            sender: item.sender,
                            time: item.createdAt.getTime(),
                            reactionIcon: item.reactionIcon,
                        };
                        return obj;
                    });
                    arr = [...data1, ...data2];
                    arr.sort((a, b) => {
                        return a.time - b.time;
                    });
                    return res.json({ status: true, arr });
                } else {
                    return res.json({ status: false, msg: 'khong tim thay doan hoi thoai' });
                }
            });
        });
    }

    sendMessage(req, res, next) {
        const { sender, receiver, messages } = req.body;
        messages.content.forEach((msg) => {
            const message = new Message();
            message.sender = sender;
            message.receiver = receiver;
            const type = msg.type;
            if (msg.type === 'text') {
                message.type = 'text';
                message.text = msg.text;
            } else if (msg.type == 'img') {
                message.type = 'img';
                message.img = msg.img;
            } else if (
                type == 'text-file' ||
                type == 'video' ||
                type == 'audio' ||
                type == 'doc-file' ||
                type == 'pdf-file'
            ) {
                // console.log(msg.file);
                message.type = type;
                message.file.content = msg.file.content;
                message.file.filename = msg.file.filename;
                message.file.size = msg.file.size;
            }
            // message.save();
            msg.id = String(message._id);
        });
        res.json({ status: true, messages });
    }

    sendReactionIcon(req, res) {
        const { messageId, reaction } = req.body;
        // console.log(req.body);
        Message.findOne({ _id: messageId }, function (err, message) {
            if (message) {
                message.reactionIcon = reaction;
                // message.save();
                return res.json({ status: true });
            } else {
                res.json({ status: false });
            }
        });
    }

    removeReactionIcon(req, res) {
        const { messageId } = req.body;
        // console.log(req.body);
        Message.findOne({ _id: messageId }, function (err, message) {
            if (message) {
                message.reactionIcon = '';
                // message.save();
                return res.json({ status: true });
            } else {
                res.json({ status: false });
            }
        });
    }

    getLastestMessage(req, res, next) {
        // console.log(req.body);
        const { receiver, sender } = req.body;
        Message.find({ sender, receiver }, function (err, messages) {
            Message.find({ sender: receiver, receiver: sender }, function (err, messages2) {
                const arr1 = checkMessageDeleted(messages, sender);
                const arr2 = checkMessageDeleted(messages2, sender);
                let a = arr1[arr1.length - 1];
                let b = arr2[arr2.length - 1];
                let message = undefined;
                if (a && b) {
                    if (a.createdAt.getTime() > b.createdAt.getTime()) {
                        message = a;
                    } else message = b;
                } else if (a && !b) {
                    message = a;
                } else if (!a && b) {
                    message = b;
                }
                return res.json({ status: true, message });
            });
        });
    }

    revokeMessage(req, res) {
        // console.log(req.body);
        const { messageId, action, userId, type } = req.body;
        console.log(req.body);
        Message.findOne({ _id: messageId }, function (err, message) {
            if (message) {
                if (action == 'revoke' && type != 'revoked') {
                    // console.log('thu hoi tin nhan');
                    message.type = 'revoked';
                    message.text = 'Tin nhắn đã bị thu hồi';
                    message.audio = undefined;
                    message.video = undefined;
                    message.file = undefined;
                    // message.save();
                    return res.json({ status: true, msg: 'thu hồi tin nhắn thành công' });
                } else {
                    if (!message.userDeletedMessage.has(userId)) {
                        if (message.userDeletedMessage.size > 0) {
                            // message.remove();
                        } else {
                            message.userDeletedMessage.set(userId);
                            // message.save();
                        }
                    }
                    return res.json({ status: true, msg: 'Xóa tin nhắn thành công' });
                }
            }
        });
    }

    deleteAllMessages(req, res) {
        Message.deleteMany({}, (err, messages) => {
            return res.send('xoa het tat ca tin nhan');
        });
    }

    deleteChat(req, res) {
        const { sender, receiver } = req.body;
        Message.find({ sender, receiver }, (err, messages) => {
            Message.find({ sender: receiver, receiver: sender }, (err, messages2) => {
                // console.log(messages, messages2);
                messages.forEach((msg) => {
                    if (!msg.userDeletedMessage.has(sender)) {
                        if (msg.userDeletedMessage.has(receiver)) {
                            // msg.remove();
                        } else {
                            msg.userDeletedMessage.set(sender, true);
                            // msg.save();
                        }
                    }
                });
                messages2.forEach((msg2) => {
                    if (!msg2.userDeletedMessage.has(sender)) {
                        if (msg2.userDeletedMessage.has(receiver)) {
                            // msg2.remove();
                        } else {
                            msg2.userDeletedMessage.set(sender, true);
                            // msg2.save();
                        }
                    }
                });
                return res.json({ status: true, msg: 'xoa doan chat thanh cong' });
            });
        });
    }
}

module.exports = new MessageController();
