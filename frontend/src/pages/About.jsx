import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#667eea] to-[#764ba2] font-sans flex flex-col">
      
      {/* Public Navbar */}
      <nav className="bg-white/10 backdrop-blur-md border-b border-white/20 text-white py-4 px-6 sticky top-0 z-50">
        <div className="container mx-auto flex flex-wrap justify-between items-center gap-4">
          <Link to="/" className="text-2xl font-black flex items-center gap-2 text-white hover:text-gray-200 transition-colors no-underline">
            <i className="bi bi-journal-check text-white"></i> AssignmentService
          </Link>
          <div className="flex items-center gap-6 font-bold text-sm">
            <Link to="/" className="text-white/80 hover:text-white transition-colors no-underline">Home</Link>
            <Link to="/about" className="text-white hover:text-white transition-colors no-underline border-b-2 border-white pb-1">About</Link>
            <Link to="/contact" className="text-white/80 hover:text-white transition-colors no-underline">Contact</Link>
            <Link to="/login" className="bg-white text-[#667eea] px-5 py-2 rounded-xl hover:shadow-lg transition-all ml-2 no-underline">Login</Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 flex-1 max-w-5xl">
        <div className="bg-white rounded-[20px] shadow-[0_15px_35px_rgba(0,0,0,0.1)] overflow-hidden animate-fadeInUp">
          <div className="p-8 md:p-12">
            
            <h1 className="text-4xl md:text-5xl font-extrabold text-[#2c3e50] text-center mb-12">About Assignment Service</h1>

            {/* Mission & Vision */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 hover:shadow-md transition-shadow">
                <h3 className="text-2xl font-bold text-[#2c3e50] mb-4 flex items-center gap-3">
                  <i className="bi bi-bullseye text-[#3498db] text-3xl"></i> Our Mission
                </h3>
                <p className="text-gray-600 leading-relaxed m-0 text-lg">
                  We are dedicated to helping undergraduate students excel in their academic journey by providing professional assistance with IT and Quantity Surveying assignments.
                </p>
              </div>
              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 hover:shadow-md transition-shadow">
                <h3 className="text-2xl font-bold text-[#2c3e50] mb-4 flex items-center gap-3">
                  <i className="bi bi-eye text-[#27ae60] text-3xl"></i> Our Vision
                </h3>
                <p className="text-gray-600 leading-relaxed m-0 text-lg">
                  To become the most trusted academic support service for students pursuing IT and Quantity Surveying degrees worldwide.
                </p>
              </div>
            </div>

            {/* What We Offer */}
            <h3 className="text-3xl font-bold text-[#2c3e50] mb-8 text-center"><i className="bi bi-people text-[#17a2b8]"></i> What We Offer</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              
              {/* IT Card */}
              <div className="bg-[#f8f9fa] rounded-2xl p-8 border-l-[6px] border-[#3498db] hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
                <h5 className="text-2xl font-bold text-[#3498db] mb-6 flex items-center gap-2"><i className="bi bi-laptop"></i> IT Assignments</h5>
                <ul className="space-y-3 text-gray-700 m-0 pl-0 list-none font-medium">
                  <li className="relative pl-6 before:content-['•'] before:absolute before:left-0 before:text-[#3498db] before:font-bold before:text-xl before:-top-1">Programming in multiple languages</li>
                  <li className="relative pl-6 before:content-['•'] before:absolute before:left-0 before:text-[#3498db] before:font-bold before:text-xl before:-top-1">Web and mobile application development</li>
                  <li className="relative pl-6 before:content-['•'] before:absolute before:left-0 before:text-[#3498db] before:font-bold before:text-xl before:-top-1">Database design and implementation</li>
                  <li className="relative pl-6 before:content-['•'] before:absolute before:left-0 before:text-[#3498db] before:font-bold before:text-xl before:-top-1">Software engineering projects</li>
                  <li className="relative pl-6 before:content-['•'] before:absolute before:left-0 before:text-[#3498db] before:font-bold before:text-xl before:-top-1">Networking and security assignments</li>
                </ul>
              </div>

              {/* QS Card */}
              <div className="bg-[#f8f9fa] rounded-2xl p-8 border-l-[6px] border-[#27ae60] hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
                <h5 className="text-2xl font-bold text-[#27ae60] mb-6 flex items-center gap-2"><i className="bi bi-calculator"></i> QS Assignments</h5>
                <ul className="space-y-3 text-gray-700 m-0 pl-0 list-none font-medium">
                  <li className="relative pl-6 before:content-['•'] before:absolute before:left-0 before:text-[#27ae60] before:font-bold before:text-xl before:-top-1">Cost estimation and analysis</li>
                  <li className="relative pl-6 before:content-['•'] before:absolute before:left-0 before:text-[#27ae60] before:font-bold before:text-xl before:-top-1">Construction management projects</li>
                  <li className="relative pl-6 before:content-['•'] before:absolute before:left-0 before:text-[#27ae60] before:font-bold before:text-xl before:-top-1">Quantity take-off calculations</li>
                  <li className="relative pl-6 before:content-['•'] before:absolute before:left-0 before:text-[#27ae60] before:font-bold before:text-xl before:-top-1">Project planning and scheduling</li>
                  <li className="relative pl-6 before:content-['•'] before:absolute before:left-0 before:text-[#27ae60] before:font-bold before:text-xl before:-top-1">Contract administration tasks</li>
                </ul>
              </div>

            </div>

            {/* Why Choose Us */}
            <h3 className="text-3xl font-bold text-[#2c3e50] mb-10 text-center"><i className="bi bi-shield-check text-[#f39c12]"></i> Why Choose Us</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6 rounded-xl hover:bg-blue-50/50 transition-colors">
                <i className="bi bi-award text-[4rem] text-[#3498db] block mb-4"></i>
                <h5 className="text-xl font-bold text-gray-800 mb-3">Quality Assurance</h5>
                <p className="text-gray-500 m-0">All assignments are thoroughly checked for quality and plagiarism.</p>
              </div>
              <div className="text-center p-6 rounded-xl hover:bg-green-50/50 transition-colors">
                <i className="bi bi-clock text-[4rem] text-[#27ae60] block mb-4"></i>
                <h5 className="text-xl font-bold text-gray-800 mb-3">On-Time Delivery</h5>
                <p className="text-gray-500 m-0">We guarantee timely submission of all work, every single time.</p>
              </div>
              <div className="text-center p-6 rounded-xl hover:bg-cyan-50/50 transition-colors">
                <i className="bi bi-lock text-[4rem] text-[#17a2b8] block mb-4"></i>
                <h5 className="text-xl font-bold text-gray-800 mb-3">Confidentiality</h5>
                <p className="text-gray-500 m-0">Your privacy, personal data, and payment security are our priority.</p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#212529] text-white/60 py-8 text-center text-sm">
        <div className="container mx-auto">
          <p className="mb-2">&copy; 2026 Assignment Service. All rights reserved.</p>
          <div className="flex justify-center gap-4 mt-4">
            <Link to="/privacy-policy" className="text-white/60 hover:text-white transition-colors">Privacy Policy</Link>
            <span>|</span>
            <Link to="/terms-and-conditions" className="text-white/60 hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes fadeInUp { 
          from { opacity: 0; transform: translateY(40px); } 
          to { opacity: 1; transform: translateY(0); } 
        }
        .animate-fadeInUp { animation: fadeInUp 0.6s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default About;