import React, { useEffect, useState } from 'react';
import { useAuth } from '../Store/useAuth';
const baseUrl = import.meta.env.VITE_API_BASE_URL;
function Admin_userManagement() {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [search, setSearch] = useState('');

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
    setDeletingId(userId);
    try {
      const res = await fetch(`http://localhost:8000/api/v1/admin/deleteuser/${userId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to delete user');
      setUsers(users.filter(u => u._id !== userId));
    } catch (err) {
      alert(err.message || 'Error deleting user');
    }
    setDeletingId(null);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`${baseUrl}admin/getusers`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Failed to fetch users');
        const data = await res.json();
        setUsers(data.users || []);
      } catch (err) {
        setError(err.message || 'Error fetching users');
      }
      setLoading(false);
    };
    fetchUsers();
  }, [token]);

  const filteredUsers = users.filter(u =>
    u.username?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase()) ||
    u.fullName?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="spinner" />
        <p className="text-gray-500 text-sm">Loading users...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mb-4">
          <span className="text-3xl">⚠️</span>
        </div>
        <h3 className="text-lg font-bold text-gray-800 mb-2">Failed to Load Users</h3>
        <p className="text-gray-500 text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8 min-h-full bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
            <p className="text-gray-500 text-sm mt-1">{users.length} total users registered</p>
          </div>
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search users..."
              className="pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 w-64"
            />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Users", value: users.length, color: "indigo", icon: "👥" },
            { label: "Admins", value: users.filter(u => u.isAdmin).length, color: "red", icon: "🛡️" },
            { label: "Professionals", value: users.filter(u => u.isprofessional).length, color: "teal", icon: "🏥" },
            { label: "Regular Users", value: users.filter(u => !u.isAdmin && !u.isprofessional).length, color: "forest", icon: "👤" },
          ].map(({ label, value, color, icon }) => (
            <div key={label} className={`card p-4 border-l-4 border-${color}-500`}>
              <div className="flex items-center gap-3">
                <span className="text-2xl">{icon}</span>
                <div>
                  <p className={`text-2xl font-bold text-${color}-700`}>{value}</p>
                  <p className="text-gray-500 text-xs">{label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-4">User</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-4 hidden md:table-cell">Email</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-4 hidden lg:table-cell">Phone</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-4">Role</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-4 hidden lg:table-cell">Joined</th>
                  <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredUsers.map(user => (
                  <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={user.avatar}
                          alt={user.username}
                          className="w-9 h-9 rounded-xl object-cover border border-gray-100 flex-shrink-0"
                          onError={(e) => { e.target.src = "../../../images/user.png"; }}
                        />
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900 truncate">{user.fullName}</p>
                          <p className="text-gray-400 text-xs truncate">@{user.username}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-gray-600 hidden md:table-cell">{user.email}</td>
                    <td className="px-5 py-4 text-gray-500 hidden lg:table-cell">{user.ph_no || "—"}</td>
                    <td className="px-5 py-4">
                      {user.isAdmin ? (
                        <span className="inline-flex items-center gap-1 bg-red-100 text-red-700 text-xs font-bold px-2 py-0.5 rounded-full">🛡️ Admin</span>
                      ) : user.isprofessional ? (
                        <span className="inline-flex items-center gap-1 bg-teal-100 text-teal-700 text-xs font-bold px-2 py-0.5 rounded-full">🏥 Doctor</span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-600 text-xs font-medium px-2 py-0.5 rounded-full">👤 User</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-gray-500 text-xs hidden lg:table-cell">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => handleDelete(user._id)}
                        disabled={deletingId === user._id}
                        className="inline-flex items-center gap-1 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all disabled:opacity-50 border border-red-100"
                      >
                        {deletingId === user._id ? (
                          <div className="w-3 h-3 border-2 border-red-300 border-t-red-600 rounded-full animate-spin" />
                        ) : "🗑️"} Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-5 py-12 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <span className="text-4xl">🔍</span>
                        <p className="text-gray-500">{search ? `No users matching "${search}"` : "No users found."}</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Admin_userManagement;
