import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();

  // Menu items list eka (Oya ewapu file list ekata anuwa)
  const menuItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: 'bi-speedometer2' },
    { name: 'Pending Assignments', path: '/admin/assignments/pending', icon: 'bi-clock-history' },
    { name: 'All Assignments', path: '/admin/assignments', icon: 'bi-list-ul' },
    { name: 'Solution Delivery', path: '/admin/assignments/delivery', icon: 'bi-send-check' },
    { name: 'Customer Profiles', path: '/admin/customers', icon: 'bi-people' },
    { name: 'System Management', path: '/admin/system', icon: 'bi-gear' },
    { name: 'Reports', path: '/admin/reports', icon: 'bi-bar-chart-line' },
  ];

  return (
    <div className="w-64 min-h-screen bg-[#2c3e50] text-white shadow-xl flex flex-col fixed left-0 top-0 z-50">
      {/* Sidebar Header / Logo Area */}
      <div className="p-6 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-center">
        <h2 className="text-xl font-bold flex items-center justify-center gap-2">
          <i className="bi bi-shield-lock-fill"></i> ADMIN PANEL
        </h2>
        <small className="opacity-75">Assignment Service</small>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 mt-6 px-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.name}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                    isActive 
                      ? 'bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white shadow-lg' 
                      : 'hover:bg-white/10 text-gray-300'
                  }`}
                >
                  <i className={`bi ${item.icon} text-lg group-hover:scale-110 transition-transform`}></i>
                  <span className="font-medium">{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Sidebar Footer / Logout */}
      <div className="p-4 border-t border-white/10">
        <button className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-all">
          <i className="bi bi-box-arrow-left text-lg"></i>
          <span className="font-bold">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;