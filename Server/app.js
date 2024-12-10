require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const sequelize = require('./config/db');
const Earnings = require('./models/earnings');
const earningsRoutes = require('./routes/earningsRoutes');
const transactionsRoutes = require('./routes/transactionsRoutes');
const usersRoutes = require('./routes/usersRoutes');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'UPDATE', 'DELETE'],
  },
});

module.exports.io = io;

let earningsInterval = null;

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('register-user', async (userId) => {
    console.log(`User registered with ID: ${userId}`);
    socket.userId = userId;

    if (earningsInterval) clearInterval(earningsInterval);  
    earningsInterval = setInterval(async () => {
      await emitEarningsUpdate(userId);
    }, 5000); 

    await emitEarningsUpdate(userId);
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
    if (earningsInterval) {
      clearInterval(earningsInterval);  
    }
  });
});

async function emitEarningsUpdate(userId) {
  try {
    const earningsData = await Earnings.findAll({ where: { userId } });
    const userSocket = [...io.sockets.sockets].find(([_, s]) => s.userId === userId)?.[1];

    if (userSocket) {
      userSocket.emit('earnings-update', earningsData);
    }
  } catch (error) {
    console.error('Error fetching earnings data:', error);
  }
}

app.use('/api', earningsRoutes(io));
app.use('/api', transactionsRoutes);
app.use('/api', usersRoutes);

sequelize.sync({ force: false }).then(() => {
  console.log('Database synced');
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
