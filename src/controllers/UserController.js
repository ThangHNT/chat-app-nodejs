class UserController {
    home(req, res, next) {
        res.send('server running');
    }

    register(req, res, next) {
        console.log(req.body);
    }
}

module.exports = new UserController();
