require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const connectDB = require('./config/db');
const userRoutes = require('./routes/user.routes');
const messageRoutes = require('./routes/message.routes');
const { Server } = require('socket.io');
const chatSocket = require('./sockets/socket');

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(cors());

connectDB();

app.use('/api', userRoutes);
app.use('/api', messageRoutes);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

chatSocket(io);

server.listen(5000, () => {
  console.log('✅ Server running on http://localhost:5000');
});
