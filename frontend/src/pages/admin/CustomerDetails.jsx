import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/admin/Sidebar';

const CustomerDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`/api/admin/customers/${id}`, { credentials: 'include' })
        .then(res => {
          if (res.status === 401) { navigate('/login'); return null; }
          if (!res.ok) throw new Error('Customer not found');
          return res.json();
        })
        .then(data => {
          if (data) { setCustomer(data); setLoading(false); }
        })
        .catch(err => {
          setError(err.message);
          setLoading(false);
        });
  }, [id]);

  if (loading) {
    return (
        <div className="flex min-h-screen bg-[#f8f9fa]">
          <Sidebar />
          <div className="flex-1 ml-64 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin border-4 border-blue-500 border-t-transparent rounded-full w-12 h-12 mx-auto mb-4"></div>
              <p className="text-gray-500">Loading customer details...</p>
            </div>
          </div>
        </div>
    );
  }

  if (error || !customer) {
    return (
        <div className="flex min-h-screen bg-[#f8f9fa]">
          <Sidebar />
          <div className="flex-1 ml-64 flex items-center justify-center">
            <div className="text-center">
              <i className="bi bi-exclamation-triangle text-5xl text-red-500 mb-4 block"></i>
              <p className="text-gray-500">{error || 'Customer not found'}</p>
              <Link to="/admin/customers" className="mt-4 inline-block bg-blue-500 text-white px-6 py-2 rounded-xl no-underline">
                Back to Customers
              </Link>
            </div>
          </div>
        </div>
    );
  }

  const assignments = customer.assignments || [];
  const totalAssignments = assignments.length;
  const completedAssignments = assignments.filter(a => a.status === 'COMPLETED' || a.status === 'DELIVERED').length;
  const pendingAssignments = assignments.filter(a => a.status === 'PENDING').length;
  const totalSpent = assignments.reduce((sum, a) => sum + (a.price || 0), 0);

  const getStatusClass = (status) => {
    switch (status) {
      case 'DELIVERED': case 'COMPLETED': return 'bg-green-500';
      case 'PENDING': return 'bg-yellow-500';
      case 'APPROVED': case 'READY_FOR_DELIVERY': return 'bg-cyan-500';
      case 'IN_PROGRESS': return 'bg-blue-500';
      case 'REJECTED': return 'bg-red-500';
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
              <Link to="/admin/customers" className="bg-gray-500 hover:bg-gray-600 text-white px-5 py-2 rounded-xl font-bold flex items-center gap-2 w-fit transition-all shadow-md no-underline">
                <i className="bi bi-arrow-left"></i> Back to Customers
              </Link>
            </div>

            {/* Profile Header */}
            <div className="bg-gradient-to-r from-[#3498db] to-[#2980b9] rounded-2xl p-8 text-white mb-8 shadow-xl animate-fadeIn">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="w-32 h-32 rounded-full bg-white/20 border-4 border-white flex items-center justify-center text-5xl font-bold shadow-lg">
                  {customer.fullName?.charAt(0).toUpperCase()}
                </div>
                <div className="text-center md:text-left">
                  <h1 className="text-4xl font-extrabold mb-2">{customer.fullName}</h1>
                  <p className="flex items-center justify-center md:justify-start gap-2 mb-2 opacity-90">
                    <i className="bi bi-envelope"></i> {customer.email}
                  </p>
                  {customer.createdAt && (
                      <p className="flex items-center justify-center md:justify-start gap-2 opacity-80 text-sm">
                        <i className="bi bi-calendar"></i> Member since: {new Date(customer.createdAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}
                      </p>
                  )}
                </div>
              </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center hover:-translate-y-2 transition-all">
                <i className="bi bi-journal-text text-5xl text-[#3498db] mb-3 block opacity-20"></i>
                <h3 className="text-3xl font-black text-gray-800">{totalAssignments}</h3>
                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">Total Assignments</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center hover:-translate-y-2 transition-all">
                <i className="bi bi-check-circle text-5xl text-green-500 mb-3 block opacity-20"></i>
                <h3 className="text-3xl font-black text-green-500">{completedAssignments}</h3>
                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">Completed</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center hover:-translate-y-2 transition-all">
                <i className="bi bi-clock-history text-5xl text-yellow-500 mb-3 block opacity-20"></i>
                <h3 className="text-3xl font-black text-yellow-600">{pendingAssignments}</h3>
                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">Pending</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center hover:-translate-y-2 transition-all">
                <i className="bi bi-currency-dollar text-5xl text-cyan-500 mb-3 block opacity-20"></i>
                <h3 className="text-3xl font-black text-gray-800">${totalSpent.toFixed(2)}</h3>
                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">Total Spent</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Customer Info */}
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
                    {customer.createdAt && (
                        <div>
                          <small className="text-gray-400 block text-[10px] font-bold uppercase tracking-widest mb-1">Member Since</small>
                          <strong className="text-gray-700">{new Date(customer.createdAt).toLocaleDateString()}</strong>
                        </div>
                    )}
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

              {/* Assignment History */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
                  <div className="bg-white p-5 border-b border-gray-100">
                    <h5 className="text-lg font-bold text-gray-700 flex items-center gap-2">
                      <i className="bi bi-list-task text-[#3498db]"></i> Assignment History
                    </h5>
                  </div>
                  <div className="p-8">
                    {assignments.length > 0 ? (
                        <div className="space-y-2">
                          {assignments.map((assignment, idx) => (
                              <div key={idx} className="border-l-4 border-[#3498db] pl-8 relative pb-8 group last:pb-2">
                                <div className="absolute -left-[10px] top-0 w-4 h-4 bg-[#3498db] rounded-full border-4 border-white shadow-sm group-hover:scale-125 transition-transform"></div>
                                <div className="bg-white p-5 rounded-xl border border-gray-50 shadow-sm hover:shadow-md hover:border-blue-100 transition-all">
                                  <div className="flex justify-between items-start mb-4">
                                    <div>
                                      <h6 className="text-lg font-bold text-gray-800 mb-1">{assignment.title}</h6>
                                      {assignment.createdAt && (
                                          <p className="text-xs text-gray-400 flex items-center gap-1">
                                            <i className="bi bi-calendar"></i> {new Date(assignment.createdAt).toLocaleDateString()}
                                          </p>
                                      )}
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
                                    {assignment.price != null && (
                                        <div>
                                          <small className="text-gray-400 block text-[9px] font-bold uppercase tracking-widest mb-1">Price</small>
                                          <strong className="text-gray-700">${Number(assignment.price).toFixed(2)}</strong>
                                        </div>
                                    )}
                                    <div className="col-span-2 sm:col-span-1 text-right">
                                      <Link to={`/admin/assignments/${assignment.id}`} className="inline-flex items-center gap-2 text-[#3498db] hover:text-blue-700 font-bold text-xs uppercase tracking-widest transition-all no-underline">
                                        View Details <i className="bi bi-chevron-right"></i>
                                      </Link>
                                    </div>
                                  </div>
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

          <footer className="mt-12 py-8 bg-[#212529] text-white/50 text-center text-sm">
            <p>&copy; 2026 Assignment Service. All rights reserved.</p>
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