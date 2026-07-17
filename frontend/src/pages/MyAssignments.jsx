import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const MyAssignments = () => {
  const [activeRevisionModal, setActiveRevisionModal] = useState(null);
  const [revisionReason, setRevisionReason] = useState('');

  // Mock User
  const user = { fullName: "Ashen Kaveesha" };

  // Mock Assignments Data (සෑම Status එකක්ම පරීක්ෂා කිරීමට)
  const assignments = [
    {
      id: 101,
      title: "Java OOP Assignment",
      type: "IT",
      subject: "Object Oriented Programming",
      status: "APPROVED",
      createdAt: "Mar 10, 2026 10:30",
      deadline: "Mar 15, 2026 23:59",
      price: 45.00,
      payment: null // Ready for Payment
    },
    {
      id: 102,
      title: "Construction Measurement",
      type: "QUANTITY_SURVEYING",
      subject: "Quantity Surveying",
      status: "IN_PROGRESS",
      createdAt: "Mar 08, 2026 14:20",
      deadline: "Mar 18, 2026 23:59",
      price: 50.00,
      payment: { status: "COMPLETED", currency: { symbol: "$" } }
    },
    {
      id: 103,
      title: "Database Management System",
      type: "IT",
      subject: "Database Systems",
      status: "DELIVERED",
      createdAt: "Mar 01, 2026 09:15",
      deadline: "Mar 10, 2026 23:59",
      price: 35.00,
      payment: { status: "COMPLETED", currency: { symbol: "$" } },
      solutionFiles: ["solution.zip"],
      revisionsUsed: 0,
      maxRevisions: 2,
      revisionRequests: []
    },
    {
      id: 104,
      title: "Python Data Analysis",
      type: "IT",
      subject: "Data Science",
      status: "REJECTED",
      createdAt: "Mar 17, 2026 11:00",
      adminNotes: "The requirements provided are incomplete. Please provide the dataset to proceed."
    },
    {
      id: 105,
      title: "Project Planning & Scheduling",
      type: "QUANTITY_SURVEYING",
      subject: "Project Management",
      status: "PENDING",
      createdAt: "Mar 18, 2026 08:30"
    }
  ];

  // Helper functions for styling based on status
  const getCardBorderColor = (status) => {
    switch (status) {
      case 'DELIVERED': return 'border-l-[#17a2b8]';
      case 'COMPLETED': case 'APPROVED': return 'border-l-[#28a745]';
      case 'IN_PROGRESS': return 'border-l-[#ffc107]';
      case 'REJECTED': return 'border-l-[#dc3545]';
      default: return 'border-l-[#6c757d]'; // PENDING
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING': return <span className="bg-gray-500 text-white text-[10px] font-bold px-3 py-1 rounded-full"><i className="bi bi-clock"></i> PENDING</span>;
      case 'APPROVED': return <span className="bg-green-500 text-white text-[10px] font-bold px-3 py-1 rounded-full"><i className="bi bi-check-circle"></i> APPROVED</span>;
      case 'REJECTED': return <span className="bg-red-500 text-white text-[10px] font-bold px-3 py-1 rounded-full"><i className="bi bi-x-circle"></i> REJECTED</span>;
      case 'DELIVERED': return <span className="bg-cyan-500 text-white text-[10px] font-bold px-3 py-1 rounded-full"><i className="bi bi-send-check"></i> DELIVERED</span>;
      case 'COMPLETED': return <span className="bg-green-500 text-white text-[10px] font-bold px-3 py-1 rounded-full"><i className="bi bi-check-circle"></i> COMPLETED</span>;
      case 'IN_PROGRESS': return <span className="bg-yellow-500 text-white text-[10px] font-bold px-3 py-1 rounded-full"><i className="bi bi-gear"></i> IN PROGRESS</span>;
      case 'REVISION_REQUESTED': return <span className="bg-gradient-to-r from-[#f093fb] to-[#f5576c] text-white text-[10px] font-bold px-3 py-1 rounded-full"><i className="bi bi-arrow-repeat"></i> REVISION REQUESTED</span>;
      default: return null;
    }
  };

  const handleRevisionSubmit = (e) => {
    e.preventDefault();
    alert(`Revision requested for Assignment #${activeRevisionModal.id} with reason: ${revisionReason}`);
    setActiveRevisionModal(null);
    setRevisionReason('');
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col font-sans">
      
      {/* Navbar */}
      <nav className="bg-[#212529] text-white py-3 px-6 shadow-md sticky top-0 z-50">
        <div className="container mx-auto flex flex-wrap justify-between items-center gap-4">
          <Link to="/dashboard" className="text-xl font-bold flex items-center gap-2 hover:text-gray-300 transition-colors no-underline text-white">
            <i className="bi bi-journal-check text-[#3498db]"></i> Assignment Service
          </Link>
          <div className="flex items-center gap-4 ml-auto">
            <Link to="/dashboard" className="border border-white/30 px-3 py-1.5 rounded hover:bg-white hover:text-black transition-all font-bold text-sm flex items-center gap-2 text-white no-underline">
              <i className="bi bi-speedometer2"></i> <span className="hidden sm:inline">Dashboard</span>
            </Link>
            <Link to="/login?logout=true" className="bg-[#dc3545] hover:bg-[#c82333] px-3 py-1.5 rounded transition-all font-bold text-sm flex items-center gap-2 text-white no-underline border border-transparent">
              <i className="bi bi-box-arrow-right"></i> <span className="hidden sm:inline">Logout</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 flex-1 max-w-5xl">
        
        {/* Page Header */}
        <div className="bg-gradient-to-r from-[#667eea] to-[#764ba2] rounded-[12px] p-8 text-white mb-8 shadow-md animate-fadeInDown">
          <h1 className="text-3xl font-bold flex items-center gap-3 mb-2 m-0">
            <i className="bi bi-list-task"></i> My Assignments
          </h1>
          <p className="text-lg text-white/80 m-0 font-medium">Track your assignments, check approval status, and complete payments</p>
        </div>

        {/* Assignments List */}
        {assignments.length > 0 ? (
          <div className="space-y-6">
            {assignments.map((assignment, index) => (
              <div key={assignment.id} className={`bg-white rounded-xl shadow-sm hover:shadow-[0_8px_20px_rgba(0,0,0,0.1)] transition-all duration-300 hover:-translate-y-1 border-l-[5px] ${getCardBorderColor(assignment.status)} animate-fadeInUp`} style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="p-6 md:p-8">
                  <div className="flex flex-col md:flex-row gap-6">
                    
                    {/* Assignment Details (Left Side) */}
                    <div className="flex-1">
                      <h4 className="text-2xl font-bold text-gray-800 mb-4 flex items-start gap-2">
                        <i className="bi bi-file-earmark-text text-[#3498db] mt-1"></i> {assignment.title}
                      </h4>

                      <div className="flex flex-wrap items-center gap-2 mb-4">
                        <span className={`text-[10px] font-bold px-3 py-1 rounded-md text-white ${assignment.type === 'IT' ? 'bg-blue-500' : 'bg-green-500'}`}>
                          <i className={`bi ${assignment.type === 'IT' ? 'bi-laptop' : 'bi-calculator'} me-1`}></i>
                          {assignment.type === 'IT' ? 'IT Assignment' : 'QS Assignment'}
                        </span>
                        {getStatusBadge(assignment.status)}
                      </div>

                      <div className="space-y-2 text-gray-500 text-sm mb-6">
                        <p className="m-0"><strong className="text-gray-700">Subject:</strong> {assignment.subject}</p>
                        <p className="m-0"><strong className="text-gray-700">Submitted:</strong> {assignment.createdAt}</p>
                        {assignment.deadline && <p className="m-0"><strong className="text-gray-700">Deadline:</strong> {assignment.deadline}</p>}
                      </div>

                      {/* Price Display */}
                      {assignment.price && (
                        <div className="bg-gradient-to-br from-[#fff9e6] to-[#ffe5b4] border-l-4 border-[#ffc107] p-4 rounded-lg mt-4 flex justify-between items-center shadow-sm">
                          <strong className="text-gray-800">Assignment Fee:</strong>
                          <span className="text-2xl font-black text-[#ff9800]">
                            {assignment.payment?.currency?.symbol || '$'}{assignment.price.toFixed(2)}
                          </span>
                        </div>
                      )}

                      {/* Approval Status Section */}
                      <div className="bg-gray-50 p-5 rounded-xl mt-6 border-2 border-gray-100">
                        <h6 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><i className="bi bi-shield-check text-[#3498db]"></i> Approval Status</h6>
                        
                        {assignment.status === 'PENDING' && (
                          <div>
                            <span className="bg-gradient-to-br from-[#fff3cd] to-[#ffe5b4] text-[#856404] border-2 border-[#ffc107] px-4 py-2 rounded-full text-sm font-bold shadow-sm inline-flex items-center gap-2">
                              <i className="bi bi-hourglass-split"></i> Awaiting Admin Review
                            </span>
                            <p className="text-gray-500 mt-3 mb-0 text-sm">Your assignment is being reviewed by our admin team.</p>
                          </div>
                        )}

                        {['APPROVED', 'IN_PROGRESS', 'DELIVERED', 'COMPLETED'].includes(assignment.status) && (
                          <div>
                            <span className="bg-gradient-to-br from-[#d4edda] to-[#c3e6cb] text-[#155724] border-2 border-[#28a745] px-4 py-2 rounded-full text-sm font-bold shadow-sm inline-flex items-center gap-2">
                              <i className="bi bi-patch-check-fill"></i> Approved by Admin
                            </span>
                            <p className="text-green-600 mt-3 mb-0 text-sm font-medium"><i className="bi bi-check-circle"></i> Your assignment has been approved and is ready for processing.</p>
                          </div>
                        )}

                        {assignment.status === 'REJECTED' && (
                          <div>
                            <span className="bg-gradient-to-br from-[#f8d7da] to-[#f5c6cb] text-[#721c24] border-2 border-[#dc3545] px-4 py-2 rounded-full text-sm font-bold shadow-sm inline-flex items-center gap-2">
                              <i className="bi bi-x-circle-fill"></i> Not Approved
                            </span>
                            <p className="text-red-500 mt-3 mb-0 text-sm font-medium"><i className="bi bi-exclamation-triangle"></i> Your assignment was not approved. Please check the reason below.</p>
                          </div>
                        )}
                      </div>

                      {/* Payment Section (If Approved/In Progress) */}
                      {['APPROVED', 'IN_PROGRESS'].includes(assignment.status) && (
                        <div className="bg-gradient-to-br from-[#e8f5e9] to-[#c8e6c9] border-l-[5px] border-[#28a745] p-5 rounded-xl mt-6">
                          <h6 className="font-bold text-[#155724] mb-4 flex items-center gap-2"><i className="bi bi-credit-card"></i> Payment Status</h6>
                          
                          {assignment.payment?.status === 'COMPLETED' && (
                            <div className="bg-[#d4edda] border-l-4 border-[#28a745] text-[#155724] p-4 rounded-lg flex items-start gap-3">
                              <i className="bi bi-check-circle-fill text-2xl mt-0.5"></i>
                              <div>
                                <strong className="block text-base">Payment Completed!</strong>
                                <span className="text-sm">✓ Payment verified and confirmed. Your assignment is now in progress.</span>
                              </div>
                            </div>
                          )}

                          {!assignment.payment && (
                            <div>
                              <div className="bg-[#fff3cd] border-l-4 border-[#ffc107] text-[#856404] p-4 rounded-lg flex items-start gap-3 mb-4">
                                <i className="bi bi-credit-card-2-front text-2xl mt-0.5"></i>
                                <div>
                                  <strong className="block text-base">Ready for Payment</strong>
                                  <span className="text-sm">Your assignment has been approved. Click below to proceed with payment.</span>
                                </div>
                              </div>
                              <Link to={`/payment/checkout?id=${assignment.id}`} className="block w-full text-center bg-gradient-to-br from-[#28a745] to-[#20c997] text-white font-bold py-3 rounded-xl shadow-[0_5px_20px_rgba(40,167,69,0.3)] hover:shadow-[0_8px_25px_rgba(40,167,69,0.4)] hover:-translate-y-1 transition-all no-underline">
                                <i className="bi bi-cash-coin me-2"></i> Click to Pay
                              </Link>
                            </div>
                          )}
                        </div>
                      )}

                      {/* PAID Badge (For Delivered/Completed without showing full payment section) */}
                      {['DELIVERED', 'COMPLETED'].includes(assignment.status) && (
                        <div className="bg-gradient-to-br from-[#d4edda] to-[#c3e6cb] border-2 border-[#28a745] p-4 rounded-xl mt-6 flex items-center gap-3">
                          <i className="bi bi-check-circle-fill text-[1.5rem] text-[#28a745]"></i>
                          <div>
                            <strong className="text-[#28a745] block">✓ PAID</strong>
                            <span className="text-[#155724] text-sm">Payment verified and confirmed</span>
                          </div>
                        </div>
                      )}

                      {/* Rejection Notice */}
                      {assignment.status === 'REJECTED' && assignment.adminNotes && (
                        <div className="bg-[#f8d7da] border-l-4 border-[#dc3545] p-4 rounded-lg mt-6 text-[#721c24]">
                          <strong><i className="bi bi-x-circle me-2"></i>Rejection Reason:</strong>
                          <p className="mb-0 mt-2 text-sm">{assignment.adminNotes}</p>
                        </div>
                      )}

                      {/* Revision Info */}
                      {(assignment.status === 'DELIVERED' || assignment.status === 'REVISION_REQUESTED') && (
                        <div className="bg-[#fff3cd] border-l-4 border-[#ffc107] p-4 rounded-lg mt-6 text-[#856404]">
                          <div className="flex items-center gap-2 mb-2">
                            <i className="bi bi-info-circle"></i>
                            <strong>Revisions:</strong>
                            <span>{assignment.revisionsUsed} used / {assignment.maxRevisions} available</span>
                          </div>
                          {assignment.revisionsUsed >= assignment.maxRevisions ? (
                            <span className="text-[#dc3545] text-sm font-bold"><i className="bi bi-exclamation-circle"></i> No revisions remaining</span>
                          ) : (
                            <span className="text-[#28a745] text-sm font-bold"><i className="bi bi-check-circle"></i> {assignment.maxRevisions - assignment.revisionsUsed} revisions remaining</span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Action Buttons (Right Side) */}
                    <div className="w-full md:w-48 flex flex-col gap-3 justify-start border-t md:border-t-0 md:border-l border-gray-100 pt-6 md:pt-0 md:pl-6">
                      
                      <Link to={`/assignments/${assignment.id}`} className="btn bg-gray-100 text-gray-700 hover:bg-gray-200 font-bold w-full rounded-lg py-2.5 transition-colors border border-gray-200 no-underline text-center">
                         <i className="bi bi-eye"></i> View Details
                      </Link>

                      {assignment.status === 'DELIVERED' && assignment.solutionFiles && (
                        <button className="btn bg-[#28a745] text-white hover:bg-[#218838] font-bold w-full rounded-lg py-2.5 transition-colors shadow-sm">
                          <i className="bi bi-download"></i> Download Solution
                        </button>
                      )}

                      {assignment.status === 'DELIVERED' && assignment.revisionsUsed < assignment.maxRevisions && (
                        <button 
                          onClick={() => setActiveRevisionModal(assignment)}
                          className="btn bg-gradient-to-r from-[#f093fb] to-[#f5576c] text-white font-bold w-full rounded-lg py-2.5 transition-all shadow-[0_4px_15px_rgba(240,147,251,0.3)] hover:-translate-y-0.5"
                        >
                          <i className="bi bi-arrow-repeat"></i> Request Revision
                        </button>
                      )}

                      {assignment.status === 'REVISION_REQUESTED' && (
                        <div className="bg-[#e3f2fd] text-[#0d6efd] p-3 rounded-lg text-center border border-[#b6d4fe] text-sm font-bold">
                          <i className="bi bi-hourglass-split animate-spin-slow inline-block"></i> <br/>Revision in progress...
                        </div>
                      )}
                    </div>

                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
            <i className="bi bi-inbox text-[5rem] text-gray-300 mb-4 block"></i>
            <h3 className="text-2xl font-bold text-gray-700">No Assignments Yet</h3>
            <p className="text-gray-500 mb-6">You haven't submitted any assignments yet.</p>
            <Link to="/assignments/create" className="bg-[#3498db] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#2980b9] transition-colors no-underline shadow-md">
              <i className="bi bi-plus-lg"></i> Submit New Assignment
            </Link>
          </div>
        )}
      </div>

      {/* Revision Modal */}
      {activeRevisionModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white rounded-[15px] w-full max-w-lg overflow-hidden shadow-2xl animate-scaleUp">
            <div className="bg-gradient-to-r from-[#667eea] to-[#764ba2] p-5 text-white flex justify-between items-center">
              <h5 className="text-xl font-bold flex items-center gap-2 m-0"><i className="bi bi-arrow-repeat"></i> Request Revision</h5>
              <button onClick={() => setActiveRevisionModal(null)} className="text-white hover:text-gray-200 transition-colors"><i className="bi bi-x-lg text-xl"></i></button>
            </div>
            <form onSubmit={handleRevisionSubmit} className="p-6">
              <div className="bg-[#e3f2fd] text-[#0d6efd] p-4 rounded-xl mb-6 font-medium text-sm flex gap-3 items-start border border-[#b6d4fe]">
                <i className="bi bi-info-circle-fill text-lg"></i>
                <p className="m-0">You have <strong>{activeRevisionModal.maxRevisions - activeRevisionModal.revisionsUsed}</strong> revision(s) remaining for this assignment.</p>
              </div>
              <div className="mb-6">
                <label className="block text-gray-800 font-bold mb-2">What changes would you like?</label>
                <textarea 
                  value={revisionReason}
                  onChange={(e) => setRevisionReason(e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-xl p-4 focus:border-[#667eea] focus:outline-none transition-colors resize-none"
                  rows="5"
                  placeholder="Please describe in detail what needs to be revised or corrected..."
                  required
                ></textarea>
                <p className="text-xs text-gray-500 mt-2">Be specific about what needs to be changed for faster processing.</p>
              </div>
              <div className="bg-yellow-50 text-yellow-800 p-3 rounded-lg text-xs font-medium mb-6 flex gap-2 border border-yellow-200">
                <i className="bi bi-exclamation-triangle"></i>
                <span><strong>Note:</strong> Once submitted, the admin will review your request. You'll be notified via email when the revised solution is ready.</span>
              </div>
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setActiveRevisionModal(null)} className="px-6 py-2.5 rounded-xl bg-gray-100 text-gray-600 font-bold hover:bg-gray-200 transition-colors">Cancel</button>
                <button type="submit" className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#f093fb] to-[#f5576c] text-white font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2">
                  <i className="bi bi-send"></i> Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-[#212529] text-white/50 text-center py-6 text-sm mt-auto">
        <p className="mb-0">&copy; 2026 Assignment Service. All rights reserved.</p>
      </footer>

      <style>{`
        @keyframes fadeInDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleUp { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        
        .animate-fadeInDown { animation: fadeInDown 0.5s ease-out forwards; }
        .animate-fadeInUp { animation: fadeInUp 0.5s ease-out forwards; }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out forwards; }
        .animate-scaleUp { animation: scaleUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
        
        .animate-spin-slow { animation: spin 3s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default MyAssignments;