const Message = require('../models/message');
const User = require('../models/user');

const checkMessageDeleted = (arr, userId) => {
    const ans = [];
    arr.forEach((msg) => {
        if (msg.userDeletedMessage) {
            const checkMsg = msg.userDeletedMessage.some((id) => {
                return id != userId;
            });
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
            message.userDeletedMessage = [];
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
                message.save();
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
                message.save();
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
                if (messages.length > 0 || messages2.length > 0) {
                    // console.log(checkMessageDeleted(messages));
                    const arr = checkMessageDeleted(messages, sender);
                    const arr2 = checkMessageDeleted(messages2, sender);
                    let n = arr.length;
                    let m = arr2.length;
                    let a = arr[n - 1];
                    let b = arr2[m - 1];
                    if (arr.length > 0 && arr2.length > 0) {
                        let msg = '';
                        let time1 = a.createdAt.getTime();
                        let time2 = b.createdAt.getTime();
                        if (time1 > time2) {
                            msg = { message: a, time: time1 };
                        } else {
                            msg = {
                                message: b,
                                time: time2,
                            };
                        }
                        return res.json({ status: true, message: msg });
                    } else if (arr.length > 0) {
                        let time = a.createdAt.getTime();
                        let msg = {
                            message: a,
                            time,
                        };
                        return res.json({ status: true, message: msg });
                    } else if (arr2.length > 0) {
                        let time = b.createdAt.getTime();
                        let msg = {
                            message: b,
                            time,
                        };
                        return res.json({ status: true, message: msg });
                    }
                } else {
                    return res.json({ status: false, msg: 'chua co tin nhan nao dc gui' });
                }
            });
        });
    }

    deleteAllMessages(req, res) {
        return res.json({ status: true });
    }

    revokeMessage(req, res) {
        // console.log(req.body);
        const { messageId, action, userId, type } = req.body;
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
                    if (message.userDeletedMessage.length == 0) {
                        message.userDeletedMessage.push(userId);
                        // message.save();
                    } else {
                        // message.remove();
                    }
                    return res.json({ status: true, msg: 'Xóa tin nhắn thành công' });
                }
            }
        });
    }
}

module.exports = new MessageController();
