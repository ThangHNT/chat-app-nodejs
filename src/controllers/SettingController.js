const Setting = require('../models/setting');

class SettingController {
    getSetting(req, res) {
        const { receiver, sender } = req.body;
        Setting.findOne({ sender, receiver }, function (data) {
            res.json(data);
            console.log('get data setting');
        });
    }

    changeTheme(req, res) {
        console.log(req.body);
        res.send('oke');
    }
}

module.exports = new SettingController();
