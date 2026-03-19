const WorkoutPlan = require('../models/workoutplan');

exports.getWorkoutPlan = async (req, res) => {
  try {
    const { userId } = req.params;
    let planDoc = await WorkoutPlan.findOne({ userId });

    // Agar user ka plan nahi hai, toh uska fresh default plan banayein
    if (!planDoc) {
      planDoc = new WorkoutPlan({
        userId: userId,
        fitnessGoal: 'General Fitness',
        fitnessLevel: 'Beginner',
        weeklyGoal: 7,
        completedWorkouts: 0,
        totalWorkouts: 0,
        currentStreak: 0,
        lastWorkoutDate: null,
        currentWeekNumber: 1,
        weeklySchedule: [
          { day: 'Monday', focusArea: 'Chest & Triceps', exercises: [{ name: 'Pushups', sets: 3, reps: 15 }, { name: 'Dumbbell Press', sets: 3, reps: 12 }, { name: 'Incline Press', sets: 3, reps: 12 }, { name: 'Chest Flyes', sets: 3, reps: 15 }, { name: 'Tricep Dips', sets: 3, reps: 12 }, { name: 'Skull Crushers', sets: 3, reps: 10 }, { name: 'Tricep Pushdowns', sets: 3, reps: 15 }, { name: 'Close Grip Pushups', sets: 3, reps: 10 }, { name: 'Cable Crossovers', sets: 3, reps: 15 }, { name: 'Diamond Pushups', sets: 3, reps: 10 }] },
          { day: 'Tuesday', focusArea: 'Back & Biceps', exercises: [{ name: 'Pull-ups', sets: 3, reps: 8 }, { name: 'Lat Pulldowns', sets: 3, reps: 12 }, { name: 'Barbell Rows', sets: 3, reps: 10 }, { name: 'Seated Cable Rows', sets: 3, reps: 12 }, { name: 'Deadlifts', sets: 3, reps: 8 }, { name: 'Bicep Curls', sets: 3, reps: 15 }, { name: 'Hammer Curls', sets: 3, reps: 12 }, { name: 'Preacher Curls', sets: 3, reps: 12 }, { name: 'Face Pulls', sets: 3, reps: 15 }, { name: 'Reverse Flyes', sets: 3, reps: 12 }] },
          { day: 'Wednesday', focusArea: 'Legs & Core', exercises: [{ name: 'Squats', sets: 4, reps: 15 }, { name: 'Lunges', sets: 3, reps: 12 }, { name: 'Leg Press', sets: 3, reps: 15 }, { name: 'Leg Curls', sets: 3, reps: 15 }, { name: 'Calf Raises', sets: 4, reps: 20 }, { name: 'Plank', sets: 3, reps: 60 }, { name: 'Crunches', sets: 3, reps: 25 }, { name: 'Russian Twists', sets: 3, reps: 20 }, { name: 'Leg Raises', sets: 3, reps: 15 }, { name: 'Bicycle Crunches', sets: 3, reps: 20 }] },
          { day: 'Thursday', focusArea: 'Shoulders & Abs', exercises: [{ name: 'Overhead Press', sets: 3, reps: 12 }, { name: 'Lateral Raises', sets: 3, reps: 15 }, { name: 'Front Raises', sets: 3, reps: 12 }, { name: 'Arnold Press', sets: 3, reps: 10 }, { name: 'Shrugs', sets: 3, reps: 15 }, { name: 'Mountain Climbers', sets: 3, reps: 30 }, { name: 'Flutter Kicks', sets: 3, reps: 20 }, { name: 'V-Ups', sets: 3, reps: 15 }, { name: 'Toe Touches', sets: 3, reps: 20 }, { name: 'Ab Rollouts', sets: 3, reps: 12 }] },
          { day: 'Friday', focusArea: 'Full Body HIIT', exercises: [{ name: 'Burpees', sets: 4, reps: 15 }, { name: 'Jump Squats', sets: 3, reps: 20 }, { name: 'High Knees', sets: 3, reps: 30 }, { name: 'Jumping Jacks', sets: 3, reps: 50 }, { name: 'Kettlebell Swings', sets: 3, reps: 20 }, { name: 'Box Jumps', sets: 3, reps: 15 }, { name: 'Battle Ropes', sets: 3, reps: 30 }, { name: 'Sprints', sets: 5, reps: 1 }, { name: 'Bear Crawls', sets: 3, reps: 10 }, { name: 'Thrusters', sets: 3, reps: 15 }] },
          { day: 'Saturday', focusArea: 'Cardio & Agility', exercises: [{ name: 'Running', sets: 1, reps: 30 }, { name: 'Cycling', sets: 1, reps: 20 }, { name: 'Rowing', sets: 1, reps: 15 }, { name: 'Jump Rope', sets: 4, reps: 50 }, { name: 'Stair Jumps', sets: 3, reps: 15 }, { name: 'Agility Ladder', sets: 3, reps: 10 }, { name: 'Cone Drills', sets: 3, reps: 10 }, { name: 'Shadow Boxing', sets: 3, reps: 20 }, { name: 'Speed Skaters', sets: 3, reps: 20 }, { name: 'Tuck Jumps', sets: 3, reps: 15 }] },
          { day: 'Sunday', focusArea: 'Active Recovery & Yoga', exercises: [{ name: 'Downward Dog', sets: 2, reps: 30 }, { name: 'Childs Pose', sets: 2, reps: 45 }, { name: 'Cobra Stretch', sets: 2, reps: 30 }, { name: 'Cat-Cow', sets: 2, reps: 10 }, { name: 'Pigeon Pose', sets: 2, reps: 30 }, { name: 'Seated Forward Fold', sets: 2, reps: 30 }, { name: 'Standing Quad Stretch', sets: 2, reps: 30 }, { name: 'Butterfly Stretch', sets: 2, reps: 30 }, { name: 'Torso Twists', sets: 2, reps: 20 }, { name: 'Deep Breathing', sets: 1, reps: 60 }] }
        ]
      });
      await planDoc.save();
    } else {
      if (planDoc.lastWorkoutDate) {
        const daysSinceLast = (new Date() - new Date(planDoc.lastWorkoutDate)) / (1000 * 60 * 60 * 24);
        if (daysSinceLast > 7) {
          planDoc.currentStreak = 0;
          await planDoc.save();
        }
      }
    }

    res.status(200).json(planDoc);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.updateProgress = async (req, res) => {
  try {
    const { userId } = req.params;
    const planDoc = await WorkoutPlan.findOne({ userId });
    if (!planDoc) return res.status(404).json({ message: 'Plan not found' });

    if (planDoc.completedWorkouts < planDoc.weeklyGoal) {
      planDoc.completedWorkouts += 1;
      planDoc.totalWorkouts = (planDoc.totalWorkouts || 0) + 1;

      const now = new Date();
      if (planDoc.lastWorkoutDate) {
        const daysSinceLast = (now - new Date(planDoc.lastWorkoutDate)) / (1000 * 60 * 60 * 24);
        if (daysSinceLast <= 7) planDoc.currentStreak = (planDoc.currentStreak || 0) + 1;
        else planDoc.currentStreak = 1; 
      } else {
        planDoc.currentStreak = 1;
      }
      planDoc.lastWorkoutDate = now;

      await planDoc.save();
      res.status(200).json({ 
        message: 'Progress updated', 
        completedWorkouts: planDoc.completedWorkouts,
        totalWorkouts: planDoc.totalWorkouts,
        currentStreak: planDoc.currentStreak
      });
    } else {
      res.status(400).json({ message: 'Weekly goal already completed' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.resetProgress = async (req, res) => {
  try {
    const { userId } = req.params;
    const planDoc = await WorkoutPlan.findOne({ userId });
    if (!planDoc) return res.status(404).json({ message: 'Plan not found' });

    planDoc.completedWorkouts = 0;
    planDoc.currentWeekNumber = (planDoc.currentWeekNumber || 1) + 1;

    // Yearly Progression: Har naye hafte me exercises ki intensity (reps) badhayenge
    planDoc.weeklySchedule.forEach(day => {
      day.exercises.forEach(ex => {
        ex.reps += 1;
      });
    });

    await planDoc.save();
    res.status(200).json({ message: 'Week reset successfully', completedWorkouts: 0, currentWeekNumber: planDoc.currentWeekNumber, weeklySchedule: planDoc.weeklySchedule });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
