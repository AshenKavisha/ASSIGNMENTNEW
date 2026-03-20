import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/admin/Sidebar';

const SystemManagement = () => {
  const [activeTab, setActiveTab] = useState('add-admin');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    specialization: '',
    password: '',
    confirmPassword: ''
  });

  // Mock Admin List (Backend connect karana kan)
  const admins = [
    { id: 1, fullName: "Ashen Kaveesha", email: "ashen@example.com", specialization: "BOTH", createdAt: "2026-01-10", itCount: 5, qsCount: 3 },
    { id: 2, fullName: "Pathum Madhusanka", email: "pathum@example.com", specialization: "IT", createdAt: "2026-02-01", itCount: 12, qsCount: 0 },
  ];

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    alert("New administrator registered successfully!");
  };

  return (
    <div className="flex min-h-screen bg-[#f5f7fa]">
      <Sidebar />

      <div className="flex-1 ml-64 pb-12 font-sans overflow-x-hidden">
        <div className="container mx-auto px-6 mt-8">
          
          {/* Page Header */}
          <div className="flex justify-between items-center mb-8 bg-white p-8 rounded-2xl shadow-sm border border-gray-100 animate-fadeIn">
            <div>
              <h1 className="text-4xl font-extrabold text-[#2c3e50] flex items-center gap-4">
                <i className="bi bi-gear text-blue-500"></i> System Management
              </h1>
              <p className="text-gray-500 mt-2 text-lg">Manage administrators and system settings</p>
            </div>
            <Link to="/admin/dashboard" className="bg-[#6c757d] hover:bg-[#5a6268] text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2 transition-all shadow-md">
              <i className="bi bi-arrow-left"></i> Back to Dashboard
            </Link>
          </div>

          {/* Navigation Tabs */}
          <div className="bg-white rounded-t-2xl shadow-md border border-gray-100 overflow-hidden">
            <div className="flex bg-gray-50 border-b-2 border-gray-100">
              {[
                { id: 'add-admin', label: 'Add New Admin', icon: 'bi-person-plus' },
                { id: 'manage-admin', label: 'Manage Administrators', icon: 'bi-people' },
                { id: 'roles', label: 'Role Permissions', icon: 'bi-shield-check' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-8 py-4 font-bold text-sm transition-all relative flex items-center gap-2 ${
                    activeTab === tab.id 
                    ? 'bg-white text-[#3498db] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-1 after:bg-[#3498db]' 
                    : 'text-gray-500 hover:text-[#3498db] hover:bg-gray-100'
                  }`}
                >
                  <i className={`bi ${tab.icon}`}></i> {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="p-8">
              
              {/* Tab 1: Add New Admin */}
              {activeTab === 'add-admin' && (
                <div className="max-w-3xl mx-auto animate-fadeIn">
                  <div className="card border-2 border-blue-100 rounded-2xl overflow-hidden shadow-sm">
                    <div className="bg-[#3498db] p-4 text-white">
                      <h4 className="text-lg font-bold flex items-center gap-2"><i className="bi bi-person-plus"></i> Register New Administrator</h4>
                    </div>
                    <div className="p-8">
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">First Name *</label>
                            <input type="text" name="firstName" required className="w-full border-2 border-gray-100 rounded-xl p-3 focus:border-blue-400 focus:outline-none" onChange={handleInputChange} />
                          </div>
                          <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Last Name *</label>
                            <input type="text" name="lastName" required className="w-full border-2 border-gray-100 rounded-xl p-3 focus:border-blue-400 focus:outline-none" onChange={handleInputChange} />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-1">Email Address *</label>
                          <input type="email" name="email" required className="w-full border-2 border-gray-100 rounded-xl p-3 focus:border-blue-400 focus:outline-none" onChange={handleInputChange} />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-1">Specialization *</label>
                          <select name="specialization" required className="w-full border-2 border-gray-100 rounded-xl p-3 focus:border-blue-400 focus:outline-none cursor-pointer" onChange={handleInputChange}>
                            <option value="">Select specialization...</option>
                            <option value="IT">Information Technology (IT)</option>
                            <option value="QUANTITY_SURVEYING">Quantity Surveying (QS)</option>
                            <option value="BOTH">Both IT and QS</option>
                          </select>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Password *</label>
                            <input type="password" name="password" required minLength="8" className="w-full border-2 border-gray-100 rounded-xl p-3 focus:border-blue-400 focus:outline-none" onChange={handleInputChange} />
                          </div>
                          <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Confirm Password *</label>
                            <input type="password" name="confirmPassword" required className="w-full border-2 border-gray-100 rounded-xl p-3 focus:border-blue-400 focus:outline-none" onChange={handleInputChange} />
                          </div>
                        </div>
                        <div className="bg-blue-50 p-4 rounded-xl text-blue-800 text-sm flex gap-3">
                          <i className="bi bi-info-circle-fill text-lg"></i>
                          <span>An email invitation will be sent to the new administrator with credentials.</span>
                        </div>
                        <div className="flex justify-end gap-3 pt-4">
                          <button type="reset" className="px-6 py-2 rounded-xl bg-gray-100 text-gray-600 font-bold hover:bg-gray-200 transition-all">Clear Form</button>
                          <button type="submit" className="px-8 py-2 rounded-xl bg-[#3498db] text-white font-bold hover:shadow-lg hover:-translate-y-0.5 transition-all">Create Admin Account</button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Manage Administrators */}
              {activeTab === 'manage-admin' && (
                <div className="animate-fadeIn">
                  <div className="flex justify-between items-center mb-6">
                    <h4 className="text-xl font-bold text-gray-700">Current Administrators</h4>
                    <span className="bg-gray-100 px-4 py-1 rounded-full text-xs font-bold text-gray-500 uppercase">Total: {admins.length}</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {admins.map((admin) => (
                      <div key={admin.id} className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative group">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex gap-4 items-center">
                             <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xl font-bold">
                               {admin.fullName.charAt(0)}
                             </div>
                             <div>
                                <h5 className="font-bold text-gray-800 text-lg">{admin.fullName}</h5>
                                <p className="text-gray-400 text-sm">{admin.email}</p>
                             </div>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-[10px] font-bold text-white shadow-sm ${admin.specialization === 'BOTH' ? 'bg-cyan-500' : admin.specialization === 'IT' ? 'bg-blue-500' : 'bg-green-500'}`}>
                            {admin.specialization === 'BOTH' ? 'Both IT & QS' : `${admin.specialization} Specialist`}
                          </span>
                        </div>
                        <hr className="my-4 opacity-5" />
                        <div className="flex justify-between items-end">
                           <div className="space-y-1">
                              <small className="text-gray-400 block text-[10px] uppercase font-bold tracking-widest">Assignments Handled</small>
                              <div className="flex gap-2">
                                 <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg text-xs font-bold">IT: {admin.itCount}</span>
                                 <span className="bg-green-50 text-green-600 px-3 py-1 rounded-lg text-xs font-bold">QS: {admin.qsCount}</span>
                              </div>
                           </div>
                           <button className="text-red-400 hover:text-red-600 transition-colors p-2"><i className="bi bi-person-dash text-xl"></i></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 3: Role Permissions */}
              {activeTab === 'roles' && (
                <div className="animate-fadeIn max-w-4xl mx-auto">
                  <h4 className="text-xl font-bold text-gray-700 mb-6 flex items-center gap-2"><i className="bi bi-shield-check text-blue-500"></i> Role Configuration</h4>
                  <div className="overflow-hidden rounded-2xl border border-gray-100 shadow-sm">
                    <table className="w-full text-left border-collapse">
                      <thead className="bg-gray-50 text-gray-500 text-[10px] uppercase font-bold tracking-widest border-b">
                        <tr>
                          <th className="p-4">Permission</th>
                          <th className="p-4 text-center">IT Admin</th>
                          <th className="p-4 text-center">QS Admin</th>
                          <th className="p-4 text-center">Super Admin</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {[
                          { p: 'View IT Assignments', it: true, qs: false, s: true },
                          { p: 'View QS Assignments', it: false, qs: true, s: true },
                          { p: 'Approve Assignments', it: true, qs: true, s: true },
                          { p: 'Reject Assignments', it: true, qs: true, s: true },
                          { p: 'Manage Users', it: false, qs: false, s: true },
                          { p: 'Add Administrators', it: false, qs: false, s: true },
                          { p: 'View Reports', it: true, qs: true, s: true }
                        ].map((row, i) => (
                          <tr key={i} className="hover:bg-blue-50/30 transition-all">
                            <td className="p-4 text-sm font-medium text-gray-700">{row.p}</td>
                            <td className="p-4 text-center">{row.it ? <i className="bi bi-check-circle-fill text-green-500"></i> : <i className="bi bi-x-circle-fill text-red-400"></i>}</td>
                            <td className="p-4 text-center">{row.qs ? <i className="bi bi-check-circle-fill text-green-500"></i> : <i className="bi bi-x-circle-fill text-red-400"></i>}</td>
                            <td className="p-4 text-center">{row.s ? <i className="bi bi-check-circle-fill text-green-500"></i> : <i className="bi bi-x-circle-fill text-red-400"></i>}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-8 bg-amber-50 border-l-4 border-amber-500 p-6 rounded-r-2xl flex gap-4 text-amber-900">
                    <i className="bi bi-exclamation-triangle-fill text-2xl"></i>
                    <div>
                      <p className="font-bold mb-1 uppercase tracking-widest text-[10px]">Security Notice</p>
                      <p className="text-sm">Only Super Administrators can modify role permissions and register new administrators in the system.</p>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>

        {/* Footer Consistent with design */}
        <footer className="mt-12 py-8 bg-[#212529] text-white/50 text-center text-sm border-t border-white/5">
          <p className="mb-0">&copy; 2026 Assignment Service. All rights reserved.</p>
        </footer>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.4s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default SystemManagement;