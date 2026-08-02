import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const SelectAssignmentType = () => {
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
          <h1 className="text-3xl font-bold text-[#2c3e50] mb-3">What kind of project is this?</h1>
          <p className="text-gray-500">Choose the option that best describes your assignment</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">

          {/* University Project Card */}
          <button
            onClick={() => navigate('/assignments/select-university')}
            className="group cursor-pointer bg-white rounded-3xl p-8 text-left border-2 border-transparent hover:border-[#667eea] shadow-[0_10px_30px_rgba(0,0,0,0.06)] hover:shadow-[0_20px_50px_rgba(102,126,234,0.15)] transition-all hover:-translate-y-2"
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">
              <i className="bi bi-mortarboard-fill"></i>
            </div>
            <h3 className="text-xl font-bold text-[#2c3e50] mb-2">University Project</h3>
            <p className="text-gray-500 text-sm leading-relaxed mb-4">
              I'm a university student submitting a project tied to a specific module,
              year, and semester (e.g. SLIIT coursework).
            </p>
            <span className="inline-flex items-center gap-2 text-[#667eea] font-bold text-sm">
              Choose your university <i className="bi bi-arrow-right group-hover:translate-x-1 transition-transform"></i>
            </span>
          </button>

          {/* Individual / Non-Student Card */}
          <button
            onClick={() => navigate('/assignments/create?mode=individual')}
            className="group cursor-pointer bg-white rounded-3xl p-8 text-left border-2 border-transparent hover:border-[#11998e] shadow-[0_10px_30px_rgba(0,0,0,0.06)] hover:shadow-[0_20px_50px_rgba(17,153,142,0.15)] transition-all hover:-translate-y-2"
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#11998e] to-[#38ef7d] text-white flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">
              <i className="bi bi-person-workspace"></i>
            </div>
            <h3 className="text-xl font-bold text-[#2c3e50] mb-2">Individual / Freelance Project</h3>
            <p className="text-gray-500 text-sm leading-relaxed mb-4">
              This isn't tied to university coursework — a personal project,
              freelance work, or something outside a university module.
            </p>
            <span className="inline-flex items-center gap-2 text-[#11998e] font-bold text-sm">
              Continue with manual details <i className="bi bi-arrow-right group-hover:translate-x-1 transition-transform"></i>
            </span>
          </button>

        </div>

        <Link to="/dashboard" className="mt-10 text-gray-400 hover:text-gray-600 text-sm flex items-center gap-2 no-underline">
          <i className="bi bi-arrow-left"></i> Back to Dashboard
        </Link>
      </div>

      {/* Footer */}
      <footer className="bg-[#212529] text-white/50 text-center py-6 text-sm mt-auto">
        <p className="mb-0">&copy; 2026 Assignment Service. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default SelectAssignmentType;