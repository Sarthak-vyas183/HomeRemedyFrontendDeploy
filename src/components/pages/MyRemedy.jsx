/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useAuth } from '../Store/useAuth';
import { Link } from 'react-router-dom';

const baseUrl = import.meta.env.VITE_API_BASE_URL;

function MyRemedy() {
  const { token } = useAuth();
  const [remedies, setRemedies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState("");

  const fetchRemedy = async () => {
    try {
      const response = await fetch(`${baseUrl}user/getmyremedies`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) { setErrMsg("Failed to load remedies."); setLoading(false); return; }
      const data = await response.json();
      setRemedies(data.data || []);
      setErrMsg(data.message || "");
    } catch (error) {
      setErrMsg("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchRemedy();
  }, [token]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="spinner" />
        <p className="text-gray-500 text-sm">Loading your remedies...</p>
      </div>
    );
  }

  if (remedies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="w-20 h-20 bg-forest-100 rounded-2xl flex items-center justify-center mb-5">
          <span className="text-4xl">🌿</span>
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">No remedies yet</h3>
        <p className="text-gray-500 mb-6 max-w-sm">You haven't created any remedies yet. Share your traditional healing knowledge with the community.</p>
        <Link to="create" className="btn-primary inline-flex items-center gap-2">
          ✏️ Create Your First Remedy
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8 min-h-full bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Remedies</h1>
            <p className="text-gray-500 text-sm mt-1">{remedies.length} remedy{remedies.length !== 1 ? "s" : ""} created</p>
          </div>
          <Link to="create" className="btn-primary inline-flex items-center gap-2 text-sm">
            ✏️ New Remedy
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {remedies.map((element) => (
            <div key={element._id} className="card card-hover group">
              <div
                className="h-44 bg-cover bg-center relative overflow-hidden"
                style={{ backgroundImage: `url(${element.image})` }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute top-3 right-3">
                  {element.isVerified ? (
                    <span className="badge-verified shadow">✓ Verified</span>
                  ) : (
                    <span className="badge-pending shadow">⏳ Pending</span>
                  )}
                </div>
              </div>

              <div className="p-5">
                <h3 className="font-bold text-gray-900 text-lg mb-2 group-hover:text-forest-700 transition-colors">
                  {element.title}
                </h3>
                <p className="text-gray-500 text-sm line-clamp-2 mb-4">{element.description}</p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-gray-400">Effectiveness:</span>
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className={`w-2 h-2 rounded-full ${i < element.effectiveness ? "bg-forest-500" : "bg-gray-200"}`} />
                      ))}
                    </div>
                  </div>
                  <Link
                    to={`/remedy/${element._id}`}
                    className="inline-flex items-center gap-1.5 text-forest-600 hover:text-forest-800 font-semibold text-sm transition-colors"
                  >
                    View Details
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MyRemedy;
