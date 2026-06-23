import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../Store/useAuth';
import { toast } from 'react-toastify';
const baseUrl = import.meta.env.VITE_API_BASE_URL;

function Verify_remedy() {
  const { token } = useAuth();
  const [verifiedRem, setVerifiedRem] = useState([]);
  const [loading, setLoading] = useState(true);
  const [verifyingId, setVerifyingId] = useState(null);

  const getImageSrc = (img) => img || "../../../images/Notfound.png";

  const unVerifyedRemedy = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${baseUrl}p/pendingRemedies`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok && Array.isArray(data.data)) {
        setVerifiedRem(data.data);
      } else {
        setVerifiedRem([]);
      }
    } catch {
      setVerifiedRem([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    unVerifyedRemedy();
    // eslint-disable-next-line
  }, []);

  const handleVerify = async (remedyId) => {
    setVerifyingId(remedyId);
    try {
      const response = await fetch(`${baseUrl}p/verifyRemedy/${remedyId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        toast.error("Failed to verify remedy");
        setVerifyingId(null);
        return;
      }
      toast.success("Remedy verified successfully!");
      setVerifiedRem(prev => prev.filter(r => r._id !== remedyId));
    } catch (error) {
      toast.error("Error verifying remedy.");
    }
    setVerifyingId(null);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="spinner" />
        <p className="text-gray-500 text-sm">Loading pending remedies...</p>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8 min-h-full bg-gray-50">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Verify Remedies</h1>
          <p className="text-gray-500 text-sm mt-1">
            {verifiedRem.length} remedy{verifiedRem.length !== 1 ? "s" : ""} pending your verification
          </p>
        </div>

        {verifiedRem.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center card">
            <div className="w-20 h-20 bg-forest-100 rounded-2xl flex items-center justify-center mb-5">
              <span className="text-4xl">✅</span>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">All verified!</h3>
            <p className="text-gray-500">No remedies pending verification at this time.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {verifiedRem.map((remedy) => (
              <div key={remedy._id} className="card card-hover group overflow-hidden flex flex-col">
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <div
                    className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                    style={{ backgroundImage: `url(${getImageSrc(remedy.image)})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute top-3 right-3">
                    <span className="badge-pending shadow">
                      ⏳ {remedy.verifyInfo?.status?.toUpperCase() || "PENDING"}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col p-5">
                  <h3 className="font-bold text-gray-900 text-lg mb-2 group-hover:text-teal-700 transition-colors">
                    {remedy.title}
                  </h3>
                  <p className="text-gray-500 text-sm line-clamp-2 mb-3">{remedy.description}</p>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {remedy.ailments?.slice(0, 3).map((ailment, idx) => (
                      <span key={idx} className="bg-teal-50 text-teal-700 text-xs font-medium px-2 py-0.5 rounded-md border border-teal-100">
                        {ailment}
                      </span>
                    ))}
                  </div>

                  {/* Author */}
                  <div className="flex items-center gap-2 mb-4 pt-3 border-t border-gray-50">
                    <div className="w-7 h-7 bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold text-gray-600">
                      {remedy.userDetail?.fullname?.[0] || "U"}
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-700">{remedy.userDetail?.fullname || "Unknown"}</p>
                      <p className="text-xs text-gray-400">{new Date(remedy.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 mt-auto">
                    <Link
                      to={`/remedy/${remedy._id}`}
                      className="flex-1 text-center bg-gray-50 hover:bg-gray-100 text-gray-700 font-semibold text-sm px-3 py-2 rounded-lg border border-gray-200 transition-all"
                    >
                      View Details
                    </Link>
                    <button
                      onClick={() => handleVerify(remedy._id)}
                      disabled={verifyingId === remedy._id}
                      className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm px-3 py-2 rounded-lg transition-all disabled:opacity-50 flex items-center justify-center gap-1"
                    >
                      {verifyingId === remedy._id ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : "✓ Verify"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Info banner */}
        <div className="mt-8 bg-teal-50 border border-teal-200 rounded-xl p-4 flex items-center gap-3">
          <span className="text-2xl">💡</span>
          <p className="text-teal-700 text-sm">
            <span className="font-semibold">My Verification history</span> — this feature is coming soon.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Verify_remedy;
