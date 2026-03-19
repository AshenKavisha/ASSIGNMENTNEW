import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Mock API Submission
    setTimeout(() => {
      setIsSubmitting(false);
      alert('Thank you for your message! We will get back to you soon.');
      setFormData({ name: '', email: '', subject: '', message: '' }); // Form එක reset කරනවා
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#667eea] to-[#764ba2] font-sans flex flex-col">
      
      {/* Public Navbar (Same as About page) */}
      <nav className="bg-white/10 backdrop-blur-md border-b border-white/20 text-white py-4 px-6 sticky top-0 z-50">
        <div className="container mx-auto flex flex-wrap justify-between items-center gap-4">
          <Link to="/" className="text-2xl font-black flex items-center gap-2 text-white hover:text-gray-200 transition-colors no-underline">
            <i className="bi bi-journal-check text-white"></i> AssignmentService
          </Link>
          <div className="flex items-center gap-6 font-bold text-sm">
            <Link to="/" className="text-white/80 hover:text-white transition-colors no-underline">Home</Link>
            <Link to="/about" className="text-white/80 hover:text-white transition-colors no-underline">About</Link>
            <Link to="/contact" className="text-white hover:text-white transition-colors no-underline border-b-2 border-white pb-1">Contact</Link>
            <Link to="/login" className="bg-white text-[#667eea] px-5 py-2 rounded-xl hover:shadow-lg transition-all ml-2 no-underline">Login</Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 flex-1 max-w-5xl">
        <div className="bg-white rounded-[20px] shadow-[0_15px_35px_rgba(0,0,0,0.1)] overflow-hidden animate-fadeInUp">
          <div className="p-8 md:p-12">
            
            <h1 className="text-4xl md:text-5xl font-extrabold text-[#2c3e50] text-center mb-12">Contact Us</h1>

            {/* Contact Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              
              {/* Email Support Card */}
              <div className="bg-[#f8f9fa] rounded-[15px] p-8 text-center border-2 border-transparent hover:border-[#3498db] hover:-translate-y-1.5 transition-all duration-300">
                <i className="bi bi-envelope text-[4rem] text-[#3498db] block mb-4"></i>
                <h5 className="text-xl font-bold text-[#2c3e50] mb-2">Email Support</h5>
                <p className="text-gray-500 mb-6">We respond within 24 hours</p>
                <a href="mailto:support@assignmentservice.com" className="inline-block border-2 border-[#3498db] text-[#3498db] font-bold px-6 py-2.5 rounded-xl hover:bg-[#3498db] hover:text-white transition-colors no-underline">
                  support@assignmentservice.com
                </a>
              </div>

              {/* Phone Support Card */}
              <div className="bg-[#f8f9fa] rounded-[15px] p-8 text-center border-2 border-transparent hover:border-[#27ae60] hover:-translate-y-1.5 transition-all duration-300">
                <i className="bi bi-telephone text-[4rem] text-[#27ae60] block mb-4"></i>
                <h5 className="text-xl font-bold text-[#2c3e50] mb-2">Phone Support</h5>
                <p className="text-gray-500 mb-6">Mon-Fri, 9AM-6PM</p>
                <a href="tel:+94112345678" className="inline-block border-2 border-[#27ae60] text-[#27ae60] font-bold px-6 py-2.5 rounded-xl hover:bg-[#27ae60] hover:text-white transition-colors no-underline">
                  +94 112 345 678
                </a>
              </div>

            </div>

            <hr className="border-gray-100 my-10" />

            {/* Contact Form */}
            <h3 className="text-3xl font-bold text-[#2c3e50] mb-8 text-center">Get In Touch</h3>
            
            <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="name" className="block text-[#2c3e50] font-bold mb-2">Your Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    value={formData.name}
                    onChange={handleInputChange}
                    required 
                    className="w-full p-3 border-2 border-[#e9ecef] rounded-xl text-base focus:border-[#3498db] focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-[#2c3e50] font-bold mb-2">Your Email</label>
                  <input 
                    type="email" 
                    id="email" 
                    value={formData.email}
                    onChange={handleInputChange}
                    required 
                    className="w-full p-3 border-2 border-[#e9ecef] rounded-xl text-base focus:border-[#3498db] focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label htmlFor="subject" className="block text-[#2c3e50] font-bold mb-2">Subject</label>
                <input 
                  type="text" 
                  id="subject" 
                  value={formData.subject}
                  onChange={handleInputChange}
                  required 
                  className="w-full p-3 border-2 border-[#e9ecef] rounded-xl text-base focus:border-[#3498db] focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
                />
              </div>

              <div className="mb-8">
                <label htmlFor="message" className="block text-[#2c3e50] font-bold mb-2">Message</label>
                <textarea 
                  id="message" 
                  rows="5" 
                  value={formData.message}
                  onChange={handleInputChange}
                  required 
                  className="w-full p-3 border-2 border-[#e9ecef] rounded-xl text-base focus:border-[#3498db] focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all resize-y min-h-[120px]"
                ></textarea>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-[#3498db] to-[#2980b9] text-white font-bold py-4 px-8 rounded-xl text-lg hover:shadow-[0_5px_15px_rgba(52,152,219,0.4)] hover:-translate-y-1 transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:hover:translate-y-0 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                   <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-5 h-5 block"></span>
                ) : (
                  <><i className="bi bi-send"></i> Send Message</>
                )}
              </button>
            </form>

          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#212529] text-white/60 py-8 text-center text-sm">
        <div className="container mx-auto">
          <p className="mb-2">&copy; 2026 Assignment Service. All rights reserved.</p>
          <div className="flex justify-center gap-4 mt-4">
            <Link to="/privacy-policy" className="text-white/60 hover:text-white transition-colors no-underline">Privacy Policy</Link>
            <span>|</span>
            <Link to="/terms-and-conditions" className="text-white/60 hover:text-white transition-colors no-underline">Terms of Service</Link>
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

export default Contact;