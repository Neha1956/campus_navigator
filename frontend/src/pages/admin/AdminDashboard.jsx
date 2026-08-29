// src/components/admin/AdminDashboard.jsx
import React, { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { MapPin, Route, LayoutDashboard, PlusCircle, PencilLine } from "lucide-react";

const AdminDashboard = () => {
  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Admin Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 p-4 flex flex-col">
        <h2 className="text-lg font-bold text-slate-900 mb-6 px-3">Admin Panel</h2>
        <nav className="space-y-1 flex-1">
          <Link to="/admin" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-blue-50 hover:text-blue-600">
            <LayoutDashboard size={18} /> Overview
          </Link>
          <Link to="/admin/add-location" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-blue-50 hover:text-blue-600">
            <MapPin size={18} /> Add Location (Map Click)
          </Link>
          <Link to="/admin/manage-locations" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-blue-50 hover:text-blue-600">
            <PencilLine size={18} /> Manage Locations
          </Link>
          <Link to="/admin/add-route" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-blue-50 hover:text-blue-600">
            <Route size={18} /> Manage Routes
          </Link>
        </nav>
      </aside>

      {/* Main Admin Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminDashboard;