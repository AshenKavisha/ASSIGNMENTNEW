import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  // Mock Data - (Backend එකෙන් එන දත්ත මෙතනට දාගන්න පුළුවන්)
  const [user, setUser] = useState({
    fullName: "Ashen Kaveesha",
    role: "USER", // මේක 'ADMIN' කළොත් අර Admin section එකත් පෙනෙයි
    online: true,
    profilePicture: null
  });

  const notificationCount = 3;
  const deliveredCount = 1;

  // Admin Mock Data (Admin කෙනෙක් ලොග් වුනොත් විතරක් පේන්න)
  const adminStats = {
    pending: 8,
    total: 25
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col font-sans">
      
      {/* Navbar */}
      <nav className="bg-[#212529] text-white py-3 px-6 shadow-md sticky top-0 z-50">
        <div className="container mx-auto flex flex-wrap justify-between items-center gap-4">
          <Link to="/dashboard" className="text-xl font-bold flex items-center gap-2 text-white hover:text-gray-300 transition-colors no-underline">
            <i className="bi bi-journal-check text-[#3498db]"></i> Assignment Service
          </Link>
          
          <div className="flex items-center gap-4 ml-auto">
            {/* Notification Bell */}
            <Link to="/notifications" className="relative cursor-pointer text-white hover:text-gray-300">
              <i className="bi bi-bell text-xl"></i>
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-2 w-4 h-4 bg-[#dc3545] rounded-full text-[9px] font-bold flex items-center justify-center animate-pulse-danger shadow-sm border border-[#212529]">
                  {notificationCount}
                </span>
              )}
            </Link>

            {/* Profile Picture / Indicator */}
            <Link to="/profile" className="relative block">
              {user.profilePicture ? (
                <img src={`data:image/jpeg;base64,${user.profilePicture}`} alt="Profile" className="w-10 h-10 rounded-full object-cover border-2 border-white" />
              ) : (
                <i className="bi bi-person-circle text-[40px] text-white/90"></i>
              )}
              {user.online && (
                <div className="absolute bottom-0.5 right-0.5 w-3 h-3 bg-[#28a745] rounded-full border-2 border-[#212529]"></div>
              )}
            </Link>

            <span className="hidden md:block font-medium">
              Welcome, {user.fullName}
            </span>

            <Link to="/profile" className="hidden sm:flex border border-white/30 px-3 py-1.5 rounded hover:bg-white hover:text-black transition-all font-bold text-sm items-center gap-2 text-white no-underline">
              <i className="bi bi-person"></i> Profile
            </Link>
            
            <Link to="/login?logout=true" className="bg-[#dc3545] hover:bg-[#c82333] px-3 py-1.5 rounded transition-all font-bold text-sm flex items-center gap-2 text-white no-underline border border-transparent">
              <i className="bi bi-box-arrow-right"></i> <span className="hidden sm:inline">Logout</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 flex-1 max-w-6xl">
        
        {/* Welcome Card */}
        <div className="bg-gradient-to-br from-[#3498db] to-[#2980b9] rounded-[15px] p-8 text-white shadow-md mb-8 animate-fadeInDown">
          <h1 className="text-3xl font-bold flex items-center gap-3 mb-2">
            <i className="bi bi-speedometer2 text-white/80"></i> Dashboard
          </h1>
          <p className="text-lg text-white/90 m-0">
            Hello, <strong className="text-white">{user.fullName}</strong>! Manage your assignments and track their progress here.
          </p>
        </div>

        {/* Notification Alert for Delivered Solutions */}
        {deliveredCount > 0 && (
          <div className="bg-[#d1e7dd] border border-[#badbcc] text-[#0f5132] p-4 rounded-xl mb-8 flex justify-between items-start animate-fadeIn">
            <div>
              <h5 className="font-bold flex items-center gap-2 mb-1">
                <i className="bi bi-envelope-check text-xl"></i> New Solutions Available!
              </h5>
              <p className="m-0 text-sm">You have <strong>{deliveredCount}</strong> assignment solution(s) delivered. Please check your email inbox for attachments or view them in your assignments.</p>
            </div>
          </div>
        )}

        {/* Quick Actions (WITH FEEDBACK) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 animate-fadeInUp">
          {/* New Assignment */}
          <div className="bg-white rounded-[15px] p-8 text-center shadow-sm hover:shadow-[0_10px_25px_rgba(0,0,0,0.1)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col h-full border border-gray-100">
            <i className="bi bi-plus-circle text-[3rem] text-[#3498db] mb-4"></i>
            <h5 className="font-bold text-gray-800 text-xl mb-2">New Assignment</h5>
            <p className="text-gray-500 mb-6 flex-1">Submit a new assignment request for IT or QS subjects.</p>
            <Link to="/assignments/create" className="bg-gradient-to-r from-[#3498db] to-[#2980b9] text-white font-bold py-2.5 px-6 rounded-[10px] hover:shadow-lg transition-all inline-flex items-center justify-center gap-2 w-full no-underline">
              <i className="bi bi-plus-lg"></i> Get Started
            </Link>
          </div>

          {/* My Assignments */}
          <div className="bg-white rounded-[15px] p-8 text-center shadow-sm hover:shadow-[0_10px_25px_rgba(0,0,0,0.1)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col h-full border border-gray-100">
            <i className="bi bi-list-task text-[3rem] text-[#27ae60] mb-4"></i>
            <h5 className="font-bold text-gray-800 text-xl mb-2">My Assignments</h5>
            <p className="text-gray-500 mb-6 flex-1">View the status and details of all your submitted assignments.</p>
            <Link to="/assignments/my-assignments" className="bg-gradient-to-r from-[#27ae60] to-[#219652] text-white font-bold py-2.5 px-6 rounded-[10px] hover:shadow-lg transition-all inline-flex items-center justify-center gap-2 w-full no-underline">
              <i className="bi bi-eye"></i> View All
            </Link>
          </div>

          {/* Feedback */}
          <div className="bg-white rounded-[15px] p-8 text-center shadow-sm hover:shadow-[0_10px_25px_rgba(0,0,0,0.1)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col h-full border border-gray-100">
            <i className="bi bi-chat-left-text text-[3rem] text-[#17a2b8] mb-4"></i>
            <h5 className="font-bold text-gray-800 text-xl mb-2">Feedback</h5>
            <p className="text-gray-500 mb-6 flex-1">Share your experience with our services to help us improve.</p>
            <Link to="/feedback/submit" className="bg-gradient-to-r from-[#17a2b8] to-[#138496] text-white font-bold py-2.5 px-6 rounded-[10px] hover:shadow-lg transition-all inline-flex items-center justify-center gap-2 w-full no-underline">
              <i className="bi bi-chat-dots"></i> Give Feedback
            </Link>
          </div>
        </div>

        {/* Admin Dashboard Section (Visible only if user is ADMIN) */}
        {user.role === 'ADMIN' && (
          <div className="bg-white rounded-[15px] border-2 border-[#f39c12] overflow-hidden mb-10 shadow-sm animate-fadeIn">
            <div className="bg-[#f39c12] text-white p-4">
              <h4 className="m-0 font-bold flex items-center gap-2"><i className="bi bi-shield-check"></i> Admin Dashboard Overview</h4>
            </div>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 p-6 rounded-xl text-center border border-gray-200">
                <i className="bi bi-clock-history text-4xl text-[#f39c12] mb-2 block"></i>
                <h3 className="text-3xl font-black text-gray-800">{adminStats.pending}</h3>
                <p className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">Pending</p>
                <Link to="/admin/assignments/pending" className="bg-[#f39c12] text-white text-sm px-4 py-1.5 rounded font-bold hover:bg-[#d68910] transition-colors"><i className="bi bi-eye"></i> Review</Link>
              </div>
              <div className="bg-gray-50 p-6 rounded-xl text-center border border-gray-200">
                <i className="bi bi-journal-text text-4xl text-[#3498db] mb-2 block"></i>
                <h3 className="text-3xl font-black text-gray-800">{adminStats.total}</h3>
                <p className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">Total</p>
                <Link to="/admin/assignments" className="bg-[#3498db] text-white text-sm px-4 py-1.5 rounded font-bold hover:bg-[#2980b9] transition-colors"><i className="bi bi-list"></i> View All</Link>
              </div>
              <div className="bg-gray-50 p-6 rounded-xl text-center border border-gray-200">
                <i className="bi bi-people text-4xl text-[#27ae60] mb-2 block"></i>
                <h3 className="text-3xl font-black text-gray-800">-</h3>
                <p className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">Customers</p>
                <Link to="/admin/customers" className="bg-[#27ae60] text-white text-sm px-4 py-1.5 rounded font-bold hover:bg-[#219652] transition-colors"><i className="bi bi-people"></i> Profiles</Link>
              </div>
              <div className="bg-gray-50 p-6 rounded-xl text-center border border-gray-200">
                <i className="bi bi-gear text-4xl text-[#17a2b8] mb-2 block"></i>
                <h3 className="text-3xl font-black text-gray-800">-</h3>
                <p className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">System</p>
                <Link to="/admin/dashboard" className="bg-[#17a2b8] text-white text-sm px-4 py-1.5 rounded font-bold hover:bg-[#138496] transition-colors"><i className="bi bi-speedometer2"></i> Panel</Link>
              </div>
            </div>
          </div>
        )}

        {/* Assignment Types Info & Process Guide */}
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-8 mb-4">
          
          {/* Our Services */}
          <div className="bg-white rounded-[15px] shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-5 border-b border-gray-100 bg-gray-50/50">
              <h4 className="m-0 font-bold text-gray-800 flex items-center gap-2">
                <i className="bi bi-info-circle text-[#3498db]"></i> Our Services
              </h4>
            </div>
            <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h5 className="font-bold text-lg mb-4 flex items-center gap-2"><i className="bi bi-laptop text-[24px] text-[#3498db]"></i> IT Assignments</h5>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start gap-2"><i className="bi bi-check-circle-fill text-[#27ae60] mt-1"></i> Programming (Java, Python, C++, etc.)</li>
                  <li className="flex items-start gap-2"><i className="bi bi-check-circle-fill text-[#27ae60] mt-1"></i> Web Development Projects</li>
                  <li className="flex items-start gap-2"><i className="bi bi-check-circle-fill text-[#27ae60] mt-1"></i> Database Design & Implementation</li>
                  <li className="flex items-start gap-2"><i className="bi bi-check-circle-fill text-[#27ae60] mt-1"></i> Mobile App Development</li>
                  <li className="flex items-start gap-2"><i className="bi bi-check-circle-fill text-[#27ae60] mt-1"></i> Software Engineering & Networking</li>
                </ul>
              </div>
              <div>
                <h5 className="font-bold text-lg mb-4 flex items-center gap-2"><i className="bi bi-calculator text-[24px] text-[#27ae60]"></i> QS Assignments</h5>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start gap-2"><i className="bi bi-check-circle-fill text-[#27ae60] mt-1"></i> Cost Estimation & Analysis</li>
                  <li className="flex items-start gap-2"><i className="bi bi-check-circle-fill text-[#27ae60] mt-1"></i> Construction Management</li>
                  <li className="flex items-start gap-2"><i className="bi bi-check-circle-fill text-[#27ae60] mt-1"></i> Quantity Take-off</li>
                  <li className="flex items-start gap-2"><i className="bi bi-check-circle-fill text-[#27ae60] mt-1"></i> Project Planning & Scheduling</li>
                  <li className="flex items-start gap-2"><i className="bi bi-check-circle-fill text-[#27ae60] mt-1"></i> Contract Administration & Measurement</li>
                </ul>
              </div>
            </div>
          </div>

          {/* How It Works */}
          <div className="bg-white rounded-[15px] shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-5 border-b border-gray-100 bg-gray-50/50">
              <h4 className="m-0 font-bold text-gray-800 flex items-center gap-2">
                <i className="bi bi-question-circle text-[#3498db]"></i> How It Works
              </h4>
            </div>
            <div className="p-6 md:p-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-center">
                
                <div className="border-2 border-gray-100 rounded-xl p-5 hover:scale-105 hover:border-blue-200 hover:shadow-md transition-all duration-300">
                  <div className="w-14 h-14 bg-[#3498db] text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4 shadow-sm">1</div>
                  <h6 className="font-bold text-gray-800 text-lg mb-2">Submit Request</h6>
                  <p className="text-gray-500 text-sm leading-relaxed mb-0">Fill out the assignment form with all your requirements.</p>
                </div>
                
                <div className="border-2 border-gray-100 rounded-xl p-5 hover:scale-105 hover:border-yellow-200 hover:shadow-md transition-all duration-300">
                  <div className="w-14 h-14 bg-[#f39c12] text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4 shadow-sm">2</div>
                  <h6 className="font-bold text-gray-800 text-lg mb-2">Admin Review</h6>
                  <p className="text-gray-500 text-sm leading-relaxed mb-0">We review your requirements and calculate a quote.</p>
                </div>
                
                <div className="border-2 border-gray-100 rounded-xl p-5 hover:scale-105 hover:border-green-200 hover:shadow-md transition-all duration-300">
                  <div className="w-14 h-14 bg-[#27ae60] text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4 shadow-sm">3</div>
                  <h6 className="font-bold text-gray-800 text-lg mb-2">Get Approval</h6>
                  <p className="text-gray-500 text-sm leading-relaxed mb-0">Receive approval, final price quote, and deadline.</p>
                </div>
                
                <div className="border-2 border-gray-100 rounded-xl p-5 hover:scale-105 hover:border-cyan-200 hover:shadow-md transition-all duration-300">
                  <div className="w-14 h-14 bg-[#17a2b8] text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4 shadow-sm">4</div>
                  <h6 className="font-bold text-gray-800 text-lg mb-2">Make Payment</h6>
                  <p className="text-gray-500 text-sm leading-relaxed mb-0">Complete the payment to start work immediately.</p>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#212529] text-white/50 text-center py-6 text-sm mt-auto border-t border-white/10">
        <p className="mb-0">&copy; 2026 Assignment Service. All rights reserved.</p>
      </footer>

      <style>{`
        @keyframes fadeInDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        
        .animate-fadeInDown { animation: fadeInDown 0.5s ease-out forwards; }
        .animate-fadeInUp { animation: fadeInUp 0.5s ease-out forwards; }
        .animate-fadeIn { animation: fadeIn 0.4s ease-out forwards; }
        
        @keyframes pulse-danger { 
          0% { box-shadow: 0 0 0 0 rgba(220, 53, 69, 0.7); } 
          70% { box-shadow: 0 0 0 6px rgba(220, 53, 69, 0); } 
          100% { box-shadow: 0 0 0 0 rgba(220, 53, 69, 0); } 
        }
        .animate-pulse-danger { animation: pulse-danger 2s infinite; }
      `}</style>
    </div>
  );
};

export default Dashboard;