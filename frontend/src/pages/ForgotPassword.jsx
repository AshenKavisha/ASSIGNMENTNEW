import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setMessage(null);

    try {
      const formData = new URLSearchParams();
      formData.append('email', email);

      const response = await fetch('/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData,
        credentials: 'include',
      });

      setMessage("If an account exists with this email, we've sent instructions to reset your password.");
      setEmail('');
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#667eea] to-[#764ba2] p-5 font-sans">
      
      {/* Container */}
      <div className="max-w-[450px] w-full animate-fadeInUp">
        
        {/* Card */}
        <div className="bg-white rounded-[20px] shadow-[0_15px_35px_rgba(0,0,0,0.1)] overflow-hidden border-none">
          
          {/* Card Header */}
          <div className="bg-gradient-to-tr from-[#3498db] to-[#2980b9] text-white p-8 text-center">
            <i className="bi bi-key-fill text-[3rem] block mb-4"></i>
            <h2 className="text-[1.75rem] font-bold m-0">Forgot Password?</h2>
          </div>

          {/* Card Body */}
          <div className="p-8">
            
            {/* Info Box */}
            <div className="bg-[#e3f2fd] border-l-4 border-[#3498db] p-[15px] rounded-[5px] mb-6">
              <p className="m-0 text-[#1565c0] text-[0.95rem] leading-relaxed flex items-start gap-2">
                <i className="bi bi-info-circle mt-0.5"></i>
                <span>Enter your email address and we'll send you instructions to reset your password.</span>
              </p>
            </div>

            {/* Success Message */}
            {message && (
              <div className="bg-gradient-to-r from-[#27ae60] to-[#219652] text-white p-3 rounded-[10px] mb-4 text-[0.9rem] flex items-center gap-2">
                <i className="bi bi-check-circle"></i> <span>{message}</span>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-gradient-to-r from-[#e74c3c] to-[#c0392b] text-white p-3 rounded-[10px] mb-4 text-[0.9rem] flex items-center gap-2">
                <i className="bi bi-exclamation-triangle"></i> <span>{error}</span>
              </div>
            )}

            {/* Reset Form */}
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label className="block font-semibold text-[#2c3e50] mb-2">
                  <i className="bi bi-envelope"></i> Email Address
                </label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-[12px_15px] border-2 border-[#e9ecef] rounded-[10px] text-[16px] transition-all duration-300 focus:border-[#3498db] focus:outline-none focus:shadow-[0_0_0_3px_rgba(52,152,219,0.1)] mb-4"
                  placeholder="Enter your registered email" 
                  required 
                />
              </div>

              {/* Primary Button */}
              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full p-[12px] bg-gradient-to-tr from-[#3498db] to-[#2980b9] text-white rounded-[10px] text-[16px] font-semibold cursor-pointer transition-all duration-300 hover:bg-gradient-to-tr hover:from-[#2980b9] hover:to-[#3498db] hover:-translate-y-0.5 hover:shadow-[0_5px_15px_rgba(52,152,219,0.4)] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mb-[10px]"
              >
                {isLoading ? (
                  <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-5 h-5 block"></span>
                ) : (
                  <><i className="bi bi-send"></i> Send Reset Link</>
                )}
              </button>

              {/* Secondary Button */}
              <Link 
                to="/login"
                className="w-full p-[12px] bg-gradient-to-tr from-[#95a5a6] to-[#7f8c8d] text-white rounded-[10px] text-[16px] font-semibold cursor-pointer transition-all duration-300 hover:bg-gradient-to-tr hover:from-[#7f8c8d] hover:to-[#95a5a6] hover:-translate-y-0.5 hover:shadow-[0_5px_15px_rgba(149,165,166,0.4)] flex items-center justify-center gap-2 no-underline mt-[10px]"
              >
                <i className="bi bi-arrow-left"></i> Back to Login
              </Link>
            </form>

            {/* Bottom Text */}
            <div className="text-center mt-6">
              <p className="text-[0.9rem] text-[#6c757d]">
                Remember your password? <Link to="/login" className="text-[#3498db] hover:underline no-underline">Login here</Link>
              </p>
            </div>

          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp { 
          from { opacity: 0; transform: translateY(30px); } 
          to { opacity: 1; transform: translateY(0); } 
        }
        .animate-fadeInUp { animation: fadeInUp 0.5s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default ForgotPassword;