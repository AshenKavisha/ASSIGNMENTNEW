import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/admin/Sidebar';

const CustomerProfiles = () => {
  const [filterType, setFilterType] = useState('ALL');

  // Mock Admin Info
  const currentAdmin = { fullName: "Admin Pathum", specialization: "BOTH" };

  // Mock Statistics
  const stats = { totalCustomers: 15, itCustomerCount: 8, qsCustomerCount: 7 };

  // Mock Customers Data
  const customers = [
    { 
      id: 1, fullName: "Ashen Kaveesha", email: "ashen@example.com", 
      assignments: [
        { type: "IT", status: "DELIVERED" },
        { type: "IT", status: "PENDING" }
      ] 
    },
    { 
      id: 2, fullName: "Nimal Perera", email: "nimal@example.com", 
      assignments: [
        { type: "QUANTITY_SURVEYING", status: "COMPLETED" }
      ] 
    },
    { 
      id: 3, fullName: "Kamal Silva", email: "kamal@example.com", 
      assignments: [
        { type: "IT", status: "COMPLETED" },
        { type: "QUANTITY_SURVEYING", status: "DELIVERED" }
      ] 
    }
  ];

  // Logic to calculate stats for each card
  const getCustomerStats = (customer) => {
    const total = customer.assignments.length;
    const completed = customer.assignments.filter(a => a.status === 'COMPLETED' || a.status === 'DELIVERED').length;
    const pending = customer.assignments.filter(a => a.status === 'PENDING').length;
    
    const specializations = [...new Set(customer.assignments.map(a => a.type))];
    
    return { total, completed, pending, specializations };
  };

  // Filter Logic
  const filteredCustomers = customers.filter(c => {
    if (filterType === 'ALL') return true;
    return c.assignments.some(a => a.type === (filterType === 'IT' ? 'IT' : 'QUANTITY_SURVEYING'));
  });

  return (
    <div className="flex min-h-screen bg-[#f8f9fa]">
      <Sidebar />

      <div className="flex-1 ml-64 pb-12 font-sans overflow-x-hidden">
        {/* Top Navbar */}
        <nav className="bg-[#212529] text-white py-3 px-6 flex justify-between items-center shadow-md">
          <div className="text-lg font-bold flex items-center gap-2">
            <i className="bi bi-journal-check text-blue-400"></i> Assignment Service - Admin
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span className="opacity-80 flex items-center gap-2">
              <i className="bi bi-person-circle text-lg"></i> {currentAdmin.fullName}
              <span className="bg-[#17a2b8] px-2 py-0.5 rounded-md text-[10px] font-bold uppercase">{currentAdmin.specialization}</span>
            </span>
            <button className="border border-white/30 px-3 py-1 rounded hover:bg-white hover:text-black transition-all flex items-center gap-1">
              <i className="bi bi-box-arrow-right"></i> Logout
            </button>
          </div>
        </nav>

        <div className="container mx-auto px-6 mt-8">
          {/* Page Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-extrabold text-[#2c3e50] flex items-center gap-3">
                <i className="bi bi-people text-blue-500"></i> Customer Profiles
              </h1>
              <p className="text-gray-500 mt-2 text-lg">View and manage your customers based on assignment types</p>
            </div>
            <Link to="/admin/dashboard" className="bg-[#6c757d] hover:bg-[#5a6268] text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2 transition-all shadow-md">
              <i className="bi bi-arrow-left"></i> Back to Dashboard
            </Link>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-[#3498db] text-white p-6 rounded-[15px] shadow-lg flex justify-between items-center">
              <div>
                <h6 className="opacity-75 text-xs font-bold uppercase mb-1">Total Customers</h6>
                <h2 className="text-4xl font-bold">{stats.totalCustomers}</h2>
              </div>
              <i className="bi bi-people text-5xl opacity-40"></i>
            </div>
            <div className="bg-[#17a2b8] text-white p-6 rounded-[15px] shadow-lg flex justify-between items-center">
              <div>
                <h6 className="opacity-75 text-xs font-bold uppercase mb-1">IT Customers</h6>
                <h2 className="text-4xl font-bold">{stats.itCustomerCount}</h2>
              </div>
              <i className="bi bi-laptop text-5xl opacity-40"></i>
            </div>
            <div className="bg-[#27ae60] text-white p-6 rounded-[15px] shadow-lg flex justify-between items-center">
              <div>
                <h6 className="opacity-75 text-xs font-bold uppercase mb-1">QS Customers</h6>
                <h2 className="text-4xl font-bold">{stats.qsCustomerCount}</h2>
              </div>
              <i className="bi bi-calculator text-5xl opacity-40"></i>
            </div>
          </div>

          {/* Filter Buttons */}
          {currentAdmin.specialization === 'BOTH' && (
            <div className="mb-8 flex gap-2 bg-white p-2 rounded-2xl shadow-sm w-fit border border-gray-100">
              <button 
                onClick={() => setFilterType('ALL')}
                className={`px-6 py-2 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${filterType === 'ALL' ? 'bg-[#3498db] text-white shadow-md' : 'text-[#3498db] hover:bg-blue-50'}`}
              >
                <i className="bi bi-funnel"></i> All Customers
              </button>
              <button 
                onClick={() => setFilterType('IT')}
                className={`px-6 py-2 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${filterType === 'IT' ? 'bg-[#17a2b8] text-white shadow-md' : 'text-[#17a2b8] hover:bg-cyan-50'}`}
              >
                <i className="bi bi-laptop"></i> IT Customers
              </button>
              <button 
                onClick={() => setFilterType('QS')}
                className={`px-6 py-2 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${filterType === 'QS' ? 'bg-[#27ae60] text-white shadow-md' : 'text-[#27ae60] hover:bg-emerald-50'}`}
              >
                <i className="bi bi-calculator"></i> QS Customers
              </button>
            </div>
          )}

          {/* Customer Cards Grid */}
          {filteredCustomers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredCustomers.map((customer) => {
                const cStats = getCustomerStats(customer);
                return (
                  <div key={customer.id} className="bg-white rounded-[15px] p-6 shadow-sm border border-gray-100 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl group">
                    <div className="flex items-start mb-4">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#3498db] to-[#2980b9] text-white flex items-center justify-center text-2xl font-bold mr-4 shadow-md group-hover:scale-110 transition-transform">
                        {customer.fullName.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <h5 className="text-xl font-bold text-[#2c3e50] mb-1">{customer.fullName}</h5>
                        <p className="text-gray-400 text-sm flex items-center gap-1 mb-2">
                          <i className="bi bi-envelope"></i> {customer.email}
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {cStats.specializations.map((spec, i) => (
                            <span key={i} className={`px-2 py-0.5 rounded-md text-[9px] font-bold text-white flex items-center gap-1 ${spec === 'IT' ? 'bg-[#17a2b8]' : 'bg-[#27ae60]'}`}>
                              <i className={`bi ${spec === 'IT' ? 'bi-laptop' : 'bi-calculator'}`}></i> {spec}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <hr className="my-4 opacity-10" />
                    <div className="grid grid-cols-3 text-center mb-6">
                      <div>
                        <small className="text-gray-400 block text-[10px] uppercase font-bold tracking-wider">Total</small>
                        <strong className="text-lg text-[#2c3e50]">{cStats.total}</strong>
                      </div>
                      <div>
                        <small className="text-gray-400 block text-[10px] uppercase font-bold tracking-wider">Completed</small>
                        <strong className="text-lg text-[#27ae60]">{cStats.completed}</strong>
                      </div>
                      <div>
                        <small className="text-gray-400 block text-[10px] uppercase font-bold tracking-wider">Pending</small>
                        <strong className="text-lg text-[#f39c12]">{cStats.pending}</strong>
                      </div>
                    </div>
                    <div className="d-grid">
                      <Link to={`/admin/customers/${customer.id}`} className="block text-center py-2 rounded-xl border-2 border-[#3498db] text-[#3498db] font-bold text-sm hover:bg-[#3498db] hover:text-white transition-all">
                        <i className="bi bi-eye"></i> View Profile
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-20 text-center shadow-md border border-gray-100 flex flex-col items-center">
              <i className="bi bi-people text-7xl text-gray-200 mb-4"></i>
              <h3 className="text-2xl font-bold text-[#2c3e50] mb-2">No Customers Found</h3>
              <p className="text-gray-400">No customers matching your filter were found in the system.</p>
            </div>
          )}
        </div>

        {/* Simple Footer inside Content Area to match design */}
        <footer className="mt-12 py-8 bg-[#212529] text-white/50 text-center text-sm border-t border-white/5">
          <p className="mb-0">&copy; 2026 Assignment Service. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default CustomerProfiles;