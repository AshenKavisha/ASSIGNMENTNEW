import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const colorClassMap = {
  'bg-green-500': 'bg-green-500',
  'bg-yellow-500': 'bg-yellow-500',
  'bg-blue-500': 'bg-blue-500',
  'bg-purple-500': 'bg-purple-500',
  primary: 'bg-blue-500',
  success: 'bg-green-500',
  danger: 'bg-red-500',
  info: 'bg-cyan-500',
  warning: 'bg-yellow-500',
  dark: 'bg-gray-800',
  secondary: 'bg-gray-500',
};

const Notifications = () => {
  const [filter, setFilter] = useState('ALL');
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState({ fullName: '' });
  const navigate = useNavigate();

  // ── Fetch notifications from backend ────────────────────────────────────────
  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch('/api/notifications', {
        credentials: 'include',
      });
      if (res.status === 401) {
        navigate('/login');
        return;
      }
      if (!res.ok) throw new Error('Failed to load notifications');
      const data = await res.json();
      setNotifications(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // ── Derived values ───────────────────────────────────────────────────────────
  const unreadCount = notifications.filter(n => n.unread).length;

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'UNREAD') return n.unread;
    return true;
  });

  // ── Actions ──────────────────────────────────────────────────────────────────
  const markAsRead = async (id) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, unread: false } : n)
    );
    try {
      const res = await fetch(`/api/notifications/${id}/read`, {
        method: 'POST',
        credentials: 'include',
      });
      if (!res.ok) throw new Error();
    } catch {
      fetchNotifications();
    }
  };

  const markAllAsRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
    try {
      const res = await fetch('/api/notifications/mark-all-read', {
        method: 'POST',
        credentials: 'include',
      });
      if (!res.ok) throw new Error();
    } catch {
      fetchNotifications();
    }
  };

  const archiveNotification = async (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    try {
      const res = await fetch(`/api/notifications/${id}/archive`, {
        method: 'POST',
        credentials: 'include',
      });
      if (!res.ok) throw new Error();
    } catch {
      fetchNotifications();
    }
  };

  const deleteNotification = async (id) => {
    if (!window.confirm('Are you sure you want to delete this notification?')) return;
    setNotifications(prev => prev.filter(n => n.id !== id));
    try {
      const res = await fetch(`/api/notifications/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) throw new Error();
    } catch {
      fetchNotifications();
    }
  };

  const handleLogout = async () => {
    await fetch('/logout', { method: 'POST', credentials: 'include' });
    navigate('/login');
  };

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col font-sans">

      {/* Navbar */}
      <nav className="bg-[#212529] text-white py-3 px-6 shadow-md sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center">
          {/* Logo → Home page */}
          <Link to="/" className="text-xl font-bold flex items-center gap-2 hover:text-gray-300 transition-colors">
            <i className="bi bi-journal-check"></i> Assignment Service
          </Link>

          <div className="flex items-center gap-4">
            {/* Bell icon (active page — no link needed) */}
            <div className="relative cursor-default">
              <i className="bi bi-bell text-xl"></i>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[9px] font-bold flex items-center justify-center animate-pulse-danger">
                  {unreadCount}
                </span>
              )}
            </div>

            {user.fullName && (
              <span className="hidden sm:flex items-center gap-2 font-medium">
                <i className="bi bi-person-circle text-xl"></i> Welcome, {user.fullName}
              </span>
            )}

            {/* Back to Dashboard */}
            <Link
              to="/dashboard"
              className="border border-white/30 px-3 py-1.5 rounded hover:bg-white hover:text-black transition-all font-bold text-sm flex items-center gap-2"
            >
              <i className="bi bi-speedometer2"></i> Dashboard
            </Link>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="border border-white/30 px-3 py-1.5 rounded hover:bg-white hover:text-black transition-all font-bold text-sm flex items-center gap-2"
            >
              <i className="bi bi-box-arrow-right"></i> Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 flex-1 max-w-4xl">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-400 mb-6">
          <Link to="/dashboard" className="hover:text-[#3498db] transition-colors flex items-center gap-1">
            <i className="bi bi-house"></i> Dashboard
          </Link>
          <i className="bi bi-chevron-right text-xs"></i>
          <span className="text-gray-600 font-medium">Notifications</span>
        </nav>

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
              <i className="bi bi-bell"></i> Notifications
            </h1>
            <p className="text-gray-500 mt-1">
              {unreadCount > 0
                ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}`
                : 'No unread notifications'}
            </p>
          </div>
          <button
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
            className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-all ${
              unreadCount > 0
                ? 'bg-white border-2 border-[#3498db] text-[#3498db] hover:bg-[#3498db] hover:text-white shadow-sm'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            <i className="bi bi-check-all text-lg"></i> Mark All as Read
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6">
          {['ALL', 'UNREAD'].map(tab => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-5 py-2 rounded-xl font-bold transition-all flex items-center gap-2 ${
                filter === tab ? 'bg-[#3498db] text-white shadow-md' : 'text-gray-500 hover:bg-gray-200'
              }`}
            >
              {tab === 'ALL' ? 'All Notifications' : 'Unread'}
              {tab === 'UNREAD' && unreadCount > 0 && (
                <span className={`px-2 py-0.5 rounded-full text-xs ${
                  filter === 'UNREAD' ? 'bg-white text-[#3498db]' : 'bg-red-500 text-white'
                }`}>
                  {unreadCount}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Notifications List */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-fadeIn">

          {loading ? (
            <div className="py-20 text-center flex flex-col items-center gap-3">
              <div className="w-10 h-10 border-4 border-[#3498db] border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-400 font-medium">Loading notifications...</p>
            </div>

          ) : error ? (
            <div className="py-20 text-center flex flex-col items-center gap-3">
              <i className="bi bi-exclamation-circle text-5xl text-red-300"></i>
              <p className="text-red-500 font-medium">{error}</p>
              <button onClick={fetchNotifications} className="text-sm text-[#3498db] underline">
                Try again
              </button>
            </div>

          ) : filteredNotifications.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {filteredNotifications.map((notif) => {
                const bgColor = colorClassMap[notif.colorClass] ?? 'bg-gray-400';
                return (
                  <div
                    key={notif.id}
                    className={`p-6 transition-all duration-200 group flex flex-col sm:flex-row gap-4 hover:bg-gray-50
                      ${notif.unread ? 'bg-blue-50/40 border-l-4 border-l-[#3498db]' : 'border-l-4 border-l-transparent'}
                      ${notif.important ? '!border-l-yellow-400' : ''}`}
                  >
                    {/* Icon */}
                    <div className={`w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center text-white text-xl shadow-sm ${bgColor}`}>
                      <i className={notif.icon}></i>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
                        <div>
                          <h5 className="text-lg font-bold text-gray-800">{notif.title}</h5>
                          <p className="text-gray-600 mt-1">{notif.message}</p>
                        </div>
                        <div className="flex flex-row sm:flex-col items-center sm:items-end gap-2 sm:gap-1 flex-shrink-0">
                          <span className="text-xs text-gray-400 font-medium">{notif.createdAt}</span>
                          <div className="flex gap-1">
                            {notif.unread && (
                              <span className="bg-blue-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                                NEW
                              </span>
                            )}
                            {notif.important && (
                              <span className="bg-yellow-400 text-yellow-900 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                                <i className="bi bi-star-fill"></i> IMPORTANT
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Action link — uses React Router, no full page reload */}
                      {notif.actionUrl && (
                        <div className="mt-3">
                          <Link
                            to={notif.actionUrl}
                            className="inline-block border border-[#3498db] text-[#3498db] px-4 py-1.5 rounded-lg text-sm font-bold hover:bg-[#3498db] hover:text-white transition-colors"
                          >
                            <i className="bi bi-arrow-right"></i> View Assignment
                          </Link>
                        </div>
                      )}

                      {/* Hover Actions */}
                      <div className="mt-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {notif.unread && (
                          <button
                            onClick={() => markAsRead(notif.id)}
                            className="text-xs font-bold text-green-600 border border-green-200 bg-green-50 px-3 py-1.5 rounded hover:bg-green-600 hover:text-white transition-colors flex items-center gap-1"
                          >
                            <i className="bi bi-check2"></i> Mark Read
                          </button>
                        )}
                        <button
                          onClick={() => archiveNotification(notif.id)}
                          className="text-xs font-bold text-gray-600 border border-gray-200 bg-gray-50 px-3 py-1.5 rounded hover:bg-gray-600 hover:text-white transition-colors flex items-center gap-1"
                        >
                          <i className="bi bi-archive"></i> Archive
                        </button>
                        <button
                          onClick={() => deleteNotification(notif.id)}
                          className="text-xs font-bold text-red-600 border border-red-200 bg-red-50 px-3 py-1.5 rounded hover:bg-red-600 hover:text-white transition-colors flex items-center gap-1"
                        >
                          <i className="bi bi-trash"></i> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

          ) : (
            <div className="py-20 text-center flex flex-col items-center">
              <i className="bi bi-bell-slash text-7xl text-gray-200 mb-4"></i>
              <h3 className="text-2xl font-bold text-gray-700 mb-2">No notifications</h3>
              <p className="text-gray-500">When you get notifications, they'll appear here.</p>
              <Link
                to="/dashboard"
                className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-[#3498db] text-white rounded-xl font-bold hover:bg-[#2980b9] transition-colors"
              >
                <i className="bi bi-speedometer2"></i> Back to Dashboard
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#212529] text-white/50 text-center py-6 text-sm mt-auto">
        <p>&copy; 2026 Assignment Service. All rights reserved.</p>
      </footer>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.4s ease-out forwards; }
        @keyframes pulse-danger {
          0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
          70% { box-shadow: 0 0 0 6px rgba(239, 68, 68, 0); }
          100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
        }
        .animate-pulse-danger { animation: pulse-danger 2s infinite; }
      `}</style>
    </div>
  );
};

export default Notifications;