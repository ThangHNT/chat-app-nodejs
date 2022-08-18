const User = require('../models/user');
const Message = require('../models/message');
const message = require('../models/message');
const user = require('../models/user');

class UserController {
    home(req, res, next) {
        res.send('server running');
    }

    async login(req, res, next) {
        try {
            const { username, password } = req.body;
            // const hashPassword = await bcrypt.hash(password, 10);

            const userCheck = await User.findOne({ username, password });
            if (!userCheck) {
                return res.json({ msg: 'Tài khoản hoặc mật khẩu không đúng.', status: false });
            } else {
                return res.json({ status: true, user: userCheck });
            }
        } catch (err) {
            console.log('login that bai');
        }
    }

    async register(req, res, next) {
        try {
            const { username, email, password } = req.body;
            const usernameCheck = await User.findOne({ username });
            if (usernameCheck) {
                return res.json({ msg: 'Tên người dùng đã tồn tại', status: false });
            }
            const emailCheck = await User.findOne({ email });
            if (emailCheck) {
                return res.json({ msg: 'Email đã được đăng ký', status: false });
            }
            // const hashPassword = await bcrypt.hash(password, 10);
            const user = new User({
                username,
                password,
                email,
                avatar: 'https://kenh14cdn.com/thumb_w/660/203336854389633024/2022/4/3/photo-1-1648980890040503462152.jpg',
            });
            user.save();
            delete user.password;
            return res.json({ status: true, user });
        } catch (e) {
            console.log('loi dang ky');
        }
    }

    messageItem(req, res, next) {
        const sender = req.body.sender;
        User.find({}, function (err, users) {
            if (users) {
                let arr = [];
                users.forEach((user) => {
                    if (user._id != sender) {
                        arr.push(user);
                    }
                });
                const userList = arr.map((user) => {
                    return {
                        id: user._id,
                        username: user.username,
                        avatar: user.avatar,
                    };
                });
                return res.json({ status: true, userList });
            } else {
                console.log('loi lay ds user');
                res.json({ status: false, msg: 'loi lay ds user' });
            }
        });
    }

    getLastestMessage(req, res, next) {
        // console.log(req.body);
        const { receiver, sender } = req.body;
        Message.find({ sender, receiver }, function (err, messages) {
            Message.find({ sender: receiver, receiver: sender }, function (err, messages2) {
                if (messages !== null && messages2 !== null) {
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
                    }
                }
            });
        });
    }

    getReciever(req, res, next) {
        const userId = req.params.id;
        // res.json(req.params.id);
        User.findOne({ _id: userId }, function (err, user) {
            if (user) {
                const data = {
                    id: user._id,
                    username: user.username,
                    avatar: user.avatar,
                };
                res.json({ status: true, data });
            } else {
                res.json({ status: false, msg: 'Loi server' });
            }
        });
    }

    sendMessage(req, res, next) {
        const { sender, receiver, messages } = req.body;
        messages.forEach((msg) => {
            const message = new Message();
            message.sender = sender;
            message.receiver = receiver;
            if (msg.type === 'text') {
                message.type = 'text';
                message.text = msg.msg;
            } else {
                message.type = 'img';
                message.img.data = msg.msg;
            }
            message.save();
        });
        res.json({ status: true, msg: 'thanh cong' });
    }

    getMessages(req, res, next) {
        const { sender, receiver } = req.body;
        let arr = [];
        Message.find({ sender: sender, receiver: receiver }, function (err, messages) {
            Message.find({ sender: receiver, receiver: sender }, function (err, messages2) {
                if (messages !== null && messages2 !== null) {
                    const data1 = messages.map((item) => {
                        const obj = {
                            type: item.type,
                            text: item.text,
                            img: item.img.data,
                            sender: item.sender,
                            time: item.createdAt.getTime(),
                        };
                        return obj;
                    });
                    const data2 = messages2.map((item) => {
                        const obj = {
                            type: item.type,
                            text: item.text,
                            img: item.img.data,
                            sender: item.sender,
                            time: item.createdAt.getTime(),
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
}

module.exports = new UserController();
