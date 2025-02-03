const { saveMessage, getMessages } = require('../services/message.services');

const fetchMessages = async (req, res) => {
  try {
    const messages = await getMessages();
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
};

// Only API saves the message, then broadcasts via Socket.IO
const sendMessage = async (req, res) => {
  try {
    const { username, message } = req.body;
    const newMessage = await saveMessage(username, message);

    // Emit the message via Socket.IO
    const io = require('../server').io;
    io.emit('receive_message', newMessage);

    res.json(newMessage);
  } catch (error) {
    res.status(500).json({ error: 'Failed to send message' });
  }
};

module.exports = { fetchMessages, sendMessage };
