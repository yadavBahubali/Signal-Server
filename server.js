// File: server.js
const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const cors = require('cors'); // Import CORS
const { generateToken } = require('./utils/auth');

// Load environment variables
dotenv.config();

// Dummy users (allow multiple users to share the same credentials)
const users = [
  { id: 1, username: 'admin', password: 'admin', role: 'user' },
  { id: 2, username: 'admin', password: 'admin', role: 'admin' },
  { id: 3, username: 'admin', password: 'admin', role: 'guest' }, // Another user with same credentials
  // Add more users as necessary
];

const app = express();

// Use CORS middleware before your routes (for all routes by default)
app.use(cors({
  origin: '*', // Allow any domain
  methods: ['GET', 'POST'], // Restrict allowed methods
  allowedHeaders: ['Content-Type', 'Authorization'] // Allow specific headers
}));

// Middleware for parsing JSON requests
app.use(bodyParser.json());

// Login route (allow multiple users to log in with same username and password)
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;

  // Find the user(s) with matching username and password
  const user = users.find(u => u.username === username && u.password === password);

  if (!user) {
    return res.status(401).send('Invalid credentials');
  }

  // Generate JWT token
  const token = generateToken(user);
  res.json({ token });
});

 

// Import routes
const imageRoutes = require('./routes/imageRoutes');
const videoRoutes = require('./routes/videoRoutes');
const textRoutes = require('./routes/textRoutes');
const shapeRoutes = require('./routes/shapeRoutes');

// Use routes with middleware
app.use('/api/images',imageRoutes);
app.use('/api/videos',videoRoutes);
app.use('/api/text',textRoutes);
app.use('/api/shapes',shapeRoutes);


app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next(); // Pass control to the next middleware
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
