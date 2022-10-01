const Setting = require('../models/setting');
const User = require('../models/user');

class SettingController {
    getTheme(req, res) {
        const { sender, receiver } = req.body;
        // console.log(req.body);
        User.findOne({ _id: sender }, (err, user) => {
            Setting.findOne({ _id: user.setting }, (err, setting) => {
                // console.log(setting.chat.theme);
                const theme = setting.chat.theme.get(receiver);
                if (theme) {
                    return res.json({ status: true, theme });
                } else {
                    setting.chat.theme.set(receiver, '0');
                    return res.json({ status: true, theme: '0' });
                }
            });
        });
    }

    deleteAll(req, res) {
        Setting.deleteMany({}, function (err, setting) {
            return res.send('oke');
        });
    }

    changeTheme(req, res) {
        // console.log(req.body);
        const { sender, receiver, theme } = req.body;
        const promise = Promise.resolve();
        promise
            .then(() => {
                User.findOne({ _id: sender }, (err, user) => {
                    Setting.findOne({ _id: user.setting }, (err, setting) => {
                        // console.log(setting.chat.theme);
                        setting.chat.theme.set(receiver, theme);
                        setting.save();
                    });
                });
            })
            .then(() => {
                User.findOne({ _id: receiver }, (err, user) => {
                    Setting.findOne({ _id: user.setting }, (err, setting) => {
                        setting.chat.theme.set(sender, theme);
                        setting.save();
                    });
                });
            })
            .then(() => {
                return res.json({ status: true });
            })
            .catch((err) => {
                console.log('loi change them');
            });
    }

    setBackgroundImage(req, res) {
        const { sender, receiver, image } = req.body;
        // console.log(sender, receiver);
        const promise = Promise.resolve();
        promise
            .then(() => {
                User.findOne({ _id: sender }, (err, user) => {
                    Setting.findOne({ _id: user.setting }, (err, setting) => {
                        // console.log(setting.chat.theme);
                        setting.chat.backgroundImage.set(receiver, image);
                        setting.save();
                    });
                });
            })
            .then(() => {
                User.findOne({ _id: receiver }, (err, user) => {
                    Setting.findOne({ _id: user.setting }, (err, setting) => {
                        setting.chat.backgroundImage.set(sender, image);
                        setting.save();
                    });
                });
            })
            .then(() => {
                return res.json({ status: true });
            })
            .catch((err) => {
                console.log('loi change them');
            });
    }
}

module.exports = new SettingController();
