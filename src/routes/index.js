const userRouter = require('./user.js');

function route(app) {
    app.use('/', userRouter);
}

module.exports = route;
