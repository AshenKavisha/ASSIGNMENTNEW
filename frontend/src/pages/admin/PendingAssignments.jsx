import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/admin/Sidebar';

const PendingAssignments = () => {
  // Mock Data (Backend set කරනකම් meka thiyagamu)
  const [pendingList, setPendingList] = useState([
    { id: 1, title: "Java OOP Assignment", student: "Ashen Kaveesha", email: "ashen@example.com", type: "IT", subject: "Object Oriented Programming", submitted: "Mar 01, 2026", deadline: "Mar 05, 2026" },
    { id: 2, title: "Construction Measurement", student: "Pathum Madhusanka", email: "pathum@example.com", type: "QS", subject: "Quantity Surveying", submitted: "Feb 28, 2026", deadline: "Mar 10, 2026" },
    { id: 3, title: "Python Data Analysis", student: "Kamal Silva", email: "kamal@example.com", type: "IT", subject: "Data Science", submitted: "Mar 01, 2026", deadline: "Mar 07, 2026" },
  ]);

  const handleApprove = (id) => {
    alert(`Assignment #${id} approved successfully!`);
    setPendingList(pendingList.filter(item => item.id !== id)); // List eken ain karanawa
  };

  return (
    <div className="flex min-h-screen bg-[#f5f7fa]">
      <Sidebar />

      <div className="flex-1 ml-64 pb-12 font-sans overflow-x-hidden">
        <div className="container mx-auto px-6 mt-8">
          
          {/* Page Header */}
          <div className="relative overflow-hidden bg-gradient-to-br from-[#ffc107] to-[#ff9800] rounded-[20px] p-10 shadow-lg text-gray-900 mb-8 animate-fadeInDown">
            <div className="absolute -top-1/2 -right-10 w-[400px] h-[400px] bg-white/10 rounded-full animate-float"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between">
              <div>
                <h1 className="text-4xl md:text-5xl font-black flex items-center gap-4">
                  <i className="bi bi-clock-history"></i> Pending Assignments
                </h1>
                <p className="text-gray-800 font-medium text-lg mt-2">Review and approve incoming assignment requests</p>
              </div>
              <div className="bg-white/50 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/40 shadow-sm mt-4 md:mt-0">
                <span className="text-sm uppercase font-bold tracking-widest block">Waiting Review</span>
                <span className="text-3xl font-black">{pendingList.length} Tasks</span>
              </div>
            </div>
          </div>

          {/* Pending Assignments Table */}
          <div className="bg-white rounded-[25px] shadow-xl overflow-hidden animate-fadeInUp">
            <div className="bg-gray-800 p-6 text-white flex justify-between items-center">
              <h4 className="text-xl font-bold flex items-center gap-2">
                <i className="bi bi-list-ul"></i> Request Queue
              </h4>
              <div className="flex gap-2">
                 <button className="bg-white/10 hover:bg-white/20 px-4 py-1 rounded-lg text-xs font-bold transition-all">Export PDF</button>
              </div>
            </div>

            <div className="p-4 md:p-8">
              {pendingList.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 uppercase text-[10px] font-bold text-gray-400 tracking-widest border-b">
                        <th className="p-4">Assignment Info</th>
                        <th className="p-4">Student</th>
                        <th className="p-4 text-center">Type</th>
                        <th className="p-4">Submitted On</th>
                        <th className="p-4 text-red-500">Deadline</th>
                        <th className="p-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {pendingList.map((item) => (
                        <tr key={item.id} className="transition-all hover:bg-blue-50/30 group">
                          <td className="p-4">
                            <div className="font-bold text-gray-800 text-lg group-hover:text-blue-600 transition-colors">{item.title}</div>
                            <div className="text-xs text-gray-400 font-medium">{item.subject}</div>
                          </td>
                          <td className="p-4">
                            <div className="font-bold text-gray-700">{item.student}</div>
                            <div className="text-xs text-gray-400">{item.email}</div>
                          </td>
                          <td className="p-4 text-center">
                            <span className={`px-4 py-1 rounded-full text-[10px] font-black text-white shadow-sm ${item.type === 'IT' ? 'bg-blue-500' : 'bg-green-500'}`}>
                              {item.type}
                            </span>
                          </td>
                          <td className="p-4 text-sm font-medium text-gray-500">{item.submitted}</td>
                          <td className="p-4">
                            <span className="bg-red-50 text-red-500 px-3 py-1 rounded-lg text-xs font-bold border border-red-100">
                              {item.deadline}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex gap-2 justify-center">
                              <Link 
                                to={`/admin/assignments/${item.id}`} 
                                className="p-2 bg-blue-100 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                                title="View Details"
                              >
                                <i className="bi bi-eye-fill"></i>
                              </Link>
                              <button 
                                onClick={() => handleApprove(item.id)}
                                className="p-2 bg-green-100 text-green-600 rounded-xl hover:bg-green-600 hover:text-white transition-all shadow-sm"
                                title="Approve Request"
                              >
                                <i className="bi bi-check-lg"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-20 animate-fadeIn">
                  <i className="bi bi-check2-all text-8xl text-green-100 mb-4 block"></i>
                  <h3 className="text-2xl font-bold text-gray-700 mb-2">Everything's Clear!</h3>
                  <p className="text-gray-400">There are no pending assignments to review at the moment.</p>
                  <Link to="/admin/dashboard" className="inline-block mt-6 text-blue-500 font-bold hover:underline">
                    Return to Dashboard
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeInDown { from { opacity: 0; transform: translateY(-30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeInDown { animation: fadeInDown 0.6s ease-out forwards; }
        .animate-fadeInUp { animation: fadeInUp 0.6s ease-out forwards; }
        @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-15px); } }
        .animate-float { animation: float 6s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default PendingAssignments;