import React, { useEffect, useState } from 'react';
import { useAuth } from '../Store/useAuth';
const baseUrl = import.meta.env.VITE_API_BASE_URL;

function Admin_remedyManagement() {
  const [remedies, setRemedies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [deletingId, setDeletingId] = useState(null);
  const { token } = useAuth();

  const fetchAllRemedies = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${baseUrl}admin/getAllRemedies`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok && Array.isArray(data.data)) {
        setRemedies(data.data);
      } else {
        setRemedies([]);
      }
    } catch {
      setRemedies([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAllRemedies();
    // eslint-disable-next-line
  }, []);

  const handleDeleteRemedy = async (remedyId) => {
    if (!remedyId || !token) return;

    const confirmed = window.confirm('Are you sure you want to delete this remedy?');
    if (!confirmed) return;

    setDeletingId(remedyId);
    try {
      const response = await fetch(`${baseUrl}admin/delete_remedy_by_admin`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ remedyId }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        alert(data.msg || 'Failed to delete remedy');
        return;
      }

      setRemedies((prev) => prev.filter((remedy) => remedy._id !== remedyId));
      alert(data.msg || 'Remedy deleted successfully');
    } catch (error) {
      console.error('Delete remedy error:', error);
      alert('Something went wrong while deleting the remedy');
    } finally {
      setDeletingId(null);
    }
  };

  const filteredRemedies = remedies.filter(r => {
    if (filter === 'verified') return r.isVerified;
    if (filter === 'unverified') return !r.isVerified;
    return true;
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="spinner" />
        <p className="text-gray-500 text-sm">Loading remedies...</p>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8 min-h-full bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Remedy Management</h1>
            <p className="text-gray-500 text-sm mt-1">{remedies.length} total remedies in system</p>
          </div>
          {/* Filter buttons */}
          <div className="flex flex-wrap bg-white border border-gray-200 rounded-xl p-1 gap-1">
            {[
              { key: 'all', label: 'All', count: remedies.length },
              { key: 'verified', label: 'Verified', count: remedies.filter(r => r.isVerified).length },
              { key: 'unverified', label: 'Unverified', count: remedies.filter(r => !r.isVerified).length },
            ].map(({ key, label, count }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                aria-pressed={filter === key}
                className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${filter === key ? "bg-indigo-600 text-white shadow-sm" : "text-gray-500 hover:text-gray-800"
                  }`}
              >
                {label}
                <span className={`ml-1.5 text-xs font-bold px-1.5 py-0.5 rounded-full ${filter === key ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"}`}>
                  {count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {filteredRemedies.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 bg-indigo-50 rounded-2xl flex items-center justify-center mb-5">
              <span className="text-4xl">🌿</span>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No remedies found</h3>
            <p className="text-gray-500">No {filter !== 'all' ? filter : ''} remedies available.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredRemedies.map((remedy) => (
              <div key={remedy._id} className="card card-hover group overflow-hidden">
                {/* Image */}
                <div className="relative h-44">
                  <div
                    className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                    style={{ backgroundImage: `url(${remedy.image})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <div className="absolute top-3 right-3">
                    {remedy.isVerified ? (
                      <span className="badge-verified shadow">✓ Verified</span>
                    ) : (
                      <span className="badge-pending shadow">⏳ Pending</span>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="font-bold text-gray-900 mb-1 group-hover:text-indigo-700 transition-colors line-clamp-1">
                    {remedy.title}
                  </h3>
                  <p className="text-gray-500 text-sm line-clamp-2 mb-3">{remedy.description}</p>

                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {remedy.ailments?.slice(0, 3).map((ailment, idx) => (
                      <span key={idx} className="bg-indigo-50 text-indigo-700 text-xs font-medium px-2 py-0.5 rounded-md border border-indigo-100">
                        {ailment}
                      </span>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-gray-50 space-y-1.5 text-xs text-gray-500">
                    <div className="flex justify-between">
                      <span>Effectiveness</span>
                      <span className="font-semibold text-forest-600">{remedy.effectiveness}/5</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Status</span>
                      <span className={`font-semibold ${remedy.verifyInfo?.status === 'approved' ? 'text-forest-600' : 'text-amber-600'}`}>
                        {remedy.verifyInfo?.status || 'pending'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Created</span>
                      <span>{new Date(remedy.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    {remedy.EcommerceUrl && (
                      <a
                        href={remedy.EcommerceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 text-xs font-semibold"
                      >
                        🛒 Buy Related Product
                      </a>
                    )}

                    <button
                      type="button"
                      onClick={() => handleDeleteRemedy(remedy._id)}
                      disabled={deletingId === remedy._id}
                      className="ml-auto rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {deletingId === remedy._id ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Admin_remedyManagement;
