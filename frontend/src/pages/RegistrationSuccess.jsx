import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const RegistrationSuccess = () => {
  const [seconds, setSeconds] = useState(10);
  const navigate = useNavigate();

  useEffect(() => {
    // තත්පරෙන් තත්පරය අඩු වෙන Timer එක
    const interval = setInterval(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);

    // Component එක unmount වෙද්දි interval එක අයින් කරනවා
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // තත්පර ගාන 0 වුනාම Login එකට යවනවා
    if (seconds <= 0) {
      navigate('/login');
    }
  }, [seconds, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#667eea] to-[#764ba2] p-5 font-sans">
      
      <div className="max-w-[500px] w-full bg-white rounded-[20px] p-8 md:p-10 text-center shadow-[0_15px_35px_rgba(0,0,0,0.1)] animate-fadeInUp">
        
        {/* Success Icon */}
        <div className="text-[80px] text-[#27ae60] mb-5 animate-bounce-custom leading-none">
          <i className="bi bi-check-circle-fill"></i>
        </div>

        <h1 className="text-[#2c3e50] mb-4 text-3xl font-bold">Registration Successful!</h1>

        <p className="text-gray-600 leading-relaxed mb-2 text-[1.1rem]">Thank you for joining Assignment Service!</p>
        <p className="text-gray-600 leading-relaxed mb-2 text-[1.1rem]">Your account has been created successfully.</p>

        {/* Email Notice */}
        <div className="bg-[#e3f2fd] rounded-xl p-4 mt-6 text-left">
          <h4 className="text-[#1565c0] mb-2 text-[1.1rem] font-bold flex items-center gap-2">
            <i className="bi bi-envelope-check"></i> Check Your Email
          </h4>
          <p className="text-[#1565c0]/80 text-sm m-0">We've sent a confirmation email with your account details.</p>
          <p className="text-[#1565c0]/80 text-sm m-0">Please check your inbox (and spam folder) for important information.</p>
        </div>

        {/* Next Steps */}
        <div className="bg-gray-50 rounded-xl p-5 my-6 text-left">
          <h3 className="text-[#2c3e50] mb-3 text-[1.2rem] font-bold flex items-center gap-2">
            <i className="bi bi-list-check"></i> Next Steps:
          </h3>
          <ul className="list-none p-0 m-0 space-y-2 text-gray-600 font-medium">
            <li className="relative pl-6 before:content-['✓'] before:absolute before:left-0 before:text-[#27ae60] before:font-bold">Check your email for confirmation</li>
            <li className="relative pl-6 before:content-['✓'] before:absolute before:left-0 before:text-[#27ae60] before:font-bold">Login to your new account</li>
            <li className="relative pl-6 before:content-['✓'] before:absolute before:left-0 before:text-[#27ae60] before:font-bold">Complete your profile setup</li>
            <li className="relative pl-6 before:content-['✓'] before:absolute before:left-0 before:text-[#27ae60] before:font-bold">Submit your first assignment</li>
          </ul>
        </div>

        {/* Countdown */}
        <div className={`text-[1.2rem] font-bold mt-5 transition-colors duration-300 ${seconds <= 3 ? 'text-[#e74c3c]' : 'text-[#27ae60]'}`}>
          Redirecting to login in <span>{seconds}</span> seconds
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center">
          <Link to="/login" className="px-6 py-3 rounded-xl text-base font-bold transition-all no-underline inline-flex items-center justify-center gap-2 min-w-[160px] bg-gradient-to-r from-[#3498db] to-[#2980b9] text-white hover:-translate-y-1 hover:shadow-lg">
            <i className="bi bi-box-arrow-in-right"></i> Go to Login
          </Link>

          <Link to="/" className="px-6 py-3 rounded-xl text-base font-bold transition-all no-underline inline-flex items-center justify-center gap-2 min-w-[160px] bg-gradient-to-r from-[#95a5a6] to-[#7f8c8d] text-white hover:-translate-y-1 hover:shadow-lg">
            <i className="bi bi-house"></i> Back to Home
          </Link>
        </div>

        <p className="mt-6 text-[0.9rem] text-gray-400 font-medium flex items-center justify-center gap-1.5 m-0">
          <i className="bi bi-shield-check text-[#27ae60]"></i> Your account is secured and ready to use
        </p>

      </div>

      <style>{`
        @keyframes fadeInUp { 
          from { opacity: 0; transform: translateY(30px); } 
          to { opacity: 1; transform: translateY(0); } 
        }
        .animate-fadeInUp { animation: fadeInUp 0.5s ease-out forwards; }
        
        @keyframes bounceCustom {
          from { transform: translateY(0); }
          to { transform: translateY(-10px); }
        }
        .animate-bounce-custom { animation: bounceCustom 1s ease infinite alternate; }
      `}</style>
    </div>
  );
};

export default RegistrationSuccess;