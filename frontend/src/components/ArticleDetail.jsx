import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from './Navbar.jsx';

const ArticleDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { article } = location.state || {};
  const [booking, setBooking] = useState(false);

  const isFemale = localStorage.getItem('userGender') === 'Female';
  const themeText = isFemale ? 'text-pink-500' : 'text-green-500';
  const themeBg = isFemale ? 'bg-pink-500' : 'bg-green-500';
  const themeHoverBg = isFemale ? 'hover:bg-pink-400' : 'hover:bg-green-400';
  const themeShadow = isFemale ? 'shadow-[0_0_20px_rgba(236,72,153,0.4)]' : 'shadow-[0_0_20px_rgba(34,197,94,0.4)]';
  const themeContainerShadow = isFemale ? 'shadow-[0_0_30px_rgba(236,72,153,0.15)]' : 'shadow-[0_0_30px_rgba(34,197,94,0.15)]';
  const themeGradient = isFemale ? 'via-pink-500' : 'via-green-500';
  const themeBorderAlpha = isFemale ? 'border-pink-500/50' : 'border-green-500/50';

  if (!article) {
    return (
      <div className="min-h-screen bg-black text-white pb-12">
        <Navbar />
        <div className="max-w-3xl mx-auto pt-20 px-4 text-center">
          <h2 className="text-2xl font-bold text-gray-400">Article Not Found</h2>
          <button onClick={() => navigate('/guidance')} className={`mt-4 ${themeText} font-bold hover:opacity-80 transition-colors`}>Go Back to Guidance</button>
        </div>
      </div>
    );
  }

  const handleBookSession = () => {
    setBooking(true);
    setTimeout(() => {
      navigate('/live-session');
    }, 1500); // 1.5 second loading animation before redirect
  };

  return (
    <div className="min-h-screen relative pb-20 text-white bg-black">
      {/* Gym Background */}
      <div 
        className="fixed inset-0 bg-cover bg-center opacity-20 pointer-events-none"
        style={{ backgroundImage: isFemale ? "url('https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=1470&auto=format&fit=crop')" : "url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470&auto=format&fit=crop')" }}
      ></div>
      <div className="fixed inset-0 bg-gradient-to-b from-black/60 via-black/90 to-black pointer-events-none"></div>

      <div className="relative z-10">
        <Navbar />
        
        <div className="max-w-4xl mx-auto pt-12 px-4">
          <button onClick={() => navigate(-1)} className={`mb-8 text-gray-400 hover:${themeText} font-bold flex items-center gap-2 transition-colors`}>
            &larr; Back to Articles
          </button>

          {/* Article Header */}
          <div className="bg-gray-900/80 backdrop-blur-md border border-gray-700 rounded-3xl p-8 md:p-12 shadow-2xl mb-12">
            <div className="flex items-center gap-4 mb-6">
              <div className="text-5xl">{article.icon}</div>
              <span className={`bg-black ${themeText} px-4 py-1.5 rounded-full font-bold text-sm uppercase tracking-widest border ${isFemale ? 'border-pink-500/30' : 'border-green-500/30'}`}>{article.category}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">{article.title}</h1>
            <p className="text-xl text-gray-300 leading-relaxed font-medium">
              {article.fullContent}
            </p>
          </div>

          {/* 1-on-1 Expert Advice Section */}
          <div className={`bg-gradient-to-br ${isFemale ? 'from-pink-900/40' : 'from-green-900/40'} to-black border-2 ${themeBorderAlpha} rounded-3xl p-8 md:p-10 text-center relative overflow-hidden ${themeContainerShadow}`}>
            <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent ${themeGradient} to-transparent`}></div>
            <h2 className="text-3xl font-extrabold text-white mb-4">Need Personalized Help? 🤔</h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto text-lg">
              Every body is different. Get a customized diet and workout strategy tailored exactly to your lifestyle and goals. Talk to our certified experts live!
            </p>
            <button 
              onClick={handleBookSession}
              disabled={booking}
              className={`${themeBg} text-black font-extrabold text-lg py-4 px-10 rounded-xl ${themeHoverBg} hover:scale-105 transition-all ${themeShadow} disabled:opacity-70 disabled:cursor-not-allowed`}
            >
              {booking ? 'Connecting to Expert...' : 'Book 1-on-1 Live Session 📞'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ArticleDetail;