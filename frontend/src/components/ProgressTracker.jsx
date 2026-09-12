import React from 'react';

const ProgressTracker = ({ completedWorkouts, weeklyGoal, onMarkComplete }) => {
  const completedCount = Number(completedWorkouts) || 0;
  const progressPercentage = Math.round((completedCount / 7) * 100) || 0;
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const handleCheck = (idx) => {
    // Sirf current/next day ko tick karne dega
    if (idx === completedCount && completedCount < 7) {
      onMarkComplete();
    } else if (idx > completedCount) {
      alert("Please complete the previous day's workout first!");
    }
  };

  return (
    <div className="p-6 bg-black rounded-2xl shadow-2xl border border-gray-800 max-w-md w-full">
      <h2 className="text-2xl font-extrabold text-white mb-1">7-Day Challenge</h2>
      <p className="text-gray-400 mb-6 font-medium text-sm">
        Completed <span className="text-green-500 font-bold">{completedCount}</span> out of 7 days.
      </p>
      
      <div className="flex justify-between items-center mb-6 px-1">
        {days.map((day, idx) => {
          const isChecked = idx < completedCount;
          const isNext = idx === completedCount;
          return (
            <div key={idx} className="flex flex-col items-center gap-2">
              <span className={`text-xs font-bold ${isChecked ? 'text-green-500' : 'text-gray-500'}`}>{day}</span>
              <input 
                type="checkbox" 
                checked={isChecked} 
                onChange={() => handleCheck(idx)}
                disabled={!isNext && !isChecked}
                className={`w-5 h-5 accent-green-500 ${isNext ? 'cursor-pointer hover:scale-110' : 'cursor-not-allowed opacity-60'} transition-transform`}
              />
            </div>
          );
        })}
      </div>
      
      <div className="w-full bg-gray-800 rounded-full h-3 relative overflow-hidden">
        <div
          className="bg-green-500 h-3 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
      
      {completedCount >= 7 && (
        <div className="mt-6 w-full py-3 bg-green-500 text-black font-extrabold rounded-xl text-center shadow-lg animate-pulse">
          Week Complete! Starting next week... 🚀
        </div>
      )}
    </div>
  );
};

export default ProgressTracker;