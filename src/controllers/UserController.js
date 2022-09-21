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

    blockUser(req, res) {
        // console.log(req.body);
        const { sender, receiver } = req.body;
        User.findOne({ _id: sender }, function (err, user) {
            if (user) {
                const checkUserExist = user.blockList.some((item) => {
                    return item == receiver;
                });
                if (!checkUserExist) {
                    user.blockList.push(receiver);
                    user.save();
                }
                res.json({ status: true });
            } else res.json({ status: false });
        });
    }

    checkBlockStatus(req, res) {
        const { currentUser, receiver } = req.body;
        User.findOne({ _id: currentUser }, function (err, users1) {
            const result = { status: true };
            User.findOne({ _id: receiver }, function (err, users2) {
                const list = users1.blockList;
                const checkBlocked = list.some((userId) => {
                    return userId == receiver;
                });
                if (checkBlocked) {
                    result.block = true;
                    result.status = false;
                }
                const list2 = users2.blockList;
                const checkBlocked2 = list2.some((userId) => {
                    return userId == currentUser;
                });
                if (checkBlocked2) {
                    result.blocked = true;
                    result.status = false;
                }
                return res.json(result);
            });
        });
    }

    checkBlockStatus2(req, res) {
        const { currentUser, receiver } = req.body;
        User.findOne({ _id: currentUser }, function (err, user) {
            // kiểm tra xem có chặn ng này ko
            if (user) {
                const arr = {};
                const list = user.blockList;
                const checkBlocked = list.some((userId) => {
                    return userId == receiver;
                });
                if (checkBlocked) {
                    arr.block = true;
                    // return res.json({ status: true, blocked: 'block' });
                } else {
                    // kiểm tra xem có bị chặn khong
                    User.findOne({ _id: receiver }, function (err, user) {
                        if (user) {
                            const list = user.blockList;
                            const checkBlocked = list.some((userId) => {
                                return userId == currentUser;
                            });
                            if (checkBlocked) {
                                // return res.json({ status: true, blocked: 'blocked' });
                                arr.blocked = true;
                            } else {
                                return res.json({ status: true, blocked: 'false' });
                            }
                        } else return res.json({ status: false, ms: 'ko tim thay ng dung' });
                    });
                }
            } else return res.json({ status: false, ms: 'ko tim thay ng dung' });
        });
    }
}

module.exports = new UserController();
