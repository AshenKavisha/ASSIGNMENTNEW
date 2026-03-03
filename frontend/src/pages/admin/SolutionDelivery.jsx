import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Sidebar from '../../components/admin/Sidebar';

const SolutionDelivery = () => {
  const { id } = useParams(); // URL eken assignment ID eka gannawa
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const [adminNotes, setAdminNotes] = useState("");

  // Mock Assignment Data (Backend eka connect karana kan)
  const assignment = {
    title: "Java OOP Assignment",
    user: { fullName: "Ashen Kaveesha", email: "ashen@example.com" },
    type: "IT",
    subject: "Object Oriented Programming",
    status: "APPROVED"
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (selectedFiles.length === 0) {
      alert('Please select at least one file!');
      return;
    }

    // File size validation (25MB)
    for (let file of selectedFiles) {
      if (file.size > 25 * 1024 * 1024) {
        alert(`File "${file.name}" is too large. Maximum size is 25MB.`);
        return;
      }
    }

    setIsSending(true);
    // Mocking API call
    setTimeout(() => {
      alert("Solution delivered successfully via email!");
      setIsSending(false);
    }, 2000);
  };

  return (
    <div className="flex min-h-screen bg-[#f8f9fa]">
      <Sidebar />

      <div className="flex-1 ml-64 pb-12 font-sans overflow-x-hidden">
        <div className="container mx-auto px-6 mt-8">
          
          {/* Page Header */}
          <div className="flex justify-between items-center mb-8 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <div>
              <h1 className="text-4xl font-extrabold text-[#28a745] flex items-center gap-4">
                <i className="bi bi-send-check"></i> Deliver Solution
              </h1>
              <p className="text-gray-500 mt-2 text-lg">Send finalized assignment solution to student</p>
            </div>
            <Link to="/admin/assignments" className="bg-[#6c757d] hover:bg-[#5a6268] text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2 transition-all">
              <i className="bi bi-arrow-left"></i> Back to Assignments
            </Link>
          </div>

          {/* Assignment Info Card */}
          <div className="bg-white rounded-2xl shadow-md border-l-8 border-[#28a745] overflow-hidden mb-8">
            <div className="bg-[#28a745] p-4 text-white">
              <h4 className="text-xl font-bold flex items-center gap-2">
                <i className="bi bi-info-circle"></i> Assignment Details
              </h4>
            </div>
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-gray-700">
                <div className="space-y-3">
                  <p><strong>Title:</strong> {assignment.title}</p>
                  <p><strong>Student:</strong> {assignment.user.fullName}</p>
                  <p><strong>Email:</strong> <span className="text-blue-600">{assignment.user.email}</span></p>
                </div>
                <div className="space-y-3">
                  <p className="flex items-center gap-2">
                    <strong>Type:</strong> 
                    <span className={`px-4 py-1 rounded-full text-xs font-bold text-white ${assignment.type === 'IT' ? 'bg-blue-500' : 'bg-green-500'}`}>
                      {assignment.type}
                    </span>
                  </p>
                  <p><strong>Subject:</strong> {assignment.subject}</p>
                  <p><strong>Status:</strong> <span className="text-orange-500 font-bold">{assignment.status}</span></p>
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Form Card */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <div className="bg-[#007bff] p-4 text-white">
              <h4 className="text-xl font-bold flex items-center gap-2">
                <i className="bi bi-paperclip"></i> Upload Solution Files
              </h4>
            </div>
            <div className="p-8">
              <form onSubmit={handleSubmit}>
                
                {/* Solution Files Upload Area */}
                <div className="mb-8">
                  <label className="block text-gray-700 font-bold text-lg mb-4">
                    <i className="bi bi-file-earmark-arrow-up mr-2"></i> Solution Files *
                  </label>

                  <div 
                    className="border-4 border-dashed border-blue-100 rounded-2xl p-12 bg-blue-50/30 text-center cursor-pointer hover:border-blue-300 hover:bg-blue-50 transition-all group"
                    onClick={() => document.getElementById('solutionFiles').click()}
                  >
                    <i className="bi bi-cloud-upload text-6xl text-blue-400 group-hover:scale-110 transition-transform mb-4 block"></i>
                    <p className="text-xl font-bold text-blue-900 mb-2">Click here to select files</p>
                    <p className="text-gray-400">Supported: PDF, Word, Excel, Images, ZIP (Max 25MB)</p>
                  </div>

                  <input 
                    type="file" id="solutionFiles" multiple hidden 
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.xlsx,.xls,.pptx,.ppt,.zip,.rar,.7z"
                  />

                  {/* Selected Files List */}
                  {selectedFiles.length > 0 && (
                    <div className="mt-6 bg-green-50 border border-green-200 rounded-xl p-4 animate-fadeIn">
                      <h6 className="font-bold text-green-800 mb-2">Selected Files:</h6>
                      <ul className="space-y-1">
                        {selectedFiles.map((file, idx) => (
                          <li key={idx} className="text-sm text-green-700 flex items-center gap-2">
                            <i className="bi bi-file-check"></i> <strong>{file.name}</strong> ({(file.size / (1024 * 1024)).toFixed(2)} MB)
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Admin Notes */}
                <div className="mb-8">
                  <label className="block text-gray-700 font-bold mb-3">
                    <i className="bi bi-chat-text mr-1"></i> Additional Notes (Optional)
                  </label>
                  <textarea 
                    className="w-full border-2 border-gray-100 rounded-xl p-4 focus:border-blue-400 focus:outline-none transition-all"
                    rows="4" placeholder="Add any notes or instructions for the student..."
                    value={adminNotes} onChange={(e) => setAdminNotes(e.target.value)}
                  ></textarea>
                </div>

                {/* Summary Alert */}
                <div className="bg-blue-50 border-l-4 border-blue-500 rounded-r-xl p-6 mb-8 text-blue-900">
                  <h5 className="font-bold mb-3 flex items-center gap-2">
                    <i className="bi bi-envelope-check"></i> What will happen:
                  </h5>
                  <ul className="list-disc ml-5 space-y-1 text-sm">
                    <li>Solution files will be sent via email to: <strong>{assignment.user.email}</strong></li>
                    <li>Assignment status will change to "DELIVERED"</li>
                    <li>Student can download files from the email</li>
                  </ul>
                </div>

                {/* Submit Button */}
                <div className="text-center">
                  <button 
                    type="submit" 
                    disabled={isSending}
                    className={`px-12 py-4 rounded-full text-white font-extrabold text-lg transition-all shadow-lg flex items-center gap-3 mx-auto ${isSending ? 'bg-gray-400' : 'bg-gradient-to-r from-[#28a745] to-[#20c997] hover:-translate-y-1 hover:shadow-2xl'}`}
                  >
                    {isSending ? (
                      <>
                        <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-5 h-5 block"></span>
                        Sending... Please wait
                      </>
                    ) : (
                      <>
                        <i className="bi bi-send-check"></i> Deliver Solution via Email
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.4s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default SolutionDelivery;