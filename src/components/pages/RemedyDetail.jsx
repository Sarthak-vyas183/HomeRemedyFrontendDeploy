import React, { useState, useEffect } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../Store/useAuth";
import { FaHeart, FaRegHeart, FaShoppingCart } from "react-icons/fa";
const baseUrl = import.meta.env.VITE_API_BASE_URL;

const RemedyDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const [remedy, setRemedy] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submittingComment, setSubmittingComment] = useState(false);
  const { user, token, isRemedyLikedByUser, toggleRemedyLike } = useAuth();
  const [isLiked, setIsLiked] = useState(false);

  const fetchRemedyDetail = async () => {
    try {
      const response = await fetch(`${baseUrl}remedy/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await response.json();
      setRemedy(data.data);
    } catch (error) {
      toast.error("Failed to load remedy details.");
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await fetch(`${baseUrl}comment/p/${id}`);
      const data = await response.json();
      setComments(data.data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  useEffect(() => {
    fetchRemedyDetail();
    fetchComments();
    const checkLiked = async () => {
      if (id && isRemedyLikedByUser) {
        const res = await isRemedyLikedByUser(id);
        setIsLiked(res.liked);
      }
    };
    checkLiked();
    // eslint-disable-next-line
  }, [id, isRemedyLikedByUser, location]);

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) { toast.error("Comment cannot be empty."); return; }
    setSubmittingComment(true);
    try {
      const response = await fetch(`${baseUrl}comment/p/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ content: newComment, onModel: "Remedy" }),
      });
      const data = await response.json();
      if (data.success) {
        setNewComment("");
        setComments((prev) => [data.data, ...prev]);
        toast.success("Comment added.");
      } else {
        toast.error("Failed to add comment.");
      }
    } catch (error) {
      toast.error("Failed to add comment.");
    }
    setSubmittingComment(false);
  };

  const handleToggleLike = async () => {
    const res = await toggleRemedyLike(id);
    if (res && res.success) {
      setIsLiked(res.message === "Product Liked Successfully");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-forest-50 pt-[10vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="spinner" />
          <p className="text-gray-500">Loading remedy...</p>
        </div>
      </div>
    );
  }

  if (!remedy) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-forest-50 pt-[10vh]">
        <div className="text-center">
          <div className="w-24 h-24 bg-forest-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">🌿</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Remedy not found</h2>
          <Link to="/remedies" className="btn-primary inline-flex">Browse Remedies</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-forest-50 pt-[10vh]">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-forest-600 transition-colors">Home</Link>
          <span>/</span>
          <Link to="/remedies" className="hover:text-forest-600 transition-colors">Remedies</Link>
          <span>/</span>
          <span className="text-gray-800 font-medium">{remedy.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-6">
            {/* Hero Card */}
            <div className="card">
              <div className="relative h-80 overflow-hidden">
                <img src={remedy.image} alt={remedy.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-5 left-5 right-5">
                  <div className="flex items-end justify-between">
                    <div>
                      <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full mb-2 ${
                        remedy.isVerified ? "bg-forest-500 text-white" : "bg-amber-500 text-white"
                      }`}>
                        {remedy.isVerified ? "✓ Doctor Verified" : "⏳ Pending Verification"}
                      </span>
                      <h1 className="text-3xl font-bold text-white">{remedy.title}</h1>
                    </div>
                    <button
                      onClick={handleToggleLike}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-200 ${
                        isLiked ? "bg-red-500 text-white" : "bg-white/20 backdrop-blur-sm text-white hover:bg-white/30"
                      }`}
                    >
                      {isLiked ? <FaHeart size={14} /> : <FaRegHeart size={14} />}
                      {isLiked ? "Liked" : "Like"}
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-7">
                <p className="text-gray-600 text-base leading-relaxed mb-6">{remedy.description}</p>

                <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-100">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm text-gray-500">Effectiveness:</span>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className={`w-3 h-3 rounded-full ${i < remedy.effectiveness ? "bg-forest-500" : "bg-gray-200"}`} />
                      ))}
                    </div>
                    <span className="text-sm font-semibold text-forest-700">{remedy.effectiveness}/5</span>
                  </div>

                  {remedy.EcommerceUrl && (
                    <a
                      href={remedy.EcommerceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 ml-auto text-sm text-forest-600 hover:text-forest-800 font-semibold border border-forest-200 px-3 py-1.5 rounded-lg hover:bg-forest-50 transition-all"
                    >
                      <FaShoppingCart size={13} />
                      Buy Ingredients
                    </a>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Ingredients */}
                  <div>
                    <h2 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                      <span className="w-6 h-6 bg-forest-100 rounded-md flex items-center justify-center text-xs">🌿</span>
                      Ingredients
                    </h2>
                    <ul className="space-y-1.5">
                      {remedy.ingredients.map((ing, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                          <span className="w-1.5 h-1.5 bg-forest-400 rounded-full flex-shrink-0" />
                          {ing}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Ailments */}
                  <div>
                    <h2 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                      <span className="w-6 h-6 bg-amber-100 rounded-md flex items-center justify-center text-xs">💊</span>
                      Treats Ailments
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {remedy.ailments.map((ailment, i) => (
                        <span key={i} className="bg-forest-50 text-forest-700 text-xs font-medium px-2.5 py-1 rounded-full border border-forest-100">
                          {ailment}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Steps */}
                <div className="mt-6">
                  <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <span className="w-6 h-6 bg-blue-100 rounded-md flex items-center justify-center text-xs">📋</span>
                    Preparation Steps
                  </h2>
                  <ol className="space-y-3">
                    {remedy.steps.map((step, i) => (
                      <li key={i} className="flex gap-3">
                        <span className="flex-shrink-0 w-6 h-6 bg-forest-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                          {i + 1}
                        </span>
                        <span className="text-gray-700 text-sm leading-relaxed pt-0.5">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>

            {/* Comment Box */}
            <div className="card p-6">
              <h3 className="font-bold text-gray-900 text-lg mb-4">Leave a comment</h3>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your experience with this remedy..."
                rows={4}
                className="input-field resize-none mb-4"
              />
              <button
                onClick={handleCommentSubmit}
                disabled={submittingComment || !token}
                className="btn-primary flex items-center gap-2"
              >
                {submittingComment ? (
                  <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Posting...</>
                ) : "Post Comment"}
              </button>
              {!token && <p className="text-amber-600 text-sm mt-2">Please log in to comment.</p>}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            {/* Author Card */}
            <div className="card p-6">
              <h3 className="font-bold text-gray-800 mb-4 text-sm uppercase tracking-wider">Posted by</h3>
              <div className="flex flex-col items-center text-center">
                <img
                  src={remedy.userId?.avatar}
                  alt={remedy.userId?.username}
                  className="w-18 h-18 w-[72px] h-[72px] rounded-full object-cover border-4 border-forest-100 shadow-sm mb-3"
                />
                <p className="font-bold text-gray-900">{remedy.userId?.fullName}</p>
                <p className="text-forest-600 text-sm">{remedy.userId?.email}</p>
                {remedy.userId?.location && (
                  <p className="text-gray-400 text-xs mt-1">📍 {remedy.userId.location}</p>
                )}
              </div>
            </div>

            {/* Comments */}
            <div className="card p-6">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center justify-between">
                Comments
                <span className="bg-forest-100 text-forest-700 text-xs font-bold px-2 py-0.5 rounded-full">
                  {comments.length}
                </span>
              </h3>

              {comments.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-gray-400 text-sm">No comments yet. Be the first!</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-80 overflow-y-auto">
                  {comments.map((comment) => (
                    <div key={comment._id} className="flex gap-3 pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                      <img
                        src={comment.ownerDetail?.[0]?.avatar}
                        alt={comment.ownerDetail?.[0]?.username}
                        className="w-9 h-9 rounded-full object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline justify-between gap-2 mb-1">
                          <p className="font-semibold text-gray-800 text-sm truncate">
                            {comment.ownerDetail?.[0]?.fullName}
                          </p>
                          <p className="text-xs text-gray-400 flex-shrink-0">
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed">{comment.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RemedyDetail;
