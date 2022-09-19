const userRouter = require('./user.js');
const messageRouter = require('./message.js');
function route(app) {
    app.use('/', userRouter, messageRouter);
}

module.exports = route;
