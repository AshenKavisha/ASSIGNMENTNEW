import React from 'react';
import { Link, useParams } from 'react-router-dom'; // useParams add kala
import Sidebar from '../../components/admin/Sidebar';

const AssignmentDetails = () => {
  const { id } = useParams(); // URL eken assignment ID eka gannawa

  // Backend eka connect karana kan me mock data thiyagamu
  const assignment = {
    id: id || 1, // URL eke thiyena id eka use karanawa
    title: "Java OOP Assignment",
    subject: "Object Oriented Programming",
    type: "IT",
    status: "IN_PROGRESS",
    price: 45.00,
    deadline: "2026-03-15",
    description: "Create a complete library management system using Java Swing and MySQL backend. Implement all CRUD operations and design patterns.",
    additionalRequirements: "Must include a detailed class diagram and database schema documentation.",
    user: {
      fullName: "Ashen Kaveesha",
      email: "ashenkaveesha@example.com"
    },
    createdAt: "Mar 01, 2026 10:30",
    updatedAt: "Mar 01, 2026 14:45",
    descriptionFiles: "assignment_brief.pdf",
    requirementsFiles: "rubric.docx",
    adminNotes: "Student requested to use Singleton pattern for DB connection.",
    deliveredAt: null,
    solutionFiles: null
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
            <Link to="/admin/assignments" className="btn bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all">
              <i className="bi bi-arrow-left"></i> Back to Assignments
            </Link>
          </div>

          {/* Assignment Details Card */}
          <div className="bg-white rounded-xl shadow-md border-l-4 border-[#0d6efd] overflow-hidden mb-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            <div className="bg-[#0d6efd] p-4 text-white">
              <h4 className="text-xl font-bold flex items-center gap-2">
                <i className="bi bi-info-circle"></i> Assignment Information
              </h4>
            </div>
            
            <div className="p-8">
              {/* Basic Details Section */}
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
                      <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-yellow-400 text-gray-900">
                        <i className="bi bi-gear me-1 animate-spin-slow"></i> {assignment.status}
                      </span>
                    </p>
                    <p className="mb-2"><strong>Price:</strong> ${assignment.price}</p>
                    <p className="mb-2"><strong>Deadline:</strong> <span className="text-red-500 font-bold">{assignment.deadline}</span></p>
                  </div>
                </div>
              </div>

              {/* Description Section */}
              <div className="bg-gray-50 rounded-xl p-6 mb-6">
                <h5 className="text-[#0d6efd] font-bold mb-3 flex items-center gap-2">
                  <i className="bi bi-card-text"></i> Description
                </h5>
                <p className="text-gray-600 leading-relaxed">{assignment.description}</p>
              </div>

              {/* Additional Requirements Section */}
              {assignment.additionalRequirements && (
                <div className="bg-gray-50 rounded-xl p-6 mb-6">
                  <h5 className="text-[#0d6efd] font-bold mb-3 flex items-center gap-2 text-red">
                    <i className="bi bi-clipboard-check"></i> Additional Requirements
                  </h5>
                  <p className="text-gray-600 leading-relaxed">{assignment.additionalRequirements}</p>
                </div>
              )}

              {/* Student Information Section */}
              <div className="bg-gray-50 rounded-xl p-6 mb-6">
                <h5 className="text-[#0d6efd] font-bold mb-4 flex items-center gap-2 border-b pb-2">
                  <i className="bi bi-person"></i> Student Information
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
                  <div>
                    <p className="mb-2"><strong>Name:</strong> {assignment.user.fullName}</p>
                    <p className="mb-2"><strong>Email:</strong> {assignment.user.email}</p>
                  </div>
                  <div>
                    <p className="mb-2"><strong>Submitted On:</strong> {assignment.createdAt}</p>
                    <p className="mb-2"><strong>Last Updated:</strong> {assignment.updatedAt}</p>
                  </div>
                </div>
              </div>

              {/* Files Section */}
              {(assignment.descriptionFiles || assignment.requirementsFiles) && (
                <div className="bg-gray-50 rounded-xl p-6 mb-6">
                  <h5 className="text-[#0d6efd] font-bold mb-3 flex items-center gap-2">
                    <i className="bi bi-paperclip"></i> Attached Files
                  </h5>
                  <div className="space-y-3">
                    {assignment.descriptionFiles && (
                      <div>
                        <p className="font-bold text-gray-700">Description Files:</p>
                        <p className="text-sm text-blue-600 cursor-pointer hover:underline"><i className="bi bi-file-earmark-pdf"></i> {assignment.descriptionFiles}</p>
                      </div>
                    )}
                    {assignment.requirementsFiles && (
                      <div>
                        <p className="font-bold text-gray-700">Requirements Files:</p>
                        <p className="text-sm text-blue-600 cursor-pointer hover:underline"><i className="bi bi-file-earmark-word"></i> {assignment.requirementsFiles}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Admin Notes Section */}
              {assignment.adminNotes && (
                <div className="bg-blue-50 border-l-4 border-blue-400 rounded-r-xl p-6 mb-6">
                  <h5 className="text-[#0d6efd] font-bold mb-2 flex items-center gap-2">
                    <i className="bi bi-chat-text"></i> Admin Notes
                  </h5>
                  <p className="text-gray-700 italic">"{assignment.adminNotes}"</p>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden animate-fadeIn">
            <div className="bg-[#2c3e50] p-4 text-white">
              <h4 className="text-xl font-bold flex items-center gap-2">
                <i className="bi bi-gear"></i> Actions
              </h4>
            </div>
            <div className="p-10 text-center">
              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/admin/assignments" className="px-8 py-3 rounded-full border-2 border-gray-400 text-gray-600 font-bold uppercase tracking-wider hover:bg-gray-100 transition-all flex items-center gap-2">
                  <i className="bi bi-arrow-left"></i> Back to List
                </Link>
                
                {/* ✅ FIXED: Button eka Link ekakata harawwa Solution Delivery page ekata yanna */}
                {assignment.status !== 'DELIVERED' && (
                  <Link 
                    to={`/admin/assignments/${id}/deliver`} 
                    className="px-8 py-3 rounded-full bg-green-600 text-white font-bold uppercase tracking-wider shadow-lg hover:bg-green-700 hover:-translate-y-1 transition-all flex items-center gap-2"
                  >
                    <i className="bi bi-send-check"></i> Deliver Solution
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <style>{`
        .animate-spin-slow { animation: spin 3s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .animate-fadeIn { animation: fadeIn 0.8s ease-out; }
      `}</style>
    </div>
  );
};

export default AssignmentDetails;