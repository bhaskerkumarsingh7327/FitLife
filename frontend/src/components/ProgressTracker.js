import React, { useState } from 'react';

const ProgressTracker = ({ completedWorkouts, weeklyGoal, onMarkComplete }) => {
  const [isOpen, setIsOpen] = useState(false); // Dropdown ke liye state
  const completedCount = Number(completedWorkouts) || 0;
  const progressPercentage = Math.round((completedCount / 7) * 100) || 0;
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const isFemale = localStorage.getItem('userGender') === 'Female';
  const themeText = isFemale ? 'text-pink-500' : 'text-green-500';
  const themeBg = isFemale ? 'bg-pink-500' : 'bg-green-500';
  const themeAccent = isFemale ? 'accent-pink-500' : 'accent-green-500';

  const handleCheck = (idx) => {
    // Sirf current/next day ko tick karne dega
    if (idx === completedCount && completedCount < 7) {
      onMarkComplete();
    } else if (idx > completedCount) {
      alert("Please complete the previous day's workout first!");
    }
  };

  return (
    <div className="bg-gray-900/90 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-700 w-full transition-all duration-300 z-50">
      {/* Dropdown Header Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="w-full p-5 flex justify-between items-center focus:outline-none"
      >
        <h2 className="text-xl font-extrabold text-white">Weekly Progress</h2>
        <span className={`transform transition-transform duration-300 ${themeText} ${isOpen ? 'rotate-180' : ''}`}>▼</span>
      </button>
      
      {/* Dropdown Content */}
      <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="p-6 pt-0 border-t border-gray-700/50 mt-2">
          <p className="text-gray-400 mb-6 font-medium text-sm">
            Completed <span className={`${themeText} font-bold`}>{completedCount}</span> out of 7 days.
          </p>
          
          <div className="flex justify-between items-center mb-6 px-1">
            {days.map((day, idx) => {
              const isChecked = idx < completedCount;
              const isNext = idx === completedCount;
              return (
                <div key={idx} className="flex flex-col items-center gap-2">
                  <span className={`text-xs font-bold ${isChecked ? themeText : 'text-gray-500'}`}>{day}</span>
                  <input 
                    type="checkbox" 
                    checked={isChecked} 
                    onChange={() => handleCheck(idx)}
                    disabled={!isNext && !isChecked}
                    className={`w-5 h-5 ${themeAccent} ${isNext ? 'cursor-pointer hover:scale-110' : 'cursor-not-allowed opacity-60'} transition-transform`}
                  />
                </div>
              );
            })}
          </div>
          
          <div className="w-full bg-gray-800 rounded-full h-3 relative overflow-hidden">
            <div
              className={`${themeBg} h-3 rounded-full transition-all duration-500 ease-out`}
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          
          {completedCount >= 7 && (
            <div className={`mt-6 w-full py-3 ${themeBg} text-black font-extrabold rounded-xl text-center shadow-lg animate-pulse`}>
              Week Complete! Starting next week... 🚀
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgressTracker;