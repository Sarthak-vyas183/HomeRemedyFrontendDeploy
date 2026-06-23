import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../Store/useAuth';
import DashboardSidebar from '../shared/DashboardSidebar';

const adminNavItems = [
  { to: "/admin/profile", icon: "👤", label: "Profile" },
  { to: "/admin/create", icon: "✏️", label: "Create Remedy" },
  { to: "/admin/myremedy", icon: "📋", label: "My Remedies" },
  { to: "/admin/usermanagement", icon: "👥", label: "Users" },
  { to: "/admin/remedymanagement", icon: "🌿", label: "Manage Remedies" },
  { to: "/admin/verifyReq", icon: "🏥", label: "Verify Doctors" },
  { to: "/admin/bookmarks", icon: "🔖", label: "Saved" },
];

function Admin() {
  const { user } = useAuth();

  if (!user || !user.isAdmin) {
    return <Navigate to="/" />;
  }

  return (
    <div className="flex h-screen bg-gray-50 pt-[10vh] lg:pt-0">
      <div className="hidden lg:flex lg:flex-col lg:w-64 lg:flex-shrink-0 lg:fixed lg:top-[10vh] lg:left-0 lg:h-[90vh]">
        <DashboardSidebar user={user} navItems={adminNavItems} title="Admin Panel" role="admin" />
      </div>
      <div className="lg:hidden flex flex-col w-full">
        <div className="fixed top-[10vh] left-0 right-0 z-30">
          <DashboardSidebar user={user} navItems={adminNavItems} title="Admin Panel" role="admin" />
        </div>
      </div>
      <main className="flex-1 lg:ml-64 overflow-y-auto lg:mt-[10vh]">
        <div className="min-h-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default Admin;
