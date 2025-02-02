const { Server } = require('socket.io');
const { authenticateSocket } = require('../middlewares/auth.middleware');

const configureSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  io.use(authenticateSocket);

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.user.username}`);

    socket.on('send_message', (data) => {
      io.emit('receive_message', {
        username: socket.user.username,
        message: data,
      });
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.user.username}`);
    });
  });

  return io;
};

module.exports = configureSocket;
