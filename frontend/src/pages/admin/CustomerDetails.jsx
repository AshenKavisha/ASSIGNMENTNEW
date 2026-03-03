import React from 'react';
import { Link, useParams } from 'react-router-dom';
import Sidebar from '../../components/admin/Sidebar';

const CustomerDetails = () => {
  const { id } = useParams(); // URL eken customer ID eka gannawa

  // Mock Customer Data (Backend connect karana kan)
  const customer = {
    id: id || "123",
    fullName: "Ashen Kaveesha",
    email: "ashenkaveesha@example.com",
    createdAt: "2026-01-10T10:30:00",
    lastLogin: "2026-03-01T09:15:00",
    assignments: [
      { id: 101, title: "Java OOP Assignment", type: "IT", status: "DELIVERED", createdAt: "2026-03-01T10:30:00", price: 45.00, deliveredAt: "2026-03-01T12:45:00" },
      { id: 102, title: "Construction Measurement", type: "QS", status: "COMPLETED", createdAt: "2026-02-15T14:20:00", price: 50.00, deliveredAt: "2026-02-20T09:00:00" },
      { id: 103, title: "Database Management", type: "IT", status: "PENDING", createdAt: "2026-02-28T11:00:00", price: 30.00, deliveredAt: null }
    ]
  };

  // Calculations
  const totalAssignments = customer.assignments.length;
  const completedAssignments = customer.assignments.filter(a => a.status === 'COMPLETED' || a.status === 'DELIVERED').length;
  const pendingAssignments = customer.assignments.filter(a => a.status === 'PENDING').length;
  const totalSpent = customer.assignments.reduce((sum, a) => sum + (a.price || 0), 0);

  // Status Badge Logic
  const getStatusClass = (status) => {
    switch (status) {
      case 'DELIVERED': case 'COMPLETED': return 'bg-green-500';
      case 'PENDING': return 'bg-yellow-500';
      case 'APPROVED': case 'READY_FOR_DELIVERY': return 'bg-cyan-500';
      case 'IN_PROGRESS': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f8f9fa]">
      <Sidebar />

      <div className="flex-1 ml-64 pb-12 font-sans overflow-x-hidden">
        <div className="container mx-auto px-6 mt-8">
          
          {/* Back Button */}
          <div className="mb-6">
            <Link to="/admin/customers" className="bg-gray-500 hover:bg-gray-600 text-white px-5 py-2 rounded-xl font-bold flex items-center gap-2 w-fit transition-all shadow-md">
              <i className="bi bi-arrow-left"></i> Back to Customers
            </Link>
          </div>

          {/* Profile Header Gradient */}
          <div className="bg-gradient-to-r from-[#3498db] to-[#2980b9] rounded-2xl p-8 text-white mb-8 shadow-xl animate-fadeIn">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="w-32 h-32 rounded-full bg-white/20 border-4 border-white flex items-center justify-center text-5xl font-bold shadow-lg">
                {customer.fullName.charAt(0).toUpperCase()}
              </div>
              <div className="text-center md:text-left">
                <h1 className="text-4xl font-extrabold mb-2 drop-shadow-md">{customer.fullName}</h1>
                <p className="flex items-center justify-center md:justify-start gap-2 mb-2 opacity-90">
                  <i className="bi bi-envelope"></i> {customer.email}
                </p>
                <p className="flex items-center justify-center md:justify-start gap-2 opacity-80 text-sm">
                  <i className="bi bi-calendar"></i> Member since: {new Date(customer.createdAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}
                </p>
              </div>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center hover:-translate-y-2 transition-all duration-300">
              <i className="bi bi-journal-text text-5xl text-[#3498db] mb-3 block opacity-20"></i>
              <h3 className="text-3xl font-black text-gray-800">{totalAssignments}</h3>
              <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">Total Assignments</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center hover:-translate-y-2 transition-all duration-300">
              <i className="bi bi-check-circle text-5xl text-green-500 mb-3 block opacity-20"></i>
              <h3 className="text-3xl font-black text-green-500">{completedAssignments}</h3>
              <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">Completed</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center hover:-translate-y-2 transition-all duration-300">
              <i className="bi bi-clock-history text-5xl text-yellow-500 mb-3 block opacity-20"></i>
              <h3 className="text-3xl font-black text-yellow-600">{pendingAssignments}</h3>
              <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">Pending</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center hover:-translate-y-2 transition-all duration-300">
              <i className="bi bi-currency-dollar text-5xl text-cyan-500 mb-3 block opacity-20"></i>
              <h3 className="text-3xl font-black text-gray-800">${totalSpent.toFixed(2)}</h3>
              <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">Total Spent</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Customer Information */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden sticky top-8">
                <div className="bg-white p-5 border-b border-gray-100">
                  <h5 className="text-lg font-bold text-gray-700 flex items-center gap-2">
                    <i className="bi bi-info-circle text-[#3498db]"></i> Customer Information
                  </h5>
                </div>
                <div className="p-6 space-y-6">
                  <div>
                    <small className="text-gray-400 block text-[10px] font-bold uppercase tracking-widest mb-1">Full Name</small>
                    <strong className="text-gray-700">{customer.fullName}</strong>
                  </div>
                  <div>
                    <small className="text-gray-400 block text-[10px] font-bold uppercase tracking-widest mb-1">Email Address</small>
                    <strong className="text-gray-700">{customer.email}</strong>
                  </div>
                  <div>
                    <small className="text-gray-400 block text-[10px] font-bold uppercase tracking-widest mb-1">Member Since</small>
                    <strong className="text-gray-700">{new Date(customer.createdAt).toLocaleDateString()}</strong>
                  </div>
                  {customer.lastLogin && (
                    <div>
                      <small className="text-gray-400 block text-[10px] font-bold uppercase tracking-widest mb-1">Last Login</small>
                      <strong className="text-gray-700">{new Date(customer.lastLogin).toLocaleString()}</strong>
                    </div>
                  )}
                  <div>
                    <small className="text-gray-400 block text-[10px] font-bold uppercase tracking-widest mb-1">Customer ID</small>
                    <strong className="text-gray-700">#{customer.id}</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Assignment History Timeline */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
                <div className="bg-white p-5 border-b border-gray-100">
                  <h5 className="text-lg font-bold text-gray-700 flex items-center gap-2">
                    <i className="bi bi-list-task text-[#3498db]"></i> Assignment History
                  </h5>
                </div>
                <div className="p-8">
                  {customer.assignments.length > 0 ? (
                    <div className="space-y-2">
                      {customer.assignments.map((assignment, idx) => (
                        <div key={idx} className="border-l-4 border-[#3498db] pl-8 relative pb-8 group last:pb-2">
                          {/* Timeline Dot */}
                          <div className="absolute -left-[10px] top-0 w-4 h-4 bg-[#3498db] rounded-full border-4 border-white shadow-sm group-hover:scale-125 transition-transform"></div>
                          
                          <div className="bg-white p-5 rounded-xl border border-gray-50 shadow-sm transition-all hover:shadow-md hover:border-blue-100">
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <h6 className="text-lg font-bold text-gray-800 mb-1">{assignment.title}</h6>
                                <p className="text-xs text-gray-400 flex items-center gap-1">
                                  <i className="bi bi-calendar"></i> {new Date(assignment.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                              <span className={`px-4 py-1 rounded-full text-[10px] font-bold text-white shadow-sm ${getStatusClass(assignment.status)}`}>
                                {assignment.status}
                              </span>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 items-center">
                              <div>
                                <small className="text-gray-400 block text-[9px] font-bold uppercase tracking-widest mb-1">Type</small>
                                <span className={`px-3 py-0.5 rounded-md text-[9px] font-bold text-white ${assignment.type === 'IT' ? 'bg-cyan-500' : 'bg-green-500'}`}>
                                  {assignment.type === 'IT' ? 'IT Assignment' : 'QS Assignment'}
                                </span>
                              </div>
                              {assignment.price && (
                                <div>
                                  <small className="text-gray-400 block text-[9px] font-bold uppercase tracking-widest mb-1">Price</small>
                                  <strong className="text-gray-700">${assignment.price.toFixed(2)}</strong>
                                </div>
                              )}
                              <div className="col-span-2 sm:col-span-1 text-right sm:text-right pt-2 sm:pt-0">
                                <Link to={`/admin/assignments/${assignment.id}`} className="inline-flex items-center gap-2 text-[#3498db] hover:text-blue-700 font-bold text-xs uppercase tracking-widest transition-all">
                                  View Details <i className="bi bi-chevron-right"></i>
                                </Link>
                              </div>
                            </div>

                            {assignment.status === 'DELIVERED' && (
                              <div className="mt-4 pt-4 border-t border-dashed border-gray-100 flex items-center gap-2 text-xs text-green-600 font-medium">
                                <i className="bi bi-send-check-fill text-lg"></i>
                                Delivered on: {new Date(assignment.deliveredAt).toLocaleString()}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-20">
                      <i className="bi bi-inbox text-7xl text-gray-100 mb-4 block"></i>
                      <p className="text-gray-400 font-medium">No assignments found for this customer.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Consistent with design */}
        <footer className="mt-12 py-8 bg-[#212529] text-white/50 text-center text-sm border-t border-white/5">
          <p className="mb-0">&copy; 2026 Assignment Service. All rights reserved.</p>
        </footer>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.5s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default CustomerDetails;