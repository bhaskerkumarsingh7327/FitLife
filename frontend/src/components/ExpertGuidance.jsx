import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar.jsx';

const guidanceData = [
  {
    id: 'nutrition-1',
    category: 'Nutrition',
    title: 'The Ultimate Guide to Pre-Workout Meals',
    description: 'Learn what to eat before your workout to maximize energy, performance, and results. Timing and macronutrients are key.',
    fullContent: 'To get the most out of your training, you need to fuel your body correctly. A perfect pre-workout meal consists of complex carbohydrates for sustained energy and a moderate amount of protein to prevent muscle breakdown. Eat a full meal 2-3 hours before, or a light snack (like a banana and peanut butter) 45 minutes before hitting the gym. Hydration is equally critical—drink at least 16 ounces of water leading up to your session.',
    icon: '🍎',
  },
  {
    id: 'form-1',
    category: 'Workout Form',
    title: 'Mastering the Perfect Squat Form',
    description: 'Avoid common mistakes and injuries. We break down the squat, from foot placement to depth, for maximum gains.',
    fullContent: 'The squat is the king of all lower-body exercises, but bad form can ruin your knees and lower back. Keep your feet shoulder-width apart, toes pointed slightly outwards. As you descend, push your hips back as if sitting in a chair. Keep your chest up and your core braced. Your knees should track over your toes, never caving inward. Break parallel if your mobility allows, then drive through your heels to return to the starting position.',
    icon: '🏋️',
  },
  {
    id: 'recovery-1',
    category: 'Recovery',
    title: 'The Science of Sleep for Muscle Growth',
    description: 'Recovery is just as important as the workout itself. Discover how quality sleep accelerates muscle repair and growth.',
    fullContent: 'You tear muscles in the gym, but you build them in your bed. During deep sleep (Non-REM), your body releases human growth hormone (HGH) which repairs tissue damage. Aim for 7-9 hours of uninterrupted sleep every night. Reduce screen time an hour before bed, keep your room cool and dark, and consider magnesium supplements if you struggle to stay asleep.',
    icon: '😴',
  },
  {
    id: 'mindset-1',
    category: 'Mindset',
    title: 'Building a Bulletproof Fitness Mindset',
    description: 'Consistency is born in the mind. Learn mental strategies to stay motivated, overcome plateaus, and build discipline.',
    fullContent: 'Motivation gets you started, but discipline keeps you going. Stop relying on feeling "hyped" to go to the gym. Treat your workouts like non-negotiable business meetings. Set micro-goals (e.g., "I will go 3 times this week") rather than just focusing on the end result. Embrace the plateau—it means your body is adapting. Change your routine, track your macros strictly, and trust the process.',
    icon: '🧠',
  },
  {
    id: 'cardio-1',
    category: 'Cardio',
    title: 'HIIT vs. LISS: Which Cardio is Best for You?',
    description: 'High-Intensity Interval Training or Low-Intensity Steady State? Understand the pros and cons of each for fat loss.',
    fullContent: 'HIIT involves short bursts of max-effort work followed by rest, burning more calories in less time and triggering the "afterburn" effect. LISS (like a 45-min brisk walk) is easier on the joints and great for active recovery. If you are short on time, do HIIT 2x a week. If you lift heavy 5x a week, LISS is better so you don\'t fry your central nervous system.',
    icon: '🏃',
  },
  {
    id: 'hydration-1',
    category: 'Hydration',
    title: 'Hydration 101: More Than Just Water',
    description: 'Proper hydration is crucial for performance. Learn about electrolytes and how much water you really need to drink daily.',
    fullContent: 'A 2% drop in hydration can lead to a 10% drop in physical performance. Drink half your body weight in ounces of water daily. If you sweat heavily, plain water isn\'t enough—you lose sodium, potassium, and magnesium. Add a pinch of pink Himalayan salt or an electrolyte powder to your intra-workout drink to prevent cramps and maintain muscle contractions.',
    icon: '💧',
  },
];

const ExpertGuidance = () => {
  const navigate = useNavigate();
  
  const isFemale = localStorage.getItem('userGender') === 'Female';
  const themeText = isFemale ? 'text-pink-500' : 'text-green-500';
  const themeBorder = isFemale ? 'border-pink-500' : 'border-green-500';
  const themeHoverBorder = isFemale ? 'hover:border-pink-500' : 'hover:border-green-500';
  const themeHoverBg = isFemale ? 'hover:bg-pink-500' : 'hover:bg-green-500';

  return (
    <div className="min-h-screen relative pb-20 text-white bg-black">
      {/* Professional Gym Background */}
      <div 
        className="fixed inset-0 bg-cover bg-center opacity-20 pointer-events-none"
        style={{ backgroundImage: isFemale ? "url('https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=1470&auto=format&fit=crop')" : "url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470&auto=format&fit=crop')" }}
      ></div>
      <div className="fixed inset-0 bg-gradient-to-b from-black/40 via-black/90 to-black pointer-events-none"></div>

      {/* Main Content */}
      <div className="relative z-10">
        <Navbar />
        <div className="max-w-6xl mx-auto pt-12 px-4">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-black mb-4 tracking-tight uppercase drop-shadow-lg">
              Expert <span className={themeText}>Guidance</span>
            </h1>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto drop-shadow-md font-medium">
              Unlock your full potential with our library of articles and tips from certified fitness and nutrition experts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {guidanceData.map((item, index) => (
              <div key={index} className={`bg-gray-900/80 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 flex flex-col ${themeHoverBorder} hover:-translate-y-2 transition-all duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.5)]`}>
                <div className="text-4xl mb-4 drop-shadow-md">{item.icon}</div>
                <span className={`text-sm font-bold ${themeText} uppercase tracking-wider mb-2`}>{item.category}</span>
                <h3 className="text-2xl font-extrabold text-white mb-4 flex-grow">
                  {item.title}
                </h3>
                <p className="text-gray-300 mb-6 font-medium">
                  {item.description}
                </p>
                <button 
                  onClick={() => navigate(`/guidance/${item.id}`, { state: { article: item } })}
                  className={`mt-auto w-full bg-transparent ${themeText} border-2 ${themeBorder} font-bold py-3 px-6 rounded-xl ${themeHoverBg} hover:text-black transition-all shadow-md`}
                >
                  Read More
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpertGuidance;