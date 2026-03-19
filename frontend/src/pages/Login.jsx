import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // URL parameters වලින් Alerts ගන්න (Mocking thymeleaf conditional alerts)
  const queryParams = new URLSearchParams(location.search);
  const isLogout = queryParams.get('logout');
  const isUnverified = queryParams.get('unverified');
  const errorMsg = queryParams.get('error');
  const successMsg = queryParams.get('message');

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Mock Login Logic
    setTimeout(() => {
      setIsLoading(false);
      if (email.toLowerCase().includes('admin')) {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard'); 
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#667eea] to-[#764ba2] p-5 font-sans">
      
      {/* Container */}
      <div className="max-w-[400px] w-full animate-fadeInUp">
        
        {/* Card */}
        <div className="bg-white rounded-[20px] shadow-[0_15px_35px_rgba(0,0,0,0.1)] overflow-hidden border-none p-8">
          
          <h2 className="text-[#2c3e50] text-center mb-6 text-3xl font-bold flex items-center justify-center gap-2">
            <i className="bi bi-person-circle"></i> Login
          </h2>

          {/* Conditional Alerts */}
          {errorMsg && (
            <div className="bg-gradient-to-r from-[#e74c3c] to-[#c0392b] text-white p-3 rounded-xl mb-4 text-sm flex items-center gap-2">
              <i className="bi bi-exclamation-triangle"></i> {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="bg-gradient-to-r from-[#27ae60] to-[#219652] text-white p-3 rounded-xl mb-4 text-sm flex items-center gap-2">
              <i className="bi bi-check-circle"></i> {successMsg}
            </div>
          )}

          {isLogout && (
            <div className="bg-gradient-to-r from-[#3498db] to-[#2980b9] text-white p-3 rounded-xl mb-4 text-sm flex items-center gap-2">
              <i className="bi bi-info-circle"></i> You have been successfully logged out.
            </div>
          )}

          {isUnverified && (
            <div className="bg-gradient-to-r from-[#f39c12] to-[#e67e22] text-white p-3 rounded-xl mb-4 text-sm flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <i className="bi bi-envelope-exclamation"></i> Please verify your email before logging in.
              </div>
              <Link to="/resend-verification" className="text-white underline text-xs mt-1 self-start hover:text-gray-200">
                Resend verification email
              </Link>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin}>
            
            <div className="mb-4">
              <label className="block font-semibold text-[#2c3e50] mb-2">Email</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border-2 border-gray-200 rounded-xl text-base transition-all duration-300 focus:border-[#3498db] focus:outline-none focus:ring-4 focus:ring-blue-500/10"
                placeholder="Enter your email" 
                required 
              />
            </div>

            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <label className="font-semibold text-[#2c3e50]">Password</label>
                <Link to="/forgot-password" className="text-[#3498db] text-sm hover:underline flex items-center gap-1">
                  <i className="bi bi-key"></i> Forgot Password?
                </Link>
              </div>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border-2 border-gray-200 rounded-xl text-base transition-all duration-300 focus:border-[#3498db] focus:outline-none focus:ring-4 focus:ring-blue-500/10"
                placeholder="Enter your password" 
                required 
              />
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full p-3 bg-gradient-to-r from-[#3498db] to-[#2980b9] text-white rounded-xl text-base font-bold cursor-pointer transition-all duration-300 hover:translate-y-[-2px] hover:shadow-[0_5px_15px_rgba(52,152,219,0.4)] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-5 h-5 block"></span>
              ) : (
                <><i className="bi bi-box-arrow-in-right"></i> Login</>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center text-center my-6 before:content-[''] before:flex-1 before:border-b before:border-gray-200 after:content-[''] after:flex-1 after:border-b after:border-gray-200">
            <span className="px-3 text-gray-500 text-sm">OR</span>
          </div>

          {/* Register Link */}
          <div className="text-center text-gray-600">
            <p>Don't have an account? <Link to="/register" className="text-[#3498db] font-semibold hover:underline">Register here</Link></p>
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

export default Login;