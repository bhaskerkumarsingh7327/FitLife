import React from 'react';
import { useNavigate } from 'react-router-dom';

const WorkoutList = ({ schedule }) => {
  const navigate = useNavigate();
  
  const isFemale = localStorage.getItem('userGender') === 'Female';
  const themeText = isFemale ? 'text-pink-500' : 'text-green-500';
  const themeBg = isFemale ? 'bg-pink-500' : 'bg-green-500';
  const themeHoverBg = isFemale ? 'hover:bg-pink-400' : 'hover:bg-green-400';
  const themeHoverBorder = isFemale ? 'hover:border-pink-500' : 'hover:border-green-500';
  const themeShadow = isFemale ? 'shadow-[0_0_15px_rgba(236,72,153,0.3)]' : 'shadow-[0_0_15px_rgba(34,197,94,0.3)]';

  if (!schedule || schedule.length === 0) return <p className="text-gray-500 mt-4 text-lg">No workout plan found.</p>;

  return (
    <div className="mt-8 w-full">
      <h3 className="text-3xl font-black mb-8 text-white drop-shadow-md text-center uppercase tracking-wide">Weekly Schedule</h3>
      <div className="flex flex-wrap justify-center gap-6">
        {schedule.map((day, index) => (
          <div key={index} className={`w-full sm:w-[calc(50%-0.75rem)] bg-gray-900/80 backdrop-blur-md p-6 rounded-2xl shadow-2xl border border-gray-700 ${themeHoverBorder} hover:bg-gray-800 transition-all duration-300 group hover:-translate-y-1`}>
            <h4 className={`font-extrabold text-xl mb-4 ${themeText}`}>
              {day.day} - <span className="text-white">{day.focusArea}</span>
            </h4>
            
            <ul className="text-gray-300 space-y-2">
              {day.exercises.slice(0, 3).map((ex, idx) => (
                <li key={idx} className="flex items-center gap-3">
                  <span className={`${themeText} font-bold`}>✓</span>
                  <span className="font-medium">{ex.name} <span className="text-gray-400 text-xs ml-1">({ex.sets}x{ex.reps})</span></span>
                </li>
              ))}
            </ul>
            {day.exercises.length > 3 && (
              <div className="mt-6 pt-4 border-t border-gray-700 text-center">
                <button onClick={() => navigate(`/workout/${day.day.toLowerCase()}`, { state: { dayData: day } })}
                  className={`w-full ${themeBg} text-black font-extrabold py-3 px-6 rounded-xl ${themeHoverBg} transition-all transform group-hover:scale-105 ${themeShadow}`}>
                  Start Workout
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkoutList;