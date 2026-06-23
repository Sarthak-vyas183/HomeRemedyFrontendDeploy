/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../Store/useAuth";
import DashboardSidebar from "../shared/DashboardSidebar";

const userNavItems = [
  { to: "/user/profile", icon: "👤", label: "Profile" },
  { to: "/user/create", icon: "✏️", label: "Create Remedy" },
  { to: "/user/myremedy", icon: "📋", label: "My Remedies" },
  { to: "/user/contact", icon: "💬", label: "Contact Doctor" },
  { to: "/user/bookmarks", icon: "🔖", label: "Saved Remedies" },
];

function User() {
  const { isLoggedin, user } = useAuth();

  if (!isLoggedin) {
    return <Navigate to="/" />;
  }

  return (
    <div className="flex h-screen bg-gray-50 pt-[10vh] lg:pt-0">
      {/* Fixed sidebar offset for desktop */}
      <div className="hidden lg:flex lg:flex-col lg:w-64 lg:flex-shrink-0 lg:fixed lg:top-[10vh] lg:left-0 lg:h-[90vh]">
        <DashboardSidebar user={user} navItems={userNavItems} title="User Panel" role="user" />
      </div>

      {/* Mobile sidebar */}
      <div className="lg:hidden flex flex-col w-full">
        <div className="fixed top-[10vh] left-0 right-0 z-30">
          <DashboardSidebar user={user} navItems={userNavItems} title="User Panel" role="user" />
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 lg:ml-64 overflow-y-auto lg:mt-[10vh]">
        <div className="min-h-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default User;
