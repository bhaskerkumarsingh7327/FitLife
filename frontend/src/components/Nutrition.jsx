import React, { useState, useEffect } from 'react';
import Navbar from './Navbar.jsx';

// Smart Food Database (Per item, or per 100g/ml)
const foodDB = {
  egg: { calories: 75, protein: 6 },
  chicken: { calories: 165, protein: 31 }, // per 100g
  rice: { calories: 130, protein: 2 }, // per 100g
  roti: { calories: 120, protein: 3 },
  chapati: { calories: 120, protein: 3 },
  milk: { calories: 42, protein: 3 }, // per 100ml
  paneer: { calories: 265, protein: 18 }, // per 100g
  whey: { calories: 110, protein: 25 },
  oat: { calories: 389, protein: 17 }, // per 100g
  apple: { calories: 95, protein: 0 },
  banana: { calories: 105, protein: 1 },
  bread: { calories: 80, protein: 4 },
  almond: { calories: 579, protein: 21 }, // per 100g
  dal: { calories: 100, protein: 5 },
  chawal: { calories: 130, protein: 2 },
  rajma: { calories: 140, protein: 5 },
  chole: { calories: 160, protein: 6 },
  paratha: { calories: 250, protein: 4 },
  dosa: { calories: 130, protein: 3 },
  idli: { calories: 40, protein: 1 },
  samosa: { calories: 260, protein: 3 },
  maggi: { calories: 350, protein: 4 },
  burger: { calories: 450, protein: 15 },
  pizza: { calories: 280, protein: 12 }, // per slice
  salad: { calories: 100, protein: 2 },
  soup: { calories: 90, protein: 4 },
  fish: { calories: 200, protein: 20 },
  mutton: { calories: 290, protein: 25 },
  beef: { calories: 250, protein: 26 },
  soya: { calories: 345, protein: 52 },
  tofu: { calories: 144, protein: 16 },
  peanut: { calories: 588, protein: 25 },
  butter: { calories: 100, protein: 0 }, 
  cheese: { calories: 110, protein: 7 }, 
};

