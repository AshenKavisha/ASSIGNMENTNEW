import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  // Also check for error from backend redirect
  const backendError = searchParams.get('error');

  const isLengthValid = password.length >= 6;
  const isMatchValid = password !== '' && confirmPassword !== '' && password === confirmPassword;
  const isFormValid = isLengthValid && isMatchValid;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    setIsLoading(true);
    setError(null);

    try {
      // Send to backend as form data
      const formData = new URLSearchParams();
      formData.append('token', token);
      formData.append('password', password);
      formData.append('confirmPassword', confirmPassword);

      const response = await fetch('http://localhost:8080/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData,
        credentials: 'include',
        redirect: 'manual',
      });

      // Backend redirects to localhost:5173/login on success
      // We handle that by navigating ourselves
      navigate('/login?message=Password reset successfully! You can now login with your new password.');

    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // If no token in URL, redirect to forgot password
  if (!token) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#667eea] to-[#764ba2] p-5">
          <div className="bg-white rounded-[20px] p-8 text-center max-w-md w-full">
            <i className="bi bi-exclamation-triangle text-5xl text-red-500 mb-4 block"></i>
            <h3 className="font-bold text-xl mb-2">Invalid Reset Link</h3>
            <p className="text-gray-500 mb-4">This password reset link is invalid or has expired.</p>
            <Link to="/forgot-password" className="bg-blue-500 text-white px-6 py-2 rounded-xl font-bold no-underline">
              Request New Link
            </Link>
          </div>
        </div>
    );
  }

  return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#667eea] to-[#764ba2] p-5 font-sans">

        <div className="max-w-[450px] w-full animate-fadeInUp">
          <div className="bg-white rounded-[20px] shadow-[0_15px_35px_rgba(0,0,0,0.1)] overflow-hidden border-none">

            {/* Card Header */}
            <div className="bg-gradient-to-tr from-[#e74c3c] to-[#c0392b] text-white p-8 text-center">
              <i className="bi bi-shield-lock text-[3rem] block mb-4"></i>
              <h2 className="text-[1.75rem] font-bold m-0">Reset Your Password</h2>
            </div>

            {/* Card Body */}
            <div className="p-8">

              {/* Info Box */}
              <div className="bg-[#fff3cd] border-l-4 border-[#ffc107] p-[15px] rounded-[5px] mb-6">
                <p className="m-0 text-[#856404] text-[0.9rem] leading-relaxed flex items-start gap-2">
                  <i className="bi bi-info-circle mt-0.5"></i>
                  <span><strong>Important:</strong> Choose a strong password that you haven't used before.</span>
                </p>
              </div>

              {/* Error from backend redirect */}
              {backendError && (
                  <div className="bg-gradient-to-r from-[#e74c3c] to-[#c0392b] text-white p-3 rounded-[10px] mb-4 text-[0.9rem] flex items-center gap-2">
                    <i className="bi bi-exclamation-triangle"></i> <span>{backendError}</span>
                  </div>
              )}

              {/* Error from frontend */}
              {error && (
                  <div className="bg-gradient-to-r from-[#e74c3c] to-[#c0392b] text-white p-3 rounded-[10px] mb-4 text-[0.9rem] flex items-center gap-2">
                    <i className="bi bi-exclamation-triangle"></i> <span>{error}</span>
                  </div>
              )}

              {/* Reset Form */}
              <form onSubmit={handleSubmit}>

                {/* New Password */}
                <div className="mb-4 relative">
                  <label className="block font-semibold text-[#2c3e50] mb-2">
                    <i className="bi bi-lock"></i> New Password
                  </label>
                  <div className="relative">
                    <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-[12px_15px] pr-10 border-2 border-[#e9ecef] rounded-[10px] text-[16px] transition-all duration-300 focus:border-[#3498db] focus:outline-none"
                        placeholder="Enter new password"
                        required
                    />
                    <i
                        className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'} absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-[#6c757d] text-lg hover:text-[#3498db] transition-colors`}
                        onClick={() => setShowPassword(!showPassword)}
                    ></i>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="mb-4 relative">
                  <label className="block font-semibold text-[#2c3e50] mb-2">
                    <i className="bi bi-lock-fill"></i> Confirm Password
                  </label>
                  <div className="relative">
                    <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className={`w-full p-[12px_15px] pr-10 border-2 ${confirmPassword && !isMatchValid ? 'border-[#e74c3c]' : 'border-[#e9ecef]'} rounded-[10px] text-[16px] transition-all duration-300 focus:border-[#3498db] focus:outline-none`}
                        placeholder="Confirm new password"
                        required
                    />
                    <i
                        className={`bi ${showConfirmPassword ? 'bi-eye-slash' : 'bi-eye'} absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-[#6c757d] text-lg hover:text-[#3498db] transition-colors`}
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    ></i>
                  </div>
                </div>

                {/* Password Requirements */}
                <div className="bg-[#f8f9fa] p-[12px] rounded-[8px] mb-6 text-[0.85rem]">
                  <strong className="text-gray-700">Password Requirements:</strong>
                  <ul className="mt-1 space-y-1 ml-1 pl-[20px] list-disc">
                    <li className={`transition-colors duration-300 ${isLengthValid ? 'text-[#27ae60] font-medium' : 'text-[#6c757d]'}`}>
                      At least 6 characters
                    </li>
                    <li className={`transition-colors duration-300 ${isMatchValid ? 'text-[#27ae60] font-medium' : 'text-[#6c757d]'}`}>
                      Passwords match
                    </li>
                  </ul>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={!isFormValid || isLoading}
                    className="w-full p-[12px] bg-gradient-to-tr from-[#e74c3c] to-[#c0392b] text-white rounded-[10px] text-[16px] font-semibold cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_5px_15px_rgba(231,76,60,0.4)] flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                      <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-5 h-5 block"></span>
                  ) : (
                      <><i className="bi bi-check-circle"></i> Reset Password</>
                  )}
                </button>
              </form>

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

export default ResetPassword;