import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const [goal, setGoal] = useState(localStorage.getItem('userGoal') || 'Fat Loss');
  const [level, setLevel] = useState(localStorage.getItem('userLevel') || 'Beginner');
  
  const isFemale = localStorage.getItem('userGender') === 'Female';
  const themeText = isFemale ? 'text-pink-500' : 'text-green-500';
  const themeHoverText = isFemale ? 'hover:text-pink-500' : 'hover:text-green-500';
  const themeBorder = isFemale ? 'border-pink-500' : 'border-green-500';
  const themeBg = isFemale ? 'bg-pink-500' : 'bg-green-500';
  const themeHoverBg = isFemale ? 'hover:bg-pink-500' : 'hover:bg-green-500';
  const themeRing = isFemale ? 'focus:ring-pink-500' : 'focus:ring-green-500';

  const userName = localStorage.getItem('userName') || "Athlete";
  const userPhoto = localStorage.getItem('userPhoto') || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userName}&backgroundColor=e2e8f0`;

  const handleLogout = () => {
    localStorage.clear(); // Login details remove karein
    navigate('/login');
  };

  const handleStartSession = () => {
    setShowPopup(false);
    navigate('/live-session');
  };

  const handleSaveStats = () => {
      localStorage.setItem('userGoal', goal);
      localStorage.setItem('userLevel', level);
      setShowSettings(false);
  };

  return (
    <>
      <nav className="bg-gray-900 shadow-md border-b border-gray-800 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        {/* LEFT: Avatar Dropdown & Brand */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <img 
              src={userPhoto} 
              alt="User Avatar" 
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className={`w-11 h-11 rounded-full cursor-pointer object-cover border-2 ${themeBorder} hover:opacity-80 transition-opacity`}
            />
            {showProfileMenu && (
              <div className="absolute top-14 left-0 w-48 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl py-2 flex flex-col z-50">
                <Link 
                  to="/profile" 
                  onClick={() => setShowProfileMenu(false)}
                  className="px-4 py-3 text-white text-sm font-bold hover:bg-gray-800 transition-colors"
                >
                  Edit Profile ✏️
                </Link>
                <button 
                  onClick={handleLogout}
                  className="px-4 py-3 text-red-500 text-sm font-bold hover:bg-gray-800 transition-colors text-left border-t border-gray-800"
                >
                  Logout 🚪
                </button>
              </div>
            )}
          </div>
          <div className={`text-2xl md:text-3xl font-extrabold text-white cursor-pointer ${themeHoverText} transition-colors`} onClick={() => navigate('/dashboard')}>
            Fit<span className={themeText}>Life</span>
          </div>
        </div>
        
        {/* RIGHT: Links & Hamburger Menu */}
        <div className="flex items-center gap-4 md:gap-6">
          <Link to="/dashboard" className={`text-gray-300 ${themeHoverText} font-bold transition-colors hidden md:block`}>Dashboard</Link>
          <Link to="/ai-coach" className={`text-gray-300 ${themeHoverText} font-bold transition-colors hidden md:block`}>AI Coach 🤖</Link>
          <Link to="/guidance" className={`text-gray-300 ${themeHoverText} font-bold transition-colors hidden md:block`}>Guidance</Link>
          <Link to="/nutrition" className={`text-gray-300 ${themeHoverText} font-bold transition-colors hidden md:block`}>Nutrition 🥗</Link>
          <Link to="/progress" className={`text-gray-300 ${themeHoverText} font-bold transition-colors hidden md:block`}>Progress</Link>
          <button onClick={() => setShowPopup(true)} className={`text-gray-300 ${themeHoverText} font-bold transition-colors hidden sm:block`}>Live Session</button>
          
          {/* Hamburger Icon */}
          <button onClick={() => setShowSettings(true)} className={`text-gray-300 ${themeHoverText} transition-colors focus:outline-none ml-2`}>
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16"></path></svg>
          </button>
        </div>
      </nav>

      {/* Live Session Confirmation Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] p-4 backdrop-blur-sm">
          <div className={`bg-gray-900 border ${themeBorder} rounded-3xl p-8 max-w-md w-full text-center shadow-[0_0_30px_rgba(0,0,0,0.5)] transform transition-all scale-105`}>
            <div className="text-6xl mb-4 animate-pulse">🎥</div>
            <h3 className="text-3xl font-extrabold text-white mb-3">Ready to Join?</h3>
            <p className="text-gray-300 mb-8 font-medium">
              You are about to start a 1-on-1 live video session with an expert coach. Ensure your camera and microphone are ready.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={() => setShowPopup(false)} className="px-6 py-3 rounded-xl font-bold text-gray-300 bg-gray-800 hover:bg-gray-700 transition-colors">
                Cancel
              </button>
              <button onClick={handleStartSession} className={`px-6 py-3 rounded-xl font-extrabold text-black bg-white ${themeHoverBg} transition-all`}>
                Start Live Session
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Settings Sidebar Panel (Right Side) */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex justify-end backdrop-blur-sm transition-all duration-300">
          <div className={`w-full max-w-md bg-gray-900 h-full shadow-2xl border-l ${themeBorder} flex flex-col`}>
            <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-black/30">
              <h2 className="text-2xl font-extrabold text-white">Your Stats 📊</h2>
              <button onClick={() => setShowSettings(false)} className="text-gray-400 hover:text-white text-3xl">&times;</button>
            </div>
            
            <div className="p-6 flex-grow overflow-y-auto space-y-6">
              {/* Goal & Level */}
              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-2">Fitness Goal</label>
                <select value={goal} onChange={(e)=>setGoal(e.target.value)} className={`w-full bg-black border border-gray-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 ${themeRing} mb-4`}>
                  <option value="Weight Loss (Burn Fat)">Weight Loss (Burn Fat)</option>
                  <option value="Muscle Gain (Build Mass)">Muscle Gain (Build Mass)</option>
                  <option value="General Fitness">General Fitness</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-2">Experience Level</label>
                <select value={level} onChange={(e)=>setLevel(e.target.value)} className={`w-full bg-black border border-gray-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 ${themeRing}`}>
                  <option value="Beginner (Just starting)">Beginner (Just starting)</option>
                  <option value="Intermediate (I workout sometimes)">Intermediate (I workout sometimes)</option>
                  <option value="Advanced (I am a beast)">Advanced (I am a beast)</option>
                </select>
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-800 bg-black/30">
              <button onClick={handleSaveStats} className={`w-full py-4 ${themeBg} text-black font-extrabold text-lg rounded-xl ${themeHoverBg} transition-all shadow-md`}>
                Save My Stats
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default Navbar;