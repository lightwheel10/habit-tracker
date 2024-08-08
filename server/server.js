const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const allowedOrigins = [
  'https://66b4fb6ee5a4300009983f36--trackhabitseasy.netlify.app', // Remove trailing slash
  'https://trackhabitseasy.netlify.app',
  'https://main--trackhabitseasy.netlify.app', // Add this line
  // Add any other relevant URLs here
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
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
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
