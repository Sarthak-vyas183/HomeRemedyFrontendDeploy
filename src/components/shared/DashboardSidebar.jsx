import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { gsap } from "gsap";

function DashboardSidebar({ user, navItems, title = "Dashboard", role = "user" }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  useEffect(() => {
    if (isOpen) {
      gsap.fromTo(
        ".sidebar-item",
        { opacity: 0, x: -16 },
        { opacity: 1, x: 0, stagger: 0.06, duration: 0.4, ease: "power2.out" }
      );
    }
  }, [isOpen]);

  const roleColors = {
    admin: { from: "from-slate-900", via: "via-slate-800", to: "to-slate-700", accent: "bg-indigo-600" },
    professional: { from: "from-teal-900", via: "via-teal-800", to: "to-forest-700", accent: "bg-teal-600" },
    user: { from: "from-forest-900", via: "via-forest-800", to: "to-forest-700", accent: "bg-forest-600" },
  };
  const colors = roleColors[role] || roleColors.user;

  const avatar = user?.avatar;
  const name = user?.fullName || user?.fullname || title;
  const email = user?.email || "";

  return (
    <>
      {/* Mobile toggle bar */}
      <div
        className="lg:hidden flex items-center gap-3 px-4 h-12 mt-[10vh] bg-gray-900 border-b border-white/10 cursor-pointer select-none"
        onClick={toggleSidebar}
      >
        <div className="w-8 h-8 flex flex-col justify-center items-center gap-1.5">
          <span className={`w-5 h-0.5 bg-white transition-all duration-200 ${isOpen ? "rotate-45 translate-y-1" : ""}`} />
          <span className={`w-5 h-0.5 bg-white transition-all duration-200 ${isOpen ? "opacity-0" : ""}`} />
          <span className={`w-5 h-0.5 bg-white transition-all duration-200 ${isOpen ? "-rotate-45 -translate-y-2" : ""}`} />
        </div>
        <span className="text-white font-semibold text-sm">{isOpen ? "Close Menu" : "Menu"}</span>
      </div>

      {/* Sidebar */}
      <div
        className={`
          bg-gradient-to-b ${colors.from} ${colors.via} ${colors.to}
          flex flex-col
          lg:w-64 lg:flex-shrink-0 lg:h-full
          ${isOpen ? "w-64 absolute z-20 h-full" : "hidden lg:flex"}
        `}
      >
        {/* User Info */}
        <div className="p-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            {avatar ? (
              <img src={avatar} alt={name} className="w-10 h-10 rounded-xl object-cover border-2 border-white/20" />
            ) : (
              <div className={`w-10 h-10 rounded-xl ${colors.accent} flex items-center justify-center text-white font-bold`}>
                {name?.[0]?.toUpperCase() || "U"}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="text-white font-semibold text-sm truncate">{name}</p>
              <p className="text-white/40 text-xs truncate">{email}</p>
            </div>
          </div>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {navItems.map(({ to, icon, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `sidebar-item flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? "bg-white/20 text-white shadow-sm"
                    : "text-white/60 hover:text-white hover:bg-white/10"
                }`
              }
            >
              <span className="text-base">{icon}</span>
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-white/10">
          <p className="text-white/25 text-xs text-center">HomeRemedy.in</p>
        </div>
      </div>
    </>
  );
}

export default DashboardSidebar;
