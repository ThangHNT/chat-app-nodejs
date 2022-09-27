const Setting = require('../models/setting');
const User = require('../models/user');
class SettingController {
    getTheme(req, res) {
        const { user } = req.body;
        User.findOne({ _id: user }, function (err, user) {
            if (user.setting) {
                Setting.findOne({ _id: user.setting }, function (err, setting) {
                    res.json(setting.theme);
                });
            }
        });
    }

    changeTheme(req, res) {
        // console.log(req.body);
        const { sender, receiver, theme } = req.body;
        User.findOne({ _id: sender }, function (err, user) {
            User.findOne({ _id: receiver }, function (err, user2) {
                if (!user.setting) {
                    const setting = new Setting();
                    setting.theme = theme;
                    setting.save();
                    user.setting = setting;
                    user2.setting = setting;
                    user.save();
                    user2.save();
                    res.json({ status: true, msg: 'tao moi setting' });
                } else {
                    Setting.findOne({ _id: user.setting }, function (err, setting) {
                        setting.theme = theme;
                        setting.save();
                        res.json({ status: true, msg: 'update setting' });
                    });
                }
            });
        });
    }
}

module.exports = new SettingController();
