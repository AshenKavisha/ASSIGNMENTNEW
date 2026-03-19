import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    termsAccepted: false
  });

  const [validation, setValidation] = useState({
    lengthValid: false,
    matchValid: false,
    showRequirements: false
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  // Watch for password changes to update validation UI
  useEffect(() => {
    setValidation(prev => ({
      ...prev,
      lengthValid: formData.password.length >= 6,
      matchValid: formData.password !== '' && formData.password === formData.confirmPassword
    }));
  }, [formData.password, formData.confirmPassword]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFocus = () => {
    setValidation(prev => ({ ...prev, showRequirements: true }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    // Extra validation checks before submit
    if (formData.fullName.trim().length < 2) {
      setErrorMsg('Please enter your full name (at least 2 characters).');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    if (!validation.lengthValid || !validation.matchValid) {
      setErrorMsg('Please ensure your password meets all requirements.');
      return;
    }

    if (!formData.termsAccepted) {
      setErrorMsg('Please agree to the Terms of Service and Privacy Policy.');
      return;
    }

    setIsLoading(true);

    // Mock Registration Logic
    setTimeout(() => {
      setIsLoading(false);
      // සාර්ථකව Register වුනාම Login පේජ් එකට යවනවා Success Message එකක් එක්ක
      navigate('/login?message=Registration successful. Please verify your email.');
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#667eea] to-[#764ba2] p-5 font-sans">
      
      {/* Container */}
      <div className="max-w-[500px] w-full animate-fadeInUp">
        
        {/* Card */}
        <div className="bg-white rounded-[20px] shadow-[0_15px_35px_rgba(0,0,0,0.1)] overflow-hidden border-none p-8">
          
          <h2 className="text-[#2c3e50] text-center mb-6 text-3xl font-bold flex items-center justify-center gap-2">
            <i className="bi bi-person-plus"></i> Create Account
          </h2>

          {/* Error Message */}
          {errorMsg && (
            <div className="bg-gradient-to-r from-[#e74c3c] to-[#c0392b] text-white p-3 rounded-xl mb-4 text-sm flex items-center gap-2">
              <i className="bi bi-exclamation-triangle"></i> {errorMsg}
            </div>
          )}

          {/* Info Box */}
          <div className="bg-[#e3f2fd] border-l-4 border-[#3498db] p-4 rounded-md mb-6 text-sm">
            <p className="text-[#1565c0] m-0 leading-relaxed">
              <i className="bi bi-info-circle me-1"></i>
              <strong>Email Verification Required:</strong> After registration, you'll need to verify your email address before you can login.
            </p>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit}>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="mb-4">
                <label className="block font-semibold text-[#2c3e50] mb-2">
                  Full Name <span className="text-[#e74c3c]">*</span>
                </label>
                <input 
                  type="text" 
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full p-3 border-2 border-gray-200 rounded-xl text-base transition-all duration-300 focus:border-[#3498db] focus:outline-none focus:ring-4 focus:ring-blue-500/10"
                  placeholder="Enter your full name" 
                  required 
                />
              </div>

              <div className="mb-4">
                <label className="block font-semibold text-[#2c3e50] mb-2">
                  Email <span className="text-[#e74c3c]">*</span>
                </label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-3 border-2 border-gray-200 rounded-xl text-base transition-all duration-300 focus:border-[#3498db] focus:outline-none focus:ring-4 focus:ring-blue-500/10"
                  placeholder="your.email@example.com" 
                  required 
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="mb-4">
                <label className="block font-semibold text-[#2c3e50] mb-2">
                  Password <span className="text-[#e74c3c]">*</span>
                </label>
                <input 
                  type="password" 
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  onFocus={handleFocus}
                  className={`w-full p-3 border-2 ${!validation.lengthValid && formData.password.length > 0 ? 'border-[#e74c3c]' : 'border-gray-200'} rounded-xl text-base transition-all duration-300 focus:border-[#3498db] focus:outline-none`}
                  placeholder="Create a password" 
                  required 
                />
              </div>

              <div className="mb-4">
                <label className="block font-semibold text-[#2c3e50] mb-2">
                  Confirm Password <span className="text-[#e74c3c]">*</span>
                </label>
                <input 
                  type="password" 
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  onFocus={handleFocus}
                  className={`w-full p-3 border-2 ${!validation.matchValid && formData.confirmPassword.length > 0 ? 'border-[#e74c3c]' : 'border-gray-200'} rounded-xl text-base transition-all duration-300 focus:border-[#3498db] focus:outline-none`}
                  placeholder="Confirm your password" 
                  required 
                />
              </div>
            </div>

            {/* Password Requirements Box */}
            <div className={`bg-gray-50 p-3 rounded-lg mb-4 text-sm transition-all duration-300 ${validation.showRequirements ? 'block' : 'hidden'}`}>
              <strong className="text-gray-700">Password Requirements:</strong>
              <ul className="mt-1 space-y-1 ml-1">
                <li className={`${validation.lengthValid ? 'text-[#27ae60]' : 'text-gray-500'} flex items-center gap-2`}>
                  <i className={`bi ${validation.lengthValid ? 'bi-check-circle-fill' : 'bi-circle'}`}></i> At least 6 characters
                </li>
                <li className={`${validation.matchValid ? 'text-[#27ae60]' : 'text-gray-500'} flex items-center gap-2`}>
                  <i className={`bi ${validation.matchValid ? 'bi-check-circle-fill' : 'bi-circle'}`}></i> Passwords match
                </li>
              </ul>
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start mb-6">
              <input 
                type="checkbox" 
                name="termsAccepted"
                id="terms"
                checked={formData.termsAccepted}
                onChange={handleInputChange}
                className="mt-1 mr-2 cursor-pointer w-4 h-4 text-[#3498db] focus:ring-[#3498db]"
                required
              />
              <label htmlFor="terms" className="text-sm text-gray-600 cursor-pointer leading-relaxed">
                I agree to the <Link to="/terms-and-conditions" className="text-[#3498db] hover:underline">Terms of Service</Link> and <Link to="/privacy-policy" className="text-[#3498db] hover:underline">Privacy Policy</Link>
              </label>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full p-3 bg-gradient-to-r from-[#3498db] to-[#2980b9] text-white rounded-xl text-base font-bold cursor-pointer transition-all duration-300 hover:translate-y-[-2px] hover:shadow-[0_5px_15px_rgba(52,152,219,0.4)] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-5 h-5 block"></span>
                  Creating Account...
                </>
              ) : (
                <><i className="bi bi-person-check"></i> Create Account</>
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="text-center text-gray-600 mt-6">
            <p>Already have an account? <Link to="/login" className="text-[#3498db] font-semibold hover:underline">Login here</Link></p>
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

export default Register;