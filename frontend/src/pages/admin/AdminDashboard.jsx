import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/admin/Sidebar';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ totalAssignments: 0, pendingCount: 0, inProgressCount: 0, completedCount: 0 });
  const [user, setUser] = useState({ name: 'Admin' });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch real user info
    fetch('/api/auth/me', { credentials: 'include' })
        .then(res => {
          if (!res.ok) navigate('/login');
          return res.json();
        })
        .then(data => setUser(data))
        .catch(() => navigate('/login'));

    // Fetch real admin stats
    fetch('/api/admin/stats', { credentials: 'include' })
        .then(res => {
          if (!res.ok) navigate('/login');
          return res.json();
        })
        .then(data => {
          setStats(data);
          setLoading(false);
        })
        .catch(() => navigate('/login'));
  }, []);

  // ✅ Real logout
  const handleLogout = async () => {
    try {
      await fetch('/logout', { method: 'POST', credentials: 'include' });
    } catch (e) {}
    navigate('/login?logout=true');
  };

  if (loading) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f5f7fa]">
          <div className="text-center">
            <div className="animate-spin border-4 border-purple-500 border-t-transparent rounded-full w-12 h-12 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading admin dashboard...</p>
          </div>
        </div>
    );
  }

  return (
      <div className="flex min-h-screen bg-[#f5f7fa]">
        <Sidebar onLogout={handleLogout} />

        <div className="flex-1 ml-64 pb-12 font-sans overflow-x-hidden">
          <div className="container mx-auto px-6 mt-8">

            {/* Admin Header */}
            <div className="relative overflow-hidden bg-gradient-to-br from-[#667eea] to-[#764ba2] rounded-[20px] p-10 shadow-[0_10px_40px_rgba(102,126,234,0.4)] text-white mb-8 animate-fadeInDown">
              <div className="absolute -top-1/2 -right-10 w-[400px] h-[400px] bg-white/10 rounded-full animate-float"></div>
              <div className="absolute -bottom-[30%] -left-[5%] w-[300px] h-[300px] bg-white/08 rounded-full animate-float-reverse"></div>

              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between">
                <div className="mb-6 md:mb-0">
                  <h1 className="text-4xl md:text-5xl font-extrabold flex items-center gap-4 drop-shadow-md">
                    <i className="bi bi-shield-check"></i> Admin Dashboard
                  </h1>
                  <p className="text-lg text-white/95 mt-2">Manage assignments and monitor system activity</p>
                </div>

                <div className="bg-white text-gray-800 rounded-[15px] p-6 shadow-lg min-w-[250px]">
                  <small className="text-gray-500 block mb-1 uppercase tracking-wider text-xs font-bold">Logged in as</small>
                  <div className="font-bold text-xl text-[#2c3e50]">{user.name || user.email}</div>
                  <small className="text-gray-500 flex items-center gap-1">
                    <i className="bi bi-shield-check text-green-500"></i> Administrator
                  </small>
                </div>
              </div>
            </div>

            {/* Real Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <div className="bg-gradient-to-br from-[#007bff] to-[#0056b3] rounded-[20px] p-8 text-white shadow-lg hover:-translate-y-4 hover:scale-105 hover:shadow-2xl transition-all duration-400 group animate-fadeInUp">
                <div className="text-center">
                  <i className="bi bi-journal-text text-5xl mb-4 block group-hover:scale-125 transition-transform duration-400"></i>
                  <h2 className="text-5xl font-extrabold mb-2">{stats.totalAssignments}</h2>
                  <p className="font-semibold uppercase tracking-widest text-xs">Total Assignments</p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-[#ffc107] to-[#ff9800] rounded-[20px] p-8 text-gray-900 shadow-lg hover:-translate-y-4 hover:scale-105 hover:shadow-2xl transition-all duration-400 group animate-fadeInUp">
                <div className="text-center">
                  <i className="bi bi-clock-history text-5xl mb-4 block group-hover:scale-125 transition-transform duration-400"></i>
                  <h2 className="text-5xl font-extrabold mb-2">{stats.pendingCount}</h2>
                  <p className="font-semibold uppercase tracking-widest text-xs">Pending Review</p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-[#17a2b8] to-[#138496] rounded-[20px] p-8 text-white shadow-lg hover:-translate-y-4 hover:scale-105 hover:shadow-2xl transition-all duration-400 group animate-fadeInUp">
                <div className="text-center">
                  <i className="bi bi-gear text-5xl mb-4 block group-hover:scale-125 transition-transform duration-400"></i>
                  <h2 className="text-5xl font-extrabold mb-2">{stats.inProgressCount || 0}</h2>
                  <p className="font-semibold uppercase tracking-widest text-xs">In Progress</p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-[#28a745] to-[#20c997] rounded-[20px] p-8 text-white shadow-lg hover:-translate-y-4 hover:scale-105 hover:shadow-2xl transition-all duration-400 group animate-fadeInUp">
                <div className="text-center">
                  <i className="bi bi-check-circle text-5xl mb-4 block group-hover:scale-125 transition-transform duration-400"></i>
                  <h2 className="text-5xl font-extrabold mb-2">{stats.completedCount || 0}</h2>
                  <p className="font-semibold uppercase tracking-widest text-xs">Completed</p>
                </div>
              </div>
            </div>

            {/* Quick Actions - NOW CLICKABLE with Link */}
            <div className="bg-white rounded-[20px] shadow-xl overflow-hidden mb-12 animate-fadeIn">
              <div className="bg-gradient-to-r from-[#343a40] to-[#495057] p-6 text-white">
                <h4 className="text-xl font-bold flex items-center gap-2">
                  <i className="bi bi-lightning-charge"></i> Quick Actions
                </h4>
              </div>
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Link to="/admin/assignments/pending" className="flex flex-col items-center justify-center min-h-[180px] p-6 rounded-[15px] bg-gradient-to-br from-[#ffc107] to-[#ff9800] text-gray-900 font-bold shadow-md hover:-translate-y-2 hover:shadow-xl transition-all duration-400 group no-underline">
                    <i className="bi bi-eye text-4xl mb-2 group-hover:scale-125 transition-transform"></i>
                    <span className="text-lg">Review Pending</span>
                    <small className="opacity-80 font-medium mt-2">({stats.pendingCount} waiting)</small>
                  </Link>

                  <Link to="/admin/assignments" className="flex flex-col items-center justify-center min-h-[180px] p-6 rounded-[15px] bg-gradient-to-br from-[#007bff] to-[#0056b3] text-white font-bold shadow-md hover:-translate-y-2 hover:shadow-xl transition-all duration-400 group no-underline">
                    <i className="bi bi-list-ul text-4xl mb-2 group-hover:scale-125 transition-transform"></i>
                    <span className="text-lg">All Assignments</span>
                  </Link>

                  <Link to="/dashboard" className="flex flex-col items-center justify-center min-h-[180px] p-6 rounded-[15px] bg-gradient-to-br from-[#6c757d] to-[#545b62] text-white font-bold shadow-md hover:-translate-y-2 hover:shadow-xl transition-all duration-400 group no-underline">
                    <i className="bi bi-speedometer2 text-4xl mb-2 group-hover:scale-125 transition-transform"></i>
                    <span className="text-lg">User Dashboard</span>
                  </Link>

                  <Link to="/admin/reports" className="flex flex-col items-center justify-center min-h-[180px] p-6 rounded-[15px] bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white font-bold shadow-md hover:-translate-y-2 hover:shadow-xl transition-all duration-400 group no-underline">
                    <i className="bi bi-bar-chart-fill text-4xl mb-2 group-hover:scale-125 transition-transform"></i>
                    <span className="text-lg">View Reports</span>
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>

        <style>{`
        @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-20px); } }
        @keyframes fadeInDown { from { opacity: 0; transform: translateY(-30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-reverse { animation: float 8s ease-in-out infinite reverse; }
        .animate-fadeInDown { animation: fadeInDown 0.6s ease-out; }
        .animate-fadeInUp { animation: fadeInUp 0.6s ease-out forwards; }
        .animate-fadeIn { animation: fadeIn 0.8s ease-out; }
      `}</style>
      </div>
  );
};

export default AdminDashboard;