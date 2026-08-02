import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

// ============================================================
// EDIT THIS: add more universities here as you expand support.
// Each entry needs a name, an image (put your actual SLIIT logo/photo
// in your frontend's public or assets folder and reference it here),
// and the mode value passed to CreateAssignment.
// ============================================================
const universities = [
  {
    id: 'sliit',
    name: 'SLIIT',
    fullName: 'Sri Lanka Institute of Information Technology',
    image: '/images/sliit-logo.jpg', // ⚠️ replace with your actual SLIIT image path
    mode: 'sliit',
  },
];

const SelectUniversity = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5f7fa] to-[#c3cfe2] flex flex-col font-sans">

      {/* Navbar */}
      <nav className="bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white py-3 px-6 shadow-md sticky top-0 z-50">
        <div className="container mx-auto flex flex-wrap justify-between items-center gap-4">
          <Link to="/dashboard" className="text-xl font-bold flex items-center gap-2 hover:text-gray-200 transition-colors no-underline">
            <i className="bi bi-journal-check text-white"></i> Assignment Service
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 flex-1 max-w-4xl flex flex-col items-center justify-center">

        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-[#2c3e50] mb-3">Which university are you from?</h1>
          <p className="text-gray-500">We currently support module-based selection for these universities</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full">

          {/* Supported university cards */}
          {universities.map(uni => (
            <button
              key={uni.id}
              onClick={() => navigate(`/assignments/create?mode=${uni.mode}`)}
              className="group cursor-pointer bg-white rounded-3xl overflow-hidden text-left border-2 border-transparent hover:border-[#667eea] shadow-[0_10px_30px_rgba(0,0,0,0.06)] hover:shadow-[0_20px_50px_rgba(102,126,234,0.15)] transition-all hover:-translate-y-2"
            >
              <div className="h-36 w-full bg-gray-100 overflow-hidden">
                <img
                  src={uni.image}
                  alt={uni.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              </div>
              <div className="p-5">
                <h3 className="text-lg font-bold text-[#2c3e50] mb-1">{uni.name}</h3>
                <p className="text-gray-400 text-xs leading-relaxed mb-3">{uni.fullName}</p>
                <span className="inline-flex items-center gap-2 text-[#667eea] font-bold text-sm">
                  Select modules <i className="bi bi-arrow-right group-hover:translate-x-1 transition-transform"></i>
                </span>
              </div>
            </button>
          ))}

          {/* Other University — manual entry */}
          <button
            onClick={() => navigate('/assignments/create?mode=other-uni')}
            className="group cursor-pointer bg-white rounded-3xl p-6 text-left border-2 border-dashed border-gray-300 hover:border-[#f39c12] shadow-[0_10px_30px_rgba(0,0,0,0.06)] hover:shadow-[0_20px_50px_rgba(243,156,18,0.15)] transition-all hover:-translate-y-2 flex flex-col justify-center items-center text-center min-h-[220px]"
          >
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#f39c12] to-[#ffd200] text-white flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
              <i className="bi bi-building"></i>
            </div>
            <h3 className="text-lg font-bold text-[#2c3e50] mb-1">Other University</h3>
            <p className="text-gray-400 text-xs leading-relaxed mb-3">
              Not seeing your university? Enter your details manually.
            </p>
            <span className="inline-flex items-center gap-2 text-[#f39c12] font-bold text-sm">
              Continue manually <i className="bi bi-arrow-right group-hover:translate-x-1 transition-transform"></i>
            </span>
          </button>

        </div>

        <Link to="/assignments/select-type" className="mt-10 text-gray-400 hover:text-gray-600 text-sm flex items-center gap-2 no-underline">
          <i className="bi bi-arrow-left"></i> Back
        </Link>
      </div>

      {/* Footer */}
      <footer className="bg-[#212529] text-white/50 text-center py-6 text-sm mt-auto">
        <p className="mb-0">&copy; 2026 Assignment Service. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default SelectUniversity;