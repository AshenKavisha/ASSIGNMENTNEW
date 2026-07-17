import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/admin/Sidebar';

const AssignmentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`/api/admin/assignments/${id}`, { credentials: 'include' })
        .then(res => {
          if (res.status === 401) { navigate('/login'); return null; }
          if (!res.ok) throw new Error('Assignment not found');
          return res.json();
        })
        .then(data => {
          if (data) { setAssignment(data); setLoading(false); }
        })
        .catch(err => {
          setError(err.message);
          setLoading(false);
        });
  }, [id]);

  if (loading) {
    return (
        <div className="flex min-h-screen bg-[#f5f7fa]">
          <Sidebar />
          <div className="flex-1 ml-64 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin border-4 border-blue-500 border-t-transparent rounded-full w-12 h-12 mx-auto mb-4"></div>
              <p className="text-gray-500">Loading assignment details...</p>
            </div>
          </div>
        </div>
    );
  }

  if (error || !assignment) {
    return (
        <div className="flex min-h-screen bg-[#f5f7fa]">
          <Sidebar />
          <div className="flex-1 ml-64 flex items-center justify-center">
            <div className="text-center">
              <i className="bi bi-exclamation-triangle text-5xl text-red-500 mb-4 block"></i>
              <p className="text-gray-500">{error || 'Assignment not found'}</p>
              <Link to="/admin/assignments" className="mt-4 inline-block bg-blue-500 text-white px-6 py-2 rounded-xl no-underline">
                Back to Assignments
              </Link>
            </div>
          </div>
        </div>
    );
  }

  const statusColors = {
    PENDING: 'bg-yellow-400 text-gray-900',
    APPROVED: 'bg-blue-500 text-white',
    IN_PROGRESS: 'bg-orange-400 text-white',
    DELIVERED: 'bg-green-500 text-white',
    COMPLETED: 'bg-green-700 text-white',
    REJECTED: 'bg-red-500 text-white',
    REVISION_REQUESTED: 'bg-purple-500 text-white',
  };

  return (
      <div className="flex min-h-screen bg-[#f5f7fa]">
        <Sidebar />

        <div className="flex-1 ml-64 pb-12 font-sans overflow-x-hidden">
          <div className="container mx-auto px-6 mt-8">

            {/* Page Header */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-4xl font-extrabold text-[#2c3e50] flex items-center">
                  <i className="bi bi-journal-text me-3 text-[#0d6efd]"></i>Assignment Details
                </h1>
                <p className="text-lg text-gray-500 mt-1">View complete assignment information</p>
              </div>
              <Link to="/admin/assignments" className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all no-underline">
                <i className="bi bi-arrow-left"></i> Back to Assignments
              </Link>
            </div>

            {/* Assignment Details Card */}
            <div className="bg-white rounded-xl shadow-md border-l-4 border-[#0d6efd] overflow-hidden mb-6">
              <div className="bg-[#0d6efd] p-4 text-white">
                <h4 className="text-xl font-bold flex items-center gap-2">
                  <i className="bi bi-info-circle"></i> Assignment Information
                </h4>
              </div>

              <div className="p-8">
                {/* Basic Details */}
                <div className="bg-gray-50 rounded-xl p-6 mb-6">
                  <h5 className="text-[#0d6efd] font-bold mb-4 flex items-center gap-2 border-b pb-2">
                    <i className="bi bi-file-text"></i> Basic Details
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
                    <div>
                      <p className="mb-2"><strong>Title:</strong> {assignment.title}</p>
                      <p className="mb-2"><strong>Subject:</strong> {assignment.subject}</p>
                      <p className="mb-2 flex items-center gap-2">
                        <strong>Type:</strong>
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold text-white ${assignment.type === 'IT' ? 'bg-blue-500' : 'bg-green-500'}`}>
                        {assignment.type} Assignment
                      </span>
                      </p>
                    </div>
                    <div>
                      <p className="mb-2 flex items-center gap-2">
                        <strong>Status:</strong>
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${statusColors[assignment.status] || 'bg-gray-400 text-white'}`}>
                        {assignment.status}
                      </span>
                      </p>
                      {assignment.price && (
                          <p className="mb-2"><strong>Price:</strong> ${assignment.price}</p>
                      )}
                      {assignment.deadline && (
                          <p className="mb-2"><strong>Deadline:</strong> <span className="text-red-500 font-bold">{assignment.deadline}</span></p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Description */}
                {assignment.description && (
                    <div className="bg-gray-50 rounded-xl p-6 mb-6">
                      <h5 className="text-[#0d6efd] font-bold mb-3 flex items-center gap-2">
                        <i className="bi bi-card-text"></i> Description
                      </h5>
                      <p className="text-gray-600 leading-relaxed">{assignment.description}</p>
                    </div>
                )}

                {/* Additional Requirements */}
                {assignment.additionalRequirements && (
                    <div className="bg-gray-50 rounded-xl p-6 mb-6">
                      <h5 className="text-[#0d6efd] font-bold mb-3 flex items-center gap-2">
                        <i className="bi bi-clipboard-check"></i> Additional Requirements
                      </h5>
                      <p className="text-gray-600 leading-relaxed">{assignment.additionalRequirements}</p>
                    </div>
                )}

                {/* Student Information */}
                <div className="bg-gray-50 rounded-xl p-6 mb-6">
                  <h5 className="text-[#0d6efd] font-bold mb-4 flex items-center gap-2 border-b pb-2">
                    <i className="bi bi-person"></i> Student Information
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
                    <div>
                      <p className="mb-2"><strong>Name:</strong> {assignment.user?.fullName}</p>
                      <p className="mb-2"><strong>Email:</strong> {assignment.user?.email}</p>
                    </div>
                    <div>
                      {assignment.createdAt && <p className="mb-2"><strong>Submitted On:</strong> {assignment.createdAt}</p>}
                      {assignment.updatedAt && <p className="mb-2"><strong>Last Updated:</strong> {assignment.updatedAt}</p>}
                    </div>
                  </div>
                </div>

                {/* Assigned Admin */}
                {assignment.assignedAdmin && (
                    <div className="bg-gray-50 rounded-xl p-6 mb-6">
                      <h5 className="text-[#0d6efd] font-bold mb-3 flex items-center gap-2">
                        <i className="bi bi-shield-check"></i> Assigned Admin
                      </h5>
                      <p className="text-gray-700"><strong>{assignment.assignedAdmin.fullName}</strong></p>
                    </div>
                )}

                {/* Admin Notes */}
                {assignment.adminNotes && (
                    <div className="bg-blue-50 border-l-4 border-blue-400 rounded-r-xl p-6 mb-6">
                      <h5 className="text-[#0d6efd] font-bold mb-2 flex items-center gap-2">
                        <i className="bi bi-chat-text"></i> Admin Notes
                      </h5>
                      <p className="text-gray-700 italic">"{assignment.adminNotes}"</p>
                    </div>
                )}

                {/* Revision Requests */}
                {assignment.revisionRequests && assignment.revisionRequests.length > 0 && (
                    <div className="bg-orange-50 border-l-4 border-orange-400 rounded-r-xl p-6 mb-6">
                      <h5 className="text-orange-700 font-bold mb-3 flex items-center gap-2">
                        <i className="bi bi-arrow-repeat"></i> Revision Requests ({assignment.revisionRequests.length})
                      </h5>
                      {assignment.revisionRequests.map((rev, idx) => (
                          <div key={idx} className="bg-white rounded-lg p-4 mb-2 border border-orange-200">
                            <p className="text-xs text-gray-500 mb-1"><i className="bi bi-clock me-1"></i>{rev.requestedAt}</p>
                            <p className="text-gray-700 italic">"{rev.reason}"</p>
                            <span className={`text-xs font-bold px-2 py-1 rounded-full ${rev.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                        {rev.status}
                      </span>
                          </div>
                      ))}
                    </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-[#2c3e50] p-4 text-white">
                <h4 className="text-xl font-bold flex items-center gap-2">
                  <i className="bi bi-gear"></i> Actions
                </h4>
              </div>
              <div className="p-10 text-center">
                <div className="flex flex-wrap justify-center gap-4">
                  <Link to="/admin/assignments" className="px-8 py-3 rounded-full border-2 border-gray-400 text-gray-600 font-bold uppercase tracking-wider hover:bg-gray-100 transition-all flex items-center gap-2 no-underline">
                    <i className="bi bi-arrow-left"></i> Back to List
                  </Link>

                  {assignment.status === 'PENDING' && (
                      <Link to="/admin/assignments/pending" className="px-8 py-3 rounded-full bg-yellow-500 text-white font-bold uppercase tracking-wider shadow-lg hover:bg-yellow-600 hover:-translate-y-1 transition-all flex items-center gap-2 no-underline">
                        <i className="bi bi-check-circle"></i> Go to Approve
                      </Link>
                  )}

                  {assignment.status !== 'DELIVERED' && assignment.status !== 'PENDING' && assignment.status !== 'REJECTED' && (
                      <Link to={`/admin/assignments/${id}/deliver`} className="px-8 py-3 rounded-full bg-green-600 text-white font-bold uppercase tracking-wider shadow-lg hover:bg-green-700 hover:-translate-y-1 transition-all flex items-center gap-2 no-underline">
                        <i className="bi bi-send-check"></i> Deliver Solution
                      </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .animate-fadeIn { animation: fadeIn 0.8s ease-out; }
      `}</style>
      </div>
  );
};

export default AssignmentDetails;