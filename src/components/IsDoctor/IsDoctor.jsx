import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../Store/useAuth';
import DashboardSidebar from '../shared/DashboardSidebar';

const doctorNavItems = [
  { to: "/professional/profile", icon: "👤", label: "Profile" },
  { to: "/professional/create", icon: "✏️", label: "Create Remedy" },
  { to: "/professional/myremedy", icon: "📋", label: "My Remedies" },
  { to: "/professional/verifyremedy", icon: "✅", label: "Verify Remedies" },
  { to: "/professional/requests", icon: "📨", label: "User Requests" },
  { to: "/professional/bookmarks", icon: "🔖", label: "Saved Remedies" },
];

function Doctor() {
  const { user } = useAuth();

  if (!user || !user.isprofessional) {
    return <Navigate to="/" />;
  }

  return (
    <div className="flex h-screen bg-gray-50 pt-[10vh] lg:pt-0">
      <div className="hidden lg:flex lg:flex-col lg:w-64 lg:flex-shrink-0 lg:fixed lg:top-[10vh] lg:left-0 lg:h-[90vh]">
        <DashboardSidebar user={user} navItems={doctorNavItems} title="Doctor Panel" role="professional" />
      </div>
      <div className="lg:hidden flex flex-col w-full">
        <div className="fixed top-[10vh] left-0 right-0 z-30">
          <DashboardSidebar user={user} navItems={doctorNavItems} title="Doctor Panel" role="professional" />
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

export default Doctor;
