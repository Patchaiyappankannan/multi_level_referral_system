const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
  console.log('Client connected');
  
  ws.on('message', (message) => {
    console.log(`Received: ${message}`);
  });
  
  ws.send('Connected to WebSocket server');
});

const sendNotification = (userId, earningsData) => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ userId, earningsData }));
    }
  });
};

module.exports = { sendNotification };
