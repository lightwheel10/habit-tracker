const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'https://66b4fb6ee5a4300009983f36--trackhabitseasy.netlify.app',
  'https://trackhabitseasy.netlify.app',
  'https://main--trackhabitseasy.netlify.app',
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

app.use(express.json());

// MongoDB connection
const mongoUri = process.env.MONGODB_URI;
if (!mongoUri) {
  console.error('MONGODB_URI environment variable is not set');
  process.exit(1);
}

mongoose.connect(mongoUri)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('Error connecting to MongoDB:', err));

// Routes
const authRoutes = require('./routes/auth');
const habitRoutes = require('./routes/habits');
const areaRoutes = require('./routes/areas');

app.use('/api/auth', authRoutes);
app.use('/api/habits', habitRoutes);
app.use('/api/areas', areaRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
