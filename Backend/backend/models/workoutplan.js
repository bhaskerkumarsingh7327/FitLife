const mongoose = require('mongoose');

const workoutPlanSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  fitnessGoal: { type: String, required: true },
  fitnessLevel: { type: String, required: true },
  weeklySchedule: [
    {
      day: String,
      focusArea: String,
      exercises: [{ name: String, sets: Number, reps: Number }]
    }
  ],
  weeklyGoal: { type: Number, default: 5 },
  completedWorkouts: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('WorkoutPlan', workoutPlanSchema);
