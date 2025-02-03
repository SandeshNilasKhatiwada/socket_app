const Message = require('../models/Message');

const saveMessage = async (username, message) => {
  const newMessage = new Message({ username, message });
  await newMessage.save();
  return newMessage;
};

const getMessages = async () => {
  return await Message.find().sort({ timestamp: 1 });
};

module.exports = { saveMessage, getMessages };
