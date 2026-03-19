import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const CreateAssignment = () => {
  const navigate = useNavigate();
  
  // Mock User
  const user = { fullName: "Ashen Kaveesha" };

  // Form State
  const [formData, setFormData] = useState({
    type: '',
    title: '',
    subject: '',
    deadline: '',
    description: '',
    additionalRequirements: ''
  });

  // File Upload States
  const [descriptionFiles, setDescriptionFiles] = useState([]);
  const [requirementFiles, setRequirementFiles] = useState([]);

  // Progress Bar State
  const [currentStep, setCurrentStep] = useState(1);

  // Set default deadline (1 week from now) on load
  useEffect(() => {
    const defaultDate = new Date();
    defaultDate.setDate(defaultDate.getDate() + 7);
    setFormData(prev => ({ ...prev, deadline: defaultDate.toISOString().slice(0, 16) }));
  }, []);

  // Handle Text/Radio Inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Progress Step Calculation Logic
  useEffect(() => {
    let step = 1;
    if (formData.type) step = 2;
    if (formData.type && formData.title && formData.subject && formData.deadline) step = 3;
    if (formData.type && formData.title && formData.subject && formData.deadline && formData.description.length > 10) step = 4;
    setCurrentStep(step);
  }, [formData]);

  // Handle File Uploads
  const handleFileUpload = (e, setFilesState, maxMB = 10) => {
    const files = Array.from(e.target.files);
    const validFiles = [];
    
    files.forEach(file => {
      if (file.size > maxMB * 1024 * 1024) {
        alert(`File "${file.name}" is too large. Maximum size is ${maxMB}MB.`);
      } else {
        validFiles.push(file);
      }
    });

    setFilesState(prev => [...prev, ...validFiles]);
  };

  const removeFile = (index, filesState, setFilesState) => {
    const newFiles = [...filesState];
    newFiles.splice(index, 1);
    setFilesState(newFiles);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileName) => {
    const ext = fileName.split('.').pop().toLowerCase();
    if (['pdf'].includes(ext)) return { icon: 'bi-file-pdf', color: 'bg-gradient-to-br from-[#ff6b6b] to-[#ee5a52]' };
    if (['doc', 'docx'].includes(ext)) return { icon: 'bi-file-word', color: 'bg-gradient-to-br from-[#2b579a] to-[#1e4a8a]' };
    if (['xls', 'xlsx'].includes(ext)) return { icon: 'bi-file-excel', color: 'bg-gradient-to-br from-[#217346] to-[#1a5c38]' };
    if (['ppt', 'pptx'].includes(ext)) return { icon: 'bi-file-ppt', color: 'bg-gradient-to-br from-[#d24726] to-[#b83a1f]' };
    if (['jpg', 'jpeg', 'png', 'gif'].includes(ext)) return { icon: 'bi-file-image', color: 'bg-gradient-to-br from-[#9c27b0] to-[#7b1fa2]' };
    return { icon: 'bi-file-earmark', color: 'bg-gradient-to-br from-[#6c757d] to-[#495057]' };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // API Call goes here (using formData, descriptionFiles, requirementFiles)
    alert("Assignment Submitted Successfully!");
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5f7fa] to-[#c3cfe2] flex flex-col font-sans">
      
      {/* Navbar */}
      <nav className="bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white py-3 px-6 shadow-md sticky top-0 z-50">
        <div className="container mx-auto flex flex-wrap justify-between items-center gap-4">
          <Link to="/dashboard" className="text-xl font-bold flex items-center gap-2 hover:text-gray-200 transition-colors no-underline">
            <i className="bi bi-journal-check text-white"></i> Assignment Service
          </Link>
          <div className="flex items-center gap-4 ml-auto">
            <span className="font-medium hidden sm:flex items-center gap-2">
              <i className="bi bi-person-circle text-xl"></i> Welcome, {user.fullName}
            </span>
            <Link to="/login?logout=true" className="border border-white/30 px-3 py-1.5 rounded hover:bg-white hover:text-[#667eea] transition-all font-bold text-sm flex items-center gap-2 no-underline">
              <i className="bi bi-box-arrow-right"></i> Logout
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 flex-1 max-w-5xl">
        
        {/* Progress Indicator */}
        <div className="flex justify-between relative mb-10 hidden md:flex">
          <div className="absolute top-[20px] left-[10%] right-[10%] h-1 bg-gray-200 z-0"></div>
          
          {[
            { num: 1, label: 'Assignment Type' },
            { num: 2, label: 'Basic Info' },
            { num: 3, label: 'Description' },
            { num: 4, label: 'Review & Submit' }
          ].map((step) => (
            <div key={step.num} className="text-center relative z-10 flex-1">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2 font-bold transition-all duration-300 ${currentStep >= step.num ? 'bg-[#3498db] text-white scale-110 shadow-md' : 'bg-gray-200 text-gray-500'}`}>
                {currentStep > step.num ? <i className="bi bi-check text-xl"></i> : step.num}
              </div>
              <div className={`text-sm font-medium ${currentStep >= step.num ? 'text-[#3498db] font-bold' : 'text-gray-500'}`}>
                {step.label}
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* Left Column - Main Form */}
          <div className="lg:col-span-8 flex-1">
            <div className="bg-white rounded-[20px] shadow-[0_15px_35px_rgba(0,0,0,0.1)] overflow-hidden animate-fadeInUp">
              
              {/* Header */}
              <div className="bg-gradient-to-r from-[#667eea] to-[#764ba2] p-8 text-center text-white">
                <h3 className="text-2xl font-bold m-0 flex justify-center items-center gap-2 drop-shadow-md">
                  <i className="bi bi-journal-plus"></i> Submit New Assignment
                </h3>
                <p className="mb-0 text-white/80 mt-2 font-medium">Fill out the form below to get professional help</p>
              </div>

              {/* Body */}
              <div className="p-6 sm:p-10">
                <form onSubmit={handleSubmit}>
                  
                  {/* Step 1: Type */}
                  <div className="mb-10 animate-fadeIn" style={{animationDelay: '0.1s'}}>
                    <label className="block text-lg font-bold text-[#2c3e50] mb-4">📝 Assignment Type <span className="text-red-500">*</span></label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      
                      {/* IT Type Card */}
                      <label className={`cursor-pointer border-4 rounded-2xl p-6 text-center transition-all hover:-translate-y-2 hover:shadow-xl relative overflow-hidden group ${formData.type === 'IT' ? 'border-[#3498db] bg-blue-50/50' : 'border-transparent bg-gray-50 hover:border-[#3498db]/30'}`}>
                        <input type="radio" name="type" value="IT" onChange={handleInputChange} className="hidden" required />
                        <div className="w-[60px] h-[60px] rounded-full bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white flex items-center justify-center text-3xl mx-auto mb-4 shadow-md group-hover:scale-110 transition-transform">
                          <i className="bi bi-laptop"></i>
                        </div>
                        <h5 className="font-bold text-[#3498db] mb-2 text-xl">IT Assignment</h5>
                        <p className="text-gray-500 text-sm m-0 leading-relaxed">Programming, Web Dev, Databases, Software Eng, Mobile, Networking.</p>
                        {formData.type === 'IT' && <div className="absolute top-3 right-3 text-[#3498db] text-2xl"><i className="bi bi-check-circle-fill"></i></div>}
                      </label>

                      {/* QS Type Card */}
                      <label className={`cursor-pointer border-4 rounded-2xl p-6 text-center transition-all hover:-translate-y-2 hover:shadow-xl relative overflow-hidden group ${formData.type === 'QS' ? 'border-[#27ae60] bg-green-50/50' : 'border-transparent bg-gray-50 hover:border-[#27ae60]/30'}`}>
                        <input type="radio" name="type" value="QS" onChange={handleInputChange} className="hidden" required />
                        <div className="w-[60px] h-[60px] rounded-full bg-gradient-to-br from-[#11998e] to-[#38ef7d] text-white flex items-center justify-center text-3xl mx-auto mb-4 shadow-md group-hover:scale-110 transition-transform">
                          <i className="bi bi-calculator"></i>
                        </div>
                        <h5 className="font-bold text-[#27ae60] mb-2 text-xl">QS Assignment</h5>
                        <p className="text-gray-500 text-sm m-0 leading-relaxed">Quantity Surveying, Cost Est, Project Planning, Contract Admin.</p>
                        {formData.type === 'QS' && <div className="absolute top-3 right-3 text-[#27ae60] text-2xl"><i className="bi bi-check-circle-fill"></i></div>}
                      </label>

                    </div>
                  </div>

                  {/* Step 2: Basic Info */}
                  <div className="mb-10 animate-fadeIn" style={{animationDelay: '0.2s'}}>
                    <label className="block text-lg font-bold text-[#2c3e50] mb-4">📋 Basic Information</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                      <div className="relative">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Assignment Title <span className="text-red-500">*</span></label>
                        <input type="text" name="title" value={formData.title} onChange={handleInputChange} maxLength="100" required className="w-full p-3 border-2 border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-[#3498db] transition-all outline-none font-medium text-gray-800" />
                        <span className={`absolute bottom-3 right-3 text-xs ${formData.title.length > 80 ? 'text-red-500' : 'text-gray-400'}`}>{formData.title.length}/100</span>
                      </div>
                      <div className="relative">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Subject/Course <span className="text-red-500">*</span></label>
                        <input type="text" name="subject" value={formData.subject} onChange={handleInputChange} maxLength="100" required className="w-full p-3 border-2 border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-[#3498db] transition-all outline-none font-medium text-gray-800" />
                        <span className={`absolute bottom-3 right-3 text-xs ${formData.subject.length > 80 ? 'text-red-500' : 'text-gray-400'}`}>{formData.subject.length}/100</span>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Deadline <span className="text-red-500">*</span></label>
                      <input type="datetime-local" name="deadline" value={formData.deadline} onChange={handleInputChange} required className="w-full p-3 border-2 border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-[#3498db] transition-all outline-none font-medium text-gray-800" />
                      <p className="text-xs text-gray-500 mt-2 flex items-center gap-1"><i className="bi bi-calendar3"></i> Select the final submission date and time</p>
                    </div>
                  </div>

                  {/* Step 3: Description & Files */}
                  <div className="mb-10 animate-fadeIn" style={{animationDelay: '0.3s'}}>
                    <div className="relative mb-6">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Assignment Description <span className="text-red-500">*</span></label>
                      <textarea name="description" value={formData.description} onChange={handleInputChange} rows="6" maxLength="1000" required className="w-full p-3 border-2 border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-[#3498db] transition-all outline-none font-medium text-gray-800 resize-none"></textarea>
                      <span className={`absolute bottom-3 right-3 text-xs ${formData.description.length > 800 ? 'text-red-500' : 'text-gray-400'}`}>{formData.description.length}/1000</span>
                    </div>

                    <div className="mb-8">
                      <label className="font-bold text-[#2c3e50] mb-2 block flex items-center gap-2"><i className="bi bi-paperclip text-[#3498db]"></i> Upload Supporting Files</label>
                      <div className="border-2 border-dashed border-[#667eea] bg-blue-50/30 rounded-xl p-6 text-center hover:bg-blue-50 transition-colors relative">
                        <input type="file" multiple accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.xlsx,.xls,.pptx,.ppt" onChange={(e) => handleFileUpload(e, setDescriptionFiles)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                        
                        {descriptionFiles.length === 0 ? (
                          <div className="text-gray-500 pointer-events-none">
                            <i className="bi bi-cloud-arrow-up text-4xl mb-2 block text-[#667eea]"></i>
                            <p className="font-medium text-gray-700">Click or drag files here to upload</p>
                            <p className="text-xs">PDF, Word, Excel, Images (Max 10MB each)</p>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 relative z-20 text-left">
                            {descriptionFiles.map((file, idx) => {
                              const style = getFileIcon(file.name);
                              return (
                                <div key={idx} className="bg-white border border-gray-200 rounded-lg p-2 flex items-center gap-3 shadow-sm hover:border-[#667eea] transition-colors">
                                  <div className={`w-10 h-10 rounded flex items-center justify-center text-white text-xl ${style.color}`}>
                                    <i className={style.icon}></i>
                                  </div>
                                  <div className="flex-1 overflow-hidden">
                                    <div className="font-bold text-sm text-gray-700 truncate">{file.name}</div>
                                    <div className="text-xs text-gray-400">{formatFileSize(file.size)}</div>
                                  </div>
                                  <button type="button" onClick={(e) => { e.preventDefault(); removeFile(idx, descriptionFiles, setDescriptionFiles); }} className="w-8 h-8 rounded-full bg-red-100 text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center transition-colors">
                                    <i className="bi bi-x-lg"></i>
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="relative mb-6">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Additional Requirements (Optional)</label>
                      <textarea name="additionalRequirements" value={formData.additionalRequirements} onChange={handleInputChange} rows="3" maxLength="500" className="w-full p-3 border-2 border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-[#3498db] transition-all outline-none font-medium text-gray-800 resize-none"></textarea>
                      <span className={`absolute bottom-3 right-3 text-xs ${formData.additionalRequirements.length > 400 ? 'text-red-500' : 'text-gray-400'}`}>{formData.additionalRequirements.length}/500</span>
                      <p className="text-xs text-gray-500 mt-2"><i className="bi bi-gear"></i> Include formatting rules, referencing styles, etc.</p>
                    </div>
                  </div>

                  {/* Submit Section */}
                  <div className="border-t border-gray-100 pt-8 flex flex-col sm:flex-row justify-center gap-4 animate-fadeIn" style={{animationDelay: '0.4s'}}>
                    <Link to="/dashboard" className="px-8 py-3 rounded-xl font-bold bg-gradient-to-br from-gray-500 to-gray-600 text-white shadow-md hover:shadow-lg hover:-translate-y-1 transition-all flex justify-center items-center gap-2 no-underline">
                      <i className="bi bi-arrow-left"></i> Back to Dashboard
                    </Link>
                    <button type="submit" disabled={currentStep < 4} className="px-8 py-3 rounded-xl font-bold bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white shadow-md hover:shadow-lg hover:-translate-y-1 transition-all flex justify-center items-center gap-2 disabled:opacity-50 disabled:hover:translate-y-0 disabled:cursor-not-allowed">
                      <i className="bi bi-send"></i> Submit Assignment
                    </button>
                  </div>

                </form>
              </div>
            </div>
          </div>

          {/* Right Column - Tips */}
          <div className="lg:w-80 animate-fadeInRight" style={{animationDelay: '0.5s'}}>
            <div className="bg-gradient-to-br from-[#fff3cd] to-[#ffeaa7] rounded-[15px] p-6 shadow-md border-none sticky top-[100px]">
              <h5 className="font-bold text-[#856404] mb-4 flex items-center gap-2">
                <i className="bi bi-stars text-xl"></i> Tips for Better Results
              </h5>
              <ul className="space-y-3 text-[#856404]/80 text-sm font-medium">
                <li className="flex items-start gap-2"><i className="bi bi-check-circle-fill text-[#27ae60] mt-0.5"></i> Provide clear and detailed requirements</li>
                <li className="flex items-start gap-2"><i className="bi bi-check-circle-fill text-[#27ae60] mt-0.5"></i> Attach marking rubrics if available</li>
                <li className="flex items-start gap-2"><i className="bi bi-check-circle-fill text-[#27ae60] mt-0.5"></i> Specify the exact reference style (Harvard, APA)</li>
                <li className="flex items-start gap-2"><i className="bi bi-check-circle-fill text-[#27ae60] mt-0.5"></i> Mention any required software versions</li>
                <li className="flex items-start gap-2"><i className="bi bi-check-circle-fill text-[#27ae60] mt-0.5"></i> Set realistic deadlines</li>
              </ul>
            </div>
          </div>

        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#212529] text-white/50 text-center py-6 text-sm mt-auto">
        <p className="mb-0">&copy; 2026 Assignment Service. All rights reserved.</p>
      </footer>

      <style>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeInDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fadeInRight { from { opacity: 0; transform: translateX(30px); } to { opacity: 1; transform: translateX(0); } }
        
        .animate-fadeInUp { animation: fadeInUp 0.6s ease-out forwards; }
        .animate-fadeInDown { animation: fadeInDown 0.6s ease-out forwards; }
        .animate-fadeIn { animation: fadeIn 0.5s ease-out forwards; }
        .animate-fadeInRight { animation: fadeInRight 0.6s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default CreateAssignment;