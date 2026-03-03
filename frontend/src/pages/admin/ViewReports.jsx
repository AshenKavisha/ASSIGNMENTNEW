import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/admin/Sidebar';

const ViewReports = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [days, setDays] = useState(7);

  // Mock Data (Backend connect karanakam thiyagamu)
  const stats = { completed: 45, inProgress: 12, pending: 8 };
  const revenueData = { itRevenue: 1250, qsRevenue: 980, totalRevenue: 2230 };
  
  const recentAssignments = [
    { title: "Java OOP Assignment", student: "Ashen Kaveesha", type: "IT", status: "COMPLETED", date: "Mar 01, 2026" },
    { title: "Construction Measurement", student: "Pathum Madhusanka", type: "QS", status: "IN_PROGRESS", date: "Feb 28, 2026" },
  ];

  const topUsers = [
    { fullName: "Ashen Kaveesha", email: "ashen@example.com", assignments: 5, completed: 4, lastActive: "Mar 01, 2026" },
    { fullName: "Nimal Perera", email: "nimal@example.com", assignments: 3, completed: 3, lastActive: "Feb 25, 2026" },
  ];

  return (
    <div className="flex min-h-screen bg-[#f5f7fa]">
      <Sidebar />

      <div className="flex-1 ml-64 pb-12 font-sans overflow-x-hidden">
        <div className="container mx-auto px-6 mt-8">
          
          {/* Page Header */}
          <div className="relative overflow-hidden bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white p-8 rounded-[15px] mb-8 shadow-[0_8px_30px_rgba(102,126,234,0.4)] animate-fadeIn">
            <div className="absolute -top-[100px] -right-[100px] w-[300px] h-[300px] bg-white/10 rounded-full"></div>
            <div className="absolute -bottom-[80px] -left-[80px] w-[250px] h-[250px] bg-white/08 rounded-full"></div>

            <div className="relative z-10 flex justify-between items-center flex-wrap">
              <div className="mb-3 md:mb-0">
                <h1 className="text-4xl font-extrabold flex items-center drop-shadow-md">
                  <i className="bi bi-bar-chart me-3"></i>System Reports
                </h1>
                <p className="text-white/95 text-lg">Analytics and performance metrics</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-white border-2 border-white/30 rounded-xl px-4 py-2 shadow-lg transition-all hover:-translate-y-1">
                  <i className="bi bi-calendar text-[#667eea] mr-2"></i>
                  <select 
                    className="border-none font-bold text-gray-700 focus:outline-none cursor-pointer"
                    value={days}
                    onChange={(e) => setDays(e.target.value)}
                  >
                    <option value="7">Last 7 days</option>
                    <option value="30">Last 30 days</option>
                    <option value="90">Last 90 days</option>
                    <option value="365">Last year</option>
                  </select>
                </div>
                <Link to="/admin/dashboard" className="bg-gray-500/20 hover:bg-gray-500/40 text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2 transition-all border border-white/30">
                  <i className="bi bi-arrow-left"></i> Dashboard
                </Link>
              </div>
            </div>
          </div>

          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total Assignments */}
            <div className="bg-white rounded-[15px] p-6 shadow-md border-t-4 border-[#007bff] transition-all hover:-translate-y-2 hover:shadow-xl group animate-fadeIn" style={{animationDelay: '0s'}}>
              <div className="flex justify-between items-center">
                <div>
                  <h6 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Total Assignments</h6>
                  <h2 className="text-4xl font-bold bg-gradient-to-br from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">65</h2>
                </div>
                <i className="bi bi-journal-text text-5xl text-[#007bff] opacity-20 group-hover:scale-110 group-hover:rotate-6 transition-transform"></i>
              </div>
              <div className="mt-4">
                <span className="bg-blue-50 text-[#007bff] px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit">
                  <i className="bi bi-arrow-up"></i> {stats.completed} completed
                </span>
              </div>
            </div>

            {/* Completion Rate */}
            <div className="bg-white rounded-[15px] p-6 shadow-md border-t-4 border-[#28a745] transition-all hover:-translate-y-2 hover:shadow-xl group animate-fadeIn" style={{animationDelay: '0.1s'}}>
              <div className="flex justify-between items-center">
                <div>
                  <h6 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Completion Rate</h6>
                  <h2 className="text-4xl font-bold bg-gradient-to-br from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">82%</h2>
                </div>
                <i className="bi bi-check-circle text-5xl text-[#28a745] opacity-20 group-hover:scale-110 group-hover:rotate-6 transition-transform"></i>
              </div>
              <div className="mt-4">
                <span className="bg-green-50 text-[#28a745] px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit">
                  <i className="bi bi-arrow-up"></i> {stats.inProgress} in progress
                </span>
              </div>
            </div>

            {/* Response Time */}
            <div className="bg-white rounded-[15px] p-6 shadow-md border-t-4 border-[#ffc107] transition-all hover:-translate-y-2 hover:shadow-xl group animate-fadeIn" style={{animationDelay: '0.2s'}}>
              <div className="flex justify-between items-center">
                <div>
                  <h6 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Avg. Response Time</h6>
                  <h2 className="text-4xl font-bold bg-gradient-to-br from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">2.4h</h2>
                </div>
                <i className="bi bi-clock text-5xl text-[#ffc107] opacity-20 group-hover:scale-110 group-hover:rotate-6 transition-transform"></i>
              </div>
              <div className="mt-4">
                <span className="bg-yellow-50 text-[#ff9800] px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit">
                  <i className="bi bi-clock-history"></i> {stats.pending} pending
                </span>
              </div>
            </div>

            {/* Satisfaction */}
            <div className="bg-white rounded-[15px] p-6 shadow-md border-t-4 border-[#17a2b8] transition-all hover:-translate-y-2 hover:shadow-xl group animate-fadeIn" style={{animationDelay: '0.3s'}}>
              <div className="flex justify-between items-center">
                <div>
                  <h6 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">User Satisfaction</h6>
                  <h2 className="text-4xl font-bold bg-gradient-to-br from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">4.8/5</h2>
                </div>
                <i className="bi bi-star text-5xl text-[#17a2b8] opacity-20 group-hover:scale-110 group-hover:rotate-6 transition-transform"></i>
              </div>
              <div className="mt-4">
                <span className="bg-cyan-50 text-[#17a2b8] px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit">
                  <i className="bi bi-people"></i> 120 active users
                </span>
              </div>
            </div>
          </div>

          {/* Detailed Analytics Section */}
          <div className="bg-white rounded-[15px] shadow-xl overflow-hidden mb-12 animate-fadeIn">
            <div className="bg-gradient-to-r from-[#667eea] to-[#764ba2] p-6 text-white">
              <h5 className="text-xl font-bold flex items-center gap-2">
                <i className="bi bi-graph-up"></i> Detailed Analytics
              </h5>
            </div>
            
            <div className="p-0">
              {/* Custom Nav Tabs */}
              <div className="flex bg-gray-50 border-b-2 border-gray-100">
                {[
                  { id: 'overview', label: 'Overview', icon: 'bi-speedometer2' },
                  { id: 'assignments', label: 'Assignments', icon: 'bi-journal-text' },
                  { id: 'revenue', label: 'Revenue', icon: 'bi-currency-dollar' },
                  { id: 'user', label: 'User Activity', icon: 'bi-people' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-8 py-4 font-bold text-sm transition-all relative flex items-center gap-2 ${
                      activeTab === tab.id 
                      ? 'bg-white text-[#667eea] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-1 after:bg-gradient-to-r after:from-[#667eea] after:to-[#764ba2]' 
                      : 'text-gray-500 hover:text-[#667eea] hover:bg-gray-100'
                    }`}
                  >
                    <i className={`bi ${tab.icon}`}></i> {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="p-8">
                {activeTab === 'overview' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fadeIn">
                    <div>
                      <h5 className="text-lg font-bold mb-4 flex items-center gap-2"><i className="bi bi-pie-chart text-[#667eea]"></i> Assignment Status Distribution</h5>
                      <div className="overflow-hidden rounded-xl border border-gray-100">
                        <table className="w-full text-left border-collapse">
                          <thead className="bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white text-xs uppercase font-bold tracking-wider">
                            <tr>
                              <th className="p-4">Status</th>
                              <th className="p-4">Count</th>
                              <th className="p-4">Percentage</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {[
                              { label: 'Pending', count: 8, color: 'bg-yellow-400', pct: '15%' },
                              { label: 'In Progress', count: 12, color: 'bg-blue-400', pct: '25%' },
                              { label: 'Completed', count: 45, color: 'bg-green-400', pct: '60%' }
                            ].map((row, i) => (
                              <tr key={i} className="hover:bg-gray-50 transition-all">
                                <td className="p-4 font-medium"><span className={`inline-block w-3 h-3 rounded-full ${row.color} me-2`}></span>{row.label}</td>
                                <td className="p-4 font-bold text-gray-700">{row.count}</td>
                                <td className="p-4 w-1/2">
                                  <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                    <div className={`h-full ${row.color}`} style={{ width: row.pct }}></div>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <div>
                      <h5 className="text-lg font-bold mb-4 flex items-center gap-2"><i className="bi bi-graph-up-arrow text-[#667eea]"></i> Key Performance Indicators</h5>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white border-2 border-gray-50 p-6 rounded-2xl text-center shadow-sm hover:border-[#667eea] transition-all hover:-translate-y-1">
                          <i className="bi bi-lightning-charge text-4xl text-yellow-500 mb-2 block"></i>
                          <h3 className="text-2xl font-bold text-gray-800">2.4h</h3>
                          <p className="text-gray-400 text-xs font-bold uppercase mb-0">Avg Response</p>
                        </div>
                        <div className="bg-white border-2 border-gray-50 p-6 rounded-2xl text-center shadow-sm hover:border-[#667eea] transition-all hover:-translate-y-1">
                          <i className="bi bi-star-fill text-4xl text-cyan-500 mb-2 block"></i>
                          <h3 className="text-2xl font-bold text-gray-800">4.8</h3>
                          <p className="text-gray-400 text-xs font-bold uppercase mb-0">Satisfaction</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'assignments' && (
                  <div className="animate-fadeIn">
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-gray-50 p-6 rounded-2xl text-center border-2 border-gray-100">
                          <h1 className="text-5xl font-black text-green-500 mb-2">{stats.completed}</h1>
                          <p className="text-gray-500 font-bold uppercase text-xs">Completed Assignments</p>
                        </div>
                        <div className="bg-gray-50 p-6 rounded-2xl text-center border-2 border-gray-100">
                          <h1 className="text-5xl font-black text-blue-500 mb-2">{stats.inProgress}</h1>
                          <p className="text-gray-500 font-bold uppercase text-xs">In Progress</p>
                        </div>
                        <div className="bg-gray-50 p-6 rounded-2xl text-center border-2 border-gray-100">
                          <h1 className="text-5xl font-black text-yellow-500 mb-2">{stats.pending}</h1>
                          <p className="text-gray-500 font-bold uppercase text-xs">Pending Review</p>
                        </div>
                     </div>
                     <h5 className="text-lg font-bold mb-4 flex items-center gap-2"><i className="bi bi-clock-history text-[#667eea]"></i> Recent Assignments</h5>
                     <div className="overflow-hidden rounded-xl border border-gray-100">
                        <table className="w-full text-left border-collapse">
                          <thead className="bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white text-xs uppercase font-bold tracking-wider">
                            <tr>
                              <th className="p-4">Title</th>
                              <th className="p-4">Student</th>
                              <th className="p-4">Type</th>
                              <th className="p-4">Status</th>
                              <th className="p-4">Date</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {recentAssignments.map((row, i) => (
                              <tr key={i} className="hover:bg-gray-50 transition-all">
                                <td className="p-4 font-bold text-gray-800">{row.title}</td>
                                <td className="p-4 text-gray-600">{row.student}</td>
                                <td className="p-4"><span className={`px-3 py-1 rounded-full text-[10px] font-bold text-white ${row.type === 'IT' ? 'bg-blue-500' : 'bg-green-500'}`}>{row.type}</span></td>
                                <td className="p-4"><span className="text-green-600 font-bold text-sm">{row.status}</span></td>
                                <td className="p-4 text-gray-400 text-sm">{row.date}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                     </div>
                  </div>
                )}

                {activeTab === 'revenue' && (
                  <div className="animate-fadeIn">
                     <div className="bg-gray-50 p-8 rounded-2xl border-2 border-gray-100 mb-8">
                        <h5 className="text-lg font-bold mb-6 flex items-center gap-2"><i className="bi bi-cash-stack text-[#667eea]"></i> Revenue Summary (Last {days} days)</h5>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                          <div className="text-center md:text-left border-b md:border-b-0 md:border-r border-gray-200 pb-4 md:pb-0">
                            <span className="text-gray-400 uppercase text-xs font-bold block mb-1">IT Revenue</span>
                            <h2 className="text-4xl font-black text-blue-600">${revenueData.itRevenue}</h2>
                          </div>
                          <div className="text-center md:text-left border-b md:border-b-0 md:border-r border-gray-200 pb-4 md:pb-0">
                            <span className="text-gray-400 uppercase text-xs font-bold block mb-1">QS Revenue</span>
                            <h2 className="text-4xl font-black text-green-600">${revenueData.qsRevenue}</h2>
                          </div>
                          <div className="text-center md:text-left">
                            <span className="text-gray-400 uppercase text-xs font-bold block mb-1">Total Revenue</span>
                            <h2 className="text-4xl font-black text-gray-800">${revenueData.totalRevenue}</h2>
                          </div>
                        </div>
                     </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white border-2 border-gray-100 p-8 rounded-2xl text-center transition-all hover:border-[#667eea]">
                          <h1 className="text-5xl font-black text-blue-600 mb-2">56%</h1>
                          <p className="text-gray-400 font-bold uppercase text-xs">IT Assignments Percentage</p>
                        </div>
                        <div className="bg-white border-2 border-gray-100 p-8 rounded-2xl text-center transition-all hover:border-[#27ae60]">
                          <h1 className="text-5xl font-black text-green-600 mb-2">44%</h1>
                          <p className="text-gray-400 font-bold uppercase text-xs">QS Assignments Percentage</p>
                        </div>
                     </div>
                  </div>
                )}

                {activeTab === 'user' && (
                  <div className="animate-fadeIn">
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                        <div className="bg-gray-50 p-6 rounded-2xl text-center border-2 border-gray-100">
                          <h1 className="text-5xl font-black text-green-500 mb-2">120</h1>
                          <p className="text-gray-500 font-bold uppercase text-xs">Active Users</p>
                        </div>
                        <div className="bg-gray-50 p-6 rounded-2xl text-center border-2 border-gray-100">
                          <h1 className="text-5xl font-black text-blue-500 mb-2">15</h1>
                          <p className="text-gray-500 font-bold uppercase text-xs">New Users (Last {days} days)</p>
                        </div>
                        <div className="bg-gray-50 p-6 rounded-2xl text-center border-2 border-gray-100">
                          <h1 className="text-5xl font-black text-cyan-500 mb-2">4</h1>
                          <p className="text-gray-500 font-bold uppercase text-xs">Total Administrators</p>
                        </div>
                     </div>

                     <h5 className="text-lg font-bold mb-4 flex items-center gap-2"><i className="bi bi-trophy text-[#667eea]"></i> Top Active Users</h5>
                     <div className="overflow-hidden rounded-xl border border-gray-100">
                        <table className="w-full text-left border-collapse">
                          <thead className="bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white text-xs uppercase font-bold tracking-wider">
                            <tr>
                              <th className="p-4">User</th>
                              <th className="p-4">Email</th>
                              <th className="p-4">Assignments</th>
                              <th className="p-4">Completed</th>
                              <th className="p-4">Last Active</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {topUsers.map((user, i) => (
                              <tr key={i} className="hover:bg-gray-50 transition-all">
                                <td className="p-4 font-bold text-gray-800">{user.fullName}</td>
                                <td className="p-4 text-gray-600">{user.email}</td>
                                <td className="p-4 font-bold text-center">{user.assignments}</td>
                                <td className="p-4 text-green-600 font-bold text-center">{user.completed}</td>
                                <td className="p-4 text-gray-400 text-sm">{user.lastActive}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                     </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Export Section */}
          <div className="mt-16 mb-16">
            <div className="h-[2px] bg-gradient-to-r from-transparent via-[#667eea] to-transparent mb-8"></div>
            <div className="bg-white rounded-[15px] shadow-xl overflow-hidden border border-gray-100">
              <div className="bg-gradient-to-r from-[#667eea] to-[#764ba2] p-6 text-white">
                <h5 className="text-xl font-bold flex items-center gap-2">
                  <i className="bi bi-download"></i> Export Reports
                </h5>
              </div>
              <div className="p-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* PDF Export */}
                  <div className="bg-white border-2 border-gray-50 p-8 rounded-2xl text-center shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all relative group overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative z-10">
                      <i className="bi bi-file-earmark-pdf text-6xl text-red-500 mb-4 block group-hover:scale-110 transition-transform"></i>
                      <h5 className="text-xl font-bold mb-2">PDF Report</h5>
                      <p className="text-gray-400 text-sm mb-6">Detailed report in PDF format</p>
                      <button className="bg-gradient-to-r from-red-500 to-red-600 text-white w-full py-3 rounded-xl font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 hover:shadow-lg transition-all">
                        <i className="bi bi-download"></i> Download PDF
                      </button>
                    </div>
                  </div>

                  {/* Excel Export */}
                  <div className="bg-white border-2 border-gray-50 p-8 rounded-2xl text-center shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all relative group overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative z-10">
                      <i className="bi bi-file-earmark-excel text-6xl text-green-500 mb-4 block group-hover:scale-110 transition-transform"></i>
                      <h5 className="text-xl font-bold mb-2">Excel Data</h5>
                      <p className="text-gray-400 text-sm mb-6">Raw data in spreadsheet format</p>
                      <button className="bg-gradient-to-r from-green-500 to-green-600 text-white w-full py-3 rounded-xl font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 hover:shadow-lg transition-all">
                        <i className="bi bi-download"></i> Download Excel
                      </button>
                    </div>
                  </div>

                  {/* Summary Export */}
                  <div className="bg-white border-2 border-gray-50 p-8 rounded-2xl text-center shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all relative group overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative z-10">
                      <i className="bi bi-graph-up text-6xl text-blue-500 mb-4 block group-hover:scale-110 transition-transform"></i>
                      <h5 className="text-xl font-bold mb-2">Summary Report</h5>
                      <p className="text-gray-400 text-sm mb-6">Executive summary report</p>
                      <button className="bg-gradient-to-r from-blue-500 to-blue-600 text-white w-full py-3 rounded-xl font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 hover:shadow-lg transition-all">
                        <i className="bi bi-download"></i> Download Summary
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="h-[100px]"></div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.6s ease-out forwards; }
        .bg-clip-text { -webkit-background-clip: text; background-clip: text; }
      `}</style>
    </div>
  );
};

export default ViewReports;