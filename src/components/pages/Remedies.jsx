/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../Store/useAuth";
import { FaSearch, FaHeart, FaRegHeart } from "react-icons/fa";
import Footer from "../layout/Footer";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

const RemedyCard = ({ remedy, isLiked, onToggleLike }) => (
  <div className="card card-hover flex flex-col group">
    {/* Image */}
    <div className="relative h-52 overflow-hidden">
      <div
        className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
        style={{ backgroundImage: `url(${remedy.image || "../../../images/Notfound.png"})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

      {/* Badges */}
      <div className="absolute top-3 left-3">
        <span className="bg-white/90 backdrop-blur-sm text-forest-700 text-xs font-bold px-2.5 py-1 rounded-full">
          {remedy.ailments?.[0] || "Remedy"}
        </span>
      </div>
      <div className="absolute top-3 right-3">
        {remedy.isVerified ? (
          <span className="badge-verified">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Verified
          </span>
        ) : (
          <span className="badge-pending">Pending</span>
        )}
      </div>
    </div>

    {/* Content */}
    <div className="p-5 flex-1 flex flex-col">
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="font-bold text-gray-900 text-lg leading-tight group-hover:text-forest-700 transition-colors">
          {remedy.title}
        </h3>
        <button
          onClick={() => onToggleLike(remedy._id)}
          className={`flex-shrink-0 p-1.5 rounded-lg transition-all duration-200 ${
            isLiked ? "text-red-500 bg-red-50" : "text-gray-300 hover:text-red-400 hover:bg-red-50"
          }`}
          title={isLiked ? "Unlike" : "Like"}
        >
          {isLiked ? <FaHeart size={16} /> : <FaRegHeart size={16} />}
        </button>
      </div>

      <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-2">{remedy.description}</p>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {remedy.ailments?.slice(0, 3).map((ailment, idx) => (
          <span key={idx} className="bg-forest-50 text-forest-700 text-xs font-medium px-2 py-0.5 rounded-md border border-forest-100">
            {ailment}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between mt-auto">
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full ${i < remedy.effectiveness ? "bg-forest-500" : "bg-gray-200"}`}
            />
          ))}
          <span className="text-xs text-gray-400 ml-1">{remedy.effectiveness}/5</span>
        </div>
        <Link
          to={`/remedy/${remedy._id}`}
          className="inline-flex items-center gap-1.5 bg-forest-600 hover:bg-forest-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-all duration-200 shadow-sm hover:shadow"
        >
          Read more
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  </div>
);

const Remedies = () => {
  const [remedies, setRemedies] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isRemedyLikedByUser, toggleRemedyLike } = useAuth();
  const [likedMap, setLikedMap] = useState({});
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    const fetchRemedies = async () => {
      try {
        const response = await fetch(`${baseUrl}remedy`);
        const res = await response.json();
        setRemedies(res.data);
      } catch (error) {
        toast.error("Failed to load remedies.");
      } finally {
        setLoading(false);
      }
    };
    fetchRemedies();
  }, []);

  useEffect(() => {
    const checkLikedRemedies = async () => {
      if (remedies.length && isRemedyLikedByUser) {
        const results = {};
        await Promise.all(
          remedies.map(async (remedy) => {
            const res = await isRemedyLikedByUser(remedy._id);
            results[remedy._id] = res.liked;
          })
        );
        setLikedMap(results);
      }
    };
    checkLikedRemedies();
    // eslint-disable-next-line
  }, [remedies]);

  const handleToggleLike = async (remedyId) => {
    const res = await toggleRemedyLike(remedyId);
    if (res && res.success) {
      setLikedMap((prev) => ({
        ...prev,
        [remedyId]: res.message === "Product Liked Successfully",
      }));
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!search.trim()) return;
    setSearching(true);
    setHasSearched(true);
    try {
      const response = await fetch(`${baseUrl}remedy/search?q=${encodeURIComponent(search)}`);
      const res = await response.json();
      setSearchResults(res.data || []);
    } catch (error) {
      toast.error("Search failed.");
      setSearchResults([]);
    }
    setSearching(false);
  };

  const clearSearch = () => {
    setSearch("");
    setSearchResults([]);
    setHasSearched(false);
  };

  const displayRemedies = hasSearched ? searchResults : remedies;

  return (
    <div className="min-h-screen bg-forest-50">
      {/* Header */}
      <div className="bg-gray-900 pt-[10vh]">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-14">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-forest-700/30 border border-forest-500/30 rounded-full px-4 py-1.5 mb-5">
              <span className="text-forest-400 text-sm font-medium">🌿 Natural Healing Library</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight">
              Explore Home Remedies
            </h1>
            <p className="text-white/50 text-lg max-w-lg mx-auto mb-8">
              Doctor-verified traditional remedies from communities worldwide
            </p>

            {/* Search */}
            <form onSubmit={handleSearch} className="flex items-center max-w-xl mx-auto gap-2">
              <div className="flex-1 relative">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by condition, ingredient, or title..."
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-white border-0 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-forest-400 shadow-lg"
                />
                {hasSearched && (
                  <button type="button" onClick={clearSearch}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    ✕
                  </button>
                )}
              </div>
              <button type="submit" disabled={searching}
                className="bg-forest-600 hover:bg-forest-500 text-white font-semibold px-5 py-3 rounded-xl transition-all shadow-lg disabled:opacity-50">
                {searching ? "..." : "Search"}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12">
        {/* Search status */}
        {hasSearched && (
          <div className="flex items-center justify-between mb-8">
            <p className="text-gray-600">
              <span className="font-semibold">{searchResults.length}</span> results for{" "}
              <span className="font-semibold text-forest-700">"{search}"</span>
            </p>
            <button onClick={clearSearch} className="text-forest-600 hover:text-forest-700 text-sm font-medium">
              Clear search
            </button>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="spinner" />
            <p className="text-gray-500 text-sm">Loading remedies...</p>
          </div>
        ) : displayRemedies.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayRemedies.map((remedy) => (
              <RemedyCard
                key={remedy._id}
                remedy={remedy}
                isLiked={likedMap[remedy._id]}
                onToggleLike={handleToggleLike}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="w-24 h-24 bg-forest-100 rounded-2xl flex items-center justify-center mb-6">
              <span className="text-5xl">🌿</span>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No remedies found</h3>
            <p className="text-gray-500 mb-6">
              {hasSearched ? `No results for "${search}". Try a different search.` : "No remedies available yet."}
            </p>
            {hasSearched && (
              <button onClick={clearSearch} className="btn-secondary">
                Browse all remedies
              </button>
            )}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Remedies;
