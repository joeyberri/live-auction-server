require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const authMiddleware = require('./middleware/auth'); // Updated import
const liveStreamRoutes = require('./routes/liveStreamRoutes');

require('./config/db');


const app = express();
const server = http.createServer(app);
const io = socketIO(server);

io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  authMiddleware({ headers: { authorization: token } }, {}, (err) => {
    if (err) {
      return next(new Error('Authentication error.'));
    }
    next();
  });
});

app.use('/live-stream', liveStreamRoutes);

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
