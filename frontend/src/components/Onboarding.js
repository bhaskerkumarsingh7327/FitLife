import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Onboarding = () => {
  const navigate = useNavigate();
  const [generating, setGenerating] = useState(false);
  const [goal, setGoal] = useState('Weight Loss (Burn Fat)');
  const [level, setLevel] = useState('Beginner (Just starting)');
  const [gender, setGender] = useState('Female'); // Naya Gender State

  const handleGeneratePlan = (e) => {
    e.preventDefault();
    setGenerating(true);
    
    // User ki preferences browser me save karein
    localStorage.setItem('userGoal', goal);
    localStorage.setItem('userLevel', level);
    localStorage.setItem('userGender', gender);
    
    // Fake loading delay to give a realistic "AI Generating Plan" feel
    setTimeout(() => {
      navigate('/dashboard');
    }, 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-500 to-indigo-600 p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-lg w-full">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-800 mb-2">Tell Us About You 🎯</h2>
          <p className="text-gray-500">We will build a personalized plan for you.</p>
        </div>

        {generating ? (
          <div className="py-12 flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-lg font-bold text-indigo-600 animate-pulse">Generating your perfect plan...</p>
          </div>
        ) : (
          <form onSubmit={handleGeneratePlan} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">What is your primary goal?</label>
              <select value={goal} onChange={(e) => setGoal(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50">
                <option>Weight Loss (Burn Fat)</option>
                <option>Muscle Gain (Build Mass)</option>
                <option>General Fitness</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">What is your current fitness level?</label>
              <select value={level} onChange={(e) => setLevel(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50">
                <option>Beginner (Just starting)</option>
                <option>Intermediate (I workout sometimes)</option>
                <option>Advanced (I am a beast)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">What is your gender?</label>
              <select value={gender} onChange={(e) => setGender(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50">
                <option>Female</option>
                <option>Male</option>
                <option>Other</option>
              </select>
            </div>
            <button type="submit" className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-extrabold text-lg hover:shadow-xl transform hover:-translate-y-1 transition-all">
              Generate My Plan ✨
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
export default Onboarding;