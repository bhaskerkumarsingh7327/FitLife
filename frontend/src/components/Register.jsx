import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth, googleProvider } from '../firebase';
import { createUserWithEmailAndPassword, updateProfile, signInWithPopup } from 'firebase/auth';

const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!auth) {
        throw new Error("Firebase configuration missing");
      }
      // Firebase me naya user create karna
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: name });
      
      localStorage.setItem('userName', name);
      localStorage.setItem('userEmail', email);
      navigate('/onboarding');
    } catch (error) {
      console.warn("Using Demo Registration:", error);
      // Fallback agar Firebase me koi error ho taaki website na ruke
      localStorage.setItem('userName', name || email.split('@')[0]);
      localStorage.setItem('userEmail', email);
      navigate('/onboarding');
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    if (!auth) {
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
      navigate('/onboarding');
    } catch (error) {
      console.error(error);
      alert("Google Signup Failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    {loading ? (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-green-500 font-bold">Creating your account...</p>
        </div>
      </div>
    ) : (
    <div className="min-h-screen flex items-center justify-center bg-black p-4">
      <div className="bg-gray-900 rounded-3xl shadow-2xl p-8 max-w-md w-full border border-gray-800">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-white mb-2">Join Fit<span className="text-green-500">Life</span></h1>
          <p className="text-gray-400 font-medium">Create an account to start your journey.</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-1">Full Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full px-4 py-3 rounded-xl bg-black border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition-all" placeholder="John Doe" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-1">Email Address</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-4 py-3 rounded-xl bg-black border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition-all" placeholder="Enter your email" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-1">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-4 py-3 rounded-xl bg-black border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition-all" placeholder="••••••••" minLength="6" />
          </div>
          <button type="submit" className="w-full py-3 bg-green-500 text-black rounded-xl font-bold text-lg hover:bg-green-400 shadow-md transition-all">
            Create Account
          </button>
        </form>

        <div className="my-6 flex items-center">
          <div className="flex-grow border-t border-gray-700"></div>
          <span className="mx-4 text-gray-500 text-sm font-semibold">OR SIGN UP WITH</span>
          <div className="flex-grow border-t border-gray-700"></div>
        </div>

        <div className="space-y-3">
          <button type="button" onClick={loginWithGoogle} className="w-full flex items-center justify-center gap-3 bg-black border border-gray-700 text-gray-300 py-3 rounded-xl font-bold hover:bg-gray-800 transition-all shadow-sm">
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" /> Google
          </button>
        </div>

        <p className="text-center text-gray-400 mt-8 text-sm font-medium">
          Already have an account? <Link to="/login" className="text-green-500 hover:text-green-400 hover:underline font-bold transition-colors">Login here</Link>
        </p>
      </div>
    </div>
    )}
    </>
  );
};
export default Register;