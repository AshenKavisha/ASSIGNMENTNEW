import React from 'react';
import { Link } from 'react-router-dom';

const AllFeedbacks = () => {
  
  // Mock Data
  const feedbacks = [
    { id: 1, user: { fullName: "Sarah Johnson" }, rating: 5, message: "Excellent service! They helped me with my Java programming assignment and delivered it before the deadline. The code was well-structured and thoroughly commented. Highly recommend for any IT student!", createdAt: "December 20, 2025" },
    { id: 2, user: { fullName: "Michael Chen" }, rating: 5, message: "Got help with my quantity surveying cost estimation project. The calculations were accurate and the report was professionally formatted. They really understand construction management!", createdAt: "December 18, 2025" },
    { id: 3, user: { fullName: "Emma Williams" }, rating: 4, message: "Amazing experience! The team was very responsive and made revisions based on my feedback. My web development project scored an A+. Will definitely use their services again!", createdAt: "December 15, 2025" },
    { id: 4, user: { fullName: "David Smith" }, rating: 5, message: "Very fast and reliable. The database design assignment was perfectly executed with proper normalization.", createdAt: "December 10, 2025" },
    { id: 5, user: { fullName: "Aisha Patel" }, rating: 4, message: "Good work on the networking assignment. Could have included more diagrams, but overall very satisfied with the content quality.", createdAt: "December 05, 2025" }
  ];

  // Calculate Average Rating
  const averageRating = feedbacks.length > 0 
    ? (feedbacks.reduce((acc, curr) => acc + curr.rating, 0) / feedbacks.length).toFixed(1) 
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5f7fa] to-[#c3cfe2] font-sans flex flex-col">
      
      {/* Public Navbar (Can be accessed by anyone) */}
      <nav className="bg-white/10 backdrop-blur-md border-b border-white/20 text-gray-800 py-4 px-6 sticky top-0 z-50 bg-[#212529]">
        <div className="container mx-auto flex flex-wrap justify-between items-center gap-4">
          <Link to="/" className="text-2xl font-black flex items-center gap-2 text-white hover:text-gray-200 transition-colors no-underline">
            <i className="bi bi-journal-check text-white"></i> AssignmentService
          </Link>
          <div className="flex items-center gap-6 font-bold text-sm">
            <Link to="/" className="text-white/80 hover:text-white transition-colors no-underline">Home</Link>
            <Link to="/about" className="text-white/80 hover:text-white transition-colors no-underline">About</Link>
            <Link to="/contact" className="text-white/80 hover:text-white transition-colors no-underline">Contact</Link>
            <Link to="/login" className="bg-white text-[#667eea] px-5 py-2 rounded-xl hover:shadow-lg transition-all ml-2 no-underline">Login</Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 flex-1 max-w-5xl">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12 animate-fadeInDown">
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-extrabold text-[#2c2f48] drop-shadow-sm mb-3 flex items-center justify-center md:justify-start gap-3">
              <i className="bi bi-chat-left-text text-[#3498db] animate-bounce-slow"></i> Student Feedback
            </h1>
            <p className="text-lg text-gray-600 m-0">See what our students are saying about their experience</p>
          </div>
          
          <Link to="/feedback/submit" className="bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white font-bold px-8 py-4 rounded-2xl shadow-[0_8px_20px_rgba(102,126,234,0.3)] hover:-translate-y-1.5 hover:shadow-[0_15px_35px_rgba(102,126,234,0.4)] transition-all uppercase tracking-wider text-sm flex items-center gap-2 group no-underline relative overflow-hidden">
            <div className="absolute inset-0 bg-white/20 scale-0 rounded-full group-hover:scale-[3] transition-transform duration-500 ease-out origin-center"></div>
            <i className="bi bi-plus-circle text-lg relative z-10"></i> <span className="relative z-10">Add Feedback</span>
          </Link>
        </div>

        {/* Average Rating Card */}
        {feedbacks.length > 0 && (
          <div className="mb-12 animate-fadeInUp">
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-[25px] p-10 text-center shadow-[0_10px_40px_rgba(0,0,0,0.08)] border-2 border-white relative overflow-hidden group">
              <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle,rgba(102,126,234,0.05)_0%,transparent_70%)] animate-spin-slow"></div>
              <div className="relative z-10">
                <div className="mb-6 flex justify-center items-end gap-2 text-[#667eea]">
                  <span className="text-[5rem] md:text-[6rem] font-black leading-none bg-clip-text text-transparent bg-gradient-to-r from-[#667eea] to-[#764ba2]">{averageRating}</span>
                  <span className="text-3xl text-gray-400 font-bold mb-3">/5.0</span>
                </div>
                
                <div className="flex justify-center gap-2 mb-6">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <i key={star} className={`bi bi-star-fill text-4xl ${star <= Math.round(averageRating) ? 'text-yellow-400 drop-shadow-md animate-pulse-star' : 'text-gray-200'}`} style={{animationDelay: `${star * 0.1}s`}}></i>
                  ))}
                </div>

                <p className="text-xl text-gray-500 m-0 font-medium flex items-center justify-center gap-2">
                  <i className="bi bi-people-fill text-[#3498db]"></i> Based on <strong className="text-gray-800 text-2xl">{feedbacks.length}</strong> student reviews
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Feedbacks List */}
        {feedbacks.length > 0 ? (
          <div>
            <div className="mb-8 animate-fadeInUp" style={{animationDelay: '0.1s'}}>
              <h3 className="text-2xl font-bold text-[#2c2f48] m-0 flex items-center gap-2">
                <i className="bi bi-chat-dots text-[#3498db]"></i> All Reviews 
                <span className="bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white text-sm px-3 py-1 rounded-full shadow-md">{feedbacks.length}</span>
              </h3>
              <p className="text-gray-500 mt-2 m-0">Real feedback from our students</p>
            </div>

            <div className="space-y-6">
              {feedbacks.map((feedback, index) => (
                <div key={feedback.id} className="bg-white rounded-[20px] p-6 md:p-8 shadow-sm hover:shadow-[0_15px_40px_rgba(102,126,234,0.15)] hover:-translate-y-2 transition-all duration-400 border border-gray-100 relative overflow-hidden group animate-fadeInUp" style={{ animationDelay: `${(index * 0.1) + 0.2}s` }}>
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-[#667eea] to-[#764ba2] scale-y-0 group-hover:scale-y-100 transition-transform origin-top"></div>
                  
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white flex items-center justify-center text-3xl shadow-lg group-hover:rotate-12 group-hover:scale-110 transition-transform">
                         <i className="bi bi-person-circle"></i>
                      </div>
                      <div>
                        <h5 className="font-bold text-[#2c2f48] text-lg mb-1">{feedback.user.fullName}</h5>
                        <small className="text-gray-500 flex items-center gap-1 font-medium"><i className="bi bi-calendar3"></i> {feedback.createdAt}</small>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full font-bold shadow-[0_4px_12px_rgba(255,193,7,0.4)] border border-white/50 flex items-center gap-1 self-start sm:self-auto">
                      <i className="bi bi-star-fill"></i> {feedback.rating}/5
                    </div>
                  </div>

                  <div className="flex gap-1 mb-4 text-2xl">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <i key={star} className={`bi ${star <= feedback.rating ? 'bi-star-fill text-yellow-400 drop-shadow-sm' : 'bi-star text-gray-200'}`}></i>
                    ))}
                  </div>

                  <div className="bg-gray-50 border-l-4 border-[#667eea] p-5 rounded-r-xl">
                    <p className="text-gray-700 text-lg leading-relaxed m-0 italic">"{feedback.message}"</p>
                  </div>
                  
                  <div className="mt-5 pt-4 border-t border-gray-100">
                    <span className="inline-flex items-center gap-2 bg-[#d4edda] text-[#155724] px-4 py-1.5 rounded-full text-sm font-bold border border-[#28a745]">
                      <i className="bi bi-patch-check-fill text-[#28a745] text-lg"></i> Verified Student
                    </span>
                  </div>

                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-[25px] p-12 text-center shadow-lg border border-gray-100 animate-fadeIn">
            <i className="bi bi-chat-square-text text-[6rem] text-gray-300 block mb-6 animate-bounce-slow"></i>
            <h2 className="text-3xl font-bold text-[#2c2f48] mb-4">No Feedback Yet</h2>
            <p className="text-gray-500 text-lg mb-8">Be the first to share your experience with our service.</p>
            <Link to="/feedback/submit" className="bg-[#3498db] text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-[#2980b9] transition-colors inline-flex items-center gap-2 no-underline shadow-md">
              <i className="bi bi-plus-circle"></i> Share Your Feedback
            </Link>
          </div>
        )}

      </div>

      {/* Footer */}
      <footer className="bg-[#212529] text-white/50 text-center py-8 text-sm mt-auto">
        <p className="mb-0">&copy; 2026 Assignment Service. All rights reserved.</p>
      </footer>

      <style>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeInDown { from { opacity: 0; transform: translateY(-30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        
        .animate-fadeInUp { animation: fadeInUp 0.6s ease-out forwards; }
        .animate-fadeInDown { animation: fadeInDown 0.6s ease-out forwards; }
        .animate-fadeIn { animation: fadeIn 0.8s ease-out forwards; }

        @keyframes bounce-slow { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        .animate-bounce-slow { animation: bounce-slow 2s ease-in-out infinite; }

        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin-slow { animation: spin-slow 20s linear infinite; }

        @keyframes pulse-star { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.1); opacity: 0.8; } }
        .animate-pulse-star { animation: pulse-star 2s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default AllFeedbacks;