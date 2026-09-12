import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth, googleProvider } from '../firebase';
import { signInWithPopup } from 'firebase/auth';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    // Normal email login me name extract kar rahe hain
    const name = email.split('@')[0];
    localStorage.setItem('userName', name);
    localStorage.setItem('userEmail', email);
    navigate('/onboarding');
  };

  const loginWithGoogle = async () => {
    if (!auth) {
      alert("Google par redirect hone ke liye firebase.js me API keys daalna zaroori hai! Abhi Demo login ho raha hai.");
      localStorage.setItem('userName', 'Demo Google User');
      navigate('/onboarding');
      return;
    }
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, googleProvider);
      localStorage.setItem('userName', result.user.displayName);
      localStorage.setItem('userEmail', result.user.email);
      localStorage.setItem('userPhoto', result.user.photoURL);
      navigate('/onboarding'); // Keep this as it is
    } catch (error) {
      console.error(error);
      alert("Google Login Failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const loginWithApple = async () => {
    // Apple ID login configuration requires Apple Developer Account
    alert("Apple Login setup require Apple Developer Account. Simulating login...");
    localStorage.setItem('userName', 'Demo Apple User');
    navigate('/onboarding'); // Keep this as it is
  };

  return (
    <>
    {loading ? (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-green-500 font-bold">Verifying Google Login...</p>
        </div>
      </div>
    ) : (
    <div className="min-h-screen flex items-center justify-center bg-black p-4">
      <div className="bg-gray-900 rounded-3xl shadow-2xl p-8 max-w-md w-full border border-gray-800">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-white mb-2">Fit<span className="text-green-500">Life</span></h1>
          <p className="text-gray-400 font-medium">Welcome back! Let's crush your goals.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-1">Email Address</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-4 py-3 rounded-xl bg-black border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition-all" placeholder="Enter your email" />
          </div>
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-semibold text-gray-300">Password</label>
              <span onClick={() => navigate('/forgot-password')} className="text-sm font-bold text-green-500 hover:text-green-400 cursor-pointer transition-colors">Forgot Password?</span> {/* This link remains */}
            </div>
            <input type="password" required className="w-full px-4 py-3 rounded-xl bg-black border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition-all" placeholder="••••••••" />
          </div>
          <button type="submit" className="w-full py-3 bg-green-500 text-black rounded-xl font-bold text-lg hover:bg-green-400 shadow-md transition-all">
            Login Securely
          </button>
        </form>

        <div className="my-6 flex items-center">
          <div className="flex-grow border-t border-gray-700"></div>
          <span className="mx-4 text-gray-500 text-sm font-semibold">OR CONTINUE WITH</span>
          <div className="flex-grow border-t border-gray-700"></div>
        </div>

        <div className="space-y-3">
          <button type="button" onClick={loginWithGoogle} className="w-full flex items-center justify-center gap-3 bg-black border border-gray-700 text-gray-300 py-3 rounded-xl font-bold hover:bg-gray-800 transition-all shadow-sm">
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" /> Google
          </button>
          <button type="button" onClick={loginWithApple} className="w-full flex items-center justify-center gap-3 bg-black border border-gray-700 text-white py-3 rounded-xl font-bold hover:bg-gray-800 transition-all shadow-sm">
            <img src="https://www.svgrepo.com/show/511330/apple-173.svg" alt="Apple" className="w-5 h-5 filter invert" /> Apple ID
          </button>
        </div>
        
        <p className="text-center text-gray-400 mt-8 text-sm font-medium">
          Don't have an account? <Link to="/register" className="text-green-500 hover:text-green-400 hover:underline font-bold transition-colors">Register here</Link>
        </p>
      </div>
    </div>
    )}
    </>
  );
};
export default Login;