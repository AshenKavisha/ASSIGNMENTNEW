import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/admin/Sidebar';

const TotalAssignments = () => {
  const [activeTab, setActiveTab] = useState('ALL');
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentAdmin, setCurrentAdmin] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState(null);
  const navigate = useNavigate();

  // Fetch current admin info
  useEffect(() => {
    fetch('/api/auth/me', { credentials: 'include' })
        .then(res => { if (!res.ok) navigate('/login'); return res.json(); })
        .then(data => setCurrentAdmin(data))
        .catch(() => navigate('/login'));
  }, []);

  // Fetch assignments when tab changes
  useEffect(() => {
    setLoading(true);
    const url = activeTab === 'ALL'
        ? '/api/admin/assignments'
        : `/api/admin/assignments?status=${activeTab}`;

    fetch(url, { credentials: 'include' })
        .then(res => { if (!res.ok) navigate('/login'); return res.json(); })
        .then(data => { setAssignments(data); setLoading(false); })
        .catch(() => { setAssignments([]); setLoading(false); });
  }, [activeTab]);

  // Count per tab from all assignments
  const [allAssignments, setAllAssignments] = useState([]);
  useEffect(() => {
    fetch('/api/admin/assignments', { credentials: 'include' })
        .then(res => res.json())
        .then(data => setAllAssignments(data))
        .catch(() => {});
  }, []);

  const tabStats = {
    ALL: allAssignments.length,
    PENDING: allAssignments.filter(a => a.status === 'PENDING').length,
    APPROVED: allAssignments.filter(a => ['APPROVED', 'IN_PROGRESS', 'READY_FOR_DELIVERY'].includes(a.status)).length,
    DELIVERED: allAssignments.filter(a => a.status === 'DELIVERED').length,
    REVISION_REQUESTED: allAssignments.filter(a => a.status === 'REVISION_REQUESTED').length,
  };

  return (
      <div className="flex min-h-screen bg-gradient-to-br from-[#f0f4ff] to-[#f8fafc]">
        <Sidebar />

        <div className="flex-1 ml-64 pb-12 font-sans overflow-x-hidden">
          <div className="container mx-auto px-6 mt-8">

            {/* Page Header */}
            <div className="bg-white rounded-[20px] p-8 mb-8 shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-[#e2e8f0] flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-[#1e293b] mb-2 flex items-center">
                  <i className="bi bi-briefcase me-3 text-[#4361ee]"></i> My Assignments
                </h1>
                <p className="text-[#64748b] text-lg mb-0">Manage and track all your assigned assignments</p>
              </div>
              <Link to="/admin/dashboard" className="bg-gradient-to-r from-[#64748b] to-[#475569] text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2 hover:-translate-y-1 transition-all no-underline">
                <i className="bi bi-arrow-left"></i> Back to Dashboard
              </Link>
            </div>

            {/* Assignment Tabs */}
            <div className="bg-white rounded-[16px] p-4 mb-8 shadow-md border border-[#e2e8f0]">
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {[
                  { label: 'All Assignments', val: 'ALL', icon: 'bi-list-ul' },
                  { label: 'Pending Approval', val: 'PENDING', icon: 'bi-hourglass-split' },
                  { label: 'Approved / In Progress', val: 'APPROVED', icon: 'bi-check-circle' },
                  { label: 'Delivered', val: 'DELIVERED', icon: 'bi-send-check' },
                  { label: 'Revision Requests', val: 'REVISION_REQUESTED', icon: 'bi-arrow-repeat' }
                ].map((tab) => (
                    <button
                        key={tab.val}
                        onClick={() => setActiveTab(tab.val)}
                        className={`flex-1 min-w-[200px] p-4 rounded-xl transition-all duration-300 flex flex-col items-center gap-2 relative border-2 ${
                            activeTab === tab.val
                                ? 'bg-gradient-to-br from-[#4361ee] to-[#3a0ca3] text-white border-[#4361ee] shadow-lg scale-105'
                                : 'bg-[#f8fafc] text-[#64748b] border-transparent hover:bg-[#e2e8f0] hover:text-[#4361ee]'
                        }`}
                    >
                      {tab.val === 'REVISION_REQUESTED' && tabStats.REVISION_REQUESTED > 0 && (
                          <span className="absolute top-2 right-2 w-5 h-5 bg-[#ef4444] text-white rounded-full flex items-center justify-center text-[10px] font-bold animate-pulse">!</span>
                      )}
                      <i className={`bi ${tab.icon} text-2xl`}></i>
                      <span className="text-sm font-semibold text-center">{tab.label}</span>
                      <span className={`px-3 py-0.5 rounded-full text-xs font-bold ${activeTab === tab.val ? 'bg-white/20' : 'bg-white/30'}`}>
                    {tabStats[tab.val] || 0}
                  </span>
                    </button>
                ))}
              </div>
            </div>

            {/* Loading */}
            {loading ? (
                <div className="text-center py-20">
                  <div className="animate-spin border-4 border-blue-500 border-t-transparent rounded-full w-12 h-12 mx-auto mb-4"></div>
                  <p className="text-gray-500">Loading assignments...</p>
                </div>
            ) : assignments.length > 0 ? (
                <div className="space-y-6">
                  {assignments.map((item) => (
                      <div key={item.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100">
                        <div className="bg-gradient-to-r from-[#f8fafc] to-[#e2e8f0] p-6 border-b-2 border-[#e2e8f0] flex justify-between items-start">
                          <div>
                            <h3 className="text-xl font-bold text-[#1e293b] mb-2">{item.title}</h3>
                            <p className="text-[#64748b] text-sm flex items-center gap-2">
                              <i className="bi bi-person"></i> {item.user?.fullName} • <i className="bi bi-envelope"></i> {item.user?.email}
                            </p>
                            <div className="flex gap-2 mt-3">
                        <span className={`px-4 py-1 rounded-full text-[10px] font-bold text-white flex items-center gap-1 ${item.type === 'IT' ? 'bg-gradient-to-r from-[#4361ee] to-[#3a0ca3]' : 'bg-gradient-to-r from-[#10b981] to-[#059669]'}`}>
                          <i className={`bi ${item.type === 'IT' ? 'bi-code-slash' : 'bi-calculator'}`}></i> {item.type}
                        </span>
                              <span className={`px-4 py-1 rounded-full text-[10px] font-bold text-white flex items-center gap-1 ${
                                  item.status === 'PENDING' ? 'bg-yellow-500' :
                                      item.status === 'APPROVED' ? 'bg-blue-500' :
                                          item.status === 'DELIVERED' ? 'bg-green-500' :
                                              item.status === 'REVISION_REQUESTED' ? 'bg-orange-500' : 'bg-gray-500'
                              }`}>
                          {item.status}
                        </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="mb-2 text-sm">
                              <span className="text-gray-400">Revisions:</span>
                              <span className="font-bold ml-1">{item.revisionsUsed}</span>
                              <span className="text-gray-400 mx-1">/</span>
                              <span className="font-bold">{item.maxRevisions}</span>
                            </div>
                            <div className="text-gray-500 text-xs font-medium">
                              <i className="bi bi-book me-1"></i> {item.subject}
                            </div>
                            {item.assignedAdmin && (
                                <div className="text-gray-400 text-[10px] mt-1 italic">
                                  Assigned: {item.assignedAdmin.fullName}
                                </div>
                            )}
                          </div>
                        </div>

                        <div className="p-6">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                            <div className="flex flex-col">
                              <span className="text-[10px] font-bold text-[#64748b] uppercase tracking-wider mb-1">Student</span>
                              <span className="text-sm font-medium">{item.user?.fullName}</span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[10px] font-bold text-[#64748b] uppercase tracking-wider mb-1">Email</span>
                              <span className="text-sm font-medium">{item.user?.email}</span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[10px] font-bold text-[#64748b] uppercase tracking-wider mb-1">Subject</span>
                              <span className="text-sm font-medium">{item.subject}</span>
                            </div>
                          </div>

                          {item.latestRevision && (
                              <div className="bg-gradient-to-r from-[#fef3c7] to-[#fde68a] border-l-4 border-[#f59e0b] rounded-lg p-4 mt-4">
                                <div className="flex items-center gap-2 mb-2 font-bold text-[#92400e]">
                                  <i className="bi bi-exclamation-triangle-fill"></i> Latest Revision Request
                                </div>
                                <p className="text-xs text-[#92400e] mb-2 font-medium">
                                  <i className="bi bi-clock me-1"></i> Requested on {item.latestRevision.requestedAt}
                                </p>
                                <p className="text-sm text-gray-800 italic">"{item.latestRevision.reason}"</p>
                              </div>
                          )}
                        </div>

                        <div className="bg-[#f8fafc] border-t border-[#e2e8f0] p-6 flex flex-wrap gap-3">
                          <Link to={`/admin/assignments/${item.id}`} className="px-6 py-2 rounded-xl bg-gradient-to-r from-[#64748b] to-[#475569] text-white text-sm font-bold flex items-center gap-2 hover:-translate-y-1 transition-all shadow-sm no-underline">
                            <i className="bi bi-eye"></i> View Details
                          </Link>
                          {item.status === 'PENDING' && (
                              <button
                                  onClick={() => navigate('/admin/assignments/pending')}
                                  className="px-6 py-2 rounded-xl bg-gradient-to-r from-[#10b981] to-[#059669] text-white text-sm font-bold flex items-center gap-2 hover:-translate-y-1 transition-all shadow-md"
                              >
                                <i className="bi bi-check-circle"></i> Approve
                              </button>
                          )}
                          {item.status === 'APPROVED' && (
                              <button className="px-6 py-2 rounded-xl bg-gradient-to-r from-[#10b981] to-[#059669] text-white text-sm font-bold flex items-center gap-2 hover:-translate-y-1 transition-all shadow-md">
                                <i className="bi bi-send-check"></i> Deliver Solution
                              </button>
                          )}
                          {item.status === 'REVISION_REQUESTED' && (
                              <>
                                <button className="px-6 py-2 rounded-xl bg-gradient-to-r from-[#06b6d4] to-[#0891b2] text-white text-sm font-bold flex items-center gap-2 hover:-translate-y-1 transition-all shadow-md">
                                  <i className="bi bi-cloud-upload"></i> Upload Files
                                </button>
                                <button
                                    onClick={() => { setSelectedAssignmentId(item.id); setShowRejectModal(true); }}
                                    className="px-6 py-2 rounded-xl bg-gradient-to-r from-[#ef4444] to-[#dc2626] text-white text-sm font-bold flex items-center gap-2 hover:-translate-y-1 transition-all shadow-md"
                                >
                                  <i className="bi bi-x-circle"></i> Reject
                                </button>
                              </>
                          )}
                        </div>
                      </div>
                  ))}
                </div>
            ) : (
                <div className="bg-white rounded-[20px] p-20 text-center shadow-sm border border-gray-100 flex flex-col items-center">
                  <i className="bi bi-inbox text-7xl text-gray-200 mb-4"></i>
                  <h3 className="text-2xl font-bold text-[#1e293b] mb-2">No Assignments Found</h3>
                  <p className="text-[#64748b]">There are no assignments in this category at the moment.</p>
                </div>
            )}
          </div>
        </div>

        {/* Reject Modal */}
        {showRejectModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn">
              <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
                <div className="bg-gradient-to-r from-[#ef4444] to-[#dc2626] p-4 text-white flex justify-between items-center">
                  <h5 className="text-lg font-bold flex items-center gap-2"><i className="bi bi-x-circle-fill"></i> Reject Revision Request</h5>
                  <button onClick={() => setShowRejectModal(false)} className="text-white"><i className="bi bi-x-lg"></i></button>
                </div>
                <div className="p-6">
                  <div className="mb-4">
                    <label className="block text-sm font-bold text-gray-700 mb-2">Reason for Rejection <span className="text-red-500">*</span></label>
                    <textarea rows="4" className="w-full border-2 border-gray-200 rounded-xl p-3 focus:border-[#ef4444] focus:outline-none transition-all" placeholder="Explain why this revision request is being rejected..."></textarea>
                  </div>
                  <div className="flex gap-3 justify-end">
                    <button onClick={() => setShowRejectModal(false)} className="px-6 py-2 rounded-xl bg-gray-100 text-gray-600 font-bold hover:bg-gray-200 transition-all">Cancel</button>
                    <button className="px-6 py-2 rounded-xl bg-[#ef4444] text-white font-bold hover:bg-[#dc2626] transition-all shadow-lg">Reject Request</button>
                  </div>
                </div>
              </div>
            </div>
        )}

        <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>
      </div>
  );
};

export default TotalAssignments;