/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useCallback, useEffect, useState } from "react";
import { useAuth } from "../Store/useAuth";
import { toast } from "react-toastify";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

function VerificationReq() {
  const { token } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImg, setModalImg] = useState("");
  const [processingId, setProcessingId] = useState(null);

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${baseUrl}admin/getAllReq`, {
        method: "POST",
        headers: { Authorization: token },
      });
      const data = await res.json();
      if (res.ok) {
        setRequests(data.data || []);
      } else {
        setError(data.msg || "Failed to fetch requests");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    }
    setLoading(false);
  }, [token]);

  useEffect(() => { fetchRequests(); }, [fetchRequests]);

  const handleViewDocument = (imgUrl) => { setModalImg(imgUrl); setModalOpen(true); };
  const handleCloseModal = () => { setModalOpen(false); setModalImg(""); };
  const handleDownload = () => { window.open(modalImg, "_blank", "noopener,noreferrer"); };

  const handleAccept = useCallback(async (id) => {
    setProcessingId(id);
    try {
      const response = await fetch(`${baseUrl}admin/getVerify`, {
        method: "POST",
        headers: { Authorization: token, "Content-Type": "application/json" },
        body: JSON.stringify({ userId: id }),
      });
      const data = await response.json();
      if (response.ok && data.statusCode === 200) {
        toast.success(data.msg || "Professional status toggled successfully");
        setRequests((prev) => prev.filter((req) => req._id !== id));
        fetchRequests();
      } else {
        toast.error(data.msg || "Failed to accept request");
      }
    } catch (error) {
      toast.error("Error accepting request");
    }
    setProcessingId(null);
  }, [requests]);

  const handleDecline = (id) => {
    try {
      fetch(`${baseUrl}admin/getDecline`, {
        method: "POST",
        headers: { Authorization: token, "Content-Type": "application/json" },
        body: JSON.stringify({ reqId: id }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.statusCode === 200) {
            toast.success(data.msg || "Request declined successfully");
            setRequests((prev) => prev.filter((req) => req._id !== id));
          } else {
            toast.error(data.msg || "Failed to decline request");
          }
        });
    } catch (error) {
      toast.error("Error declining request");
    }
  };

  const statusColor = (status) => {
    if (status === 'approved') return 'bg-forest-100 text-forest-700';
    if (status === 'declined') return 'bg-red-100 text-red-700';
    return 'bg-amber-100 text-amber-700';
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="spinner" />
        <p className="text-gray-500 text-sm">Loading verification requests...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mb-4">
          <span className="text-3xl">⚠️</span>
        </div>
        <h3 className="text-lg font-bold text-gray-800 mb-2">Failed to load requests</h3>
        <p className="text-gray-500 text-sm mb-4">{error}</p>
        <button onClick={fetchRequests} className="btn-secondary">Try Again</button>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8 min-h-full bg-gray-50">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Doctor Verification Requests</h1>
          <p className="text-gray-500 text-sm mt-1">
            {requests.length} pending request{requests.length !== 1 ? "s" : ""}
          </p>
        </div>

        {requests.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center card">
            <div className="w-20 h-20 bg-forest-100 rounded-2xl flex items-center justify-center mb-5">
              <span className="text-4xl">✅</span>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">All caught up!</h3>
            <p className="text-gray-500">No pending verification requests at this time.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {requests.map((req) => (
              <div key={req._id} className="card p-6 hover:border-indigo-200 transition-all">
                {/* Status badge */}
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${statusColor(req.status)}`}>
                    {req.status?.charAt(0).toUpperCase() + req.status?.slice(1) || 'Pending'}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(req.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {/* Details */}
                <div className="space-y-2.5 mb-5">
                  <div className="flex items-start gap-2">
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider w-16 flex-shrink-0 pt-0.5">RMP No.</span>
                    <span className="text-gray-800 text-sm font-medium">{req.RMP_NO}</span>
                  </div>
                  {req.message && (
                    <div className="flex items-start gap-2">
                      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider w-16 flex-shrink-0 pt-0.5">Message</span>
                      <p className="text-gray-600 text-sm leading-relaxed">{req.message}</p>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t border-gray-50">
                  <button
                    onClick={() => handleViewDocument(req.RMP_Img)}
                    className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-700 font-semibold text-xs px-3 py-2 rounded-lg border border-gray-200 transition-all"
                  >
                    📄 View Doc
                  </button>
                  <button
                    onClick={() => handleAccept(req.userId)}
                    disabled={processingId === req.userId}
                    className="flex-1 bg-forest-600 hover:bg-forest-700 text-white font-semibold text-xs px-3 py-2 rounded-lg transition-all disabled:opacity-50 flex items-center justify-center gap-1"
                  >
                    {processingId === req.userId ? (
                      <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : "✓ Accept"}
                  </button>
                  <button
                    onClick={() => { handleDecline(req._id) }}
                    className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 font-semibold text-xs px-3 py-2 rounded-lg border border-red-100 transition-all"
                  >
                    ✗ Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Document Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={handleCloseModal}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden animate-fade-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-900">RMP Certificate Document</h3>
              <button onClick={handleCloseModal} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4 bg-gray-50">
              <img
                src={modalImg}
                alt="RMP Certificate"
                className="max-h-[65vh] w-full object-contain rounded-xl border border-gray-200"
              />
            </div>
            <div className="flex gap-3 p-4 border-t border-gray-100">
              <button onClick={handleDownload} className="btn-primary flex-1 flex items-center justify-center gap-2">
                ⬇️ Download
              </button>
              <button onClick={handleCloseModal} className="btn-secondary flex-1">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default VerificationReq;
