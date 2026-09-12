import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from './Navbar.jsx';

const DayWorkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { dayData } = location.state || {};
  const [completed, setCompleted] = useState(false);
  const [setLogs, setSetLogs] = useState({});
  const [restTimer, setRestTimer] = useState(0);
  const [caloriesBurned, setCaloriesBurned] = useState(0);

  // Guided Workout Mode States
  const [isGuidedMode, setIsGuidedMode] = useState(false);
  const [guidedState, setGuidedState] = useState('prep'); // 'prep', 'workout', 'rest', 'finished'
  const [guidedTimer, setGuidedTimer] = useState(20);
  const [currentExIdx, setCurrentExIdx] = useState(0);
  const [currentSetIdx, setCurrentSetIdx] = useState(0);
  
  const isFemale = localStorage.getItem('userGender') === 'Female';
  const themeText = isFemale ? 'text-pink-500' : 'text-green-500';
  const themeBg = isFemale ? 'bg-pink-500' : 'bg-green-500';
  const themeBorder = isFemale ? 'border-pink-500' : 'border-green-500';
  const themeHoverBg = isFemale ? 'hover:bg-pink-500' : 'hover:bg-green-500';
  const themeHoverBorder = isFemale ? 'hover:border-pink-500' : 'hover:border-green-500';
  const themeShadow = isFemale ? 'shadow-[0_0_20px_rgba(236,72,153,0.4)]' : 'shadow-[0_0_20px_rgba(34,197,94,0.4)]';

  // Manual Rest Timer Logic
  useEffect(() => {
    let interval = null;
    if (restTimer > 0) {
      interval = setInterval(() => {
        setRestTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [restTimer]);

  // GUIDED MODE TIMER LOGIC
  useEffect(() => {
    let interval = null;
    if (isGuidedMode) {
      if (guidedState === 'prep' || guidedState === 'rest') {
        if (guidedTimer > 0) {
          interval = setInterval(() => setGuidedTimer(prev => prev - 1), 1000);
        } else {
          if (guidedState === 'prep') {
            setGuidedState('workout');
            setGuidedTimer(0);
          } else if (guidedState === 'rest') {
            moveToNextSet();
          }
        }
      } else if (guidedState === 'workout') {
        // Workout ke time stopwatch chalegi
        interval = setInterval(() => setGuidedTimer(prev => prev + 1), 1000);
      }
    }
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isGuidedMode, guidedState, guidedTimer]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleToggleSet = (exIdx, setIdx, targetReps) => {
    const key = `${exIdx}-${setIdx}`;
    setSetLogs(prev => {
      const isDone = prev[key]?.done;
      const newLog = { ...prev };
      if (isDone) {
        newLog[key] = { ...newLog[key], done: false };
        setCaloriesBurned(c => Math.max(0, c - 15)); // Undo calories
      } else {
        newLog[key] = { reps: prev[key]?.reps || targetReps, done: true };
        setCaloriesBurned(c => c + 15); // Add ~15 kcal per set
        setRestTimer(60); // Start 60s Rest Timer
      }
      return newLog;
    });
  };

  const handleRepChange = (exIdx, setIdx, val) => {
    const key = `${exIdx}-${setIdx}`;
    setSetLogs(prev => ({
      ...prev,
      [key]: { ...prev[key], reps: val }
    }));
  };

  // GUIDED MODE CONTROLS
  const startGuidedWorkout = () => {
    setIsGuidedMode(true);
    setGuidedState('prep');
    setGuidedTimer(20); // 20s Get Ready Timer
    setCurrentExIdx(0);
    setCurrentSetIdx(0);
  };

  const moveToNextSet = () => {
    const currentEx = dayData.exercises[currentExIdx];
    if (currentSetIdx + 1 < currentEx.sets) {
      setCurrentSetIdx(prev => prev + 1);
    } else {
      if (currentExIdx + 1 < dayData.exercises.length) {
        setCurrentExIdx(prev => prev + 1);
        setCurrentSetIdx(0);
      } else {
        setGuidedState('finished');
        return;
      }
    }
    setGuidedState('workout');
    setGuidedTimer(0);
  };

  const handleGuidedCompleteSet = () => {
    const currentEx = dayData.exercises[currentExIdx];
    handleToggleSet(currentExIdx, currentSetIdx, currentEx.reps); // Backend log save
    
    if (currentExIdx === dayData.exercises.length - 1 && currentSetIdx === currentEx.sets - 1) {
      setGuidedState('finished');
    } else {
      setGuidedState('rest');
      setGuidedTimer(60); // 60s Rest Timer
    }
  };

  if (!dayData) {
    return (
      <div className="min-h-screen bg-black pb-12">
        <Navbar />
        <div className="max-w-3xl mx-auto pt-20 px-4 text-center">
          <h2 className="text-2xl font-bold text-gray-200">No Workout Data Found</h2>
          <button onClick={() => navigate('/dashboard')} className={`mt-4 ${themeText} font-bold opacity-80 hover:opacity-100 transition-opacity`}>Go Back to Dashboard</button>
        </div>
      </div>
    );
  }

  const handleComplete = () => {
    setCompleted(true);
    // Show Thank You message, then redirect to Dashboard after 3 seconds
    setTimeout(() => {
      navigate('/dashboard');
    }, 3000);
  };

  // ===== GUIDED PLAYER UI =====
  if (isGuidedMode) {
    const currentEx = dayData?.exercises[currentExIdx];
    
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute top-0 w-full p-6 flex justify-between items-center z-50">
          <button onClick={() => setIsGuidedMode(false)} className="text-gray-400 hover:text-white font-bold transition-colors">&larr; Exit Mode</button>
          <span className={`font-black ${themeText} bg-gray-900 px-4 py-2 rounded-xl`}>🔥 {caloriesBurned} kcal</span>
        </div>

        {guidedState === 'prep' && (
          <div className="text-center z-10">
            <h2 className="text-5xl md:text-7xl font-black text-white mb-4 uppercase tracking-wider animate-pulse">Get Ready!</h2>
            <p className={`text-9xl font-extrabold ${themeText} mb-8 drop-shadow-lg`}>{guidedTimer}</p>
            <p className="text-2xl text-gray-400">First Exercise: <span className="text-white font-bold">{dayData.exercises[0].name}</span></p>
            <button onClick={() => { setGuidedState('workout'); setGuidedTimer(0); }} className="mt-10 px-8 py-3 rounded-xl font-bold text-gray-300 bg-gray-800 hover:bg-gray-700 transition-colors">Skip Timer ⏭️</button>
          </div>
        )}

        {guidedState === 'workout' && currentEx && (
          <div className="text-center w-full max-w-2xl px-4 z-10">
            <p className={`text-xl font-bold ${themeText} mb-2 uppercase tracking-widest`}>Exercise {currentExIdx + 1} of {dayData.exercises.length}</p>
            <h2 className="text-5xl md:text-6xl font-black text-white mb-8">{currentEx.name}</h2>
            <div className="flex justify-center gap-4 md:gap-8 mb-10">
              <div className="bg-gray-900 border border-gray-800 p-6 rounded-3xl w-32 md:w-40 shadow-xl">
                <p className="text-gray-500 text-sm font-bold uppercase mb-1">Set</p>
                <p className="text-4xl font-black text-white">{currentSetIdx + 1}<span className="text-xl text-gray-600">/{currentEx.sets}</span></p>
              </div>
              <div className="bg-gray-900 border border-gray-800 p-6 rounded-3xl w-32 md:w-40 shadow-xl">
                <p className="text-gray-500 text-sm font-bold uppercase mb-1">Reps</p>
                <p className="text-4xl font-black text-white">{currentEx.reps}</p>
              </div>
            </div>
            <p className="text-gray-400 font-mono text-2xl mb-10 flex items-center justify-center gap-3"><span className="animate-spin">⏳</span> {formatTime(guidedTimer)}</p>
            <button onClick={handleGuidedCompleteSet} className={`w-full py-5 rounded-2xl font-extrabold text-2xl text-black ${themeBg} ${themeShadow} hover:scale-105 transition-all`}>
              Mark Set Complete ✅
            </button>
          </div>
        )}

        {guidedState === 'rest' && (
          <div className="text-center z-10">
            <h2 className="text-5xl font-black text-white mb-4">REST</h2>
            <p className={`text-8xl md:text-9xl font-extrabold ${themeText} mb-8`}>{formatTime(guidedTimer)}</p>
            <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl mb-8 inline-block shadow-lg">
              <p className="text-sm text-gray-500 font-bold uppercase tracking-wider mb-2">Up Next</p>
              <p className="text-2xl font-bold text-white">
                {currentSetIdx + 1 < currentEx.sets ? `${currentEx.name} (Set ${currentSetIdx + 2})` : dayData.exercises[currentExIdx + 1]?.name}
              </p>
            </div>
            <br/>
            <button onClick={moveToNextSet} className="px-10 py-4 rounded-xl font-bold text-black bg-white hover:bg-gray-200 transition-all shadow-md">
              Skip Rest ⏭️
            </button>
          </div>
        )}

        {guidedState === 'finished' && (
          <div className="text-center z-10 animate-bounce">
            <div className="text-8xl mb-6">🎉</div>
            <h1 className={`text-5xl md:text-6xl font-extrabold ${themeText} mb-4`}>Workout Complete!</h1>
            <p className="text-2xl text-gray-300 mb-10">You burned approx <span className="font-bold text-white">{caloriesBurned} kcal</span> today.</p>
            <button onClick={handleComplete} className={`px-12 py-5 rounded-2xl font-extrabold text-2xl text-black ${themeBg} ${themeShadow} hover:scale-105 transition-all`}>
              Save & Finish 🏁
            </button>
          </div>
        )}
      </div>
    );
  }

  // ===== NORMAL MANUAL UI =====
  return (
    <div className="min-h-screen bg-black pb-12">
      <Navbar />
      <div className="max-w-4xl mx-auto pt-10 px-4">
        <button onClick={() => navigate(-1)} className={`mb-6 text-gray-400 hover:${themeText} font-bold flex items-center gap-2 transition-colors`}>
          &larr; Back to Dashboard
        </button>
        
        <div className={`bg-gray-900 p-8 md:p-10 rounded-2xl shadow-lg border border-gray-800 relative overflow-hidden transition-all duration-500`}>
          {completed ? (
            <div className="text-center py-16 transform transition-all scale-105">
              <div className="text-7xl mb-6 animate-bounce">🎉</div>
              <h1 className={`text-4xl font-extrabold ${themeText} mb-4`}>Thank You!</h1>
              <p className="text-xl text-gray-300 font-medium max-w-lg mx-auto">
                Awesome job completing your <span className={`font-bold ${themeText}`}>{dayData.day}</span> workout! Keep crushing those goals.
              </p>
              <p className="text-sm text-gray-400 mt-10 animate-pulse font-semibold">Redirecting to Dashboard...</p>
            </div>
          ) : (
            <>
              <h1 className="text-4xl font-extrabold text-white mb-2">{dayData.day} Workout</h1>
              <p className={`text-xl ${themeText} font-bold mb-6`}>{dayData.focusArea}</p>

              {/* Guided Workout Start Button */}
              <div className="mb-8">
                <button onClick={startGuidedWorkout} className={`w-full py-4 ${themeBg} text-black font-extrabold text-xl md:text-2xl rounded-2xl ${themeShadow} hover:scale-105 transition-all flex items-center justify-center gap-3`}>
                  ▶️ Start Guided Workout
                </button>
                <p className="text-center text-gray-500 mt-4 text-sm font-bold uppercase tracking-wider">Or log sets manually below 👇</p>
              </div>

              {/* Live Status Bar (Calories & Timer) */}
              <div className={`sticky top-24 z-40 bg-black/90 backdrop-blur-md p-5 rounded-2xl border ${themeBorder} flex justify-between items-center mb-8 shadow-xl`}>
                <div>
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Calories Burned</p>
                  <p className={`text-3xl font-black ${themeText}`}>🔥 {caloriesBurned} <span className="text-sm text-gray-500 font-bold">kcal</span></p>
                </div>
                <div className="text-right">
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Rest Timer</p>
                  <p className={`text-3xl font-mono font-black ${restTimer > 0 ? themeText + ' animate-pulse' : 'text-gray-600'}`}>{formatTime(restTimer)}</p>
                </div>
              </div>
              
              <div className="space-y-8">
                {dayData.exercises.map((ex, idx) => (
                  <div key={idx} className={`bg-gray-800 p-5 md:p-6 rounded-2xl border border-gray-700 ${themeHoverBorder} transition-all`}>
                    <div className="flex items-center gap-4 mb-5 border-b border-gray-700 pb-4">
                      <div className={`w-10 h-10 bg-black shadow-sm ${themeText} rounded-full flex items-center justify-center font-black text-lg border border-gray-600`}>
                        {idx + 1}
                      </div>
                      <span className="font-extrabold text-white text-xl">{ex.name}</span>
                    </div>
                    
                    {/* Sets Logger */}
                    <div className="space-y-3">
                      <div className="grid grid-cols-4 gap-4 text-gray-400 text-xs font-bold uppercase tracking-wider mb-2 px-2">
                        <div>Set</div>
                        <div className="text-center">Target</div>
                        <div className="text-center">Reps Done</div>
                        <div className="text-right">Mark</div>
                      </div>
                      
                      {Array.from({ length: ex.sets }).map((_, setIdx) => {
                        const key = `${idx}-${setIdx}`;
                        const isDone = setLogs[key]?.done || false;
                        const repsVal = setLogs[key]?.reps !== undefined ? setLogs[key].reps : ex.reps;

                        return (
                          <div key={setIdx} className={`grid grid-cols-4 gap-4 items-center p-3 rounded-xl transition-colors ${isDone ? 'bg-black/50 border ' + themeBorder : 'bg-black border border-gray-700'}`}>
                            <div className={`font-bold ${isDone ? themeText : 'text-gray-300'}`}>Set {setIdx + 1}</div>
                            <div className="text-center text-gray-500 font-medium">{ex.reps}</div>
                            <div className="text-center">
                              <input 
                                type="number" 
                                value={repsVal}
                                onChange={(e) => handleRepChange(idx, setIdx, e.target.value)}
                                disabled={isDone}
                                className={`w-16 bg-gray-900 border ${isDone ? themeBorder + ' ' + themeText : 'border-gray-600 text-white'} rounded-lg px-2 py-1 text-center font-bold focus:outline-none focus:ring-1 focus:ring-current transition-all`}
                              />
                            </div>
                            <div className="text-right flex justify-end">
                               <button 
                                 onClick={() => handleToggleSet(idx, setIdx, ex.reps)}
                                 className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all font-bold ${isDone ? themeBg + ' text-black shadow-[0_0_10px_currentColor]' : 'bg-gray-700 text-gray-400 hover:bg-gray-600'}`}
                               >
                                 {isDone ? '✓' : ''}
                               </button>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>

              <label className={`mt-8 flex items-center justify-center gap-3 w-full py-4 bg-black ${themeText} rounded-xl font-bold text-lg shadow-md ${themeHoverBg} hover:text-black transition-all duration-300 cursor-pointer border-2 ${themeBorder}`}>
                <input type="checkbox" checked={completed} onChange={handleComplete} className="w-6 h-6 accent-white cursor-pointer" />
                <span>Mark {dayData.day} as Complete</span>
              </label>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
export default DayWorkout;