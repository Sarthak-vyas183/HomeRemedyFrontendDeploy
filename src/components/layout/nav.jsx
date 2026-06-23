/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../Store/useAuth";
import logo from "../../assets/LOGO.png";

function Nav() {
  const location = useLocation();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const { isLoggedin, user } = useAuth();

  const toggleSidebar = () => {
    setSidebarOpen((prev) => {
      const next = !prev;
      document.body.classList.toggle("overflow-hidden", next);
      return next;
    });
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
    document.body.classList.remove("overflow-hidden");
  };

  // Close sidebar on outside click
  useEffect(() => {
    if (!isSidebarOpen) return;
    const handleOutsideClick = (event) => {
      if (!document.getElementById("sidebar")?.contains(event.target)) {
        closeSidebar();
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isSidebarOpen]);

  // Close sidebar automatically whenever route changes
  useEffect(() => {
    closeSidebar();
  }, [location.pathname]);

  const profileLink = user?.isAdmin
    ? "/admin/profile"
    : user?.isprofessional
      ? "/professional/profile"
      : "/user/profile";

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" },
    { to: "/remedies", label: "Remedies" },
  ];

  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Main Navbar — same solid dark background on every route */}
      <nav className="fixed top-0 left-0 right-0 z-40 h-[10vh] bg-gray-900/95 backdrop-blur-md shadow-lg">
        <div className="h-full max-w-7xl mx-auto px-4 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-full overflow-hidden bg-forest-600/20 border border-forest-400/30 flex items-center justify-center">
              <img src={logo} alt="Logo" className="w-7 h-7 object-contain" />
            </div>
            <span className="text-white font-bold text-lg tracking-tight hidden sm:block">
              Home<span className="text-forest-400">Remedies</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${isActive(to)
                  ? "bg-forest-600 text-white"
                  : "text-white/80 hover:text-white hover:bg-white/10"
                  }`}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Desktop Auth */}
          <div className="hidden lg:flex items-center gap-2">
            {isLoggedin ? (
              <>
                <Link
                  to={profileLink}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200"
                >
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      className="w-7 h-7 rounded-full object-cover border border-forest-400"
                      alt="avatar"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-forest-600 flex items-center justify-center">
                      <span className="text-white text-xs font-bold">
                        {user?.fullName?.[0] || "U"}
                      </span>
                    </div>
                  )}
                  <span>Profile</span>
                </Link>
                <Link
                  to="/logout"
                  className="px-4 py-2 rounded-lg text-sm font-semibold text-red-300 hover:text-red-200 hover:bg-red-500/10 transition-all duration-200"
                >
                  Logout
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-lg text-sm font-semibold text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 rounded-lg text-sm font-semibold bg-forest-600 text-white hover:bg-forest-500 transition-all duration-200 shadow-sm"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Hamburger */}
          <button
            className="lg:hidden p-2 rounded-lg text-white hover:bg-white/10 transition-colors"
            onClick={toggleSidebar}
            aria-label="Open menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </nav>

      {/* Spacer so page content never hides under the fixed navbar */}
      <div className="h-[10vh]" aria-hidden="true" />

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Mobile Sidebar */}
      <div
        id="sidebar"
        className={`fixed top-0 left-0 h-full w-72 bg-gray-900 shadow-2xl z-50 transform transition-transform duration-300 ease-out lg:hidden ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        {/* Sidebar Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isLoggedin && user?.avatar ? (
              <img
                src={user.avatar}
                className="w-10 h-10 rounded-full object-cover border-2 border-forest-400"
                alt="avatar"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-forest-700 flex items-center justify-center">
                <span className="text-white font-bold">
                  {isLoggedin ? user?.fullName?.[0] || "U" : "G"}
                </span>
              </div>
            )}
            <div>
              <p className="text-white font-semibold text-sm">
                {isLoggedin ? user?.fullName || "User" : "Guest"}
              </p>
              <p className="text-white/50 text-xs">
                {isLoggedin ? user?.email : "Not logged in"}
              </p>
            </div>
          </div>
          <button
            onClick={closeSidebar}
            className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Nav Links */}
        <ul className="p-4 space-y-1 mt-2">
          {navLinks.map(({ to, label }) => (
            <li key={to}>
              <Link
                to={to}
                onClick={closeSidebar}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${isActive(to)
                  ? "bg-forest-600 text-white"
                  : "text-white/70 hover:text-white hover:bg-white/8"
                  }`}
              >
                {label}
              </Link>
            </li>
          ))}

          <li className="pt-2 border-t border-white/10 mt-3">
            {isLoggedin ? (
              <div className="space-y-1">
                <Link
                  to={profileLink}
                  onClick={closeSidebar}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-white/70 hover:text-white hover:bg-white/8 transition-all"
                >
                  Profile
                </Link>
                <Link
                  to="/logout"
                  onClick={closeSidebar}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all"
                >
                  Logout
                </Link>
              </div>
            ) : (
              <div className="space-y-2">
                <Link
                  to="/login"
                  onClick={closeSidebar}
                  className="flex items-center justify-center px-4 py-3 rounded-xl text-sm font-semibold text-white/70 hover:text-white hover:bg-white/8 transition-all border border-white/10"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  onClick={closeSidebar}
                  className="flex items-center justify-center px-4 py-3 rounded-xl text-sm font-semibold bg-forest-600 text-white hover:bg-forest-500 transition-all"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </li>
        </ul>
      </div>
    </>
  );
}

export default Nav;