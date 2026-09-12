import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
// Navbar is not used in LiveSession.jsx, so no change needed here.
const LiveSession = () => {
  const navigate = useNavigate();
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [callTime, setCallTime] = useState(0);
  const userVideoRef = useRef(null);
  const streamRef = useRef(null);
  
  const isFemale = localStorage.getItem('userGender') === 'Female';
  const themeBorder = isFemale ? 'border-pink-500' : 'border-green-500';

  // Call duration timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCallTime((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Asali Camera aur Mic access karne ke liye WebRTC API
  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        streamRef.current = stream;
        if (userVideoRef.current) {
          userVideoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Camera ya Mic ka access deny ho gaya ya device nahi mila.", err);
      }
    };
    startCamera();

    // Jab page close ho, toh camera ki light band ho jaye (Cleanup)
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Mute/Unmute aur Video On/Off ko asali stream se link karna
  useEffect(() => {
    if (streamRef.current) {
      const audioTrack = streamRef.current.getAudioTracks()[0];
      if (audioTrack) audioTrack.enabled = !isMuted;

      const videoTrack = streamRef.current.getVideoTracks()[0];
      if (videoTrack) videoTrack.enabled = !isVideoOff;
    }
  }, [isMuted, isVideoOff]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleEndCall = () => {
    // End call par camera permanently band karke wapas bhejein
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    // End call par wapas Guidance page bhejein
    navigate('/guidance');
  };

  return (
    <div className="min-h-screen bg-black flex flex-col relative overflow-hidden">
      {/* Main Expert Video Area (Simulated with a gym coach image) */}
      <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
         <img 
           src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=1470&auto=format&fit=crop" 
           alt="Expert Coach" 
           className="w-full h-full object-cover opacity-80"
         />
         <div className="absolute top-8 left-8 bg-black/60 px-4 py-2 rounded-lg backdrop-blur-sm border border-gray-700">
           <p className="text-white font-bold flex items-center gap-2">
             <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></span> 
             Live: Coach Alex
           </p>
           <p className="text-gray-300 text-sm mt-1 text-center font-mono">{formatTime(callTime)}</p>
         </div>
      </div>

      {/* User PiP (Picture in Picture) Video */}
      <div className={`absolute bottom-32 right-8 w-32 h-48 md:w-40 md:h-56 bg-gray-800 border-2 ${themeBorder} rounded-2xl overflow-hidden shadow-2xl z-10 transition-all duration-300`}>
        {isVideoOff && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 text-gray-500 font-bold z-20">
            <span className="text-3xl mb-2">🚫</span> Off
          </div>
        )}
        <video 
          ref={userVideoRef}
          autoPlay 
          playsInline 
          muted // Muted taaki aapki khud ki aawaz wapas echo na kare
          className="w-full h-full object-cover transform scale-x-[-1]" // Mirror effect ke liye
        />
        <div className="absolute bottom-2 left-2 bg-black/70 px-2 py-1 rounded text-xs text-white font-bold z-20">You</div>
      </div>

      {/* Bottom Call Controls */}
      <div className="absolute bottom-0 w-full h-28 bg-gradient-to-t from-black to-transparent flex items-center justify-center gap-6 pb-6 z-20">
        <button onClick={() => setIsMuted(!isMuted)} className={`w-14 h-14 rounded-full flex items-center justify-center text-xl transition-all shadow-lg ${isMuted ? 'bg-white text-black' : 'bg-gray-700/80 text-white hover:bg-gray-600 backdrop-blur-md'}`}>
          {isMuted ? '🔇' : '🎤'}
        </button>
        <button onClick={handleEndCall} className="px-8 py-4 bg-red-600 text-white font-extrabold rounded-full hover:bg-red-500 transition-all shadow-[0_0_20px_rgba(220,38,38,0.6)] hover:scale-105">
          End Call ☎️
        </button>
        <button onClick={() => setIsVideoOff(!isVideoOff)} className={`w-14 h-14 rounded-full flex items-center justify-center text-xl transition-all shadow-lg ${isVideoOff ? 'bg-white text-black' : 'bg-gray-700/80 text-white hover:bg-gray-600 backdrop-blur-md'}`}>
          {isVideoOff ? '🚫' : '📷'}
        </button>
      </div>
    </div>
  );
}
export default LiveSession;