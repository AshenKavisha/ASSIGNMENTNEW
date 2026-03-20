import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/admin/Sidebar';

const PendingAssignments = () => {
  const currencySymbols = {
    LKR: "Rs.",
    USD: "$"
  };

  // Mock Admins List (Backend එකෙන් එනකම්)
  const mockAdmins = [
    { id: 101, name: "najeeb s", email: "najeebsaman69@gmail.com", role: "IT Specialist" },
    { id: 102, name: "ramiru dew", email: "ramirudewadan@gmail.com", role: "IT Specialist" }
  ];

  const [pendingList, setPendingList] = useState([
    { 
      id: 1, 
      student: "ASHEN", 
      email: "kavishaashenkdh@gmail.com", 
      type: "IT", 
      subject: "w", 
      deadline: "2026-03-27T11:04", 
      submitted: "Mar 20, 2026",
      description: "swd",
      amount: "", 
      currency: "LKR"
    }
  ]);

  // Modal State Variables
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [handoverData, setHandoverData] = useState({ amount: '', currency: 'LKR', adminId: null });

  const handleAmountChange = (id, value) => {
    setPendingList(pendingList.map(item => 
      item.id === id ? { ...item, amount: value } : item
    ));
  };

  const handleCurrencyChange = (id, value) => {
    setPendingList(pendingList.map(item => 
      item.id === id ? { ...item, currency: value } : item
    ));
  };

  // Normal Approve
  const handleApprove = (id) => {
    const assignment = pendingList.find(item => item.id === id);
    if (!assignment.amount) {
      alert("Please enter an amount before approving.");
      return;
    }
    alert(`Assignment approved! Amount: ${assignment.currency} ${assignment.amount}`);
    setPendingList(pendingList.filter(item => item.id !== id));
  };

  const handleReject = (id) => {
    if (window.confirm("Are you sure you want to reject this assignment?")) {
      setPendingList(pendingList.filter(item => item.id !== id));
    }
  };

  // --- Modal Functions ---
  const openHandoverModal = (assignment) => {
    setSelectedAssignment(assignment);
    // කාඩ් එකේ ටයිප් කරලා තියෙන ගාන ඔටෝ Modal එකට ගන්නවා
    setHandoverData({
      amount: assignment.amount || '',
      currency: assignment.currency || 'LKR',
      adminId: null
    });
    setIsModalOpen(true);
  };

  const closeHandoverModal = () => {
    setIsModalOpen(false);
    setSelectedAssignment(null);
  };

  const submitHandover = () => {
    if (!handoverData.amount) {
      alert("Please set a price.");
      return;
    }
    if (!handoverData.adminId) {
      alert("Please select an Admin to handover.");
      return;
    }

    const adminDetails = mockAdmins.find(a => a.id === parseInt(handoverData.adminId));
    
    alert(`Successfully Handed Over!\n\nAssignment: ${selectedAssignment.subject}\nAmount: ${handoverData.currency} ${handoverData.amount}\nAdmin: ${adminDetails.name}`);
    
    setPendingList(pendingList.filter(item => item.id !== selectedAssignment.id));
    closeHandoverModal();
  };

  return (
    <div className="flex min-h-screen bg-[#fffdf5] font-sans relative">
      
      <Sidebar />

      <div className="flex-1 ml-64 p-8 overflow-x-hidden">
        
        {/* Page Header */}
        <div className="bg-[#f39c12] rounded-xl p-6 flex justify-between items-center text-white mb-8 shadow-md">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3 m-0">
              <i className="bi bi-clock-history"></i> Pending Assignments
            </h1>
            <p className="m-0 mt-1 opacity-90">You have {pendingList.length} assignments waiting for review</p>
          </div>
          <Link to="/admin/dashboard" className="bg-white text-gray-800 px-4 py-2 rounded font-bold text-sm no-underline hover:bg-gray-100 transition-colors shadow-sm">
            ← Back to Admin Dashboard
          </Link>
        </div>

        {/* Assignment Cards */}
        {pendingList.length > 0 ? (
          <div className="space-y-8 max-w-4xl mx-auto">
            {pendingList.map((item) => (
              <div key={item.id} className="bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-gray-100 overflow-hidden">
                
                <div className="bg-[#ffb300] px-6 py-3 flex justify-between items-center">
                  <h3 className="font-bold text-gray-900 m-0 uppercase">{item.subject}</h3>
                  <span className="bg-[#1f2937] text-white text-xs px-3 py-1 rounded-full font-bold flex items-center gap-1">
                    <i className="bi bi-info-circle"></i> PENDING
                  </span>
                </div>

                <div className="p-6">
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="border border-gray-200 rounded-lg p-3">
                      <span className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Student</span>
                      <span className="font-bold text-gray-800">{item.student}</span>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-3">
                      <span className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Email</span>
                      <span className="font-bold text-gray-800">{item.email}</span>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-3">
                      <span className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Type</span>
                      <span className="bg-[#0d6efd] text-white text-[10px] px-2 py-0.5 rounded font-bold inline-flex items-center gap-1">
                        <i className="bi bi-laptop"></i> {item.type}
                      </span>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-3">
                      <span className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Subject</span>
                      <span className="font-bold text-gray-800">{item.subject}</span>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-3">
                      <span className="text-[10px] font-bold text-gray-400 uppercase block mb-1 flex items-center gap-1">
                        <i className="bi bi-calendar-event"></i> Deadline
                      </span>
                      <span className="font-bold text-[#dc3545]">{item.deadline}</span>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-3">
                      <span className="text-[10px] font-bold text-gray-400 uppercase block mb-1 flex items-center gap-1">
                        <i className="bi bi-calendar-check"></i> Submitted
                      </span>
                      <span className="font-bold text-gray-800">{item.submitted}</span>
                    </div>
                  </div>

                  <div className="bg-[#fff8e1] border border-[#ffe082] rounded-lg p-4 mb-6">
                    <span className="text-[10px] font-bold text-gray-500 uppercase flex items-center gap-1 mb-2">
                      <i className="bi bi-file-text"></i> Description
                    </span>
                    <p className="m-0 text-sm text-gray-700">{item.description}</p>
                  </div>

                  {/* Amount & Currency Approve Section */}
                  <div className="flex gap-2 items-stretch mb-2">
                    <div className="flex bg-[#28a745] text-white px-3 items-center rounded-l-lg font-bold border border-[#28a745] min-w-[50px] justify-center">
                      {currencySymbols[item.currency]}
                    </div>
                    
                    <input 
                      type="number" 
                      placeholder="Enter amount" 
                      className="border border-gray-300 px-3 py-2 flex-1 focus:outline-none focus:border-[#28a745] min-w-0"
                      value={item.amount}
                      onChange={(e) => handleAmountChange(item.id, e.target.value)}
                    />

                    {/* LKR / USD Dropdown */}
                    <div className="relative border border-gray-300 bg-white flex items-center w-[120px]">
                      <select 
                        value={item.currency}
                        onChange={(e) => handleCurrencyChange(item.id, e.target.value)}
                        className="appearance-none bg-transparent pl-3 pr-8 py-2 w-full h-full text-sm text-gray-600 focus:outline-none cursor-pointer outline-none border-none shadow-none focus:ring-0"
                      >
                        <option value="LKR">LKR (Rs.)</option>
                        <option value="USD">USD ($)</option>
                      </select>
                      <i className="bi bi-chevron-down absolute right-3 text-[10px] text-gray-500 pointer-events-none"></i>
                    </div>

                    <button 
                      onClick={() => handleApprove(item.id)}
                      className="bg-[#20c997] hover:bg-[#1ba87e] text-white font-bold px-6 md:px-8 rounded-r-lg transition-colors flex items-center gap-2 border-none cursor-pointer whitespace-nowrap"
                    >
                      <i className="bi bi-check-circle"></i> Approve
                    </button>
                  </div>
                  
                  <p className="text-[10px] text-gray-400 mt-1 mb-6 flex items-center gap-1">
                    <i className="bi bi-info-circle"></i> User will receive a payment link via email in the selected currency
                  </p>

                  <div className="space-y-2">
                    <button 
                      onClick={() => openHandoverModal(item)} // Modal එක Open කරන තැන
                      className="w-full bg-[#17a2b8] hover:bg-[#138496] text-white font-bold py-2 rounded-lg transition-colors flex justify-center items-center gap-2 border-none cursor-pointer"
                    >
                      <i className="bi bi-person-check"></i> Approve & Handover to Admin
                    </button>
                    
                    <button 
                      onClick={() => handleReject(item.id)}
                      className="w-full bg-[#dc3545] hover:bg-[#c82333] text-white font-bold py-2 rounded-lg transition-colors flex justify-center items-center gap-2 border-none cursor-pointer"
                    >
                      <i className="bi bi-x-circle"></i> Reject Assignment
                    </button>
                  </div>

                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <i className="bi bi-check2-all text-6xl text-green-400 mb-4 block"></i>
            <h3 className="text-2xl font-bold text-gray-700">All Caught Up!</h3>
            <p className="text-gray-500">No pending assignments to review.</p>
          </div>
        )}

      </div>

      {/* =========================================
          HANDOVER MODAL (Popup)
      ========================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fadeIn">
          
          <div className="bg-white w-full max-w-md rounded-xl shadow-2xl overflow-hidden animate-slideUp scale-100">
            
            {/* Modal Header */}
            <div className="bg-[#f97316] text-white px-5 py-4 flex justify-between items-center">
              <h3 className="font-bold m-0 flex items-center gap-2 text-lg">
                <i className="bi bi-person-rolodex"></i> Handover Assignment
              </h3>
              <button onClick={closeHandoverModal} className="text-white hover:text-gray-200 transition-colors bg-transparent border-none text-2xl leading-none">
                &times;
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              
              {/* Set Price Input */}
              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-800 mb-2">Set Price <span className="text-red-500">*</span></label>
                <div className="flex gap-2 items-stretch">
                  <div className="flex bg-white px-3 items-center rounded-l-lg font-bold border border-gray-300 border-r-0 min-w-[40px] justify-center text-gray-600 text-sm">
                    {currencySymbols[handoverData.currency]}
                  </div>
                  <input 
                    type="number" 
                    placeholder="Enter amount" 
                    className="border border-gray-300 border-l-0 px-3 py-2 flex-1 focus:outline-none focus:border-[#f97316] text-sm"
                    value={handoverData.amount}
                    onChange={(e) => setHandoverData({...handoverData, amount: e.target.value})}
                  />
                  <div className="relative border border-gray-300 bg-white flex items-center w-[90px] rounded-r-lg">
                    <select 
                      value={handoverData.currency}
                      onChange={(e) => setHandoverData({...handoverData, currency: e.target.value})}
                      className="appearance-none bg-transparent pl-2 pr-6 py-2 w-full h-full text-[12px] text-gray-600 focus:outline-none cursor-pointer outline-none border-none"
                    >
                      <option value="LKR">LKR (Rs.)</option>
                      <option value="USD">USD ($)</option>
                    </select>
                    <i className="bi bi-chevron-down absolute right-2 text-[10px] text-gray-500 pointer-events-none"></i>
                  </div>
                </div>
              </div>

              {/* Select Admin List */}
              <div className="mb-4">
                <label className="block text-sm font-bold text-gray-800 mb-2">Select Admin <span className="text-red-500">*</span></label>
                <div className="space-y-3 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                  
                  {mockAdmins.map(admin => (
                    <label key={admin.id} className={`flex justify-between items-center p-3 border rounded-lg cursor-pointer transition-all ${handoverData.adminId == admin.id ? 'border-[#17a2b8] bg-[#17a2b8]/10' : 'border-gray-200 hover:border-gray-300'}`}>
                      <div>
                        <p className="font-bold text-gray-800 m-0 text-sm">{admin.name}</p>
                        <p className="text-xs text-gray-500 m-0 mb-1">{admin.email}</p>
                        <span className="bg-[#0d6efd] text-white text-[10px] px-2 py-0.5 rounded font-bold inline-flex items-center gap-1">
                          <i className="bi bi-laptop"></i> {admin.role}
                        </span>
                      </div>
                      <input 
                        type="radio" 
                        name="selectedAdmin" 
                        value={admin.id}
                        checked={handoverData.adminId == admin.id}
                        onChange={(e) => setHandoverData({...handoverData, adminId: e.target.value})}
                        className="w-4 h-4 text-[#17a2b8] focus:ring-[#17a2b8] border-gray-300 cursor-pointer"
                      />
                    </label>
                  ))}

                </div>
              </div>

              <p className="text-[10px] text-gray-400 flex items-center gap-1 mt-3 mb-0">
                <i className="bi bi-info-circle"></i> Only admins with matching specialization are shown
              </p>

            </div>

            {/* Modal Footer */}
            <div className="border-t border-gray-100 p-4 bg-gray-50 flex justify-end gap-3 rounded-b-xl">
              <button 
                onClick={closeHandoverModal}
                className="px-4 py-2 rounded-lg text-sm font-bold text-gray-600 bg-white border border-gray-300 hover:bg-gray-100 transition-colors flex items-center gap-2"
              >
                <i className="bi bi-x"></i> Cancel
              </button>
              <button 
                onClick={submitHandover}
                className="px-4 py-2 rounded-lg text-sm font-bold text-white bg-[#17a2b8] hover:bg-[#138496] transition-colors flex items-center gap-2 border-none shadow-sm"
              >
                <i className="bi bi-person-check"></i> Approve & Handover
              </button>
            </div>

          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
        .animate-fadeIn { animation: fadeIn 0.2s ease-out forwards; }
        .animate-slideUp { animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #c1c1c1; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #a8a8a8; }
      `}</style>
    </div>
  );
};

export default PendingAssignments;