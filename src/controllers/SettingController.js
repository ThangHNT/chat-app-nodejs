const Setting = require('../models/setting');
const User = require('../models/user');

class SettingController {
    getTheme(req, res) {
        const { sender, receiver } = req.body;
        // console.log(req.body);
        return res.send('oke');
        // Setting.findOne({ user1: sender, user2: receiver }, function (err, setting) {
        //     Setting.findOne({ user1: receiver, user2: sender }, (err, setting2) => {
        //         if (!setting && !setting2) {
        //             const setting = new Setting();
        //             setting.user1 = sender;
        //             setting.user2 = receiver;
        //             setting.save();
        //             return res.send({ status: true, theme: '0' });
        //         } else if (setting) {
        //             return res.json({ status: true, theme: setting.theme });
        //         } else if (setting2) {
        //             return res.json({ status: true, theme: setting2.theme });
        //         }
        //     });
        // });
    }

    deleteAll(req, res) {
        Setting.deleteMany({}, function (err, setting) {
            return res.send('oke');
        });
    }

    changeTheme(req, res) {
        // console.log(req.body);
        const { sender, receiver, theme } = req.body;
        Setting.findOne({ user1: sender, user2: receiver }, function (err, setting) {
            Setting.findOne({ user1: receiver, user2: sender }, function (err, setting2) {
                if (setting) {
                    setting.theme = theme;
                    setting.save();
                } else if (setting2) {
                    setting2.theme = theme;
                    setting2.save();
                }
                return res.json({ status: true });
            });
        });
    }
}

module.exports = new SettingController();
