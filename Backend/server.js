const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const workoutRoutes = require('./routes/workoutRoutes');

const app = express();
app.use(express.json());
app.use(cors());

app.use('/api/workouts', workoutRoutes);

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/fitness-portal')
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.log('❌ DB Connection Error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
