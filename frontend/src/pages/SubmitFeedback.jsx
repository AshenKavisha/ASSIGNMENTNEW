import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const SubmitFeedback = () => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);

  // Mock User Data
  const user = { fullName: "Ashen Kaveesha", profilePicture: null, isOnline: true };

  // Mock Past Feedbacks
  const pastFeedbacks = [
    { id: 1, user: { fullName: "John Doe" }, rating: 5, message: "Excellent service! The Java assignment was perfect.", createdAt: "Mar 17, 2026 10:30 AM" },
    { id: 2, user: { fullName: "Sarah Connor" }, rating: 4, message: "Very good QS report. Delivered on time.", createdAt: "Mar 16, 2026 02:15 PM" }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0) {
      alert("Please select a rating before submitting.");
      return;
    }
    
    setIsSubmitting(true);
    
    // Mock API Submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccessMsg("Thank you! Your feedback has been successfully submitted.");
      setRating(0);
      setMessage('');
      setTimeout(() => setSuccessMsg(null), 5000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5f7fa] to-[#c3cfe2] font-sans flex flex-col">
      
      {/* Navbar (Dashboard Style) */}
      <nav className="bg-[#212529] text-white py-3 px-6 shadow-md sticky top-0 z-50">
        <div className="container mx-auto flex flex-wrap justify-between items-center gap-4">
          <Link to="/dashboard" className="text-xl font-bold flex items-center gap-2 hover:text-gray-300 transition-colors no-underline text-white">
            <i className="bi bi-journal-check text-[#3498db]"></i> Assignment Service
          </Link>
          <div className="flex items-center gap-4 ml-auto">
            <div className="relative hidden sm:block">
              {user.profilePicture ? (
                <img src={user.profilePicture} alt="Profile" className="w-8 h-8 rounded-full object-cover border border-white" />
              ) : (
                <i className="bi bi-person-circle text-[30px] text-white/90"></i>
              )}
              {user.isOnline && <div className="absolute bottom-0.5 right-0.5 w-2.5 h-2.5 bg-[#28a745] rounded-full border-2 border-[#212529]"></div>}
            </div>
            <span className="hidden md:inline font-medium">Welcome, {user.fullName}</span>
            <Link to="/dashboard" className="border border-white/30 px-3 py-1.5 rounded hover:bg-white hover:text-black transition-all font-bold text-sm flex items-center gap-2 text-white no-underline">
              <i className="bi bi-speedometer2"></i> <span className="hidden sm:inline">Dashboard</span>
            </Link>
            <Link to="/login?logout=true" className="bg-[#dc3545] hover:bg-[#c82333] px-3 py-1.5 rounded transition-all font-bold text-sm flex items-center gap-2 text-white no-underline border border-transparent">
              <i className="bi bi-box-arrow-right"></i> <span className="hidden sm:inline">Logout</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 flex-1 max-w-6xl">
        
        <div className="mb-6 animate-fadeInDown">
          <Link to="/dashboard" className="inline-flex items-center gap-2 bg-white border-2 border-[#667eea] text-[#667eea] px-6 py-2.5 rounded-xl font-bold hover:bg-[#667eea] hover:text-white hover:-translate-y-1 hover:shadow-lg transition-all no-underline relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-[#667eea] to-[#764ba2] opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
            <i className="bi bi-arrow-left"></i> Back to Dashboard
          </Link>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* Left Column: Form & Guidelines */}
          <div className="w-full lg:w-7/12 xl:w-2/3">
            
            {/* Form Card */}
            <div className="bg-white rounded-[25px] shadow-[0_10px_40px_rgba(0,0,0,0.12)] overflow-hidden mb-6 animate-fadeInUp">
              <div className="bg-gradient-to-r from-[#667eea] to-[#764ba2] p-8 text-white flex items-center gap-4 relative overflow-hidden">
                <div className="absolute top-[-50%] right-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle,rgba(255,255,255,0.1)_0%,transparent_70%)] animate-spin-slow"></div>
                <i className="bi bi-chat-left-text text-5xl animate-bounce-slow relative z-10"></i>
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold m-0">We Value Your Opinion</h3>
                  <p className="m-0 text-white/80">How would you rate your overall experience?</p>
                </div>
              </div>

              <div className="p-8 md:p-10">
                {successMsg && (
                  <div className="bg-[#d4edda] text-[#155724] border-l-4 border-[#28a745] p-4 rounded-lg mb-6 flex items-center gap-3 animate-fadeIn">
                    <i className="bi bi-check-circle-fill text-xl"></i>
                    <span className="font-medium">{successMsg}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  
                  {/* Rating Stars */}
                  <div className="mb-10 text-center">
                    <label className="block text-xl font-bold text-gray-800 mb-6 flex items-center justify-center gap-2">
                      <i className="bi bi-star-fill text-yellow-400 animate-pulse-slow"></i> Rate Your Experience <span className="text-red-500">*</span>
                    </label>
                    <div className="flex flex-row-reverse justify-center gap-2 drop-shadow-md">
                      {[5, 4, 3, 2, 1].map((star) => (
                        <React.Fragment key={star}>
                          <input type="radio" id={`star${star}`} name="rating" value={star} className="hidden" onChange={() => setRating(star)} />
                          <label 
                            htmlFor={`star${star}`} 
                            onMouseEnter={() => setHoveredRating(star)}
                            onMouseLeave={() => setHoveredRating(0)}
                            className={`text-5xl cursor-pointer transition-all duration-300 hover:scale-125 hover:rotate-12 ${star <= (hoveredRating || rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                            title={star === 5 ? 'Excellent' : star === 4 ? 'Very Good' : star === 3 ? 'Good' : star === 2 ? 'Fair' : 'Poor'}
                          >
                            <i className="bi bi-star-fill"></i>
                          </label>
                        </React.Fragment>
                      ))}
                    </div>
                    <p className="text-gray-500 mt-4 text-sm font-medium">Select your rating from 1 (Poor) to 5 (Excellent)</p>
                  </div>

                  {/* Feedback Textarea */}
                  <div className="mb-8">
                    <label htmlFor="message" className="block text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <i className="bi bi-pencil-square text-[#17a2b8]"></i> Kindly take a moment to tell us what you think <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <textarea 
                        id="message" 
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Share your thoughts in detail..."
                        maxLength="500"
                        required
                        className="w-full p-5 border-4 border-gray-100 rounded-2xl bg-gradient-to-br from-white to-gray-50 focus:border-[#667eea] focus:ring-4 focus:ring-blue-500/20 focus:bg-white outline-none transition-all resize-none h-[150px] text-lg font-medium text-gray-700 shadow-inner"
                      ></textarea>
                      <div className="flex justify-end mt-2">
                        <span className={`text-sm font-bold transition-colors ${message.length > 450 ? 'text-red-500' : message.length > 400 ? 'text-yellow-500' : 'text-gray-400'}`}>
                          {message.length}/500 characters
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-center mt-10">
                    <button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white font-black uppercase tracking-wider py-4 px-10 rounded-full shadow-[0_8px_25px_rgba(102,126,234,0.4)] hover:-translate-y-1.5 hover:shadow-[0_15px_40px_rgba(102,126,234,0.5)] active:translate-y-0 transition-all duration-300 w-full sm:w-auto min-w-[250px] flex items-center justify-center gap-3 disabled:opacity-70 disabled:hover:translate-y-0"
                    >
                      {isSubmitting ? (
                        <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-5 h-5 block"></span>
                      ) : (
                        <><i className="bi bi-send-check text-xl"></i> Share My Feedback</>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Guidelines Card */}
            <div className="bg-white rounded-[20px] shadow-[0_5px_20px_rgba(0,0,0,0.08)] overflow-hidden animate-fadeInUp" style={{animationDelay: '0.2s'}}>
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 border-b-4 border-gray-200 p-5">
                <h5 className="font-bold text-gray-800 m-0 flex items-center gap-2">
                  <i className="bi bi-lightbulb text-yellow-400 text-xl animate-glow"></i> Feedback Guidelines
                </h5>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { icon: 'bi-check-circle-fill', color: 'text-green-500', title: 'Be Specific', desc: 'Mention specific features or services you liked.' },
                    { icon: 'bi-clock-fill', color: 'text-blue-500', title: 'Recent Experience', desc: 'Share feedback based on your most recent experience.' },
                    { icon: 'bi-heart-fill', color: 'text-red-500', title: 'Constructive Feedback', desc: 'Focus on how we can improve.', animate: 'animate-heartbeat' },
                    { icon: 'bi-patch-check-fill', color: 'text-[#3498db]', title: 'Be Honest', desc: 'Your genuine opinion helps us serve you better.' }
                  ].map((guide, idx) => (
                    <div key={idx} className="bg-gradient-to-br from-white to-gray-50 border-2 border-transparent hover:border-[#667eea] rounded-2xl p-5 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 shadow-sm hover:shadow-md hover:translate-x-1 hover:bg-white transition-all group">
                      <i className={`bi ${guide.icon} text-3xl ${guide.color} ${guide.animate || ''} group-hover:rotate-[360deg] group-hover:scale-110 transition-all duration-500`}></i>
                      <div>
                        <h6 className="font-bold text-gray-800 mb-1">{guide.title}</h6>
                        <p className="text-sm text-gray-500 m-0 leading-snug">{guide.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Past Feedbacks */}
          <div className="w-full lg:w-5/12 xl:w-1/3">
            <div className="bg-white rounded-[25px] shadow-[0_10px_40px_rgba(0,0,0,0.12)] overflow-hidden lg:sticky lg:top-[100px] animate-fadeInRight" style={{animationDelay: '0.4s'}}>
              <div className="bg-gradient-to-br from-[#36b9cc] to-[#258391] p-6 text-white">
                <h4 className="font-bold m-0 flex items-center gap-2">
                  <i className="bi bi-chat-dots"></i> Recent Feedbacks
                </h4>
              </div>
              <div className="p-6">
                
                {pastFeedbacks.length > 0 ? (
                  <div className="space-y-4">
                    {pastFeedbacks.map((fb, idx) => (
                      <div key={fb.id} className="bg-gradient-to-br from-white to-gray-50 border-2 border-gray-100 rounded-2xl p-5 relative overflow-hidden group hover:-translate-y-1 hover:border-[#667eea] hover:bg-white hover:shadow-md transition-all animate-fadeInUp" style={{animationDelay: `${0.5 + (idx * 0.1)}s`}}>
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#667eea] to-[#764ba2] scale-y-0 group-hover:scale-y-100 transition-transform origin-top"></div>
                        
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white flex items-center justify-center shadow-sm">
                              <i className="bi bi-person-circle text-xl"></i>
                            </div>
                            <div>
                              <h6 className="font-bold text-gray-800 m-0 text-sm">{fb.user.fullName}</h6>
                              <span className="text-[10px] text-gray-400 font-medium">{fb.createdAt}</span>
                            </div>
                          </div>
                          <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs font-bold shadow-sm flex items-center gap-1 border border-yellow-200">
                            <i className="bi bi-star-fill text-yellow-500"></i> {fb.rating}/5
                          </span>
                        </div>
                        
                        <p className="text-gray-600 text-sm leading-relaxed m-0 italic">"{fb.message}"</p>
                      </div>
                    ))}
                    
                    <div className="text-center mt-6 pt-4 border-t border-gray-100">
                      <Link to="/feedback/all" className="inline-block border-2 border-[#667eea] text-[#667eea] font-bold px-6 py-2.5 rounded-xl uppercase tracking-wider text-xs hover:bg-gradient-to-r hover:from-[#667eea] hover:to-[#764ba2] hover:text-white hover:-translate-y-0.5 hover:shadow-md transition-all no-underline">
                        <i className="bi bi-eye mr-1"></i> View All Feedbacks
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-10 opacity-60">
                    <i className="bi bi-chat-left-dots text-6xl text-gray-300 block mb-4"></i>
                    <p className="text-gray-500 font-medium">No feedbacks yet. Be the first to share!</p>
                  </div>
                )}

              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#212529] text-white/50 text-center py-6 text-sm mt-auto">
        <p className="mb-0">&copy; 2026 Assignment Service. All rights reserved.</p>
      </footer>

      <style>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeInDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeInRight { from { opacity: 0; transform: translateX(40px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        
        .animate-fadeInUp { animation: fadeInUp 0.6s ease-out forwards; }
        .animate-fadeInDown { animation: fadeInDown 0.6s ease-out forwards; }
        .animate-fadeInRight { animation: fadeInRight 0.6s ease-out forwards; }
        .animate-fadeIn { animation: fadeIn 0.4s ease-out forwards; }

        @keyframes bounce-slow { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        .animate-bounce-slow { animation: bounce-slow 2s ease-in-out infinite; }

        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin-slow { animation: spin-slow 20s linear infinite; }

        @keyframes pulse-slow { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.1); opacity: 0.8; } }
        .animate-pulse-slow { animation: pulse-slow 2s ease-in-out infinite; }

        @keyframes glow { 0%, 100% { filter: drop-shadow(0 0 2px #ffc107); } 50% { filter: drop-shadow(0 0 8px #ffc107); } }
        .animate-glow { animation: glow 2s ease-in-out infinite; }

        @keyframes heartbeat { 0%, 100% { transform: scale(1); } 25% { transform: scale(1.15); } 50% { transform: scale(1); } 75% { transform: scale(1.1); } }
        .animate-heartbeat { animation: heartbeat 1.5s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default SubmitFeedback;