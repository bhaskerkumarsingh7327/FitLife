const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const workoutRoutes = require('./routes/workoutRoutes');

const app = express();
app.use(express.json());
app.use(cors());

app.use('/api/workouts', workoutRoutes);

if (!process.env.MONGO_URI) {
  console.error('FATAL ERROR: MONGO_URI is not defined in the .env file in the Backend directory.');
  process.exit(1); // Stop the server if DB connection string is missing
}

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected to Atlas'))
  .catch(err => console.log('❌ DB Connection Error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