const Nutrition = () => {
  const isFemale = localStorage.getItem('userGender') === 'Female';
  const themeText = isFemale ? 'text-pink-500' : 'text-green-500';
  const themeBg = isFemale ? 'bg-pink-500' : 'bg-green-500';
  const themeBorder = isFemale ? 'border-pink-500' : 'border-green-500';
  const themeHoverBg = isFemale ? 'hover:bg-pink-400' : 'hover:bg-green-400';
  const themeShadow = isFemale ? 'shadow-[0_0_15px_rgba(236,72,153,0.3)]' : 'shadow-[0_0_15px_rgba(34,197,94,0.3)]';

  // Get today's date string for local storage key
  const today = new Date().toLocaleDateString();
  
  // States
  const [meals, setMeals] = useState(() => {
    const saved = localStorage.getItem(`dietLog_${today}`);
    return saved ? JSON.parse(saved) : { breakfast: [], lunch: [], dinner: [], snacks: [] };
  });
  
  const [showModal, setShowModal] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState('breakfast');
  const [foodInput, setFoodInput] = useState({ name: '', calories: '', protein: '' });
  const [isCalculating, setIsCalculating] = useState(false);

  // Goals (can be customized later via settings)
  const calorieGoal = isFemale ? 1800 : 2400;
  const proteinGoal = isFemale ? 120 : 160;

  useEffect(() => {
    localStorage.setItem(`dietLog_${today}`, JSON.stringify(meals));
  }, [meals, today]);

  // Calculate Totals
  const getTotal = (nutrient) => {
    let total = 0;
    Object.values(meals).forEach(mealArray => {
      mealArray.forEach(food => {
        total += Number(food[nutrient]) || 0;
      });
    });
    return total;
  };

  const totalCalories = getTotal('calories');
  const totalProtein = getTotal('protein');

  const calPercent = Math.min((totalCalories / calorieGoal) * 100, 100);
  const proPercent = Math.min((totalProtein / proteinGoal) * 100, 100);

  const handleAddFood = (e) => {
    e.preventDefault();
    if (!foodInput.name || !foodInput.calories) return;
    
    setMeals(prev => ({
      ...prev,
      [selectedMeal]: [...prev[selectedMeal], foodInput]
    }));
    setFoodInput({ name: '', calories: '', protein: '' });
    setShowModal(false);
  };

  // Smart Macro Calculator Engine
  const handleSmartFill = async () => {
    if (!foodInput.name) return;
    setIsCalculating(true);
    
    let text = foodInput.name.toLowerCase();

    try {
      // ==========================================
      // PROFESSIONAL API CALL (CalorieNinjas)
      // ==========================================
      // Note: Go to calorieninjas.com, create a free account, and paste your API key below:
      const apiKey = 'lbt37Nxp9jNQ6/DO3AhamA==jSQw3NG9zbyo2Wfg'; 
      
      if (apiKey !== 'YOUR_API_KEY_HERE') {
        const response = await fetch(`https://api.calorieninjas.com/v1/nutrition?query=${text}`, {
          headers: { 'X-Api-Key': apiKey }
        });

        if (!response.ok) throw new Error('API request failed');

        const data = await response.json();
        
        if (data.items && data.items.length > 0) {
          let totalCals = 0;
          let totalPro = 0;
          data.items.forEach(item => {
            totalCals += item.calories;
            totalPro += item.protein_g;
          });

          setFoodInput(prev => ({
            ...prev,
            calories: Math.round(totalCals).toString(),
            protein: Math.round(totalPro).toString()
          }));
          setIsCalculating(false);
          return; // Success! Exit function.
        }
      }
    } catch (error) {
      console.warn("API Error or Key missing. Falling back to Offline Smart Engine...");
    }

    // ==========================================
    // OFFLINE FALLBACK ENGINE (Agar API band ho)
    // ==========================================
    let matchedFood = null;
    let qty = 1;

    // Quantity scan (e.g. "2 eggs", "200g chicken")
    const match = text.match(/(\d+(?:\.\d+)?)\s*(g|ml|scoop|slice|piece|bowl)?/i);
    if (match) {
      qty = parseFloat(match[1]);
      const unit = match[2];
      // Agar weight grams/ml me hai, toh database value ko (qty/100) se multiply karein
      if (unit && (unit.includes('g') || unit.includes('ml'))) {
        qty = qty / 100; 
      }
    }

    for (const [foodKey, macros] of Object.entries(foodDB)) {
      if (text.includes(foodKey)) {
        matchedFood = macros;
        break;
      }
    }

    if (matchedFood) {
      setFoodInput(prev => ({
        ...prev,
        calories: Math.round(matchedFood.calories * qty).toString(),
        protein: Math.round(matchedFood.protein * qty).toString()
      }));
    } else {
      // AI Estimation Fallback (Agar koi alien food daal diya jo list me nahi hai)
      let estCal = 200;
      let estPro = 5;

      if (text.includes('fried') || text.includes('oil') || text.includes('sweet') || text.includes('cake')) {
        estCal = 400; estPro = 4;
      } else if (text.includes('salad') || text.includes('veg') || text.includes('green') || text.includes('fruit')) {
        estCal = 80; estPro = 2;
      } else if (text.includes('meat') || text.includes('protein') || text.includes('steak')) {
        estCal = 250; estPro = 25;
      }

      setFoodInput(prev => ({
        ...prev,
        calories: Math.round(estCal * qty).toString(),
        protein: Math.round(estPro * qty).toString()
      }));
    }
    setIsCalculating(false);
  };

  const openModal = (mealType) => {
    setSelectedMeal(mealType);
    setShowModal(true);
  };

  const deleteFood = (mealType, index) => {
    setMeals(prev => {
      const updatedMeal = [...prev[mealType]];
      updatedMeal.splice(index, 1);
      return { ...prev, [mealType]: updatedMeal };
    });
  };

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      <Navbar />
      
      <div className="max-w-4xl mx-auto pt-10 px-4">
        <div className="flex justify-between items-end mb-8 border-b border-gray-800 pb-6">
          <div>
            <h1 className="text-4xl font-extrabold text-white">Daily <span className={themeText}>Nutrition</span></h1>
            <p className="text-gray-400 mt-2 font-medium">Track your meals and hit your macro goals.</p>
          </div>
          <div className="text-right hidden sm:block">
            <p className="text-sm text-gray-500 font-bold uppercase tracking-widest">Today</p>
            <p className={`text-xl font-black ${themeText}`}>{today}</p>
          </div>
        </div>

        {/* Macros Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 shadow-xl relative overflow-hidden">
            <div className={`absolute top-0 left-0 w-full h-1 ${themeBg}`}></div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">Calories</h3>
              <span className="text-gray-400 font-medium">{totalCalories} / {calorieGoal} kcal</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-4 mb-2">
              <div className={`${themeBg} h-4 rounded-full transition-all duration-700 shadow-[0_0_10px_currentColor]`} style={{ width: `${calPercent}%` }}></div>
            </div>
            <p className="text-xs text-gray-500 font-bold text-right">{Math.max(calorieGoal - totalCalories, 0)} kcal remaining</p>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 shadow-xl relative overflow-hidden">
            <div className={`absolute top-0 left-0 w-full h-1 ${themeBg}`}></div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">Protein</h3>
              <span className="text-gray-400 font-medium">{totalProtein} / {proteinGoal} g</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-4 mb-2">
              <div className={`${themeBg} h-4 rounded-full transition-all duration-700 shadow-[0_0_10px_currentColor]`} style={{ width: `${proPercent}%` }}></div>
            </div>
            <p className="text-xs text-gray-500 font-bold text-right">{Math.max(proteinGoal - totalProtein, 0)} g remaining</p>
          </div>
        </div>

        {/* Meal Logs */}
        <div className="space-y-6">
          {['breakfast', 'lunch', 'dinner', 'snacks'].map((meal) => (
            <div key={meal} className="bg-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-extrabold text-white capitalize">{meal}</h3>
                <button onClick={() => openModal(meal)} className={`w-8 h-8 rounded-full ${themeBg} text-black font-black flex items-center justify-center hover:scale-110 transition-transform ${themeShadow}`}>+</button>
              </div>
              
              {meals[meal].length === 0 ? (
                <p className="text-gray-600 text-sm font-medium italic">No food logged yet.</p>
              ) : (
                <div className="space-y-3 mt-4">
                  {meals[meal].map((food, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-black border border-gray-800 p-4 rounded-xl group hover:border-gray-600 transition-colors">
                      <div>
                        <p className="font-bold text-white">{food.name}</p>
                        <p className={`text-xs ${themeText} font-bold mt-1`}>{food.protein ? `${food.protein}g Protein` : 'No Protein data'}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-mono text-gray-300 font-bold bg-gray-900 px-3 py-1 rounded-lg">{food.calories} kcal</span>
                        <button onClick={() => deleteFood(meal, idx)} className="text-red-500 opacity-0 group-hover:opacity-100 hover:text-red-400 transition-opacity font-black">✕</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Add Food Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] p-4 backdrop-blur-sm">
          <div className={`bg-gray-900 border ${themeBorder} rounded-3xl p-8 max-w-md w-full shadow-[0_0_30px_rgba(0,0,0,0.5)] transform transition-all scale-105`}>
            <h3 className="text-2xl font-extrabold text-white mb-6 capitalize">Add to {selectedMeal} 🍽️</h3>
            
            <form onSubmit={handleAddFood} className="space-y-5">
              <div>
                <div className="flex justify-between items-end mb-2">
                  <label className="block text-sm font-semibold text-gray-400">Food Name</label>
                  <button type="button" onClick={handleSmartFill} disabled={isCalculating} className={`text-xs font-extrabold ${themeText} bg-gray-800 px-3 py-1.5 rounded-lg hover:bg-gray-700 transition-colors shadow-md disabled:opacity-50`}>{isCalculating ? '⏳ Calculating...' : '✨ AI Auto-Fill'}</button>
                </div>
                <input type="text" value={foodInput.name} onChange={(e) => setFoodInput({...foodInput, name: e.target.value})} required className={`w-full px-4 py-3 rounded-xl bg-black border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-${isFemale ? 'pink' : 'green'}-500 transition-all`} placeholder="e.g., 2 boiled eggs or 200g chicken" />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-semibold text-gray-400 mb-2">Calories (kcal)</label>
                  <input type="number" value={foodInput.calories} onChange={(e) => setFoodInput({...foodInput, calories: e.target.value})} required className={`w-full px-4 py-3 rounded-xl bg-black border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-${isFemale ? 'pink' : 'green'}-500 transition-all`} placeholder="150" />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-semibold text-gray-400 mb-2">Protein (g)</label>
                  <input type="number" value={foodInput.protein} onChange={(e) => setFoodInput({...foodInput, protein: e.target.value})} className={`w-full px-4 py-3 rounded-xl bg-black border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-${isFemale ? 'pink' : 'green'}-500 transition-all`} placeholder="12" />
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-end mt-8">
                <button type="button" onClick={() => setShowModal(false)} className="px-6 py-3 rounded-xl font-bold text-gray-300 bg-gray-800 hover:bg-gray-700 transition-colors">
                  Cancel
                </button>
                <button type="submit" className={`px-6 py-3 rounded-xl font-extrabold text-black ${themeBg} ${themeHoverBg} transition-all ${themeShadow}`}>
                  Log Food
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Nutrition;