import React, { useState, useEffect } from 'react';
import Navbar from './Navbar.jsx';

const Profile = () => {
  const [userName, setUserName] = useState(localStorage.getItem('userName') || "Athlete");
  const userEmail = localStorage.getItem('userEmail') || "Guest";
  const userPhoto = localStorage.getItem('userPhoto') || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userName}&backgroundColor=e2e8f0`;
  
  const [workoutData, setWorkoutData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(userName);
  
  const isFemale = localStorage.getItem('userGender') === 'Female';
  const themeText = isFemale ? 'text-pink-500' : 'text-green-500';
  const themeBg = isFemale ? 'bg-pink-500' : 'bg-green-500';
  const themeBorder = isFemale ? 'border-pink-500' : 'border-green-500';
  const themeHoverBg = isFemale ? 'hover:bg-pink-400' : 'hover:bg-green-400';
  const themeShadow = isFemale ? 'shadow-[0_0_15px_rgba(236,72,153,0.3)]' : 'shadow-[0_0_15px_rgba(34,197,94,0.3)]';

  // Ab real user ID seedha LocalStorage se aayegi
  const userId = localStorage.getItem('userEmail') ? localStorage.getItem('userEmail') : "guest_user";

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const safeUserId = encodeURIComponent(userId);
       const response = await fetch(`${process.env.REACT_APP_API_URL}/api/workouts/${safeUserId}`);
        if (response.ok) {
          const data = await response.json();
          setWorkoutData(data);
        } else {
          throw new Error("Failed to fetch profile");
        }
      } catch (error) {
        console.error("Fetch error:", error);
        const localTotal = Number(localStorage.getItem('localTotal')) || 0;
        const localStreak = Number(localStorage.getItem('localStreak')) || 0;
        setWorkoutData({
          fitnessGoal: 'General Fitness',
          totalWorkouts: localTotal,
          currentStreak: localStreak
        });
      }
    };
    fetchProfileData();
  }, [userId]);

  const handleSaveProfile = () => {
    localStorage.setItem('userName', editName);
    setUserName(editName);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      
      <div className="max-w-4xl mx-auto pt-12 px-4">
        <div className="bg-gray-900 rounded-3xl shadow-xl overflow-hidden border border-gray-800">
          {/* Colorful Cover Photo */}
          <div className="h-48 bg-black border-b border-gray-800"></div>
          
          <div className="px-8 pb-8 flex flex-col items-center -mt-20">
            {/* Avatar */}
            <img 
              src={userPhoto} 
              alt="Profile" 
              className="w-40 h-40 rounded-full border-8 border-gray-900 bg-gray-800 shadow-lg"
            />
            
            <h2 className="text-3xl font-extrabold text-white mt-4 capitalize">{userName}</h2>
            <p className={`${themeText} font-bold mb-6`}>{userEmail}</p>
            
            <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 text-center mt-4">
              <div className="bg-gray-800 hover:bg-gray-700 transition-colors p-6 rounded-2xl border border-gray-700">
                <h3 className="text-gray-300 font-bold mb-1">Current Goal</h3>
                <p className="text-2xl font-extrabold text-white">{workoutData ? workoutData.fitnessGoal : 'General Fitness'}</p>
              </div>
              <div className="bg-gray-800 hover:bg-gray-700 transition-colors p-6 rounded-2xl border border-gray-700">
                <h3 className="text-gray-300 font-bold mb-1">Total Workouts</h3>
                <p className="text-2xl font-extrabold text-white">{workoutData ? workoutData.totalWorkouts || 0 : 0} Days</p>
              </div>
              <div className="bg-gray-800 hover:bg-gray-700 transition-colors p-6 rounded-2xl border border-gray-700">
                <h3 className="text-gray-300 font-bold mb-1">Current Streak</h3>
                <p className="text-2xl font-extrabold text-white">🔥 {workoutData ? workoutData.currentStreak || 0 : 0} Days</p>
              </div>
            </div>

            <button onClick={() => setIsEditing(true)} className={`mt-10 px-10 py-3 ${themeBg} text-black rounded-xl font-extrabold ${themeHoverBg} transition-all ${themeShadow} hover:scale-105`}>
              Edit Profile
            </button>
          </div>
        </div>
      </div>

      {/* Edit Profile Popup (Modal) */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] p-4 backdrop-blur-sm">
          <div className={`bg-gray-900 border ${themeBorder} rounded-3xl p-8 max-w-md w-full shadow-[0_0_30px_rgba(0,0,0,0.5)] transform transition-all scale-105`}>
            <h3 className="text-3xl font-extrabold text-white mb-6">Edit Profile ✏️</h3>
            
            <div className="space-y-5 mb-8">
              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-2">Display Name</label>
                <input 
                  type="text" 
                  value={editName} 
                  onChange={(e) => setEditName(e.target.value)} 
                  className={`w-full px-4 py-3 rounded-xl bg-black border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-${isFemale?'pink':'green'}-500 transition-all`} 
                  placeholder="Enter your name" 
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-2">Email Address (Read Only)</label>
                <input 
                  type="email" 
                  value={userEmail} 
                  disabled 
                  className="w-full px-4 py-3 rounded-xl bg-black border border-gray-800 text-gray-500 cursor-not-allowed opacity-70" 
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-end">
              <button onClick={() => setIsEditing(false)} className="px-6 py-3 rounded-xl font-bold text-gray-300 bg-gray-800 hover:bg-gray-700 transition-colors">
                Cancel
              </button>
              <button onClick={handleSaveProfile} className={`px-6 py-3 rounded-xl font-extrabold text-black ${themeBg} ${themeHoverBg} transition-all ${themeShadow}`}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;