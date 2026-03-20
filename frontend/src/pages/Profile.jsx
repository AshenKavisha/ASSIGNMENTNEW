import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // Active Tab State
  const [activeTab, setActiveTab] = useState('edit');

  // Mock User Data
  const [user, setUser] = useState({
    fullName: "Ashen Kaveesha",
    email: "ashenkaveesha@example.com",
    phoneNumber: "075 730 0842",
    birthDate: "2000-01-01",
    bio: "Data Science student passionate about AI and web development.",
    workExperience: "Freelance web developer.",
    education: "BSc (Hons) in Information Technology - SLIIT",
    skills: "Python, Java, React, SQL",
    location: "Homagama, Sri Lanka",
    website: "https://ashenkaveesha.com",
    profilePicture: null,
    isOnline: true,
    assignments: [
      { id: 101, title: "Java OOP Assignment", createdAt: "2026-03-10", description: "Create a complete library management system using Java Swing and MySQL backend. Implement all CRUD operations and design patterns.", status: "DELIVERED" },
      { id: 102, title: "Construction Measurement", createdAt: "2026-03-08", description: "Quantity surveying assignment for the new building project.", status: "IN_PROGRESS" }
    ],
    feedbacks: [{ id: 1 }, { id: 2 }] // Just for counting
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [deleteData, setDeleteData] = useState({
    password: '',
    confirmDelete: false
  });

  // Handle Profile Update
  const handleProfileUpdate = (e) => {
    e.preventDefault();
    alert("Profile updated successfully!");
  };

  // Handle Password Change
  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("New passwords do not match!");
      return;
    }
    alert("Password changed successfully!");
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  // Handle Account Delete
  const handleDeleteAccount = (e) => {
    e.preventDefault();
    if (window.confirm('⚠️ FINAL WARNING!\n\nAre you absolutely sure you want to delete your account?\n\nThis will permanently delete:\n- Your profile and personal information\n- All your assignments\n- All your feedback and reviews\n- Your entire account history\n\nThis action CANNOT be undone!\n\nClick OK to proceed with deletion, or Cancel to go back.')) {
      alert("Account deleted.");
      navigate('/login');
    }
  };

  // Handle Profile Picture Preview
  const handlePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUser(prev => ({ ...prev, profilePicture: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Helper for Status Badge in Activity Tab
  const getStatusBadge = (status) => {
    switch (status) {
      case 'COMPLETED': case 'DELIVERED': return 'bg-[#28a745]';
      case 'PENDING': return 'bg-[#ffc107]';
      case 'IN_PROGRESS': return 'bg-[#17a2b8]';
      default: return 'bg-[#6c757d]';
    }
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
            {/* Profile Picture Indicator */}
            <div className="relative block">
              {user.profilePicture ? (
                <img src={user.profilePicture} alt="Profile" className="w-10 h-10 rounded-full object-cover border-2 border-white" />
              ) : (
                <i className="bi bi-person-circle text-[40px] text-white/90"></i>
              )}
              {user.isOnline && (
                <div className="absolute bottom-0.5 right-0.5 w-3 h-3 bg-[#28a745] rounded-full border-2 border-[#212529]"></div>
              )}
            </div>
            
            <span className="hidden sm:inline font-medium">{user.fullName}</span>
            
            <Link to="/dashboard" className="border border-white/30 px-3 py-1.5 rounded hover:bg-white hover:text-black transition-all font-bold text-sm flex items-center gap-2 text-white no-underline">
              <i className="bi bi-speedometer2"></i> <span className="hidden md:inline">Dashboard</span>
            </Link>
            <Link to="/login?logout=true" className="bg-[#dc3545] hover:bg-[#c82333] px-3 py-1.5 rounded transition-all font-bold text-sm flex items-center gap-2 text-white no-underline border border-transparent">
              <i className="bi bi-box-arrow-right"></i> <span className="hidden md:inline">Logout</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 flex-1 max-w-6xl">
        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* Left Column - Profile Card */}
          <div className="w-full lg:w-1/3 animate-fadeInUp">
            <div className="bg-white rounded-[15px] shadow-sm border border-gray-100 overflow-hidden mb-6">
              
              <div className="bg-gradient-to-br from-[#3498db] to-[#2980b9] p-8 text-center text-white relative">
                <div className="relative inline-block mx-auto mb-4">
                  {user.profilePicture ? (
                    <img src={user.profilePicture} alt="Profile" className="w-[150px] h-[150px] rounded-full object-cover border-[5px] border-white shadow-lg" />
                  ) : (
                    <div className="w-[150px] h-[150px] rounded-full bg-white text-gray-300 flex items-center justify-center border-[5px] border-white shadow-lg mx-auto">
                      <i className="bi bi-person-circle text-[7rem]"></i>
                    </div>
                  )}
                  {user.isOnline && (
                    <div className="absolute bottom-[15px] right-[15px] w-[20px] h-[20px] bg-[#28a745] rounded-full border-[3px] border-white shadow-sm"></div>
                  )}
                  <input type="file" ref={fileInputRef} onChange={handlePictureChange} accept="image/*" className="hidden" />
                </div>
                
                <h3 className="text-2xl font-bold mb-1">{user.fullName}</h3>
                <p className="text-white/80 m-0">{user.email}</p>

                <div className="mt-4 flex flex-col gap-2">
                  <button onClick={() => fileInputRef.current.click()} className="bg-white/20 hover:bg-white text-white hover:text-[#3498db] py-2 rounded-lg font-bold text-sm transition-colors shadow-sm">
                    <i className="bi bi-camera"></i> Change Picture
                  </button>
                  {user.profilePicture && (
                    <button onClick={() => setUser(prev => ({...prev, profilePicture: null}))} className="bg-transparent border border-white/40 hover:bg-red-500 hover:border-red-500 py-1.5 rounded-lg font-bold text-sm transition-colors text-white">
                      <i className="bi bi-trash"></i> Remove Picture
                    </button>
                  )}
                </div>
              </div>

              <div className="p-6">
                {/* Stats */}
                <div className="grid grid-cols-3 text-center mb-6 pb-6 border-b border-gray-100">
                  <div>
                    <h5 className="text-2xl font-bold text-gray-800 m-0">{user.assignments.length}</h5>
                    <small className="text-gray-500 font-medium uppercase tracking-wider text-[10px]">Assignments</small>
                  </div>
                  <div>
                    <h5 className="text-2xl font-bold text-gray-800 m-0">{user.feedbacks.length}</h5>
                    <small className="text-gray-500 font-medium uppercase tracking-wider text-[10px]">Feedbacks</small>
                  </div>
                  <div>
                    <h5 className={`text-xl font-bold m-0 mt-1 ${user.isOnline ? 'text-[#28a745]' : 'text-gray-500'}`}>
                      {user.isOnline ? 'Online' : 'Offline'}
                    </h5>
                    <small className="text-gray-500 font-medium uppercase tracking-wider text-[10px]">Status</small>
                  </div>
                </div>

                {/* Bio */}
                {user.bio && (
                  <div className="mb-6">
                    <h6 className="font-bold text-gray-800 mb-2 uppercase tracking-wide text-xs">About Me</h6>
                    <p className="text-gray-600 text-sm whitespace-pre-line leading-relaxed m-0 bg-gray-50 p-4 rounded-lg">{user.bio}</p>
                  </div>
                )}

                {/* Contact Info */}
                <div>
                  <h6 className="font-bold text-gray-800 mb-3 uppercase tracking-wide text-xs">Contact Information</h6>
                  <ul className="space-y-3 text-sm text-gray-600 m-0 pl-0 list-none">
                    {user.phoneNumber && <li className="flex items-center gap-3"><i className="bi bi-telephone text-[#3498db]"></i> {user.phoneNumber}</li>}
                    {user.location && <li className="flex items-center gap-3"><i className="bi bi-geo-alt text-[#e74c3c]"></i> {user.location}</li>}
                    {user.website && (
                      <li className="flex items-center gap-3">
                        <i className="bi bi-globe text-[#27ae60]"></i> 
                        <a href={user.website} target="_blank" rel="noreferrer" className="text-[#3498db] hover:underline truncate">{user.website}</a>
                      </li>
                    )}
                  </ul>
                </div>
              </div>

            </div>
          </div>

          {/* Right Column - Tabs & Content */}
          <div className="w-full lg:w-2/3 animate-fadeInUp" style={{animationDelay: '0.1s'}}>
            
            {/* Custom Tabs */}
            <div className="flex border-b border-gray-200 mb-6 overflow-x-auto hide-scrollbar">
              {[
                { id: 'edit', icon: 'bi-pencil', label: 'Edit Profile' },
                { id: 'password', icon: 'bi-key', label: 'Change Password' },
                { id: 'activity', icon: 'bi-clock-history', label: 'Recent Activity' },
                { id: 'delete', icon: 'bi-exclamation-triangle-fill', label: 'Delete Account', color: 'text-red-500' }
              ].map(tab => (
                <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-5 py-3 font-bold text-sm flex items-center gap-2 whitespace-nowrap transition-colors border-b-2 ${activeTab === tab.id ? 'border-[#3498db] text-[#3498db]' : 'border-transparent text-gray-500 hover:text-gray-800'} ${tab.color || ''}`}
                >
                  <i className={tab.icon}></i> {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="bg-white rounded-[15px] shadow-sm border border-gray-100">
              
              {/* Tab: Edit Profile */}
              {activeTab === 'edit' && (
                <div className="p-6 md:p-8 animate-fadeIn">
                  <h5 className="text-xl font-bold text-gray-800 mb-6">Edit Profile Details</h5>
                  <form onSubmit={handleProfileUpdate}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Full Name</label>
                        <input type="text" value={user.fullName} onChange={(e) => setUser({...user, fullName: e.target.value})} required className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Email</label>
                        <input type="email" value={user.email} readOnly className="w-full p-2.5 border border-gray-200 rounded-lg bg-gray-100 text-gray-500 outline-none cursor-not-allowed" />
                        <span className="text-[10px] text-gray-400 mt-1 block">Email cannot be changed</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Phone Number</label>
                        <input type="tel" value={user.phoneNumber} onChange={(e) => setUser({...user, phoneNumber: e.target.value})} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Birth Date</label>
                        <input type="date" value={user.birthDate} onChange={(e) => setUser({...user, birthDate: e.target.value})} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
                      </div>
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-bold text-gray-700 mb-1">Bio/About Me</label>
                      <textarea value={user.bio} onChange={(e) => setUser({...user, bio: e.target.value})} rows="3" placeholder="Tell us about yourself..." className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"></textarea>
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-bold text-gray-700 mb-1">Work Experience</label>
                      <textarea value={user.workExperience} onChange={(e) => setUser({...user, workExperience: e.target.value})} rows="2" placeholder="Describe your work experience..." className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"></textarea>
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-bold text-gray-700 mb-1">Education</label>
                      <textarea value={user.education} onChange={(e) => setUser({...user, education: e.target.value})} rows="2" placeholder="Your educational background..." className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"></textarea>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Skills</label>
                        <textarea value={user.skills} onChange={(e) => setUser({...user, skills: e.target.value})} rows="2" placeholder="Your skills (comma separated)..." className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"></textarea>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Location</label>
                        <input type="text" value={user.location} onChange={(e) => setUser({...user, location: e.target.value})} placeholder="City, Country" className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all mb-4" />
                        
                        <label className="block text-sm font-bold text-gray-700 mb-1">Website/Portfolio</label>
                        <input type="url" value={user.website} onChange={(e) => setUser({...user, website: e.target.value})} placeholder="https://yourwebsite.com" className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
                      </div>
                    </div>
                    <div className="mt-6">
                      <button type="submit" className="bg-[#3498db] text-white px-6 py-2.5 rounded-lg font-bold hover:bg-[#2980b9] transition-colors flex items-center gap-2">
                        <i className="bi bi-save"></i> Save Changes
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Tab: Change Password */}
              {activeTab === 'password' && (
                <div className="p-6 md:p-8 animate-fadeIn">
                  <h5 className="text-xl font-bold text-gray-800 mb-6">Change Password</h5>
                  <form onSubmit={handlePasswordChange} className="max-w-md">
                    <div className="mb-4">
                      <label className="block text-sm font-bold text-gray-700 mb-1">Current Password</label>
                      <input type="password" required value={passwordData.currentPassword} onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-bold text-gray-700 mb-1">New Password</label>
                      <input type="password" required minLength="6" value={passwordData.newPassword} onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
                      <span className="text-[10px] text-gray-400 mt-1 block">Must be at least 6 characters long</span>
                    </div>
                    <div className="mb-6">
                      <label className="block text-sm font-bold text-gray-700 mb-1">Confirm New Password</label>
                      <input type="password" required minLength="6" value={passwordData.confirmPassword} onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
                    </div>
                    <button type="submit" className="bg-[#3498db] text-white px-6 py-2.5 rounded-lg font-bold hover:bg-[#2980b9] transition-colors flex items-center gap-2">
                      <i className="bi bi-key"></i> Change Password
                    </button>
                  </form>
                </div>
              )}

              {/* Tab: Recent Activity */}
              {activeTab === 'activity' && (
                <div className="p-6 md:p-8 animate-fadeIn">
                  <h5 className="text-xl font-bold text-gray-800 mb-6">Recent Activity</h5>
                  {user.assignments.length === 0 ? (
                    <div className="text-center py-10 bg-gray-50 rounded-xl border border-gray-100">
                      <i className="bi bi-inbox text-5xl text-gray-300 mb-3 block"></i>
                      <p className="text-gray-500 mb-4">No assignments yet</p>
                      <Link to="/assignments/create" className="bg-[#3498db] text-white px-5 py-2 rounded-lg font-bold hover:bg-[#2980b9] transition-colors inline-flex items-center gap-2 no-underline">
                        <i className="bi bi-plus-lg"></i> Create Your First Assignment
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {user.assignments.map(assignment => (
                        <div key={assignment.id} className="p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div>
                            <div className="flex items-center justify-between sm:justify-start gap-4 mb-1">
                              <h6 className="font-bold text-gray-800 m-0">{assignment.title}</h6>
                              <span className="text-xs text-gray-400 font-medium">{assignment.createdAt}</span>
                            </div>
                            <p className="text-sm text-gray-500 m-0 truncate max-w-md">{assignment.description}</p>
                          </div>
                          <div>
                            <span className={`text-[10px] font-bold text-white px-3 py-1 rounded-full whitespace-nowrap ${getStatusBadge(assignment.status)}`}>
                              {assignment.status.replace('_', ' ')}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Tab: Delete Account */}
              {activeTab === 'delete' && (
                <div className="p-6 md:p-8 animate-fadeIn border-t-[5px] border-t-red-500 rounded-t-xl mt-[-1px]">
                  <div className="bg-red-50 text-red-800 p-4 rounded-xl flex items-start gap-4 mb-6 border border-red-200">
                    <i className="bi bi-exclamation-triangle-fill text-2xl mt-1 text-red-500"></i>
                    <div>
                      <h5 className="font-bold mb-1 text-red-700">Danger Zone</h5>
                      <p className="m-0 text-sm font-medium">Once you delete your account, there is no going back. Please be certain.</p>
                    </div>
                  </div>

                  <h5 className="text-xl font-bold text-red-600 mb-4 flex items-center gap-2"><i className="bi bi-trash"></i> Delete Account Permanently</h5>
                  
                  <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 mb-6">
                    <h6 className="font-bold text-gray-700 mb-3 text-sm">What happens when you delete your account:</h6>
                    <ul className="text-sm text-gray-600 space-y-2 m-0 pl-4 list-disc">
                      <li>All your personal information will be permanently deleted</li>
                      <li>All your assignments and submission history will be removed</li>
                      <li>All your feedback and reviews will be deleted</li>
                      <li>Your profile and activity will no longer be accessible</li>
                      <li className="text-red-500 font-bold">This action cannot be undone</li>
                    </ul>
                  </div>

                  <form onSubmit={handleDeleteAccount}>
                    <div className="mb-4 max-w-md">
                      <label className="block text-sm font-bold text-gray-700 mb-2">To confirm deletion, please enter your password:</label>
                      <input type="password" required value={deleteData.password} onChange={(e) => setDeleteData({...deleteData, password: e.target.value})} placeholder="Enter your current password" className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all" />
                    </div>
                    
                    <div className="mb-6 flex items-start gap-2">
                      <input type="checkbox" id="confirmDelete" required checked={deleteData.confirmDelete} onChange={(e) => setDeleteData({...deleteData, confirmDelete: e.target.checked})} className="mt-1 cursor-pointer w-4 h-4 text-red-600 focus:ring-red-500" />
                      <label htmlFor="confirmDelete" className="text-sm font-bold text-red-600 cursor-pointer leading-tight">
                        I understand that this action is permanent and cannot be undone
                      </label>
                    </div>

                    <div className="flex gap-3">
                      <button type="submit" disabled={!deleteData.confirmDelete || !deleteData.password} className="bg-[#dc3545] text-white px-6 py-2.5 rounded-lg font-bold hover:bg-[#c82333] transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                        <i className="bi bi-trash-fill"></i> Delete My Account
                      </button>
                      <button type="button" onClick={() => setActiveTab('edit')} className="bg-gray-500 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-gray-600 transition-colors flex items-center gap-2">
                        <i className="bi bi-x-circle"></i> Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#212529] text-white/50 text-center py-6 text-sm mt-auto">
        <p className="mb-0">&copy; 2026 Assignment Service. All rights reserved.</p>
      </footer>

      <style>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .animate-fadeInUp { animation: fadeInUp 0.5s ease-out forwards; }
        .animate-fadeIn { animation: fadeIn 0.4s ease-out forwards; }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default Profile;