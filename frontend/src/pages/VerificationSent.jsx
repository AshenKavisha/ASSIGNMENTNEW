import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';

const VerificationSent = () => {
  const [searchParams] = useSearchParams();
  // URL එකෙන් email එක ගන්නවා, නැත්නම් default එකක් පෙන්වනවා
  const email = searchParams.get('email') || "your email address";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#667eea] to-[#764ba2] p-5 font-sans">
      
      <div className="max-w-[550px] w-full bg-white rounded-[20px] p-8 md:p-10 text-center shadow-[0_15px_35px_rgba(0,0,0,0.1)] animate-fadeInUp">
        
        {/* Animated Icon */}
        <div className="text-[80px] text-[#3498db] mb-5 animate-pulse-custom leading-none">
          <i className="bi bi-envelope-check"></i>
        </div>

        <h1 className="text-[#2c3e50] mb-4 text-3xl font-bold">Check Your Email!</h1>

        <p className="text-gray-600 leading-relaxed mb-4 text-[1.05rem]">We've sent a verification email to:</p>

        {/* Email Display Box */}
        <div className="bg-[#e3f2fd] p-4 rounded-xl mb-6 font-bold text-[#3498db] break-all border border-[#b6d4fe]">
          <i className="bi bi-envelope-at mr-2"></i> {email}
        </div>

        {/* Steps Card */}
        <div className="bg-gray-50 rounded-xl p-6 mb-6 text-left">
          <h3 className="text-[#2c3e50] mb-4 text-[1.2rem] font-bold text-center flex items-center justify-center gap-2">
            <i className="bi bi-list-check"></i> Next Steps:
          </h3>
          <ol className="list-decimal pl-6 space-y-3 text-gray-600 font-medium">
            <li>Open your email inbox</li>
            <li>Look for an email from <strong>Assignment Service</strong></li>
            <li>Click the verification link in the email</li>
            <li>Once verified, you can login to your account</li>
          </ol>
        </div>

        {/* Info Alert */}
        <div className="bg-[#fff3cd] border-l-4 border-[#ffc107] p-4 rounded-md mb-6 text-left shadow-sm">
          <p className="text-[#856404] font-bold m-0 flex items-center gap-2">
            <i className="bi bi-info-circle"></i> Didn't receive the email?
          </p>
          <p className="text-[#856404]/80 text-sm mt-2 mb-0 leading-relaxed">
            Check your spam folder or wait a few minutes. The email may take up to 5 minutes to arrive.
          </p>
        </div>

        <p className="text-sm text-gray-400 font-medium mb-6">
          The verification link will expire in 24 hours.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/resend-verification" className="px-6 py-3 rounded-xl text-base font-bold transition-all no-underline inline-flex items-center justify-center gap-2 min-w-[160px] bg-gradient-to-r from-[#3498db] to-[#2980b9] text-white hover:-translate-y-1 hover:shadow-lg">
            <i className="bi bi-arrow-clockwise"></i> Resend Email
          </Link>

          <Link to="/login" className="px-6 py-3 rounded-xl text-base font-bold transition-all no-underline inline-flex items-center justify-center gap-2 min-w-[160px] bg-gradient-to-r from-[#95a5a6] to-[#7f8c8d] text-white hover:-translate-y-1 hover:shadow-lg">
            <i className="bi bi-box-arrow-in-right"></i> Go to Login
          </Link>
        </div>

      </div>

      <style>{`
        @keyframes fadeInUp { 
          from { opacity: 0; transform: translateY(30px); } 
          to { opacity: 1; transform: translateY(0); } 
        }
        .animate-fadeInUp { animation: fadeInUp 0.6s ease-out forwards; }
        
        @keyframes pulseCustom {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.08); }
        }
        .animate-pulse-custom { animation: pulseCustom 2s ease infinite; }
      `}</style>
    </div>
  );
};

export default VerificationSent;