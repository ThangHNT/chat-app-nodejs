const Message = require('../models/message');
class MessageController {
    getMessages(req, res, next) {
        const { sender, receiver } = req.body;
        let arr = [];
        Message.find({ sender: sender, receiver: receiver }, function (err, messages) {
            Message.find({ sender: receiver, receiver: sender }, function (err, messages2) {
                if (messages.length > 0 || messages2.length > 0) {
                    const data1 = messages.map((item) => {
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
                    const data2 = messages2.map((item) => {
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
        // console.log(messages);
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
            message.save();
        });
        res.json({ status: true, msg: 'thanh cong' });
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

    getLastestMessage(req, res, next) {
        // console.log(req.body);
        const { receiver, sender } = req.body;
        Message.find({ sender, receiver }, function (err, messages) {
            Message.find({ sender: receiver, receiver: sender }, function (err, messages2) {
                // console.log(messages == null, messages2);
                if (messages.length > 0 || messages2.length > 0) {
                    let n = messages.length;
                    let m = messages2.length;
                    let a = messages[n - 1];
                    let b = messages2[m - 1];
                    if (a && b) {
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
                    } else if (a) {
                        let time = a.createdAt.getTime();
                        let msg = {
                            message: a,
                            time,
                        };
                        return res.json({ status: true, message: msg });
                    } else if (b) {
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

    deleteMessages(req, res) {
        return res.json({ status: true });
    }
}

module.exports = new MessageController();
