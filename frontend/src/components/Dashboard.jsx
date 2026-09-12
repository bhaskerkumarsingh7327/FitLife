import React, { useState, useEffect } from 'react';
import Navbar from './Navbar.jsx';
import ProgressTracker from './ProgressTracker.jsx';
import WorkoutList from './WorkoutList.jsx';

const Dashboard = () => {
  const [workoutData, setWorkoutData] = useState(null);
  const userEmail = localStorage.getItem('userEmail');
  const userId = userEmail ? userEmail : "guest_user"; 
  const userName = localStorage.getItem('userName') || "Athlete";
  const isFemale = localStorage.getItem('userGender') === 'Female';
  const themeText = isFemale ? 'text-pink-500' : 'text-green-500';

  const fetchWorkoutPlan = async () => {
    try {
      const safeUserId = encodeURIComponent(userId);
      const gender = localStorage.getItem('userGender') || 'Male';
      const goal = localStorage.getItem('userGoal') || 'General Fitness';
      const level = localStorage.getItem('userLevel') || 'Beginner';
      
      const response = await fetch(`http://localhost:5001/api/workouts/${safeUserId}?gender=${gender}&goal=${goal}&level=${level}`);
      if (response.ok) {
        const data = await response.json();
        setWorkoutData(data);
        localStorage.setItem('localCompleted', data.completedWorkouts);
        if (data.totalWorkouts !== undefined) localStorage.setItem('localTotal', data.totalWorkouts);
        if (data.currentStreak !== undefined) localStorage.setItem('localStreak', data.currentStreak);
        if (data.currentWeekNumber !== undefined) localStorage.setItem('localWeek', data.currentWeekNumber);
      } else {
        throw new Error("Plan not found");
      }
    } catch (error) {
      console.warn("Backend fetch failed, using Demo Data:", error);
      const savedCompleted = Number(localStorage.getItem('localCompleted')) || 0;
      const savedTotal = Number(localStorage.getItem('localTotal')) || savedCompleted;
      const savedStreak = Number(localStorage.getItem('localStreak')) || savedCompleted;
      const savedWeek = Number(localStorage.getItem('localWeek')) || 1;
      setWorkoutData({
        userId: userId,
        completedWorkouts: savedCompleted,
        totalWorkouts: savedTotal,
        currentStreak: savedStreak,
        currentWeekNumber: savedWeek,
        weeklyGoal: 7,
        weeklySchedule: isFemale ? [
          { day: 'Monday', focusArea: 'Glutes & Hamstrings', exercises: [{ name: 'Hip Thrusts', sets: 3, reps: 15 }, { name: 'Romanian Deadlifts', sets: 3, reps: 12 }] },
          { day: 'Tuesday', focusArea: 'Upper Body Toning', exercises: [{ name: 'Pushups (Modified)', sets: 3, reps: 10 }, { name: 'Dumbbell Shoulder Press', sets: 3, reps: 12 }] },
          { day: 'Wednesday', focusArea: 'Core & Cardio HIIT', exercises: [{ name: 'Jumping Jacks', sets: 3, reps: 40 }, { name: 'Plank', sets: 3, reps: 60 }] },
          { day: 'Thursday', focusArea: 'Quads & Calves', exercises: [{ name: 'Goblet Squats', sets: 4, reps: 15 }, { name: 'Leg Press', sets: 3, reps: 15 }] },
          { day: 'Friday', focusArea: 'Full Body Fat Burn', exercises: [{ name: 'Kettlebell Swings', sets: 4, reps: 20 }, { name: 'Thrusters', sets: 3, reps: 15 }] },
          { day: 'Saturday', focusArea: 'Active Recovery', exercises: [{ name: 'Light Jogging', sets: 1, reps: 30 }] },
          { day: 'Sunday', focusArea: 'Yoga & Flexibility', exercises: [{ name: 'Downward Dog', sets: 2, reps: 30 }] }
        ] : [
          { day: 'Monday', focusArea: 'Chest & Triceps', exercises: [{ name: 'Pushups', sets: 3, reps: 15 }, { name: 'Dumbbell Press', sets: 3, reps: 12 }, { name: 'Incline Press', sets: 3, reps: 12 }, { name: 'Chest Flyes', sets: 3, reps: 15 }, { name: 'Tricep Dips', sets: 3, reps: 12 }, { name: 'Skull Crushers', sets: 3, reps: 10 }, { name: 'Tricep Pushdowns', sets: 3, reps: 15 }, { name: 'Close Grip Pushups', sets: 3, reps: 10 }, { name: 'Cable Crossovers', sets: 3, reps: 15 }, { name: 'Diamond Pushups', sets: 3, reps: 10 }] },
          { day: 'Tuesday', focusArea: 'Back & Biceps', exercises: [{ name: 'Pull-ups', sets: 3, reps: 8 }, { name: 'Lat Pulldowns', sets: 3, reps: 12 }, { name: 'Barbell Rows', sets: 3, reps: 10 }, { name: 'Seated Cable Rows', sets: 3, reps: 12 }, { name: 'Deadlifts', sets: 3, reps: 8 }, { name: 'Bicep Curls', sets: 3, reps: 15 }, { name: 'Hammer Curls', sets: 3, reps: 12 }, { name: 'Preacher Curls', sets: 3, reps: 12 }, { name: 'Face Pulls', sets: 3, reps: 15 }, { name: 'Reverse Flyes', sets: 3, reps: 12 }] },
          { day: 'Wednesday', focusArea: 'Legs & Core', exercises: [{ name: 'Squats', sets: 4, reps: 15 }, { name: 'Lunges', sets: 3, reps: 12 }, { name: 'Leg Press', sets: 3, reps: 15 }, { name: 'Leg Curls', sets: 3, reps: 15 }, { name: 'Calf Raises', sets: 4, reps: 20 }, { name: 'Plank', sets: 3, reps: 60 }, { name: 'Crunches', sets: 3, reps: 25 }, { name: 'Russian Twists', sets: 3, reps: 20 }, { name: 'Leg Raises', sets: 3, reps: 15 }, { name: 'Bicycle Crunches', sets: 3, reps: 20 }] },
          { day: 'Thursday', focusArea: 'Shoulders & Abs', exercises: [{ name: 'Overhead Press', sets: 3, reps: 12 }, { name: 'Lateral Raises', sets: 3, reps: 15 }, { name: 'Front Raises', sets: 3, reps: 12 }, { name: 'Arnold Press', sets: 3, reps: 10 }, { name: 'Shrugs', sets: 3, reps: 15 }, { name: 'Mountain Climbers', sets: 3, reps: 30 }, { name: 'Flutter Kicks', sets: 3, reps: 20 }, { name: 'V-Ups', sets: 3, reps: 15 }, { name: 'Toe Touches', sets: 3, reps: 20 }, { name: 'Ab Rollouts', sets: 3, reps: 12 }] },
          { day: 'Friday', focusArea: 'Full Body HIIT', exercises: [{ name: 'Burpees', sets: 4, reps: 15 }, { name: 'Jump Squats', sets: 3, reps: 20 }, { name: 'High Knees', sets: 3, reps: 30 }, { name: 'Jumping Jacks', sets: 3, reps: 50 }, { name: 'Kettlebell Swings', sets: 3, reps: 20 }, { name: 'Box Jumps', sets: 3, reps: 15 }, { name: 'Battle Ropes', sets: 3, reps: 30 }, { name: 'Sprints', sets: 5, reps: 1 }, { name: 'Bear Crawls', sets: 3, reps: 10 }, { name: 'Thrusters', sets: 3, reps: 15 }] },
          { day: 'Saturday', focusArea: 'Cardio & Agility', exercises: [{ name: 'Running', sets: 1, reps: 30 }, { name: 'Cycling', sets: 1, reps: 20 }, { name: 'Rowing', sets: 1, reps: 15 }, { name: 'Jump Rope', sets: 4, reps: 50 }, { name: 'Stair Jumps', sets: 3, reps: 15 }, { name: 'Agility Ladder', sets: 3, reps: 10 }, { name: 'Cone Drills', sets: 3, reps: 10 }, { name: 'Shadow Boxing', sets: 3, reps: 20 }, { name: 'Speed Skaters', sets: 3, reps: 20 }, { name: 'Tuck Jumps', sets: 3, reps: 15 }] },
          { day: 'Sunday', focusArea: 'Active Recovery & Yoga', exercises: [{ name: 'Downward Dog', sets: 2, reps: 30 }, { name: 'Childs Pose', sets: 2, reps: 45 }, { name: 'Cobra Stretch', sets: 2, reps: 30 }, { name: 'Cat-Cow', sets: 2, reps: 10 }, { name: 'Pigeon Pose', sets: 2, reps: 30 }, { name: 'Seated Forward Fold', sets: 2, reps: 30 }, { name: 'Standing Quad Stretch', sets: 2, reps: 30 }, { name: 'Butterfly Stretch', sets: 2, reps: 30 }, { name: 'Torso Twists', sets: 2, reps: 20 }, { name: 'Deep Breathing', sets: 1, reps: 60 }] }
        ]
      });
    }
  };

  useEffect(() => {
    fetchWorkoutPlan();
  }, []);

  const handleResetWeek = async () => {
    try {
      const safeUserId = encodeURIComponent(userId);
      const response = await fetch(`http://localhost:5001/api/workouts/${safeUserId}/reset`, { 
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
      });
      if (response.ok) {
        const data = await response.json();
        setWorkoutData(prev => {
          localStorage.setItem('localCompleted', 0);
          localStorage.setItem('localWeek', data.currentWeekNumber);
          return { ...prev, completedWorkouts: 0, currentWeekNumber: data.currentWeekNumber, weeklySchedule: data.weeklySchedule };
        });
      }
    } catch (error) {
      setWorkoutData(prev => {
        localStorage.setItem('localCompleted', 0);
        const nextWeek = (prev.currentWeekNumber || 1) + 1;
        localStorage.setItem('localWeek', nextWeek);
        return { ...prev, completedWorkouts: 0, currentWeekNumber: nextWeek };
      });
    }
  };

  const handleMarkComplete = async () => {
    try {
      const safeUserId = encodeURIComponent(userId);
      const response = await fetch(`http://localhost:5001/api/workouts/${safeUserId}/progress`, { 
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
      });
      if (response.ok) {
        const data = await response.json();
        setWorkoutData(prev => {
          localStorage.setItem('localCompleted', data.completedWorkouts);
          if (data.totalWorkouts !== undefined) localStorage.setItem('localTotal', data.totalWorkouts);
          if (data.currentStreak !== undefined) localStorage.setItem('localStreak', data.currentStreak);
          return { ...prev, completedWorkouts: data.completedWorkouts, totalWorkouts: data.totalWorkouts !== undefined ? data.totalWorkouts : prev.totalWorkouts, currentStreak: data.currentStreak !== undefined ? data.currentStreak : prev.currentStreak };
        });
      }
    } catch (error) {
      setWorkoutData(prev => {
        const newCount = prev.completedWorkouts < prev.weeklyGoal ? prev.completedWorkouts + 1 : prev.completedWorkouts;
        const newTotal = (prev.totalWorkouts || 0) + 1;
        const newStreak = (prev.currentStreak || 0) + 1;
        localStorage.setItem('localCompleted', newCount);
        localStorage.setItem('localTotal', newTotal);
        localStorage.setItem('localStreak', newStreak);
        return { ...prev, completedWorkouts: newCount, totalWorkouts: newTotal, currentStreak: newStreak };
      });
    }
  };

  return (
    <div className="min-h-screen relative pb-12 text-white bg-black">
      <div 
        className="fixed inset-0 bg-cover bg-center opacity-20 pointer-events-none"
        style={{ backgroundImage: isFemale ? "url('https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=1470&auto=format&fit=crop')" : "url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470&auto=format&fit=crop')" }}
      ></div>
      <div className="fixed inset-0 bg-gradient-to-b from-black/40 via-black/80 to-black pointer-events-none"></div>
      <div className="relative z-10">
        <Navbar />
        <div className="max-w-6xl mx-auto pt-10 px-4">
          <div className="flex flex-col lg:flex-row justify-between items-start gap-6 mb-8">
            <div className="text-center lg:text-left w-full lg:w-auto">
              <h1 className="text-4xl font-extrabold text-white capitalize drop-shadow-lg">Week {workoutData?.currentWeekNumber || 1} - <span className={themeText}>{userName}'s</span> Plan</h1>
              <p className="text-gray-300 mt-2 text-lg font-medium drop-shadow-md">Welcome to Week {workoutData?.currentWeekNumber || 1} of your 52-Week Journey.</p>
            </div>
            {workoutData && (
              <div className="w-full lg:w-96 relative z-20">
                <ProgressTracker completedWorkouts={workoutData.completedWorkouts} weeklyGoal={workoutData.weeklyGoal} onMarkComplete={handleMarkComplete} onResetWeek={handleResetWeek} />
              </div>
            )}
          </div>
          {workoutData ? (
            <div className="w-full flex justify-center">
              <WorkoutList schedule={workoutData.weeklySchedule} />
            </div>
          ) : (
            <p className="text-gray-500 text-center py-20 text-xl font-semibold animate-pulse">Loading your workout plan...</p>
          )}
        </div>
      </div>
    </div>
  );
};
export default Dashboard;