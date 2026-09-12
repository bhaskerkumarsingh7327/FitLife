import React, { useState, useEffect, useRef } from 'react';
import Navbar from './Navbar.jsx';

const AICoach = () => {
  const [activeTab, setActiveTab] = useState('chatbot'); // 'chatbot', 'diet', 'workout'
  
  // Theme Logic
  const isFemale = localStorage.getItem('userGender') === 'Female';
  const themeText = isFemale ? 'text-pink-500' : 'text-green-500';
  const themeBg = isFemale ? 'bg-pink-500' : 'bg-green-500';
  const themeHoverBg = isFemale ? 'hover:bg-pink-400' : 'hover:bg-green-400';
  
  // Chatbot States
  const [messages, setMessages] = useState([{ sender: 'ai', text: `Hi ${localStorage.getItem('userName') || 'there'}! I am your AI FitCoach. How can I help you crush your goals today?` }]);
  const [input, setInput] = useState('');
  const chatEndRef = useRef(null);

  // Generator States
  const [dietPlan, setDietPlan] = useState(null);
  const [workoutPlan, setWorkoutPlan] = useState(null);
  const [loading, setLoading] = useState(false);

  const goal = localStorage.getItem('userGoal') || 'Fat Loss';

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    const userMsg = input;
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setInput('');
    
    // Simulate AI response
    setTimeout(() => {
      let aiResponse = "That's a great question! Keep focusing on your protein intake and stay hydrated.";
      if (userMsg.toLowerCase().includes('protein')) aiResponse = "For your goal, aim for 1.6g to 2.2g of protein per kg of body weight!";
      else if (userMsg.toLowerCase().includes('cardio')) aiResponse = "Cardio is great for heart health. Try 20 mins of HIIT or 45 mins of brisk walking post-workout.";
      else if (userMsg.toLowerCase().includes('sore')) aiResponse = "Muscle soreness is normal! Make sure to stretch, sleep 8 hours, and eat enough protein to recover.";
      
      setMessages(prev => [...prev, { sender: 'ai', text: aiResponse }]);
    }, 1500);
  };

  const generateDiet = () => {
    setLoading(true);
    setTimeout(() => {
      if (goal === 'Fat Loss') {
        setDietPlan([
          { meal: 'Breakfast', food: 'Oats with Almond Milk, Chia Seeds & 1 Scoop Whey', cals: '350 kcal' },
          { meal: 'Lunch', food: 'Grilled Chicken Breast (150g) with Quinoa & Broccoli', cals: '450 kcal' },
          { meal: 'Snack', food: 'Greek Yogurt with Mixed Berries', cals: '200 kcal' },
          { meal: 'Dinner', food: 'Baked Salmon with Sweet Potato & Asparagus', cals: '400 kcal' }
        ]);
      } else {
        setDietPlan([
          { meal: 'Breakfast', food: '4 Whole Eggs, 2 Slices Whole Wheat Toast, Avocado', cals: '550 kcal' },
          { meal: 'Lunch', food: 'Beef Mince (200g), Jasmine Rice & Mixed Veggies', cals: '650 kcal' },
          { meal: 'Snack', food: 'Protein Shake, Peanut Butter & Banana', cals: '400 kcal' },
          { meal: 'Dinner', food: 'Chicken Thighs, Pasta & Olive Oil Dressing', cals: '600 kcal' }
        ]);
      }
      setLoading(false);
    }, 2000);
  };

  const generateWorkout = () => {
    setLoading(true);
    setTimeout(() => {
      setWorkoutPlan({
        title: isFemale ? "Lower Body & Core Crusher" : "Upper Body Power Focus",
        exercises: isFemale 
          ? ['Warmup: 5 mins Jump Rope', 'Barbell Hip Thrusts - 4x12', 'Bulgarian Split Squats - 3x10/leg', 'Cable Kickbacks - 3x15', 'Plank - 3x60s']
          : ['Warmup: 5 mins Rowing', 'Incline Dumbbell Press - 4x10', 'Pull-ups - 4xMax', 'Overhead Shoulder Press - 3x10', 'Hanging Leg Raises - 3x15']
      });
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-black text-white pb-12 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-900 via-black to-black pointer-events-none"></div>
      
      <div className="relative z-10">
        <Navbar />
        <div className="max-w-5xl mx-auto pt-10 px-4">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-8 text-center drop-shadow-lg">
            FitLife <span className={themeText}>AI Coach 🤖</span>
          </h1>

          {/* Tabs */}
          <div className="flex justify-center gap-2 md:gap-4 mb-10 bg-gray-900 p-2 rounded-2xl w-fit mx-auto border border-gray-800 shadow-xl">
            <button onClick={() => setActiveTab('chatbot')} className={`px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'chatbot' ? `${themeBg} text-black` : 'text-gray-400 hover:text-white'}`}>Chatbot</button>
            <button onClick={() => setActiveTab('diet')} className={`px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'diet' ? `${themeBg} text-black` : 'text-gray-400 hover:text-white'}`}>AI Diet</button>
            <button onClick={() => setActiveTab('workout')} className={`px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'workout' ? `${themeBg} text-black` : 'text-gray-400 hover:text-white'}`}>AI Workout</button>
          </div>

          {/* Content Area */}
          <div className="bg-gray-900/80 backdrop-blur-md border border-gray-800 rounded-3xl p-6 md:p-10 shadow-2xl min-h-[500px] flex flex-col">
            
            {/* CHATBOT TAB */}
            {activeTab === 'chatbot' && (
              <div className="flex flex-col h-full flex-grow">
                <div className="flex-grow overflow-y-auto space-y-4 mb-6 pr-2 h-[350px]">
                  {messages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[75%] px-5 py-3 rounded-2xl ${msg.sender === 'user' ? `${themeBg} text-black font-medium rounded-br-sm` : 'bg-gray-800 text-gray-200 border border-gray-700 rounded-bl-sm'}`}>
                        {msg.text}
                      </div>
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>
                <form onSubmit={handleSendMessage} className="flex gap-3">
                  <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask about fitness, diet, or injuries..." className={`flex-grow bg-black border border-gray-700 rounded-xl px-5 py-4 focus:outline-none focus:border-${isFemale ? 'pink' : 'green'}-500 transition-colors`} />
                  <button type="submit" className={`px-6 py-4 ${themeBg} text-black font-extrabold rounded-xl ${themeHoverBg} transition-colors`}>Send</button>
                </form>
              </div>
            )}

            {/* DIET PLAN TAB */}
            {activeTab === 'diet' && (
              <div className="flex flex-col items-center justify-center h-full flex-grow text-center">
                {!dietPlan && !loading && (
                  <>
                    <div className="text-6xl mb-4">🥗</div>
                    <h3 className="text-2xl font-bold mb-2">Smart Diet Generator</h3>
                    <p className="text-gray-400 mb-8 max-w-md">Our AI will analyze your {goal} goal and generate a perfectly balanced daily meal plan.</p>
                    <button onClick={generateDiet} className={`px-10 py-4 ${themeBg} text-black font-extrabold text-lg rounded-xl ${themeHoverBg} shadow-lg hover:scale-105 transition-all`}>Generate Diet Plan</button>
                  </>
                )}
                {loading && <div className={`w-16 h-16 border-4 border-gray-700 border-t-${isFemale ? 'pink' : 'green'}-500 rounded-full animate-spin my-auto`}></div>}
                {dietPlan && !loading && (
                  <div className="w-full text-left">
                    <h3 className={`text-2xl font-black mb-6 ${themeText}`}>Your Customized {goal} Diet</h3>
                    <div className="space-y-4">
                      {dietPlan.map((item, idx) => (
                        <div key={idx} className="bg-black border border-gray-800 p-5 rounded-xl flex justify-between items-center hover:border-gray-600 transition-colors">
                          <div>
                            <span className={`text-xs font-bold uppercase tracking-widest ${themeText}`}>{item.meal}</span>
                            <p className="text-lg font-bold text-white mt-1">{item.food}</p>
                          </div>
                          <span className="font-mono text-gray-400 font-bold bg-gray-900 px-3 py-1 rounded-lg">{item.cals}</span>
                        </div>
                      ))}
                    </div>
                    <button onClick={() => setDietPlan(null)} className="mt-8 text-gray-500 hover:text-white font-bold transition-colors">Generate Another Plan 🔄</button>
                  </div>
                )}
              </div>
            )}

            {/* WORKOUT PLAN TAB */}
            {activeTab === 'workout' && (
              <div className="flex flex-col items-center justify-center h-full flex-grow text-center">
                {!workoutPlan && !loading && (
                  <>
                    <div className="text-6xl mb-4">⚡</div>
                    <h3 className="text-2xl font-bold mb-2">Smart Workout Generator</h3>
                    <p className="text-gray-400 mb-8 max-w-md">Need a quick routine? The AI will instantly create a custom session based on your profile.</p>
                    <button onClick={generateWorkout} className={`px-10 py-4 ${themeBg} text-black font-extrabold text-lg rounded-xl ${themeHoverBg} shadow-lg hover:scale-105 transition-all`}>Generate Workout</button>
                  </>
                )}
                {loading && <div className={`w-16 h-16 border-4 border-gray-700 border-t-${isFemale ? 'pink' : 'green'}-500 rounded-full animate-spin my-auto`}></div>}
                {workoutPlan && !loading && (
                  <div className="w-full text-left">
                    <h3 className={`text-2xl font-black mb-6 ${themeText}`}>{workoutPlan.title}</h3>
                    <div className="grid grid-cols-1 gap-3">
                      {workoutPlan.exercises.map((ex, idx) => (
                        <div key={idx} className="bg-black border border-gray-800 p-5 rounded-xl flex items-center gap-4">
                          <div className={`w-8 h-8 rounded-full ${themeBg} text-black flex items-center justify-center font-bold`}>{idx + 1}</div>
                          <p className="text-lg font-bold text-white">{ex}</p>
                        </div>
                      ))}
                    </div>
                    <button onClick={() => setWorkoutPlan(null)} className="mt-8 text-gray-500 hover:text-white font-bold transition-colors">Generate New Routine 🔄</button>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default AICoach;