import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import AssignmentStatusBar from '../components/AssignmentStatusBar'; // adjust path

const ViewAssignment = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  const [showRevisionModal, setShowRevisionModal] = useState(false);
  const [revisionReason, setRevisionReason] = useState('');
  const [revisionSubmitting, setRevisionSubmitting] = useState(false);
  const [revisionError, setRevisionError] = useState('');

  const [downloading, setDownloading] = useState(false);

  const fetchAssignment = () => {
    setLoading(true);
    fetch(`/api/assignments/${id}`, { credentials: 'include' })
        .then(res => {
          if (res.status === 401) { navigate('/login'); return null; }
          if (!res.ok) throw new Error('Failed to load assignment');
          return res.json();
        })
        .then(data => {
          if (!data) return;
          setAssignment(data);
          setLoadError(null);
          setLoading(false);
        })
        .catch(() => {
          setLoadError('Assignment not found or you do not have permission to view it.');
          setLoading(false);
        });
  };

  useEffect(() => {
    fetchAssignment();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const getStatusStyles = (status) => {
    switch (status) {
      case 'PENDING': return 'bg-[#fff3cd] text-[#856404] border border-[#ffeeba]';
      case 'APPROVED': case 'DELIVERED': case 'COMPLETED': case 'PAID': return 'bg-[#d1e7dd] text-[#0f5132] border border-[#badbcc]';
      case 'IN_PROGRESS': return 'bg-[#cfe2ff] text-[#084298] border border-[#b6d4fe]';
      case 'REJECTED': return 'bg-[#f8d7da] text-[#842029] border border-[#f5c2c7]';
      case 'REVISION_REQUESTED': return 'bg-gradient-to-r from-[#f093fb] to-[#f5576c] text-white shadow-md';
      default: return 'bg-gray-200 text-gray-800';
    }
  };

  const submitRevision = async () => {
    if (!revisionReason.trim()) {
      setRevisionError('Please describe what changes you need.');
      return;
    }

    setRevisionSubmitting(true);
    setRevisionError('');

    try {
      const formData = new URLSearchParams();
      formData.append('reason', revisionReason.trim());

      const response = await fetch(`/assignments/${id}/request-revision`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData,
        credentials: 'include',
      });

      if (response.ok || response.redirected) {
        setShowRevisionModal(false);
        setRevisionReason('');
        fetchAssignment(); // refresh to show new status + revision history
      } else if (response.status === 401) {
        navigate('/login');
      } else {
        setRevisionError('Failed to submit revision request. Please try again.');
      }
    } catch (err) {
      setRevisionError('Something went wrong. Please try again.');
    } finally {
      setRevisionSubmitting(false);
    }
  };

  const handleDownloadSolution = async () => {
    setDownloading(true);
    try {
      const res = await fetch(`/assignments/${id}/download-solution`, { credentials: 'include' });
      if (res.status === 401) { navigate('/login'); return; }
      if (!res.ok) throw new Error('Download failed');

      const blob = await res.blob();
      const disposition = res.headers.get('Content-Disposition') || '';
      const match = disposition.match(/filename="?([^"]+)"?/);
      const filename = match ? match[1] : 'solution';

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert('Failed to download solution. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
        <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-[#667eea] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500">Loading assignment...</p>
          </div>
        </div>
    );
  }

  if (loadError || !assignment) {
    return (
        <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center">
          <div className="text-center bg-white p-10 rounded-2xl shadow-md border border-gray-100 max-w-md">
            <i className="bi bi-exclamation-triangle text-5xl text-red-400 mb-4 block"></i>
            <p className="text-gray-600 mb-6">{loadError || 'Assignment not found.'}</p>
            <Link to="/dashboard" className="bg-[#667eea] hover:bg-[#5a67d8] text-white px-6 py-2 rounded-xl font-bold no-underline">
              Back to Dashboard
            </Link>
          </div>
        </div>
    );
  }

  const remainingRevisions = (assignment.maxRevisions ?? 0) - (assignment.revisionsUsed ?? 0);

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col font-sans">
      
      {/* Navbar (User Side) */}
      <nav className="bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white py-4 px-6 shadow-lg sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-xl font-bold flex items-center gap-2 hover:text-gray-200 transition-colors">
            <i className="bi bi-journal-check text-2xl"></i> Assignment Service
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 flex-1 max-w-5xl">
        
        {/* Back Button */}
        <div className="mb-6 animate-fadeIn">
          <Link to="/dashboard" className="text-gray-500 hover:text-gray-800 font-bold flex items-center gap-2 w-fit transition-colors">
            <i className="bi bi-arrow-left"></i> Back to Dashboard
          </Link>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-[20px] shadow-xl overflow-hidden mb-8 animate-fadeInUp">
          
          {/* Card Header Gradient */}
          <div className="bg-gradient-to-r from-[#667eea] to-[#764ba2] p-8 text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-3xl font-extrabold mb-1 drop-shadow-md">{assignment.title}</h2>
              <p className="text-white/80 font-medium text-lg"><i className="bi bi-book"></i> {assignment.subject}</p>
            </div>
            <div className={`px-6 py-2 rounded-full font-bold uppercase tracking-wider text-sm shadow-lg ${getStatusStyles(assignment.status)}`}>
              {String(assignment.status).replace('_', ' ')}
            </div>
          </div>

          <div className="p-8">
            
          {/* ✅ ADD THE STATUS BAR RIGHT HERE — before "Basic Info Row" */}
            <div className="mb-8">
              <AssignmentStatusBar status={assignment.status} />
            </div>

            {/* Basic Info Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gray-50 p-5 rounded-xl border border-gray-100 flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl shadow-sm ${assignment.type === 'IT' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
                  <i className={`bi ${assignment.type === 'IT' ? 'bi-laptop' : 'bi-calculator'}`}></i>
                </div>
                <div>
                  <span className="text-gray-400 text-xs font-bold uppercase tracking-widest block mb-1">Assignment Type</span>
                  <strong className="text-gray-800 text-lg">{assignment.type === 'IT' ? 'IT Assignment' : 'Quantity Surveying'}</strong>
                </div>
              </div>
              <div className="bg-gray-50 p-5 rounded-xl border border-gray-100 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-red-100 text-red-500 flex items-center justify-center text-xl shadow-sm">
                  <i className="bi bi-clock"></i>
                </div>
                <div>
                  <span className="text-gray-400 text-xs font-bold uppercase tracking-widest block mb-1">Deadline</span>
                  <strong className="text-gray-800 text-lg">{assignment.deadline ? new Date(assignment.deadline).toLocaleString() : '—'}</strong>
                </div>
              </div>
            </div>

            {/* Description Sections */}
            <div className="space-y-8">
              <div>
                <h5 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2 border-b pb-2">
                  <i className="bi bi-file-text text-[#667eea]"></i> Description
                </h5>
                <p className="text-gray-600 leading-relaxed bg-gray-50 p-5 rounded-xl border border-gray-100 whitespace-pre-wrap">{assignment.description}</p>
              </div>

              {assignment.additionalRequirements && (
                <div>
                  <h5 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2 border-b pb-2">
                    <i className="bi bi-list-check text-[#667eea]"></i> Additional Requirements
                  </h5>
                  <p className="text-gray-600 leading-relaxed bg-gray-50 p-5 rounded-xl border border-gray-100 whitespace-pre-wrap">{assignment.additionalRequirements}</p>
                </div>
              )}

              {/* Files */}
              {((assignment.descriptionFiles && assignment.descriptionFiles.length > 0) ||
                (assignment.requirementsFiles && assignment.requirementsFiles.length > 0)) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {assignment.descriptionFiles && assignment.descriptionFiles.length > 0 && (
                    <div>
                      <h5 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                        <i className="bi bi-paperclip text-blue-500"></i> Description Files
                      </h5>
                      <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-2">
                        {assignment.descriptionFiles.map((file, i) => (
                          <div key={i} className="flex items-center gap-2 text-sm font-medium text-gray-700 bg-white p-2 rounded-lg shadow-sm">
                            <i className="bi bi-file-earmark text-blue-500"></i> {file}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {assignment.requirementsFiles && assignment.requirementsFiles.length > 0 && (
                    <div>
                      <h5 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                        <i className="bi bi-paperclip text-green-500"></i> Requirement Files
                      </h5>
                      <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-2">
                        {assignment.requirementsFiles.map((file, i) => (
                          <div key={i} className="flex items-center gap-2 text-sm font-medium text-gray-700 bg-white p-2 rounded-lg shadow-sm">
                            <i className="bi bi-file-earmark text-green-500"></i> {file}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Rejection reason */}
              {assignment.status === 'REJECTED' && assignment.adminNotes && (
                <div className="bg-red-50 border-l-4 border-red-400 p-6 rounded-r-xl">
                  <h5 className="text-lg font-bold text-red-800 mb-2 flex items-center gap-2">
                    <i className="bi bi-x-circle"></i> Rejection Reason
                  </h5>
                  <p className="text-red-700 italic">"{assignment.adminNotes}"</p>
                </div>
              )}

              {/* Pricing */}
              {assignment.price != null && (
                <div>
                  <h5 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2 border-b pb-2">
                    <i className="bi bi-currency-dollar text-green-600"></i> Pricing
                  </h5>
                  <div className="flex gap-6">
                    <div className="bg-gray-50 p-5 rounded-xl border border-gray-100 flex-1 flex flex-col justify-center">
                      <span className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Initial Quote</span>
                      <strong className="text-2xl text-blue-600">{assignment.currency === 'USD' ? '$' : 'Rs.'}{Number(assignment.price).toFixed(2)}</strong>
                    </div>
                    {assignment.finalPrice != null && (
                      <div className="bg-green-50 p-5 rounded-xl border border-green-100 flex-1 flex flex-col justify-center">
                        <span className="text-green-700/70 text-xs font-bold uppercase tracking-widest mb-1">Final Price</span>
                        <strong className="text-2xl text-green-600">{assignment.currency === 'USD' ? '$' : 'Rs.'}{Number(assignment.finalPrice).toFixed(2)}</strong>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Revision Info */}
              {(assignment.status === 'DELIVERED' || assignment.status === 'REVISION_REQUESTED') && (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-r-xl shadow-sm">
                  <h5 className="text-lg font-bold text-yellow-800 mb-2 flex items-center gap-2">
                    <i className="bi bi-arrow-repeat"></i> Revision Information
                  </h5>
                  <p className="text-yellow-700 mb-4 font-medium flex items-center gap-2 flex-wrap">
                    <i className="bi bi-info-circle"></i>
                    Revisions used: <strong className="text-lg">{assignment.revisionsUsed}</strong> / {assignment.maxRevisions}
                    {remainingRevisions <= 0 ? (
                      <span className="text-red-500 ml-4 font-bold bg-red-100 px-3 py-1 rounded-full text-xs">No revisions remaining</span>
                    ) : (
                      <span className="text-green-600 ml-4 font-bold bg-green-100 px-3 py-1 rounded-full text-xs">{remainingRevisions} remaining</span>
                    )}
                  </p>

                  {assignment.revisionRequests && assignment.revisionRequests.length > 0 && (
                    <div className="bg-white/60 p-4 rounded-xl space-y-3">
                      <h6 className="font-bold text-gray-700 text-sm"><i className="bi bi-clock-history"></i> Revision History</h6>
                      {assignment.revisionRequests.map((rev, idx) => (
                        <div key={idx} className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-[#667eea]">
                          <div className="flex justify-between items-center mb-2">
                            <strong className="text-[#667eea]">Request #{idx + 1}</strong>
                            <small className="text-gray-400 font-medium">{rev.requestedAt ? new Date(rev.requestedAt).toLocaleString() : ''}</small>
                          </div>
                          <p className="text-sm text-gray-600 italic mb-2">"{rev.reason}"</p>
                          <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${rev.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                            {rev.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Solution Download Box */}
              {assignment.status === 'DELIVERED' && (
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-8 text-white shadow-lg flex flex-col md:flex-row justify-between items-center gap-6">
                  <div>
                    <h4 className="text-2xl font-bold mb-2 flex items-center gap-2"><i className="bi bi-file-earmark-check"></i> Solution is Ready!</h4>
                    <p className="text-green-100">Your assignment has been finalized and the files are ready to download.</p>
                  </div>
                  <button
                      onClick={handleDownloadSolution}
                      disabled={downloading}
                      className="bg-white text-green-600 px-8 py-4 rounded-xl font-black uppercase tracking-wider hover:shadow-xl hover:-translate-y-1 transition-all flex items-center gap-3 disabled:opacity-60"
                  >
                    {downloading ? (
                      <><i className="bi bi-arrow-repeat animate-spin text-xl"></i> Downloading...</>
                    ) : (
                      <><i className="bi bi-cloud-download text-xl"></i> Download Solution</>
                    )}
                  </button>
                </div>
              )}

              {/* User Actions */}
              <div className="pt-6 border-t flex flex-wrap gap-4">
                {assignment.status === 'APPROVED' && (
                  <button className="bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 shadow-md hover:shadow-lg transition-all">
                    <i className="bi bi-credit-card"></i> Make Payment
                  </button>
                )}
                
                {assignment.status === 'DELIVERED' && remainingRevisions > 0 && (
                  <button 
                    onClick={() => setShowRevisionModal(true)}
                    className="bg-gradient-to-r from-[#f093fb] to-[#f5576c] text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all"
                  >
                    <i className="bi bi-arrow-repeat"></i> Request Revision
                  </button>
                )}

                {assignment.status === 'REVISION_REQUESTED' && (
                  <div className="bg-blue-50 text-blue-600 px-6 py-3 rounded-xl font-bold flex items-center gap-2 border border-blue-100">
                    <i className="bi bi-hourglass-split animate-spin-slow"></i> Revision in progress...
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>

        {/* Revision Modal */}
        {showRevisionModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
            <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-scaleUp">
              <div className="bg-gradient-to-r from-[#667eea] to-[#764ba2] p-5 text-white flex justify-between items-center">
                <h5 className="text-xl font-bold flex items-center gap-2"><i className="bi bi-arrow-repeat"></i> Request Revision</h5>
                <button onClick={() => setShowRevisionModal(false)} disabled={revisionSubmitting} className="text-white hover:text-gray-200 transition-colors"><i className="bi bi-x-lg text-xl"></i></button>
              </div>
              <div className="p-8">
                {revisionError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl p-3 mb-4">
                    {revisionError}
                  </div>
                )}
                <div className="bg-blue-50 text-blue-800 p-4 rounded-xl mb-6 font-medium text-sm flex gap-3 items-start">
                  <i className="bi bi-info-circle-fill text-lg"></i>
                  <p>You have <strong>{remainingRevisions}</strong> revision(s) remaining. Be specific about the changes needed.</p>
                </div>
                <div className="mb-6">
                  <label className="block text-gray-700 font-bold mb-2">What changes would you like?</label>
                  <textarea 
                    className="w-full border-2 border-gray-200 rounded-xl p-4 focus:border-[#667eea] focus:outline-none transition-colors"
                    rows="5"
                    placeholder="Describe in detail what needs to be revised or corrected..."
                    value={revisionReason}
                    onChange={(e) => setRevisionReason(e.target.value)}
                    disabled={revisionSubmitting}
                  ></textarea>
                </div>
                <div className="flex justify-end gap-3">
                  <button onClick={() => setShowRevisionModal(false)} disabled={revisionSubmitting} className="px-6 py-2.5 rounded-xl bg-gray-100 text-gray-600 font-bold hover:bg-gray-200 transition-colors disabled:opacity-50">Cancel</button>
                  <button
                      onClick={submitRevision}
                      disabled={revisionSubmitting}
                      className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#f093fb] to-[#f5576c] text-white font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-60"
                  >
                    {revisionSubmitting ? (
                      <><i className="bi bi-arrow-repeat animate-spin"></i> Submitting...</>
                    ) : (
                      <><i className="bi bi-send"></i> Submit Request</>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes scaleUp { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .animate-fadeIn { animation: fadeIn 0.4s ease-out forwards; }
        .animate-fadeInUp { animation: fadeInUp 0.6s ease-out forwards; }
        .animate-scaleUp { animation: scaleUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
        .animate-spin-slow { animation: spin 3s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default ViewAssignment;