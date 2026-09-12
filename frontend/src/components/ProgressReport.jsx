import React, { useState } from 'react';
import Navbar from './Navbar.jsx';

const ProgressReport = () => {
  // Convert data to states so they can be edited here
  const [weight, setWeight] = useState(localStorage.getItem('userWeight') || '');
  const [height, setHeight] = useState(localStorage.getItem('userHeight') || '');
  const [chest, setChest] = useState(localStorage.getItem('userChest') || '');
  const [waist, setWaist] = useState(localStorage.getItem('userWaist') || '');
  const [beforePhoto, setBeforePhoto] = useState(localStorage.getItem('userBeforePhoto') || null);
  const [afterPhoto, setAfterPhoto] = useState(localStorage.getItem('userAfterPhoto') || null);
  const totalWorkouts = localStorage.getItem('localTotal') || '0';
  const currentStreak = localStorage.getItem('localStreak') || '0';

  // Theme Logic
  const isFemale = localStorage.getItem('userGender') === 'Female';
  const themeText = isFemale ? 'text-pink-500' : 'text-green-500';
  const themeBg = isFemale ? 'bg-pink-500' : 'bg-green-500';
  const themeBorder = isFemale ? 'border-pink-500' : 'border-green-500';
  const themeHoverBg = isFemale ? 'hover:bg-pink-400' : 'hover:bg-green-400';

  const handlePhotoUpload = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'before') setBeforePhoto(reader.result);
        else setAfterPhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProgress = () => {
    try {
      localStorage.setItem('userWeight', weight);
      localStorage.setItem('userHeight', height);
      localStorage.setItem('userChest', chest);
      localStorage.setItem('userWaist', waist);
      if (beforePhoto) localStorage.setItem('userBeforePhoto', beforePhoto);
      if (afterPhoto) localStorage.setItem('userAfterPhoto', afterPhoto);
      alert("Progress details saved successfully!");
    } catch (e) {
      alert("Photo is too large to save. Please try a smaller image!");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      <Navbar />
      
      <div className="max-w-6xl mx-auto pt-10 px-4">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-2 text-white drop-shadow-lg">
          Your Progress <span className={themeText}>Report 📈</span>
        </h1>
        <p className="text-gray-400 mb-10 text-lg">Track your transformation, measurements, and milestones all in one place.</p>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Stats & Measurements */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 shadow-xl">
              <h3 className="text-xl font-bold text-white mb-4 border-b border-gray-800 pb-2">Body Measurements</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-black p-4 rounded-xl border border-gray-800 text-center">
                  <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">Weight (kg)</p>
                  <input type="number" value={weight} onChange={(e)=>setWeight(e.target.value)} className={`w-full bg-transparent text-center text-2xl font-black ${themeText} focus:outline-none`} placeholder="0" />
                </div>
                <div className="bg-black p-4 rounded-xl border border-gray-800 text-center">
                  <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">Height (cm)</p>
                  <input type="number" value={height} onChange={(e)=>setHeight(e.target.value)} className={`w-full bg-transparent text-center text-2xl font-black ${themeText} focus:outline-none`} placeholder="0" />
                </div>
                <div className="bg-black p-4 rounded-xl border border-gray-800 text-center">
                  <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">Chest (cm)</p>
                  <input type="number" value={chest} onChange={(e)=>setChest(e.target.value)} className={`w-full bg-transparent text-center text-2xl font-black ${themeText} focus:outline-none`} placeholder="0" />
                </div>
                <div className="bg-black p-4 rounded-xl border border-gray-800 text-center">
                  <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">Waist (cm)</p>
                  <input type="number" value={waist} onChange={(e)=>setWaist(e.target.value)} className={`w-full bg-transparent text-center text-2xl font-black ${themeText} focus:outline-none`} placeholder="0" />
                </div>
              </div>
              <button onClick={handleSaveProgress} className={`mt-6 w-full py-3 ${themeBg} text-black font-extrabold rounded-xl ${themeHoverBg} transition-colors shadow-md`}>
                Save Measurements & Photos
              </button>
            </div>

            <div className={`bg-gradient-to-br from-gray-900 to-black p-6 rounded-2xl border ${themeBorder} shadow-[0_0_20px_rgba(0,0,0,0.5)]`}>
              <h3 className="text-xl font-bold text-white mb-4">Milestones 🏆</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center bg-black p-4 rounded-xl">
                  <span className="text-gray-300 font-bold">Total Workouts</span>
                  <span className={`text-xl font-black ${themeText}`}>{totalWorkouts}</span>
                </div>
                <div className="flex justify-between items-center bg-black p-4 rounded-xl">
                  <span className="text-gray-300 font-bold">Current Streak</span>
                  <span className={`text-xl font-black ${themeText}`}>🔥 {currentStreak}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Chart & Photos */}
          <div className="lg:col-span-2 space-y-8">
            {/* Big Weight Tracking Chart */}
            <div className="bg-gray-900 p-8 rounded-2xl border border-gray-800 shadow-xl overflow-hidden">
              <h3 className="text-xl font-bold text-white mb-6">Weight Tracking Chart</h3>
              <div className="h-64 bg-black border border-gray-800 rounded-xl flex items-end justify-between p-6 gap-2 md:gap-6 relative">
                <div className="absolute inset-0 flex flex-col justify-between p-6 pointer-events-none opacity-20">
                  <div className="w-full border-t border-gray-600"></div><div className="w-full border-t border-gray-600"></div>
                  <div className="w-full border-t border-gray-600"></div><div className="w-full border-t border-gray-600"></div>
                </div>
                {[82, 80, 78, 76, 75, 74, Number(weight) || 72].map((w, i) => (
                  <div key={i} className="flex flex-col items-center gap-2 w-full group z-10">
                    <div className="relative w-full flex justify-center h-full items-end">
                      <div className={`w-full max-w-[40px] ${themeBg} rounded-t-md transition-all duration-700 ${i === 6 ? 'opacity-100 shadow-[0_0_15px_currentColor]' : 'opacity-50 hover:opacity-90'}`} style={{ height: `${Math.min(w, 100)}%` }}>
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-white text-black text-xs font-bold py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">{w} kg</div>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500 font-bold">Wk {i+1}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Before / After Transformation */}
            <div className="bg-gray-900 p-8 rounded-2xl border border-gray-800 shadow-xl">
              <h3 className="text-xl font-bold text-white mb-6">Transformation Journey</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex flex-col items-center">
                  <div className="w-full aspect-[3/4] bg-black border-2 border-dashed border-gray-700 rounded-2xl overflow-hidden flex items-center justify-center mb-4 relative group">
                    {beforePhoto ? <img src={beforePhoto} className="w-full h-full object-cover" alt="Before" /> : <p className="text-gray-600 font-bold text-sm">No Before Photo</p>}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <label className={`text-xs cursor-pointer ${themeText} font-bold px-3 py-1 border border-current rounded-full`}>
                        Upload
                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handlePhotoUpload(e, 'before')} />
                      </label>
                    </div>
                  </div>
                  <span className="text-lg font-black tracking-widest text-gray-400 uppercase">Before</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className={`w-full aspect-[3/4] bg-black border-2 ${themeBorder} rounded-2xl overflow-hidden flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(0,0,0,0.3)] relative group`}>
                    {afterPhoto ? <img src={afterPhoto} className="w-full h-full object-cover" alt="After" /> : <p className={`text-sm font-bold ${themeText}`}>Click to Upload</p>}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <label className={`text-xs cursor-pointer ${themeText} font-bold px-3 py-1 border border-current rounded-full`}>
                        Upload
                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handlePhotoUpload(e, 'after')} />
                      </label>
                    </div>
                  </div>
                  <span className={`text-lg font-black tracking-widest ${themeText} uppercase`}>Current</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProgressReport;