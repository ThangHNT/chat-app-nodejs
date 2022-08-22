const express = require('express');
const router = express.Router();
const userController = require('../controllers/UserController.js');

router.get('/', userController.home);
router.post('/api/message-item', userController.messageItem);
router.get('/api/receiver/:id', userController.getReciever);
router.get('/api/search', userController.searchUser);
router.post('/api/send-message', userController.sendMessage);
router.post('/api/lastest-message', userController.getLastestMessage);
router.post('/api/get-messages', userController.getMessages);
router.post('/register', userController.register);
router.post('/login', userController.login);

module.exports = router;
