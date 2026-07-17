import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [notificationCount, setNotificationCount] = useState(0);
  const [deliveredCount, setDeliveredCount] = useState(0);
  const [adminStats, setAdminStats] = useState({ pending: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch real dashboard data from backend
    fetch('/dashboard', {
      credentials: 'include',
    })
        .then(res => {
          if (!res.ok) {
            navigate('/login');
          }
          return res.text();
        })
        .then(html => {
          // Parse real values from backend HTML response
          const parser = new DOMParser();
          const doc = parser.parseFromString(html, 'text/html');

          // Extract data from meta tags we'll add to backend
          // For now use session-based approach
          setLoading(false);
        })
        .catch(() => navigate('/login'));

    // Fetch current user info
    fetch('/api/auth/me', {
      credentials: 'include',
    })
        .then(res => {
          if (!res.ok) navigate('/login');
          return res.json();
        })
        .then(data => {
          setUser(data);
          setNotificationCount(data.notificationCount || 0);
          setDeliveredCount(data.deliveredCount || 0);
          if (data.role === 'ADMIN') {
            setAdminStats({
              pending: data.pendingCount || 0,
              total: data.totalAssignments || 0
            });
          }
        })
        .catch(() => navigate('/login'));
  }, []);

  // ✅ Real logout function
  const handleLogout = async () => {
    try {
      await fetch('/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (e) {}
    navigate('/login?logout=true');
  };

  if (loading || !user) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa]">
          <div className="text-center">
            <div className="animate-spin border-4 border-blue-500 border-t-transparent rounded-full w-12 h-12 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading dashboard...</p>
          </div>
        </div>
    );
  }

  return (
      <div className="min-h-screen bg-[#f8f9fa] flex flex-col font-sans">

        {/* Navbar */}
        <nav className="bg-[#212529] text-white py-3 px-6 shadow-md sticky top-0 z-50">
          <div className="container mx-auto flex flex-wrap justify-between items-center gap-4">
            <Link to="/dashboard" className="text-xl font-bold flex items-center gap-2 text-white hover:text-gray-300 transition-colors no-underline">
              <i className="bi bi-journal-check text-[#3498db]"></i> Assignment Service
            </Link>

            <div className="flex items-center gap-4 ml-auto">
              <Link to="/notifications" className="relative cursor-pointer text-white hover:text-gray-300">
                <i className="bi bi-bell text-xl"></i>
                {notificationCount > 0 && (
                    <span className="absolute -top-1 -right-2 w-4 h-4 bg-[#dc3545] rounded-full text-[9px] font-bold flex items-center justify-center animate-pulse-danger shadow-sm border border-[#212529]">
                  {notificationCount}
                </span>
                )}
              </Link>

              <Link to="/profile" className="relative block">
                {user.profilePicture ? (
                    <img src={`data:image/jpeg;base64,${user.profilePicture}`} alt="Profile" className="w-10 h-10 rounded-full object-cover border-2 border-white" />
                ) : (
                    <i className="bi bi-person-circle text-[40px] text-white/90"></i>
                )}
                <div className="absolute bottom-0.5 right-0.5 w-3 h-3 bg-[#28a745] rounded-full border-2 border-[#212529]"></div>
              </Link>

              <span className="hidden md:block font-medium">
              Welcome, {user.fullName}
            </span>

              <Link to="/profile" className="hidden sm:flex border border-white/30 px-3 py-1.5 rounded hover:bg-white hover:text-black transition-all font-bold text-sm items-center gap-2 text-white no-underline">
                <i className="bi bi-person"></i> Profile
              </Link>

              {/* ✅ Real logout button */}
              <button
                  onClick={handleLogout}
                  className="bg-[#dc3545] hover:bg-[#c82333] px-3 py-1.5 rounded transition-all font-bold text-sm flex items-center gap-2 text-white border border-transparent cursor-pointer"
              >
                <i className="bi bi-box-arrow-right"></i> <span className="hidden sm:inline">Logout</span>
              </button>
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
                  <p className="m-0 text-sm">You have <strong>{deliveredCount}</strong> assignment solution(s) delivered to your email.</p>
                </div>
              </div>
          )}

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 animate-fadeInUp">
            <div className="bg-white rounded-[15px] p-8 text-center shadow-sm hover:shadow-[0_10px_25px_rgba(0,0,0,0.1)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col h-full border border-gray-100">
              <i className="bi bi-plus-circle text-[3rem] text-[#3498db] mb-4"></i>
              <h5 className="font-bold text-gray-800 text-xl mb-2">New Assignment</h5>
              <p className="text-gray-500 mb-6 flex-1">Submit a new assignment request for IT or QS subjects.</p>
              <Link to="/assignments/create" className="bg-gradient-to-r from-[#3498db] to-[#2980b9] text-white font-bold py-2.5 px-6 rounded-[10px] hover:shadow-lg transition-all inline-flex items-center justify-center gap-2 w-full no-underline">
                <i className="bi bi-plus-lg"></i> Get Started
              </Link>
            </div>

            <div className="bg-white rounded-[15px] p-8 text-center shadow-sm hover:shadow-[0_10px_25px_rgba(0,0,0,0.1)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col h-full border border-gray-100">
              <i className="bi bi-list-task text-[3rem] text-[#27ae60] mb-4"></i>
              <h5 className="font-bold text-gray-800 text-xl mb-2">My Assignments</h5>
              <p className="text-gray-500 mb-6 flex-1">View the status and details of all your submitted assignments.</p>
              <Link to="/assignments/my-assignments" className="bg-gradient-to-r from-[#27ae60] to-[#219652] text-white font-bold py-2.5 px-6 rounded-[10px] hover:shadow-lg transition-all inline-flex items-center justify-center gap-2 w-full no-underline">
                <i className="bi bi-eye"></i> View All
              </Link>
            </div>

            <div className="bg-white rounded-[15px] p-8 text-center shadow-sm hover:shadow-[0_10px_25px_rgba(0,0,0,0.1)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col h-full border border-gray-100">
              <i className="bi bi-chat-left-text text-[3rem] text-[#17a2b8] mb-4"></i>
              <h5 className="font-bold text-gray-800 text-xl mb-2">Feedback</h5>
              <p className="text-gray-500 mb-6 flex-1">Share your experience with our services to help us improve.</p>
              <Link to="/feedback/submit" className="bg-gradient-to-r from-[#17a2b8] to-[#138496] text-white font-bold py-2.5 px-6 rounded-[10px] hover:shadow-lg transition-all inline-flex items-center justify-center gap-2 w-full no-underline">
                <i className="bi bi-chat-dots"></i> Give Feedback
              </Link>
            </div>
          </div>

          {/* Admin Section */}
          {user.role === 'ADMIN' && (
              <div className="bg-white rounded-[15px] shadow-sm border border-gray-100 p-6 mb-8">
                <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <i className="bi bi-shield-check text-[#dc3545]"></i> Admin Panel
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gray-50 p-6 rounded-xl text-center border border-gray-200">
                    <i className="bi bi-hourglass text-4xl text-[#f39c12] mb-2 block"></i>
                    <h3 className="text-3xl font-black text-gray-800">{adminStats.pending}</h3>
                    <p className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">Pending</p>
                    <Link to="/admin/assignments/pending" className="bg-[#f39c12] text-white text-sm px-4 py-1.5 rounded font-bold hover:bg-[#e67e22] transition-colors">Review</Link>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-xl text-center border border-gray-200">
                    <i className="bi bi-journal-text text-4xl text-[#3498db] mb-2 block"></i>
                    <h3 className="text-3xl font-black text-gray-800">{adminStats.total}</h3>
                    <p className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">Total</p>
                    <Link to="/admin/assignments" className="bg-[#3498db] text-white text-sm px-4 py-1.5 rounded font-bold hover:bg-[#2980b9] transition-colors">View All</Link>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-xl text-center border border-gray-200">
                    <i className="bi bi-people text-4xl text-[#27ae60] mb-2 block"></i>
                    <h3 className="text-3xl font-black text-gray-800">-</h3>
                    <p className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">Customers</p>
                    <Link to="/admin/customers" className="bg-[#27ae60] text-white text-sm px-4 py-1.5 rounded font-bold hover:bg-[#219652] transition-colors">Profiles</Link>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-xl text-center border border-gray-200">
                    <i className="bi bi-gear text-4xl text-[#17a2b8] mb-2 block"></i>
                    <h3 className="text-3xl font-black text-gray-800">-</h3>
                    <p className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">System</p>
                    <Link to="/admin/dashboard" className="bg-[#17a2b8] text-white text-sm px-4 py-1.5 rounded font-bold hover:bg-[#138496] transition-colors">Panel</Link>
                  </div>
                </div>
              </div>
          )}

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