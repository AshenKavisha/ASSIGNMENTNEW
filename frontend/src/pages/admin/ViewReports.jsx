import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/admin/Sidebar';

const ViewReports = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [days, setDays] = useState(7);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Real data state
  const [assignments, setAssignments] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [admins, setAdmins] = useState([]);

  // ─── Fetch all data on mount ───────────────────────────────────────────────
  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      setError(null);
      try {
        const [assignRes, customerRes, adminRes] = await Promise.all([
          fetch('/api/admin/assignments', { credentials: 'include' }),
          fetch('/api/admin/customers',   { credentials: 'include' }),
          fetch('/api/admin/admins',       { credentials: 'include' }),
        ]);

        if (!assignRes.ok || !customerRes.ok || !adminRes.ok) {
          throw new Error('Failed to fetch report data. Please check your session.');
        }

        const assignData   = await assignRes.json();
        const customerData = await customerRes.json();
        const adminData    = await adminRes.json();

        setAssignments(assignData);
        setCustomers(customerData);   // { customers: [...], totalCustomers, itCustomerCount, qsCustomerCount }
        setAdmins(adminData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  // ─── Derived stats ─────────────────────────────────────────────────────────
  const assignmentList = Array.isArray(assignments) ? assignments : [];

  const completedCount   = assignmentList.filter(a => a.status === 'COMPLETED'   || String(a.status) === 'COMPLETED').length;
  const inProgressCount  = assignmentList.filter(a => a.status === 'IN_PROGRESS' || String(a.status) === 'IN_PROGRESS').length;
  const pendingCount     = assignmentList.filter(a => a.status === 'PENDING'      || String(a.status) === 'PENDING').length;
  const deliveredCount   = assignmentList.filter(a => a.status === 'DELIVERED'   || String(a.status) === 'DELIVERED').length;
  const totalAssignments = assignmentList.length;

  const completionRate = totalAssignments > 0
      ? Math.round(((completedCount + deliveredCount) / totalAssignments) * 100)
      : 0;

  const itAssignments = assignmentList.filter(a => String(a.type) === 'IT');
  const qsAssignments = assignmentList.filter(a => String(a.type) === 'QUANTITY_SURVEYING');

  const itRevenue    = itAssignments.reduce((sum, a) => sum + (parseFloat(a.price) || 0), 0);
  const qsRevenue    = qsAssignments.reduce((sum, a) => sum + (parseFloat(a.price) || 0), 0);
  const totalRevenue = itRevenue + qsRevenue;

  const itPct = totalAssignments > 0 ? Math.round((itAssignments.length / totalAssignments) * 100) : 0;
  const qsPct = totalAssignments > 0 ? Math.round((qsAssignments.length / totalAssignments) * 100) : 0;

  const customerList  = customers?.customers || [];
  const totalCustomers = customers?.totalCustomers || 0;
  const adminList     = Array.isArray(admins) ? admins : [];

  // Top users: customers sorted by number of assignments (desc), take top 10
  const topUsers = [...customerList]
      .map(c => ({
        fullName:   c.fullName,
        email:      c.email,
        assignments: (c.assignments || []).length,
        completed:  (c.assignments || []).filter(a => String(a.status) === 'COMPLETED' || String(a.status) === 'DELIVERED').length,
        lastActive: c.createdAt ? new Date(c.createdAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) : '—',
      }))
      .sort((a, b) => b.assignments - a.assignments)
      .slice(0, 10);

  // Recent assignments: latest 10 by array order (backend returns newest first or we just show all)
  const recentAssignments = assignmentList.slice(0, 10).map(a => ({
    title:   a.title,
    student: a.user?.fullName || '—',
    type:    String(a.type) === 'QUANTITY_SURVEYING' ? 'QS' : 'IT',
    status:  String(a.status),
    date:    a.createdAt ? new Date(a.createdAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) : '—',
  }));

  // ─── Helpers ───────────────────────────────────────────────────────────────
  const statusColor = (status) => {
    switch (String(status)) {
      case 'COMPLETED':   return 'text-green-600';
      case 'DELIVERED':   return 'text-blue-600';
      case 'IN_PROGRESS': return 'text-blue-500';
      case 'PENDING':     return 'text-yellow-600';
      default:            return 'text-gray-500';
    }
  };

  // ─── Loading / Error states ────────────────────────────────────────────────
  if (loading) {
    return (
        <div className="flex min-h-screen bg-[#f5f7fa]">
          <Sidebar />
          <div className="flex-1 ml-64 flex items-center justify-center">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-[#667eea] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-500 font-semibold">Loading report data…</p>
            </div>
          </div>
        </div>
    );
  }

  if (error) {
    return (
        <div className="flex min-h-screen bg-[#f5f7fa]">
          <Sidebar />
          <div className="flex-1 ml-64 flex items-center justify-center">
            <div className="bg-white rounded-2xl shadow-xl p-10 text-center max-w-md">
              <i className="bi bi-exclamation-triangle text-5xl text-red-500 block mb-4"></i>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Failed to Load Reports</h3>
              <p className="text-gray-400 mb-6">{error}</p>
              <button
                  onClick={() => window.location.reload()}
                  className="bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white px-6 py-2 rounded-xl font-bold"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
    );
  }

  // ─── Main render ───────────────────────────────────────────────────────────
  return (
      <div className="flex min-h-screen bg-[#f5f7fa]">
        <Sidebar />

        <div className="flex-1 ml-64 pb-12 font-sans overflow-x-hidden">
          <div className="container mx-auto px-6 mt-8">

            {/* Page Header */}
            <div className="relative overflow-hidden bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white p-8 rounded-[15px] mb-8 shadow-[0_8px_30px_rgba(102,126,234,0.4)] animate-fadeIn">
              <div className="absolute -top-[100px] -right-[100px] w-[300px] h-[300px] bg-white/10 rounded-full"></div>
              <div className="absolute -bottom-[80px] -left-[80px] w-[250px] h-[250px] bg-white/08 rounded-full"></div>

              <div className="relative z-10 flex justify-between items-center flex-wrap">
                <div className="mb-3 md:mb-0">
                  <h1 className="text-4xl font-extrabold flex items-center drop-shadow-md">
                    <i className="bi bi-bar-chart me-3"></i>System Reports
                  </h1>
                  <p className="text-white/95 text-lg">Analytics and performance metrics</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-white border-2 border-white/30 rounded-xl px-4 py-2 shadow-lg transition-all hover:-translate-y-1">
                    <i className="bi bi-calendar text-[#667eea] mr-2"></i>
                    <select
                        className="border-none font-bold text-gray-700 focus:outline-none cursor-pointer"
                        value={days}
                        onChange={(e) => setDays(e.target.value)}
                    >
                      <option value="7">Last 7 days</option>
                      <option value="30">Last 30 days</option>
                      <option value="90">Last 90 days</option>
                      <option value="365">Last year</option>
                    </select>
                  </div>
                  <Link to="/admin/dashboard" className="bg-gray-500/20 hover:bg-gray-500/40 text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2 transition-all border border-white/30">
                    <i className="bi bi-arrow-left"></i> Dashboard
                  </Link>
                </div>
              </div>
            </div>

            {/* Key Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Total Assignments */}
              <div className="bg-white rounded-[15px] p-6 shadow-md border-t-4 border-[#007bff] transition-all hover:-translate-y-2 hover:shadow-xl group animate-fadeIn">
                <div className="flex justify-between items-center">
                  <div>
                    <h6 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Total Assignments</h6>
                    <h2 className="text-4xl font-bold bg-gradient-to-br from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">{totalAssignments}</h2>
                  </div>
                  <i className="bi bi-journal-text text-5xl text-[#007bff] opacity-20 group-hover:scale-110 group-hover:rotate-6 transition-transform"></i>
                </div>
                <div className="mt-4">
                <span className="bg-blue-50 text-[#007bff] px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit">
                  <i className="bi bi-arrow-up"></i> {completedCount + deliveredCount} completed
                </span>
                </div>
              </div>

              {/* Completion Rate */}
              <div className="bg-white rounded-[15px] p-6 shadow-md border-t-4 border-[#28a745] transition-all hover:-translate-y-2 hover:shadow-xl group animate-fadeIn" style={{animationDelay: '0.1s'}}>
                <div className="flex justify-between items-center">
                  <div>
                    <h6 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Completion Rate</h6>
                    <h2 className="text-4xl font-bold bg-gradient-to-br from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">{completionRate}%</h2>
                  </div>
                  <i className="bi bi-check-circle text-5xl text-[#28a745] opacity-20 group-hover:scale-110 group-hover:rotate-6 transition-transform"></i>
                </div>
                <div className="mt-4">
                <span className="bg-green-50 text-[#28a745] px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit">
                  <i className="bi bi-arrow-up"></i> {inProgressCount} in progress
                </span>
                </div>
              </div>

              {/* Total Revenue */}
              <div className="bg-white rounded-[15px] p-6 shadow-md border-t-4 border-[#ffc107] transition-all hover:-translate-y-2 hover:shadow-xl group animate-fadeIn" style={{animationDelay: '0.2s'}}>
                <div className="flex justify-between items-center">
                  <div>
                    <h6 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Total Revenue</h6>
                    <h2 className="text-4xl font-bold bg-gradient-to-br from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">${totalRevenue.toFixed(0)}</h2>
                  </div>
                  <i className="bi bi-cash-stack text-5xl text-[#ffc107] opacity-20 group-hover:scale-110 group-hover:rotate-6 transition-transform"></i>
                </div>
                <div className="mt-4">
                <span className="bg-yellow-50 text-[#ff9800] px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit">
                  <i className="bi bi-clock-history"></i> {pendingCount} pending
                </span>
                </div>
              </div>

              {/* Active Users */}
              <div className="bg-white rounded-[15px] p-6 shadow-md border-t-4 border-[#17a2b8] transition-all hover:-translate-y-2 hover:shadow-xl group animate-fadeIn" style={{animationDelay: '0.3s'}}>
                <div className="flex justify-between items-center">
                  <div>
                    <h6 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Total Customers</h6>
                    <h2 className="text-4xl font-bold bg-gradient-to-br from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">{totalCustomers}</h2>
                  </div>
                  <i className="bi bi-people text-5xl text-[#17a2b8] opacity-20 group-hover:scale-110 group-hover:rotate-6 transition-transform"></i>
                </div>
                <div className="mt-4">
                <span className="bg-cyan-50 text-[#17a2b8] px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit">
                  <i className="bi bi-person-badge"></i> {adminList.length} administrators
                </span>
                </div>
              </div>
            </div>

            {/* Detailed Analytics Section */}
            <div className="bg-white rounded-[15px] shadow-xl overflow-hidden mb-12 animate-fadeIn">
              <div className="bg-gradient-to-r from-[#667eea] to-[#764ba2] p-6 text-white">
                <h5 className="text-xl font-bold flex items-center gap-2">
                  <i className="bi bi-graph-up"></i> Detailed Analytics
                </h5>
              </div>

              <div className="p-0">
                {/* Tabs */}
                <div className="flex bg-gray-50 border-b-2 border-gray-100">
                  {[
                    { id: 'overview',     label: 'Overview',      icon: 'bi-speedometer2' },
                    { id: 'assignments',  label: 'Assignments',   icon: 'bi-journal-text' },
                    { id: 'revenue',      label: 'Revenue',       icon: 'bi-currency-dollar' },
                    { id: 'user',         label: 'User Activity', icon: 'bi-people' }
                  ].map((tab) => (
                      <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`px-8 py-4 font-bold text-sm transition-all relative flex items-center gap-2 ${
                              activeTab === tab.id
                                  ? 'bg-white text-[#667eea] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-1 after:bg-gradient-to-r after:from-[#667eea] after:to-[#764ba2]'
                                  : 'text-gray-500 hover:text-[#667eea] hover:bg-gray-100'
                          }`}
                      >
                        <i className={`bi ${tab.icon}`}></i> {tab.label}
                      </button>
                  ))}
                </div>

                {/* Tab Content */}
                <div className="p-8">

                  {/* ── Overview ── */}
                  {activeTab === 'overview' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fadeIn">
                        <div>
                          <h5 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <i className="bi bi-pie-chart text-[#667eea]"></i> Assignment Status Distribution
                          </h5>
                          <div className="overflow-hidden rounded-xl border border-gray-100">
                            <table className="w-full text-left border-collapse">
                              <thead className="bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white text-xs uppercase font-bold tracking-wider">
                              <tr>
                                <th className="p-4">Status</th>
                                <th className="p-4">Count</th>
                                <th className="p-4">Percentage</th>
                              </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-100">
                              {[
                                { label: 'Pending',     count: pendingCount,                    color: 'bg-yellow-400', pct: totalAssignments > 0 ? (pendingCount / totalAssignments) * 100 : 0 },
                                { label: 'In Progress', count: inProgressCount,                 color: 'bg-blue-400',   pct: totalAssignments > 0 ? (inProgressCount / totalAssignments) * 100 : 0 },
                                { label: 'Completed',   count: completedCount + deliveredCount, color: 'bg-green-400',  pct: totalAssignments > 0 ? ((completedCount + deliveredCount) / totalAssignments) * 100 : 0 },
                              ].map((row, i) => (
                                  <tr key={i} className="hover:bg-gray-50 transition-all">
                                    <td className="p-4 font-medium">
                                      <span className={`inline-block w-3 h-3 rounded-full ${row.color} me-2`}></span>{row.label}
                                    </td>
                                    <td className="p-4 font-bold text-gray-700">{row.count}</td>
                                    <td className="p-4 w-1/2">
                                      <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                        <div className={`h-full ${row.color}`} style={{ width: `${row.pct}%` }}></div>
                                      </div>
                                    </td>
                                  </tr>
                              ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                        <div>
                          <h5 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <i className="bi bi-graph-up-arrow text-[#667eea]"></i> Key Performance Indicators
                          </h5>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white border-2 border-gray-50 p-6 rounded-2xl text-center shadow-sm hover:border-[#667eea] transition-all hover:-translate-y-1">
                              <i className="bi bi-lightning-charge text-4xl text-yellow-500 mb-2 block"></i>
                              <h3 className="text-2xl font-bold text-gray-800">{completionRate}%</h3>
                              <p className="text-gray-400 text-xs font-bold uppercase mb-0">Completion Rate</p>
                            </div>
                            <div className="bg-white border-2 border-gray-50 p-6 rounded-2xl text-center shadow-sm hover:border-[#667eea] transition-all hover:-translate-y-1">
                              <i className="bi bi-people-fill text-4xl text-cyan-500 mb-2 block"></i>
                              <h3 className="text-2xl font-bold text-gray-800">{totalCustomers}</h3>
                              <p className="text-gray-400 text-xs font-bold uppercase mb-0">Total Customers</p>
                            </div>
                            <div className="bg-white border-2 border-gray-50 p-6 rounded-2xl text-center shadow-sm hover:border-[#667eea] transition-all hover:-translate-y-1">
                              <i className="bi bi-cash text-4xl text-green-500 mb-2 block"></i>
                              <h3 className="text-2xl font-bold text-gray-800">${totalRevenue.toFixed(0)}</h3>
                              <p className="text-gray-400 text-xs font-bold uppercase mb-0">Total Revenue</p>
                            </div>
                            <div className="bg-white border-2 border-gray-50 p-6 rounded-2xl text-center shadow-sm hover:border-[#667eea] transition-all hover:-translate-y-1">
                              <i className="bi bi-person-badge text-4xl text-purple-500 mb-2 block"></i>
                              <h3 className="text-2xl font-bold text-gray-800">{adminList.length}</h3>
                              <p className="text-gray-400 text-xs font-bold uppercase mb-0">Administrators</p>
                            </div>
                          </div>
                        </div>
                      </div>
                  )}

                  {/* ── Assignments ── */}
                  {activeTab === 'assignments' && (
                      <div className="animate-fadeIn">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                          <div className="bg-gray-50 p-6 rounded-2xl text-center border-2 border-gray-100">
                            <h1 className="text-5xl font-black text-green-500 mb-2">{completedCount + deliveredCount}</h1>
                            <p className="text-gray-500 font-bold uppercase text-xs">Completed Assignments</p>
                          </div>
                          <div className="bg-gray-50 p-6 rounded-2xl text-center border-2 border-gray-100">
                            <h1 className="text-5xl font-black text-blue-500 mb-2">{inProgressCount}</h1>
                            <p className="text-gray-500 font-bold uppercase text-xs">In Progress</p>
                          </div>
                          <div className="bg-gray-50 p-6 rounded-2xl text-center border-2 border-gray-100">
                            <h1 className="text-5xl font-black text-yellow-500 mb-2">{pendingCount}</h1>
                            <p className="text-gray-500 font-bold uppercase text-xs">Pending Review</p>
                          </div>
                        </div>

                        <h5 className="text-lg font-bold mb-4 flex items-center gap-2">
                          <i className="bi bi-clock-history text-[#667eea]"></i> Recent Assignments
                        </h5>
                        {recentAssignments.length === 0 ? (
                            <p className="text-gray-400 text-center py-8">No assignments found.</p>
                        ) : (
                            <div className="overflow-hidden rounded-xl border border-gray-100">
                              <table className="w-full text-left border-collapse">
                                <thead className="bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white text-xs uppercase font-bold tracking-wider">
                                <tr>
                                  <th className="p-4">Title</th>
                                  <th className="p-4">Student</th>
                                  <th className="p-4">Type</th>
                                  <th className="p-4">Status</th>
                                  <th className="p-4">Date</th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                {recentAssignments.map((row, i) => (
                                    <tr key={i} className="hover:bg-gray-50 transition-all">
                                      <td className="p-4 font-bold text-gray-800">{row.title}</td>
                                      <td className="p-4 text-gray-600">{row.student}</td>
                                      <td className="p-4">
                                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold text-white ${row.type === 'IT' ? 'bg-blue-500' : 'bg-green-500'}`}>
                                    {row.type}
                                  </span>
                                      </td>
                                      <td className="p-4">
                                        <span className={`font-bold text-sm ${statusColor(row.status)}`}>{row.status}</span>
                                      </td>
                                      <td className="p-4 text-gray-400 text-sm">{row.date}</td>
                                    </tr>
                                ))}
                                </tbody>
                              </table>
                            </div>
                        )}
                      </div>
                  )}

                  {/* ── Revenue ── */}
                  {activeTab === 'revenue' && (
                      <div className="animate-fadeIn">
                        <div className="bg-gray-50 p-8 rounded-2xl border-2 border-gray-100 mb-8">
                          <h5 className="text-lg font-bold mb-6 flex items-center gap-2">
                            <i className="bi bi-cash-stack text-[#667eea]"></i> Revenue Summary (All Time)
                          </h5>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="text-center md:text-left border-b md:border-b-0 md:border-r border-gray-200 pb-4 md:pb-0">
                              <span className="text-gray-400 uppercase text-xs font-bold block mb-1">IT Revenue</span>
                              <h2 className="text-4xl font-black text-blue-600">${itRevenue.toFixed(2)}</h2>
                              <p className="text-gray-400 text-xs mt-1">{itAssignments.length} assignments</p>
                            </div>
                            <div className="text-center md:text-left border-b md:border-b-0 md:border-r border-gray-200 pb-4 md:pb-0">
                              <span className="text-gray-400 uppercase text-xs font-bold block mb-1">QS Revenue</span>
                              <h2 className="text-4xl font-black text-green-600">${qsRevenue.toFixed(2)}</h2>
                              <p className="text-gray-400 text-xs mt-1">{qsAssignments.length} assignments</p>
                            </div>
                            <div className="text-center md:text-left">
                              <span className="text-gray-400 uppercase text-xs font-bold block mb-1">Total Revenue</span>
                              <h2 className="text-4xl font-black text-gray-800">${totalRevenue.toFixed(2)}</h2>
                              <p className="text-gray-400 text-xs mt-1">{totalAssignments} assignments</p>
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="bg-white border-2 border-gray-100 p-8 rounded-2xl text-center transition-all hover:border-[#667eea]">
                            <h1 className="text-5xl font-black text-blue-600 mb-2">{itPct}%</h1>
                            <p className="text-gray-400 font-bold uppercase text-xs">IT Assignments Percentage</p>
                          </div>
                          <div className="bg-white border-2 border-gray-100 p-8 rounded-2xl text-center transition-all hover:border-[#27ae60]">
                            <h1 className="text-5xl font-black text-green-600 mb-2">{qsPct}%</h1>
                            <p className="text-gray-400 font-bold uppercase text-xs">QS Assignments Percentage</p>
                          </div>
                        </div>
                      </div>
                  )}

                  {/* ── User Activity ── */}
                  {activeTab === 'user' && (
                      <div className="animate-fadeIn">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                          <div className="bg-gray-50 p-6 rounded-2xl text-center border-2 border-gray-100">
                            <h1 className="text-5xl font-black text-green-500 mb-2">{totalCustomers}</h1>
                            <p className="text-gray-500 font-bold uppercase text-xs">Total Customers</p>
                          </div>
                          <div className="bg-gray-50 p-6 rounded-2xl text-center border-2 border-gray-100">
                            <h1 className="text-5xl font-black text-blue-500 mb-2">{customers?.itCustomerCount || 0}</h1>
                            <p className="text-gray-500 font-bold uppercase text-xs">IT Customers</p>
                          </div>
                          <div className="bg-gray-50 p-6 rounded-2xl text-center border-2 border-gray-100">
                            <h1 className="text-5xl font-black text-cyan-500 mb-2">{adminList.length}</h1>
                            <p className="text-gray-500 font-bold uppercase text-xs">Total Administrators</p>
                          </div>
                        </div>

                        <h5 className="text-lg font-bold mb-4 flex items-center gap-2">
                          <i className="bi bi-trophy text-[#667eea]"></i> Top Active Users
                        </h5>
                        {topUsers.length === 0 ? (
                            <p className="text-gray-400 text-center py-8">No customers found.</p>
                        ) : (
                            <div className="overflow-hidden rounded-xl border border-gray-100">
                              <table className="w-full text-left border-collapse">
                                <thead className="bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white text-xs uppercase font-bold tracking-wider">
                                <tr>
                                  <th className="p-4">User</th>
                                  <th className="p-4">Email</th>
                                  <th className="p-4">Assignments</th>
                                  <th className="p-4">Completed</th>
                                  <th className="p-4">Joined</th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                {topUsers.map((user, i) => (
                                    <tr key={i} className="hover:bg-gray-50 transition-all">
                                      <td className="p-4 font-bold text-gray-800">{user.fullName}</td>
                                      <td className="p-4 text-gray-600">{user.email}</td>
                                      <td className="p-4 font-bold text-center">{user.assignments}</td>
                                      <td className="p-4 text-green-600 font-bold text-center">{user.completed}</td>
                                      <td className="p-4 text-gray-400 text-sm">{user.lastActive}</td>
                                    </tr>
                                ))}
                                </tbody>
                              </table>
                            </div>
                        )}
                      </div>
                  )}
                </div>
              </div>
            </div>

            {/* Export Section */}
            <div className="mt-16 mb-16">
              <div className="h-[2px] bg-gradient-to-r from-transparent via-[#667eea] to-transparent mb-8"></div>
              <div className="bg-white rounded-[15px] shadow-xl overflow-hidden border border-gray-100">
                <div className="bg-gradient-to-r from-[#667eea] to-[#764ba2] p-6 text-white">
                  <h5 className="text-xl font-bold flex items-center gap-2">
                    <i className="bi bi-download"></i> Export Reports
                  </h5>
                </div>
                <div className="p-10">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* PDF Export */}
                    <div className="bg-white border-2 border-gray-50 p-8 rounded-2xl text-center shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all relative group overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <div className="relative z-10">
                        <i className="bi bi-file-earmark-pdf text-6xl text-red-500 mb-4 block group-hover:scale-110 transition-transform"></i>
                        <h5 className="text-xl font-bold mb-2">PDF Report</h5>
                        <p className="text-gray-400 text-sm mb-6">Detailed report in PDF format</p>
                        <button className="bg-gradient-to-r from-red-500 to-red-600 text-white w-full py-3 rounded-xl font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 hover:shadow-lg transition-all">
                          <i className="bi bi-download"></i> Download PDF
                        </button>
                      </div>
                    </div>

                    {/* Excel Export */}
                    <div className="bg-white border-2 border-gray-50 p-8 rounded-2xl text-center shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all relative group overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <div className="relative z-10">
                        <i className="bi bi-file-earmark-excel text-6xl text-green-500 mb-4 block group-hover:scale-110 transition-transform"></i>
                        <h5 className="text-xl font-bold mb-2">Excel Data</h5>
                        <p className="text-gray-400 text-sm mb-6">Raw data in spreadsheet format</p>
                        <button className="bg-gradient-to-r from-green-500 to-green-600 text-white w-full py-3 rounded-xl font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 hover:shadow-lg transition-all">
                          <i className="bi bi-download"></i> Download Excel
                        </button>
                      </div>
                    </div>

                    {/* Summary Export */}
                    <div className="bg-white border-2 border-gray-50 p-8 rounded-2xl text-center shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all relative group overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <div className="relative z-10">
                        <i className="bi bi-graph-up text-6xl text-blue-500 mb-4 block group-hover:scale-110 transition-transform"></i>
                        <h5 className="text-xl font-bold mb-2">Summary Report</h5>
                        <p className="text-gray-400 text-sm mb-6">Executive summary report</p>
                        <button className="bg-gradient-to-r from-blue-500 to-blue-600 text-white w-full py-3 rounded-xl font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 hover:shadow-lg transition-all">
                          <i className="bi bi-download"></i> Download Summary
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="h-[100px]"></div>
          </div>
        </div>

        <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.6s ease-out forwards; }
        .bg-clip-text { -webkit-background-clip: text; background-clip: text; }
      `}</style>
      </div>
  );
};

export default ViewReports;