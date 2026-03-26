const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
  name: String,
  sets: Number,
  reps: Number,
});

const dayScheduleSchema = new mongoose.Schema({
  day: String,
  focusArea: String,
  exercises: [exerciseSchema],
});

const workoutPlanSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  fitnessGoal: String,
  fitnessLevel: String,
  weeklyGoal: { type: Number, default: 7 },
  completedWorkouts: { type: Number, default: 0 },
  totalWorkouts: { type: Number, default: 0 },
  currentStreak: { type: Number, default: 0 },
  lastWorkoutDate: Date,
  currentWeekNumber: { type: Number, default: 1 },
  weeklySchedule: [dayScheduleSchema],
});

const WorkoutPlan = mongoose.model('WorkoutPlan', workoutPlanSchema);

module.exports = WorkoutPlan;