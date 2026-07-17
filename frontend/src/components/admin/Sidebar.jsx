import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Sidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [unreadCount, setUnreadCount] = useState(0);

    const menuItems = [
        { name: 'Dashboard', path: '/admin/dashboard', icon: 'bi-speedometer2' },
        { name: 'Pending Assignments', path: '/admin/assignments/pending', icon: 'bi-clock-history' },
        { name: 'All Assignments', path: '/admin/assignments', icon: 'bi-list-ul' },
        { name: 'Solution Delivery', path: '/admin/assignments/delivery', icon: 'bi-send-check' },
        { name: 'Customer Profiles', path: '/admin/customers', icon: 'bi-people' },
        { name: 'System Management', path: '/admin/system', icon: 'bi-gear' },
        { name: 'Reports', path: '/admin/reports', icon: 'bi-bar-chart-line' },
    ];

    // Poll unread count every 30s so the badge stays current across every page,
    // since Sidebar is mounted on every admin route.
    useEffect(() => {
        const fetchCount = () => {
            fetch('/api/notifications/unread-count', { credentials: 'include' })
                .then(res => res.ok ? res.json() : { count: 0 })
                .then(data => setUnreadCount(data.count || 0))
                .catch(() => {});
        };

        fetchCount();
        const interval = setInterval(fetchCount, 30000);
        return () => clearInterval(interval);
    }, []);

    const handleLogout = async () => {
        try {
            await fetch('/logout', { method: 'POST', credentials: 'include' });
        } catch (e) {}
        navigate('/login?logout=true');
    };

    return (
        <div className="w-64 min-h-screen bg-[#2c3e50] text-white shadow-xl flex flex-col fixed left-0 top-0 z-50">
            {/* Sidebar Header */}
            <div className="p-6 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-center relative">
                <h2 className="text-xl font-bold flex items-center justify-center gap-2">
                    <i className="bi bi-shield-lock-fill"></i> ADMIN PANEL
                </h2>
                <small className="opacity-75">Assignment Service</small>

                {/* Notification Bell — always visible regardless of which tab is active */}
                <Link
                    to="/notifications"
                    className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
                    title="Notifications"
                >
                    <i className="bi bi-bell-fill text-xl"></i>
                    {unreadCount > 0 && (
                        <span className="absolute -top-1.5 -right-2 w-5 h-5 bg-red-500 rounded-full text-[10px] font-bold flex items-center justify-center border-2 border-[#667eea] animate-pulse">
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                    )}
                </Link>
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

            {/* Logout Button */}
            <div className="p-4 border-t border-white/10">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-all cursor-pointer"
                >
                    <i className="bi bi-box-arrow-left text-lg"></i>
                    <span className="font-bold">Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;