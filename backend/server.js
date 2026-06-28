const express = require('express');
const cors = require('cors');
const http = require('http'); // Required to attach socket.io
const { Server } = require('socket.io'); // Import socket.io Server
require('dotenv').config();

const cardRoutes = require('./routes/cardRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Create HTTP server and wrap the Express app
const server = http.createServer(app);

// Initialize Socket.IO with CORS settings
const io = new Server(server, {
  cors: {
    origin: '*', // Allow all origins for now (can be restricted to frontend URL later)
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

// Attach the 'io' instance to the Express app so we can use it in controllers
app.set('io', io);

// Listen for WebSocket connections
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}. Total active: ${io.sockets.sockets.size}`);
  
  // Broadcast active users on connection
  io.emit('active_users', io.sockets.sockets.size);
  
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}. Total active: ${io.sockets.sockets.size}`);
    // Broadcast active users on disconnection
    io.emit('active_users', io.sockets.sockets.size);
  });
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/cards', cardRoutes);

// Base route for testing
app.get('/', (req, res) => {
  res.send('Server is running with WebSockets enabled!');
});

// Start the server using the wrapped HTTP server, NOT the express app
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
