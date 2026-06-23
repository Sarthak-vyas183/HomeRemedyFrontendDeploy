import React, { useEffect, useState } from 'react';
import { useAuth } from '../Store/useAuth';
import { Link } from 'react-router-dom';
const baseUrl = import.meta.env.VITE_API_BASE_URL;

function Users_Requests() {
  const [userRequests, setUserRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  const UserRequests = async () => {
    try {
      const response = await fetch(`${baseUrl}p/getAllVerificationReq`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) { setUserRequests([]); setLoading(false); return; }
      const res = await response.json();
      setUserRequests(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      setUserRequests([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) UserRequests();
  }, [token]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="spinner" />
        <p className="text-gray-500 text-sm">Loading requests...</p>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8 min-h-full bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">User Requests</h1>
          <p className="text-gray-500 text-sm mt-1">
            {userRequests.length} request{userRequests.length !== 1 ? "s" : ""} awaiting review
          </p>
        </div>

        {userRequests.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center card">
            <div className="w-20 h-20 bg-teal-100 rounded-2xl flex items-center justify-center mb-5">
              <span className="text-4xl">📨</span>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No requests yet</h3>
            <p className="text-gray-500">Users haven't submitted any requests for your review.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {userRequests.map((request) => (
              <div key={request._id} className="card p-6 hover:border-teal-200 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                    request.status === 'approved'
                      ? 'bg-forest-100 text-forest-700'
                      : 'bg-amber-100 text-amber-700'
                  }`}>
                    {request.status === 'approved' ? '✓ Approved' : '⏳ Pending'}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(request.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="space-y-3 mb-5">
                  {request.about && (
                    <div>
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">About</p>
                      <p className="text-gray-700 text-sm leading-relaxed">{request.about}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Message</p>
                    <p className="text-gray-700 text-sm leading-relaxed">{request.message}</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-50">
                  <Link
                    to={`/viewuser/${request.userId}`}
                    className="inline-flex items-center gap-2 bg-teal-50 hover:bg-teal-100 text-teal-700 font-semibold text-sm px-4 py-2 rounded-lg border border-teal-200 transition-all"
                  >
                    👤 View User Profile
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Users_Requests;
