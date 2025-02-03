const express = require('express');
const {
  fetchMessages,
  sendMessage,
} = require('../controller/messaging.controller');

const router = express.Router();

router.get('/messages', fetchMessages);
router.post('/messages', sendMessage);

module.exports = router;
