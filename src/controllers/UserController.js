const User = require('../models/user');
const bcrypt = require('bcrypt');

class UserController {
    home(req, res, next) {
        res.send('server running');
    }

    async login(req, res, next) {
        try {
            const { username, password } = req.body;
            const hashPassword = await bcrypt.hash(password, 10);
            const userCheck = await User.findOne({ username, hashPassword });
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
            const hashPassword = await bcrypt.hash(password, 10);
            const user = new User({
                username,
                password: hashPassword,
                email,
            });
            user.save();
            delete user.password;
            return res.json({ status: true, user });
        } catch (e) {
            console.log('loi dang ky');
        }
    }
}

module.exports = new UserController();
