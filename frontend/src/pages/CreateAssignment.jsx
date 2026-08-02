import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

// ============================================================
// EDIT THIS: your actual SLIIT module list per year/semester.
// Each module has a code, name, and which specialization it maps to
// (IT or QS) so your backend routing (admin specialization matching)
// keeps working unchanged.
// ============================================================
const moduleData = {
  'Year 1': {
    'Semester 1': [
      { code: 'IT1120', name: 'Introduction to Programming', type: 'IT' },
      { code: 'IT1140', name: 'Fundamentals of Computing', type: 'IT' },
      { code: 'IE1030', name: 'Data Communication and Networks', type: 'IT' },
    ],
    'Semester 2': [
      { code: 'IT1170', name: 'Data Structures and Algorithms', type: 'IT' },
      { code: 'SE1020', name: 'Object Oriented Programming', type: 'IT' },
      { code: 'IT1150', name: 'Technical Writing', type: 'IT' },
    ],
  },
  'Year 2': {
    'Semester 1': [
      { code: 'SE2030', name: 'Software Engineering', type: 'IT' },
      { code: 'IT2140', name: 'Database Design and Development', type: 'IT' },
      { code: 'IT2011', name: 'Artificial Intelligence and machine Learning', type: 'IT' },
    ],
    'Semester 2': [
      { code: 'SE2020', name: 'Web and Mobile Technology', type: 'IT' },
      { code: 'IT2021', name: 'Artificial Intelligence and machine Learning Project', type: 'IT' },
    ],
  },
};

// mode → display label + which university name gets sent to backend
const MODE_CONFIG = {
  sliit:      { universityName: 'SLIIT', label: 'SLIIT', isKnownUniversity: true },
  'other-uni': { universityName: '', label: 'Other University', isKnownUniversity: false, requiresUniversityInput: true },
  individual: { universityName: '', label: 'Individual / Freelance', isKnownUniversity: false, isIndividual: true },
};

