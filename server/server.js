const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: 'https://66b3e0d7e753ef0008f0cd9d--trackhabitseasy.netlify.app/', // Replace with your frontend URL
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
