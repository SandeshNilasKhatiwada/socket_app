const chatSocket = (io) => {
  io.on('connection', (socket) => {
    console.log('✅ New user connected');

    // Listen for "send_message" event and broadcast without saving
    socket.on('send_message', (data) => {
      io.emit('receive_message', data); // Broadcast message to all clients
    });

    socket.on('disconnect', () => {
      console.log('❌ User disconnected');
    });
  });
};

module.exports = chatSocket;