const CreateAssignment = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode') || 'individual'; // fallback if someone lands here directly
  const modeConfig = MODE_CONFIG[mode] || MODE_CONFIG.individual;

  // Real user from session
  const [user, setUser] = useState({ fullName: '' });

  // Form State
  const [formData, setFormData] = useState({
    universityName: modeConfig.universityName || '',
    academicYear: '',
    semester: '',
    moduleCode: '',
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

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError]   = useState('');

  // Success Modal State
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // ── Fetch logged-in user ────────────────────────────────────────────────────
  useEffect(() => {
    fetch('/api/auth/me', { credentials: 'include' })
        .then(res => res.ok ? res.json() : null)
        .then(data => { if (data) setUser({ fullName: data.name || data.email }); })
        .catch(() => {});
  }, []);

  // ── Set default deadline (1 week from now) ─────────────────────────────────
  useEffect(() => {
    const defaultDate = new Date();
    defaultDate.setDate(defaultDate.getDate() + 7);
    setFormData(prev => ({ ...prev, deadline: defaultDate.toISOString().slice(0, 16) }));
  }, []);

  // ── Handle Text/Radio Inputs ────────────────────────────────────────────────
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // ── Cascading selectors: Year → Semester → Module (SLIIT mode only) ─────────
  const handleYearChange = (e) => {
    const academicYear = e.target.value;
    setFormData(prev => ({ ...prev, academicYear, semester: '', moduleCode: '', type: '', subject: '' }));
  };

  const handleSemesterChange = (e) => {
    const semester = e.target.value;
    setFormData(prev => ({ ...prev, semester, moduleCode: '', type: '', subject: '' }));
  };

  const handleModuleChange = (e) => {
    const moduleCode = e.target.value;
    const modulesForSemester = moduleData[formData.academicYear]?.[formData.semester] || [];
    const selectedModule = modulesForSemester.find(m => m.code === moduleCode);

    setFormData(prev => ({
      ...prev,
      moduleCode,
      type: selectedModule ? selectedModule.type : '',
      subject: selectedModule ? selectedModule.name : '',
    }));
  };

  const availableSemesters = formData.academicYear ? Object.keys(moduleData[formData.academicYear] || {}) : [];
  const availableModules = (formData.academicYear && formData.semester)
      ? (moduleData[formData.academicYear]?.[formData.semester] || [])
      : [];

  // ── Progress Step Calculation ───────────────────────────────────────────────
  useEffect(() => {
    let step = 1;
    const academicDone = mode === 'sliit'
        ? !!(formData.academicYear && formData.semester && formData.moduleCode)
        : mode === 'other-uni'
            ? !!(formData.universityName.trim() && formData.academicYear.trim() && formData.semester.trim())
            : !!formData.type; // individual mode: just IT/QS choice

    if (academicDone) step = 2;
    if (academicDone && formData.title && formData.deadline) step = 3;
    if (academicDone && formData.title && formData.deadline && formData.description.trim().length > 10) step = 4;
    setCurrentStep(step);
  }, [formData, mode]);

  // ── Validation helper — returns array of missing field labels ───────────────
  const getMissingFields = () => {
    const missing = [];

    if (mode === 'sliit') {
      if (!formData.academicYear) missing.push('Academic Year');
      if (!formData.semester)     missing.push('Semester');
      if (!formData.moduleCode)   missing.push('Module');
    } else if (mode === 'other-uni') {
      if (!formData.universityName.trim()) missing.push('University Name');
      if (!formData.academicYear.trim())   missing.push('Academic Year');
      if (!formData.semester.trim())       missing.push('Semester');
      if (!formData.type)                  missing.push('Assignment Type (IT or QS)');
      if (!formData.subject.trim())        missing.push('Module / Subject Name');
    } else {
      // individual
      if (!formData.type)            missing.push('Assignment Type (IT or QS)');
      if (!formData.subject.trim())  missing.push('Subject');
    }

    if (!formData.title.trim())                   missing.push('Title');
    if (!formData.deadline)                       missing.push('Deadline');
    if (formData.description.trim().length <= 10) missing.push('Description (min 11 characters)');
    return missing;
  };

  const canSubmit = getMissingFields().length === 0;

  // ── File Uploads ────────────────────────────────────────────────────────────
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
    if (['pdf'].includes(ext))           return { icon: 'bi-file-pdf',     color: 'bg-gradient-to-br from-[#ff6b6b] to-[#ee5a52]' };
    if (['doc','docx'].includes(ext))    return { icon: 'bi-file-word',    color: 'bg-gradient-to-br from-[#2b579a] to-[#1e4a8a]' };
    if (['xls','xlsx'].includes(ext))    return { icon: 'bi-file-excel',   color: 'bg-gradient-to-br from-[#217346] to-[#1a5c38]' };
    if (['ppt','pptx'].includes(ext))    return { icon: 'bi-file-ppt',     color: 'bg-gradient-to-br from-[#d24726] to-[#b83a1f]' };
    if (['jpg','jpeg','png','gif'].includes(ext)) return { icon: 'bi-file-image', color: 'bg-gradient-to-br from-[#9c27b0] to-[#7b1fa2]' };
    return { icon: 'bi-file-earmark', color: 'bg-gradient-to-br from-[#6c757d] to-[#495057]' };
  };

  // ── Submit ──────────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');

    const missing = getMissingFields();
    if (missing.length > 0) {
      setSubmitError('Please complete: ' + missing.join(', '));
      return;
    }

    setIsSubmitting(true);
    try {
      const backendType = formData.type === 'QS' ? 'QUANTITY_SURVEYING' : formData.type;

      const payload = new FormData();
      payload.append('type',                   backendType);
      payload.append('title',                  formData.title.trim());
      payload.append('subject',                formData.subject.trim());
      payload.append('deadline',               formData.deadline);
      payload.append('description',            formData.description.trim());
      payload.append('additionalRequirements', formData.additionalRequirements.trim());

      // Academic context — blank for individual mode, filled for sliit/other-uni
      payload.append('universityName', formData.universityName.trim());
      payload.append('academicYear',   formData.academicYear.trim());
      payload.append('semester',       formData.semester.trim());
      payload.append('moduleCode',     formData.moduleCode.trim());

      descriptionFiles.forEach(file => payload.append('descriptionFiles', file));
      requirementFiles.forEach(file => payload.append('requirementFiles', file));

      const res = await fetch('/api/assignments/submit', {
        method: 'POST',
        credentials: 'include',
        body: payload,
        redirect: 'manual',
      });

      if (res.type === 'opaqueredirect' || res.ok) {
        setShowSuccessModal(true);
        return;
      }

      let msg = '';
      try { msg = await res.text(); } catch (_) {}
      throw new Error(msg || `Server error ${res.status}. Please try again.`);

    } catch (err) {
      setSubmitError(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleModalClose = () => {
    setShowSuccessModal(false);
    navigate('/dashboard?success=Assignment submitted successfully! Admin will receive your files via email.');
  };

  const missingFields = getMissingFields();

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
              <i className="bi bi-person-circle text-xl"></i>
              {user.fullName ? `Welcome, ${user.fullName}` : ''}
            </span>
              <Link to="/login?logout=true" className="border border-white/30 px-3 py-1.5 rounded hover:bg-white hover:text-[#667eea] transition-all font-bold text-sm flex items-center gap-2 no-underline">
                <i className="bi bi-box-arrow-right"></i> Logout
              </Link>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8 flex-1 max-w-5xl">

          {/* Mode indicator */}
          <div className="mb-6 flex items-center gap-2 text-sm">
            <Link to="/assignments/select-type" className="text-gray-400 hover:text-gray-600 flex items-center gap-1 no-underline">
              <i className="bi bi-arrow-left"></i> Change project type
            </Link>
            <span className="text-gray-300">•</span>
            <span className="font-bold text-[#667eea]">{modeConfig.label}</span>
          </div>

          {/* Progress Indicator */}
          <div className="flex justify-between relative mb-10 hidden md:flex">
            <div className="absolute top-[20px] left-[10%] right-[10%] h-1 bg-gray-200 z-0"></div>
            {[
              { num: 1, label: mode === 'individual' ? 'Assignment Type' : 'Academic Details' },
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

                    {/* ============ SLIIT MODE: cascading Year/Sem/Module ============ */}
                    {mode === 'sliit' && (
                      <div className="mb-10 animate-fadeIn">
                        <label className="block text-lg font-bold text-[#2c3e50] mb-4">🎓 Select Your Year, Semester & Module <span className="text-red-500">*</span></label>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div>
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Academic Year</label>
                            <select value={formData.academicYear} onChange={handleYearChange} className="w-full p-3 border-2 border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-[#3498db] transition-all outline-none font-medium text-gray-800">
                              <option value="">Select Year</option>
                              {Object.keys(moduleData).map(year => <option key={year} value={year}>{year}</option>)}
                            </select>
                          </div>
                          <div>
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Semester</label>
                            <select value={formData.semester} onChange={handleSemesterChange} disabled={!formData.academicYear} className="w-full p-3 border-2 border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-[#3498db] transition-all outline-none font-medium text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed">
                              <option value="">Select Semester</option>
                              {availableSemesters.map(sem => <option key={sem} value={sem}>{sem}</option>)}
                            </select>
                          </div>
                          <div>
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Module</label>
                            <select value={formData.moduleCode} onChange={handleModuleChange} disabled={!formData.semester} className="w-full p-3 border-2 border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-[#3498db] transition-all outline-none font-medium text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed">
                              <option value="">Select Module</option>
                              {availableModules.map(mod => <option key={mod.code} value={mod.code}>{mod.code} — {mod.name}</option>)}
                            </select>
                          </div>
                        </div>

                        {formData.moduleCode && (
                          <div className={`rounded-xl p-4 border flex items-center gap-3 ${formData.type === 'IT' ? 'bg-blue-50/50 border-blue-200' : 'bg-green-50/50 border-green-200'}`}>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-xl ${formData.type === 'IT' ? 'bg-gradient-to-br from-[#667eea] to-[#764ba2]' : 'bg-gradient-to-br from-[#11998e] to-[#38ef7d]'}`}>
                              <i className={`bi ${formData.type === 'IT' ? 'bi-laptop' : 'bi-calculator'}`}></i>
                            </div>
                            <div>
                              <p className="font-bold text-gray-800 m-0">{formData.subject}</p>
                              <p className="text-xs text-gray-500 m-0">SLIIT • {formData.academicYear} • {formData.semester}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* ============ OTHER-UNI MODE: manual university/module entry ============ */}
                    {mode === 'other-uni' && (
                      <div className="mb-10 animate-fadeIn">
                        <label className="block text-lg font-bold text-[#2c3e50] mb-4">🏫 Your University Details <span className="text-red-500">*</span></label>
                        <p className="text-xs text-gray-400 mb-4">We don't have your university's module list yet, so please fill these in manually.</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                          <div>
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">University Name</label>
                            <input type="text" name="universityName" value={formData.universityName} onChange={handleInputChange} placeholder="e.g. University of Colombo" className="w-full p-3 border-2 border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-[#3498db] transition-all outline-none font-medium text-gray-800" />
                          </div>
                          <div>
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Assignment Type</label>
                            <div className="flex gap-3">
                              <label className={`flex-1 cursor-pointer border-2 rounded-xl p-3 text-center transition-all ${formData.type === 'IT' ? 'border-[#3498db] bg-blue-50/50' : 'border-gray-200 bg-white'}`}>
                                <input type="radio" name="type" value="IT" checked={formData.type === 'IT'} onChange={handleInputChange} className="hidden" />
                                <span className="font-bold text-sm text-gray-700">IT</span>
                              </label>
                              <label className={`flex-1 cursor-pointer border-2 rounded-xl p-3 text-center transition-all ${formData.type === 'QS' ? 'border-[#27ae60] bg-green-50/50' : 'border-gray-200 bg-white'}`}>
                                <input type="radio" name="type" value="QS" checked={formData.type === 'QS'} onChange={handleInputChange} className="hidden" />
                                <span className="font-bold text-sm text-gray-700">QS</span>
                              </label>
                            </div>
                          </div>
                          <div>
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Academic Year</label>
                            <input type="text" name="academicYear" value={formData.academicYear} onChange={handleInputChange} placeholder="e.g. Year 2" className="w-full p-3 border-2 border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-[#3498db] transition-all outline-none font-medium text-gray-800" />
                          </div>
                          <div>
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Semester</label>
                            <input type="text" name="semester" value={formData.semester} onChange={handleInputChange} placeholder="e.g. Semester 1" className="w-full p-3 border-2 border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-[#3498db] transition-all outline-none font-medium text-gray-800" />
                          </div>
                        </div>

                        <div>
                          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Module / Subject Name</label>
                          <input type="text" name="subject" value={formData.subject} onChange={handleInputChange} maxLength="100" placeholder="e.g. Software Engineering" className="w-full p-3 border-2 border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-[#3498db] transition-all outline-none font-medium text-gray-800" />
                        </div>
                      </div>
                    )}

                    {/* ============ INDIVIDUAL MODE: old flat IT/QS form ============ */}
                    {mode === 'individual' && (
                      <div className="mb-10 animate-fadeIn">
                        <label className="block text-lg font-bold text-[#2c3e50] mb-4">📝 Assignment Type <span className="text-red-500">*</span></label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <label className={`cursor-pointer border-4 rounded-2xl p-6 text-center transition-all hover:-translate-y-2 hover:shadow-xl relative overflow-hidden group ${formData.type === 'IT' ? 'border-[#3498db] bg-blue-50/50' : 'border-transparent bg-gray-50 hover:border-[#3498db]/30'}`}>
                            <input type="radio" name="type" value="IT" onChange={handleInputChange} className="hidden" />
                            <div className="w-[60px] h-[60px] rounded-full bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white flex items-center justify-center text-3xl mx-auto mb-4 shadow-md group-hover:scale-110 transition-transform">
                              <i className="bi bi-laptop"></i>
                            </div>
                            <h5 className="font-bold text-[#3498db] mb-2 text-xl">IT Assignment</h5>
                            <p className="text-gray-500 text-sm m-0 leading-relaxed">Programming, Web Dev, Databases, Software Eng, Mobile, Networking.</p>
                            {formData.type === 'IT' && <div className="absolute top-3 right-3 text-[#3498db] text-2xl"><i className="bi bi-check-circle-fill"></i></div>}
                          </label>
                          <label className={`cursor-pointer border-4 rounded-2xl p-6 text-center transition-all hover:-translate-y-2 hover:shadow-xl relative overflow-hidden group ${formData.type === 'QS' ? 'border-[#27ae60] bg-green-50/50' : 'border-transparent bg-gray-50 hover:border-[#27ae60]/30'}`}>
                            <input type="radio" name="type" value="QS" onChange={handleInputChange} className="hidden" />
                            <div className="w-[60px] h-[60px] rounded-full bg-gradient-to-br from-[#11998e] to-[#38ef7d] text-white flex items-center justify-center text-3xl mx-auto mb-4 shadow-md group-hover:scale-110 transition-transform">
                              <i className="bi bi-calculator"></i>
                            </div>
                            <h5 className="font-bold text-[#27ae60] mb-2 text-xl">QS Assignment</h5>
                            <p className="text-gray-500 text-sm m-0 leading-relaxed">Quantity Surveying, Cost Est, Project Planning, Contract Admin.</p>
                            {formData.type === 'QS' && <div className="absolute top-3 right-3 text-[#27ae60] text-2xl"><i className="bi bi-check-circle-fill"></i></div>}
                          </label>
                        </div>
                        <div className="relative">
                          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Subject / Project Area</label>
                          <input type="text" name="subject" value={formData.subject} onChange={handleInputChange} maxLength="100" placeholder="e.g. E-commerce Web App" className="w-full p-3 border-2 border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-[#3498db] transition-all outline-none font-medium text-gray-800" />
                        </div>
                      </div>
                    )}

                    {/* Step 2: Basic Info */}
                    <div className="mb-10 animate-fadeIn" style={{animationDelay: '0.2s'}}>
                      <label className="block text-lg font-bold text-[#2c3e50] mb-4">📋 Basic Information</label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                        <div className="relative">
                          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Assignment Title <span className="text-red-500">*</span></label>
                          <input type="text" name="title" value={formData.title} onChange={handleInputChange} maxLength="100" className="w-full p-3 border-2 border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-[#3498db] transition-all outline-none font-medium text-gray-800" />
                          <span className={`absolute bottom-3 right-3 text-xs ${formData.title.length > 80 ? 'text-red-500' : 'text-gray-400'}`}>{formData.title.length}/100</span>
                        </div>
                        {mode === 'sliit' && (
                          <div className="relative">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Subject/Module <span className="text-red-500">*</span></label>
                            <input type="text" name="subject" value={formData.subject} onChange={handleInputChange} maxLength="100" className="w-full p-3 border-2 border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-[#3498db] transition-all outline-none font-medium text-gray-800" />
                          </div>
                        )}
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Deadline <span className="text-red-500">*</span></label>
                        <input type="datetime-local" name="deadline" value={formData.deadline} onChange={handleInputChange} className="w-full p-3 border-2 border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-[#3498db] transition-all outline-none font-medium text-gray-800" />
                        <p className="text-xs text-gray-500 mt-2 flex items-center gap-1"><i className="bi bi-calendar3"></i> Select the final submission date and time</p>
                      </div>
                    </div>

                    {/* Step 3: Description & Files */}
                    <div className="mb-10 animate-fadeIn" style={{animationDelay: '0.3s'}}>
                      <div className="relative mb-6">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Assignment Description <span className="text-red-500">*</span></label>
                        <textarea name="description" value={formData.description} onChange={handleInputChange} rows="6" maxLength="1000" className="w-full p-3 border-2 border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-[#3498db] transition-all outline-none font-medium text-gray-800 resize-none"></textarea>
                        <span className={`absolute bottom-3 right-3 text-xs ${formData.description.length > 800 ? 'text-red-500' : 'text-gray-400'}`}>{formData.description.length}/1000</span>
                        {formData.description.length > 0 && formData.description.trim().length <= 10 && (
                            <p className="text-xs text-orange-500 mt-1 flex items-center gap-1">
                              <i className="bi bi-exclamation-circle"></i> Description must be at least 11 characters
                            </p>
                        )}
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

                      <div className="mb-8">
                        <label className="font-bold text-[#2c3e50] mb-2 block flex items-center gap-2"><i className="bi bi-paperclip text-[#27ae60]"></i> Upload Requirement Files <span className="text-gray-400 text-xs font-normal">(Optional)</span></label>
                        <div className="border-2 border-dashed border-[#27ae60] bg-green-50/30 rounded-xl p-6 text-center hover:bg-green-50 transition-colors relative">
                          <input type="file" multiple accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.xlsx,.xls,.pptx,.ppt" onChange={(e) => handleFileUpload(e, setRequirementFiles)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                          {requirementFiles.length === 0 ? (
                              <div className="text-gray-500 pointer-events-none">
                                <i className="bi bi-cloud-arrow-up text-4xl mb-2 block text-[#27ae60]"></i>
                                <p className="font-medium text-gray-700">Click or drag requirement files here</p>
                                <p className="text-xs">Rubrics, marking schemes, guidelines (Max 10MB each)</p>
                              </div>
                          ) : (
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 relative z-20 text-left">
                                {requirementFiles.map((file, idx) => {
                                  const style = getFileIcon(file.name);
                                  return (
                                      <div key={idx} className="bg-white border border-gray-200 rounded-lg p-2 flex items-center gap-3 shadow-sm hover:border-[#27ae60] transition-colors">
                                        <div className={`w-10 h-10 rounded flex items-center justify-center text-white text-xl ${style.color}`}>
                                          <i className={style.icon}></i>
                                        </div>
                                        <div className="flex-1 overflow-hidden">
                                          <div className="font-bold text-sm text-gray-700 truncate">{file.name}</div>
                                          <div className="text-xs text-gray-400">{formatFileSize(file.size)}</div>
                                        </div>
                                        <button type="button" onClick={(e) => { e.preventDefault(); removeFile(idx, requirementFiles, setRequirementFiles); }} className="w-8 h-8 rounded-full bg-red-100 text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center transition-colors">
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
                    <div className="border-t border-gray-100 pt-8 animate-fadeIn" style={{animationDelay: '0.4s'}}>

                      {submitError && (
                          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 flex items-start gap-2 text-sm">
                            <i className="bi bi-exclamation-triangle-fill mt-0.5 shrink-0"></i>
                            <span>{submitError}</span>
                          </div>
                      )}

                      {!canSubmit && missingFields.length > 0 && (
                          <div className="mb-4 bg-orange-50 border border-orange-200 text-orange-700 rounded-xl px-4 py-3 text-sm">
                            <p className="font-bold flex items-center gap-2 mb-1">
                              <i className="bi bi-info-circle-fill"></i> Still needed to enable submit:
                            </p>
                            <ul className="list-disc list-inside space-y-0.5">
                              {missingFields.map(f => <li key={f}>{f}</li>)}
                            </ul>
                          </div>
                      )}

                      <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link to="/dashboard" className="px-8 py-3 rounded-xl font-bold bg-gradient-to-br from-gray-500 to-gray-600 text-white shadow-md hover:shadow-lg hover:-translate-y-1 transition-all flex justify-center items-center gap-2 no-underline">
                          <i className="bi bi-arrow-left"></i> Back to Dashboard
                        </Link>
                        <button
                            type="submit"
                            disabled={!canSubmit || isSubmitting}
                            className="px-8 py-3 rounded-xl font-bold bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white shadow-md hover:shadow-lg hover:-translate-y-1 transition-all flex justify-center items-center gap-2 disabled:opacity-50 disabled:hover:translate-y-0 disabled:cursor-not-allowed"
                        >
                          {isSubmitting
                              ? <><i className="bi bi-arrow-repeat animate-spin"></i> Submitting…</>
                              : <><i className="bi bi-send"></i> Submit Assignment</>
                          }
                        </button>
                      </div>
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

                <div className="mt-6 pt-4 border-t border-[#856404]/20">
                  <p className="text-xs font-bold text-[#856404] uppercase tracking-wider mb-3">Form Progress</p>
                  <ul className="space-y-2 text-xs">
                    {[
                      { label: mode === 'individual' ? 'Assignment type selected' : 'Academic details filled', done: getMissingFields().length < 5 },
                      { label: 'Title filled',             done: !!formData.title.trim() },
                      { label: 'Deadline set',             done: !!formData.deadline },
                      { label: 'Description (11+ chars)',  done: formData.description.trim().length > 10 },
                    ].map(item => (
                        <li key={item.label} className={`flex items-center gap-2 ${item.done ? 'text-[#27ae60]' : 'text-[#856404]/60'}`}>
                          <i className={`bi ${item.done ? 'bi-check-circle-fill' : 'bi-circle'}`}></i>
                          {item.label}
                        </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Footer */}
        <footer className="bg-[#212529] text-white/50 text-center py-6 text-sm mt-auto">
          <p className="mb-0">&copy; 2026 Assignment Service. All rights reserved.</p>
        </footer>

        {/* Success Modal */}
        {showSuccessModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-fadeIn">
            <div className="bg-white rounded-[20px] shadow-2xl max-w-md w-full p-8 text-center animate-fadeInUp">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#27ae60] to-[#11998e] text-white flex items-center justify-center text-4xl mx-auto mb-6 shadow-lg">
                <i className="bi bi-check-lg"></i>
              </div>
              <h3 className="text-2xl font-bold text-[#2c3e50] mb-3">Thank You!</h3>
              <p className="text-gray-600 mb-2 leading-relaxed">
                Your assignment has been submitted successfully.
              </p>
              <p className="text-gray-600 mb-6 leading-relaxed">
                We'll check your assignment and get back to you soon via email.
              </p>
              <button
                  onClick={handleModalClose}
                  className="w-full px-8 py-3 rounded-xl font-bold bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white shadow-md hover:shadow-lg hover:-translate-y-1 transition-all flex justify-center items-center gap-2"
              >
                <i className="bi bi-speedometer2"></i> Go to Dashboard
              </button>
            </div>
          </div>
        )}

        <style>{`
        @keyframes fadeInUp    { from { opacity: 0; transform: translateY(30px); }  to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeInDown  { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn      { from { opacity: 0; }                               to { opacity: 1; } }
        @keyframes fadeInRight { from { opacity: 0; transform: translateX(30px); }  to { opacity: 1; transform: translateX(0); } }
        @keyframes spin        { to   { transform: rotate(360deg); } }

        .animate-fadeInUp    { animation: fadeInUp    0.6s ease-out forwards; }
        .animate-fadeInDown  { animation: fadeInDown  0.6s ease-out forwards; }
        .animate-fadeIn      { animation: fadeIn      0.5s ease-out forwards; }
        .animate-fadeInRight { animation: fadeInRight 0.6s ease-out forwards; }
        .animate-spin        { animation: spin        0.8s linear infinite; }
      `}</style>
      </div>
  );
};

export default CreateAssignment;