const User = require('../models/user');
const Message = require('../models/message');

class UserController {
    home(req, res, next) {
        res.send('server running');
    }

    async login(req, res, next) {
        try {
            const { username, password } = req.body;

            const userCheck = await User.findOne({ username, password });
            if (!userCheck) {
                return res.json({ msg: 'Tài khoản hoặc mật khẩu không đúng.', status: false });
            } else {
                const user = {
                    username: userCheck.username,
                    _id: userCheck._id,
                    avatar: userCheck.avatar,
                };
                return res.json({ status: true, user });
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
            const user = new User({
                username,
                password,
                email,
                avatar: 'https://png.pngtree.com/element_our/md/20180710/md_5b44128b4c192.jpg',
            });
            user.save();
            delete user.password;
            const newUser = {
                username: user.username,
                _id: user._id,
                avatar: user.avatar,
            };
            return res.json({ status: true, newUser });
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
                // console.log(data);
            } else {
                res.json({ status: false, msg: 'Loi server' });
            }
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
                            img: item.img,
                            file: item.file,
                            sender: item.sender,
                            time: item.createdAt.getTime(),
                        };
                        return obj;
                    });
                    const data2 = messages2.map((item) => {
                        const obj = {
                            type: item.type,
                            text: item.text,
                            img: item.img,
                            file: item.file,
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

    searchUser(req, res) {
        let name = req.query.q;
        const exceptionuser = req.query.exceptUser;
        let listUser = [];
        User.find({}, function (err, users) {
            users.forEach((user) => {
                const arr = name.split(' ');
                const data = {
                    username: user.username,
                    avatar: user.avatar,
                    userId: user._id,
                };
                if (arr.length == 1 && user.username.startsWith(name) && user._id != exceptionuser) {
                    listUser.push(data);
                } else {
                    for (let i = 0; i < arr.length; i++) {
                        if (user.username.indexOf(arr[i]) > -1 && user._id != exceptionuser) {
                            listUser.push(data);
                            break;
                        }
                    }
                }
            });
            if (listUser.length > 0) {
                return res.json({ status: true, listUser });
            } else {
                return res.json({ status: false, msg: 'ko co nguoi dung trong he thong' });
            }
        });
    }
}

module.exports = new UserController();
