import React, { useState, useEffect } from 'react';
import { auth } from '../firebase';
import { sendPasswordResetEmail, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';

const ForgotPassword = () => {
  const [method, setMethod] = useState('email'); // 'email' or 'phone'
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // reCAPTCHA को सेटअप करने के लिए
  useEffect(() => {
    // यह सुनिश्चित करता है कि reCAPTCHA बार-बार न बने
    if (!window.recaptchaVerifier) {
      // अदृश्य reCAPTCHA, जो यूजर को परेशान नहीं करता
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible',
        'callback': (response) => {
          // reCAPTCHA हल हो गया, अब OTP भेजा जा सकता है
        }
      });
    }
  }, []);

  // --- EMAIL RESET LOGIC ---
  const handleEmailReset = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage('✅ Password reset link has been sent to your Gmail!');
      setEmail('');
    } catch (err) {
      console.error(err);
      if (err.code === 'auth/user-not-found') {
        setError('❌ This email is not registered. Please sign up first.');
      } else {
        setError('❌ Failed to send reset link. Make sure the email is correct.');
      }
    }
    setLoading(false);
  };

  // --- PHONE OTP LOGIC (Requires Firebase Console Setup) ---
  const handlePhoneOTP = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    // Phone number format validation and auto-adding +91
    let formattedPhone = phone.trim();
    if (/^\d{10}$/.test(formattedPhone)) {
      formattedPhone = '+91' + formattedPhone;
    } else if (!formattedPhone.startsWith('+')) {
      setLoading(false);
      return setError('❌ Please enter a valid 10-digit number or add country code (e.g., +91).');
    }

    try {
      const verifier = window.recaptchaVerifier;
      const result = await signInWithPhoneNumber(auth, formattedPhone, verifier);
      setConfirmationResult(result);
      setMessage(`✅ OTP sent to ${formattedPhone}! Please enter it below.`);
    } catch (err) {
      console.error("Phone OTP Error:", err);
      setError(`❌ Error: ${err.message}`);
      // Error hone par reCAPTCHA ko reset karein
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.render().then(widgetId => {
          window.grecaptcha.reset(widgetId);
        });
      }
    }
    setLoading(false);
  };

  // --- VERIFY OTP LOGIC ---
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (!confirmationResult) return setError('Please send an OTP first.');
    setLoading(true);
    setMessage('');
    setError('');
    try {
      await confirmationResult.confirm(otp);
      setMessage('✅ Phone number verified! You can now reset your password.');
      setConfirmationResult(null); // OTP वेरिफाई होने के बाद इसे क्लियर कर दें
    } catch (err) {
      setError('❌ Invalid OTP. Please try again.');
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-gray-900 rounded-3xl shadow-[0_0_20px_rgba(255,255,255,0.05)] border border-gray-800 p-8">
        <h2 className="text-3xl font-extrabold text-center mb-2">Reset Password</h2>
        <p className="text-gray-400 text-center mb-8">Choose how you want to reset your password</p>

        {/* Toggle Buttons */}
        <div className="flex bg-gray-800 rounded-xl mb-8 p-1">
          <button 
            onClick={() => { setMethod('email'); setError(''); setMessage(''); }}
            className={`flex-1 py-2 rounded-lg font-bold transition-all ${method === 'email' ? 'bg-green-500 text-black shadow-md' : 'text-gray-400 hover:text-white'}`}
          >
            Via Email
          </button>
          <button 
            onClick={() => { setMethod('phone'); setError(''); setMessage(''); }}
            className={`flex-1 py-2 rounded-lg font-bold transition-all ${method === 'phone' ? 'bg-green-500 text-black shadow-md' : 'text-gray-400 hover:text-white'}`}
          >
            Via Phone OTP
          </button>
        </div>

        {message && <div className="mb-4 p-3 bg-green-500/20 border border-green-500 text-green-400 rounded-xl text-sm font-semibold text-center">{message}</div>}
        {error && <div className="mb-4 p-3 bg-red-500/20 border border-red-500 text-red-400 rounded-xl text-sm font-semibold text-center">{error}</div>}

        {/* Email Form */}
        {method === 'email' && (
          <form onSubmit={handleEmailReset} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-400 mb-2">Registered Gmail Address</label>
              <input 
                type="email" 
                required
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className="w-full px-4 py-3 rounded-xl bg-black border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition-all" 
                placeholder="Enter your email" 
              />
            </div>
            <button disabled={loading} className="w-full py-3 bg-green-500 hover:bg-green-400 text-black rounded-xl font-extrabold transition-all hover:scale-[1.02] disabled:opacity-50">
              {loading ? 'Sending Link...' : 'Send Reset Link'}
            </button>
          </form>
        )}

        {/* Phone Form */}
        {method === 'phone' && !confirmationResult && (
           <form onSubmit={handlePhoneOTP} className="space-y-5">
             <div>
               <label className="block text-sm font-semibold text-gray-400 mb-2">Registered Phone Number</label>
               <input 
                 type="tel" 
                 required
                 value={phone} 
                 onChange={(e) => setPhone(e.target.value)} 
                 className="w-full px-4 py-3 rounded-xl bg-black border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition-all" 
                 placeholder="+919876543210" 
               />
             </div>
             <button disabled={loading} className="w-full py-3 bg-green-500 hover:bg-green-400 text-black rounded-xl font-extrabold transition-all hover:scale-[1.02] disabled:opacity-50">
               {loading ? 'Sending OTP...' : 'Send OTP'}
             </button>
           </form>
        )}

        {/* OTP Verification Form */}
        {method === 'phone' && confirmationResult && (
           <form onSubmit={handleVerifyOTP} className="space-y-5">
             <div>
               <label className="block text-sm font-semibold text-gray-400 mb-2">Enter 6-Digit OTP</label>
               <input 
                 type="text" 
                 required
                 value={otp} 
                 onChange={(e) => setOtp(e.target.value)} 
                 className="w-full px-4 py-3 rounded-xl bg-black border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition-all" 
                 placeholder="123456" 
               />
             </div>
             <button disabled={loading} className="w-full py-3 bg-green-500 hover:bg-green-400 text-black rounded-xl font-extrabold transition-all hover:scale-[1.02] disabled:opacity-50">
               {loading ? 'Verifying...' : 'Verify OTP'}
             </button>
           </form>
        )}
        
        <div id="recaptcha-container"></div>
        <div className="mt-6 text-center">
          <a href="/login" className="text-gray-400 hover:text-white font-semibold text-sm transition-colors">Back to Login</a>
        </div>
      </div>
    </div>
  );
};
export default ForgotPassword;