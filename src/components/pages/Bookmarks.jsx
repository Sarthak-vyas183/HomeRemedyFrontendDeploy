import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../Store/useAuth';
const baseUrl = import.meta.env.VITE_API_BASE_URL;

function Bookmarks() {
  const [saved, setSaved] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  const bookmarks = async () => {
    try {
      const response = await fetch(`${baseUrl}/user/mybookmarks`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Failed to fetch bookmarks");
      const res = await response.json();
      const remedyIDs = res.data || [];
      const remedyDetails = await Promise.all(
        remedyIDs.map(async (ID) => {
          const remedyResponse = await fetch(`${baseUrl}/user/mybookmarksdetail`, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
            body: JSON.stringify({ remedyId: ID }),
          });
          if (!remedyResponse.ok) throw new Error("Failed to fetch remedy data");
          const remedyDetail = await remedyResponse.json();
          return remedyDetail.remedydetail;
        })
      );
      setSaved(remedyDetails);
    } catch (error) {
      console.error(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) bookmarks();
  }, [token]);

  const getImageSrc = (buffer) => {
    if (!buffer) return "";
    const binary = new Uint8Array(buffer.data).reduce(
      (acc, byte) => acc + String.fromCharCode(byte), ""
    );
    return `data:image/jpeg;base64,${window.btoa(binary)}`;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="spinner" />
        <p className="text-gray-500 text-sm">Loading bookmarks...</p>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8 min-h-full bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Saved Remedies</h1>
          <p className="text-gray-500 text-sm mt-1">
            {saved.length} saved remedy{saved.length !== 1 ? "s" : ""}
          </p>
        </div>

        {saved.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 bg-forest-100 rounded-2xl flex items-center justify-center mb-5">
              <span className="text-4xl">🔖</span>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No saved remedies</h3>
            <p className="text-gray-500 mb-6 max-w-sm">
              Start exploring remedies and bookmark the ones you find helpful.
            </p>
            <Link to="/remedies" className="btn-primary inline-flex items-center gap-2">
              🌿 Browse Remedies
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {saved.map((remedy, index) => (
              <div key={index} className="card card-hover group">
                <div className="h-44 overflow-hidden">
                  <img
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    src={getImageSrc(remedy.img)}
                    alt={remedy.title}
                    onError={(e) => { e.target.src = "../../../images/Notfound.png"; }}
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-gray-900 mb-2 group-hover:text-forest-700 transition-colors">
                    {remedy.title}
                  </h3>
                  <p className="text-gray-500 text-sm line-clamp-2 mb-4">{remedy.desc}</p>
                  <Link
                    to={`/remedy/${remedy.Id}`}
                    className="inline-flex items-center gap-1.5 bg-forest-600 hover:bg-forest-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-all shadow-sm"
                  >
                    Read More
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

export default Bookmarks;
