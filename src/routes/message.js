const express = require('express');
const router = express.Router();
const messageController = require('../controllers/MessageController.js');

router.post('/api/send/reaction-icon', messageController.sendReactionIcon); // gửi reaction icon
router.post('/api/remove/reaction-icon', messageController.removeReactionIcon); // xóa reaction icon
router.post('/api/delete-all-messages', messageController.deleteAllMessages); // xóa đoạn chat
router.post('/api/send/message', messageController.sendMessage); // gửi tin nhắn
router.post('/api/lastest-message', messageController.getLastestMessage); // lấy tin nhắn mới nhất đã gửi
router.post('/api/get/messages', messageController.getMessages); // lấy tất cả tin nhắn đã gửi
router.post('/api/revoke-message', messageController.revokeMessage); // gỡ bỏ tin nhắn

module.exports = router;
