import React from 'react';
import { Link } from 'react-router-dom'; // Link component eka import kala
import Sidebar from '../../components/admin/Sidebar';

const AdminDashboard = () => {
  // Backend eka connect karana kan me mock data thiyagamu
  const stats = {
    totalAssignments: 25,
    pendingCount: 8,
    inProgressCount: 12,
    completedCount: 5
  };

  const pendingAssignments = [
    { id: 1, title: "Java OOP Assignment", fullName: "Ashen Kaveesha", type: "IT", subject: "Object Oriented Programming", deadline: "2026-03-05", createdAt: "2026-03-01" },
    { id: 2, title: "Construction Measurement", fullName: "Pathum Madhusanka", type: "QS", subject: "Quantity Surveying", deadline: "2026-03-10", createdAt: "2026-02-28" },
  ];

  return (
    <div className="flex min-h-screen bg-[#f5f7fa]">
      {/* --- SIDEBAR --- */}
      <Sidebar />

      {/* --- MAIN CONTENT AREA --- */}
      <div className="flex-1 ml-64 pb-12 font-sans overflow-x-hidden">
        <div className="container mx-auto px-6 mt-8">
          
          {/* Admin Header */}
          <div className="relative overflow-hidden bg-gradient-to-br from-[#667eea] to-[#764ba2] rounded-[20px] p-10 shadow-[0_10px_40px_rgba(102,126,234,0.4)] text-white mb-8 animate-fadeInDown">
            <div className="absolute -top-1/2 -right-10 w-[400px] h-[400px] bg-white/10 rounded-full animate-float"></div>
            <div className="absolute -bottom-[30%] -left-[5%] w-[300px] h-[300px] bg-white/08 rounded-full animate-float-reverse"></div>

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between">
              <div className="mb-6 md:mb-0">
                <h1 className="text-4xl md:text-5xl font-extrabold flex items-center gap-4 drop-shadow-md">
                  <i className="bi bi-shield-check animate-bounce-slow"></i>Admin Dashboard
                </h1>
                <p className="text-lg text-white/95 mt-2">Manage assignments and monitor system activity</p>
              </div>

              {/* User Info Card */}
              <div className="bg-white text-gray-800 rounded-[15px] p-6 shadow-lg transition-all duration-300 hover:scale-105 group min-w-[250px]">
                <small className="text-gray-500 block mb-1 uppercase tracking-wider text-xs font-bold">Logged in as</small>
                <div className="font-bold text-xl text-[#2c3e50]">Admin User</div>
                <small className="text-gray-500 flex items-center gap-1">
                  <i className="bi bi-shield-check text-green-500"></i> Administrator
                </small>
              </div>
            </div>
          </div>

          {/* Quick Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="bg-gradient-to-br from-[#007bff] to-[#0056b3] rounded-[20px] p-8 text-white shadow-lg transition-all duration-400 hover:-translate-y-4 hover:scale-105 hover:shadow-2xl group animate-fadeInUp">
              <div className="text-center relative z-10">
                <i className="bi bi-journal-text text-5xl mb-4 block group-hover:scale-125 group-hover:rotate-12 transition-transform duration-400"></i>
                <h2 className="text-5xl font-extrabold mb-2 drop-shadow-sm">{stats.totalAssignments}</h2>
                <p className="font-semibold uppercase tracking-widest text-xs">Total Assignments</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#ffc107] to-[#ff9800] rounded-[20px] p-8 text-gray-900 shadow-lg transition-all duration-400 hover:-translate-y-4 hover:scale-105 hover:shadow-2xl group animate-fadeInUp" style={{animationDelay: '0.1s'}}>
              <div className="text-center relative z-10">
                <i className="bi bi-clock-history text-5xl mb-4 block group-hover:scale-125 group-hover:rotate-12 transition-transform duration-400"></i>
                <h2 className="text-5xl font-extrabold mb-2">{stats.pendingCount}</h2>
                <p className="font-semibold uppercase tracking-widest text-xs">Pending Review</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#17a2b8] to-[#138496] rounded-[20px] p-8 text-white shadow-lg transition-all duration-400 hover:-translate-y-4 hover:scale-105 hover:shadow-2xl group animate-fadeInUp" style={{animationDelay: '0.2s'}}>
              <div className="text-center relative z-10">
                <i className="bi bi-gear text-5xl mb-4 block group-hover:scale-125 group-hover:rotate-12 transition-transform duration-400"></i>
                <h2 className="text-5xl font-extrabold mb-2">{stats.inProgressCount}</h2>
                <p className="font-semibold uppercase tracking-widest text-xs">In Progress</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#28a745] to-[#20c997] rounded-[20px] p-8 text-white shadow-lg transition-all duration-400 hover:-translate-y-4 hover:scale-105 hover:shadow-2xl group animate-fadeInUp" style={{animationDelay: '0.3s'}}>
              <div className="text-center relative z-10">
                <i className="bi bi-check-circle text-5xl mb-4 block group-hover:scale-125 group-hover:rotate-12 transition-transform duration-400"></i>
                <h2 className="text-5xl font-extrabold mb-2">{stats.completedCount}</h2>
                <p className="font-semibold uppercase tracking-widest text-xs">Completed</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-[20px] shadow-xl overflow-hidden mb-12 animate-fadeIn">
            <div className="bg-gradient-to-r from-[#343a40] to-[#495057] p-6 text-white">
              <h4 className="text-xl font-bold flex items-center gap-2">
                <i className="bi bi-lightning-charge"></i> Quick Actions
              </h4>
            </div>
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <button className="flex flex-col items-center justify-center min-h-[180px] p-6 rounded-[15px] bg-gradient-to-br from-[#ffc107] to-[#ff9800] text-gray-900 font-bold shadow-md transition-all duration-400 hover:-translate-y-2 hover:shadow-xl group">
                  <i className="bi bi-eye text-4xl mb-2 group-hover:scale-125 transition-transform"></i>
                  <span className="text-lg">Review Pending</span>
                  <small className="opacity-80 font-medium mt-2">({stats.pendingCount} waiting)</small>
                </button>

                <button className="flex flex-col items-center justify-center min-h-[180px] p-6 rounded-[15px] bg-gradient-to-br from-[#007bff] to-[#0056b3] text-white font-bold shadow-md transition-all duration-400 hover:-translate-y-2 hover:shadow-xl group">
                  <i className="bi bi-list-ul text-4xl mb-2 group-hover:scale-125 transition-transform"></i>
                  <span className="text-lg">All Assignments</span>
                </button>

                <button className="flex flex-col items-center justify-center min-h-[180px] p-6 rounded-[15px] bg-gradient-to-br from-[#6c757d] to-[#545b62] text-white font-bold shadow-md transition-all duration-400 hover:-translate-y-2 hover:shadow-xl group">
                  <i className="bi bi-speedometer2 text-4xl mb-2 group-hover:scale-125 transition-transform"></i>
                  <span className="text-lg">User Dashboard</span>
                </button>

                <button className="flex flex-col items-center justify-center min-h-[180px] p-6 rounded-[15px] bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white font-bold shadow-md transition-all duration-400 hover:-translate-y-2 hover:shadow-xl group">
                  <i className="bi bi-bar-chart-fill text-4xl mb-2 group-hover:scale-125 transition-transform"></i>
                  <span className="text-lg">View Reports</span>
                </button>
              </div>
            </div>
          </div>

          {/* Recent Pending Table */}
          <div className="bg-white rounded-[20px] shadow-xl overflow-hidden animate-fadeIn" style={{animationDelay: '0.4s'}}>
            <div className="bg-gradient-to-r from-[#343a40] to-[#495057] p-6 text-white">
              <h4 className="text-xl font-bold flex items-center gap-2">
                <i className="bi bi-clock-history"></i> Recent Pending Assignments
              </h4>
            </div>
            <div className="p-4 md:p-8">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gradient-to-r from-[#f8f9fa] to-[#e9ecef] uppercase text-[10px] font-bold text-gray-600">
                      <th className="p-4 rounded-tl-lg">Title</th>
                      <th className="p-4">Student</th>
                      <th className="p-4 text-center">Type</th>
                      <th className="p-4">Subject</th>
                      <th className="p-4">Deadline</th>
                      <th className="p-4 text-center rounded-tr-lg">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {pendingAssignments.map((item) => (
                      <tr key={item.id} className="transition-all hover:bg-gray-50 hover:scale-[1.01]">
                        <td className="p-4 font-semibold text-[#2c3e50]">{item.title}</td>
                        <td className="p-4 text-gray-600">{item.fullName}</td>
                        <td className="p-4 text-center">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1 ${
                            item.type === 'IT' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                          }`}>
                            <i className={`bi ${item.type === 'IT' ? 'bi-laptop' : 'bi-calculator'}`}></i>
                            {item.type}
                          </span>
                        </td>
                        <td className="p-4 text-gray-600">{item.subject}</td>
                        <td className="p-4 text-red-500 font-bold">{item.deadline}</td>
                        <td className="p-4 text-center">
                          {/* ✅ FIXED: Button eka Link ekakata harawwa details page ekata yanna */}
                          <Link 
                            to={`/admin/assignments/${item.id}`} 
                            className="px-4 py-1 rounded-full border border-[#007bff] text-[#007bff] text-xs font-bold hover:bg-[#007bff] hover:text-white transition-all inline-block"
                          >
                            View
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-reverse { animation: float 8s ease-in-out infinite reverse; }
        .animate-fadeInDown { animation: fadeInDown 0.6s ease-out; }
        .animate-fadeInUp { animation: fadeInUp 0.6s ease-out forwards; }
        .animate-fadeIn { animation: fadeIn 0.8s ease-out; }
        .animate-bounce-slow { animation: bounce 2s infinite; }
      `}</style>
    </div>
  );
};

export default AdminDashboard;