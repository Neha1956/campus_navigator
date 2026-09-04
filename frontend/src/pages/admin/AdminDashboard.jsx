// src/components/admin/AdminDashboard.jsx
import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { MapPin, Route, PencilLine, Building2, ChevronRight, Compass, ShieldCheck } from "lucide-react";

const AdminDashboard = () => {
  const location = useLocation();
  const isDashboardHome = location.pathname === "/admin";

  const adminCards = [
    {
      title: "Add New Location",
      description: "Click directly on the interactive campus map to drop markers and set precise X/Y spatial coordinates.",
      path: "/admin/add-location",
      icon: <MapPin size={26} className="text-blue-600" />,
      bg: "bg-blue-50 border-blue-100",
      accent: "group-hover:border-blue-500",
      badge: "Mapping Tool",
    },
    {
      title: "Manage Locations",
      description: "Review directory records, modify metadata details, handle media photo galleries, or remove listings.",
      path: "/admin/manage-locations",
      icon: <PencilLine size={26} className="text-emerald-600" />,
      bg: "bg-emerald-50 border-emerald-100",
      accent: "group-hover:border-emerald-500",
      badge: "Directory Control",
    },
    {
      title: "Manage Routes",
      description: "Configure directional pathways, connectivity nodes, and optimal routing paths across campus zones.",
      path: "/admin/add-route",
      icon: <Route size={26} className="text-violet-600" />,
      bg: "bg-violet-50 border-violet-100",
      accent: "group-hover:border-violet-500",
      badge: "Navigation Engine",
    },
    {
      title: "Campus Builder",
      description: "Design structural blocks, set infrastructural perimeters, and structure the 2D/3D facility layout map.",
      path: "/admin/campus-builder",
      icon: <Building2 size={26} className="text-amber-600" />,
      bg: "bg-amber-50 border-amber-100",
      accent: "group-hover:border-amber-500",
      badge: "Infrastructure",
    },
  ];

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50/50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {isDashboardHome ? (
          <div className="space-y-8">
            {/* Immersive Hero Welcome Banner */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-950 p-8 sm:p-12 text-white shadow-2xl">
              <div className="absolute -right-12 -bottom-12 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
              <div className="relative z-10 max-w-3xl">
                <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-blue-200 border border-blue-400/30 mb-5 backdrop-blur-md">
                  <ShieldCheck size={14} /> Ramchandra Chandravanshi University
                </div>
                <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
                  Admin Control Dashboard
                </h1>
                <p className="mt-4 text-slate-300 text-base sm:text-lg leading-relaxed">
                  Centralized command hub for managing campus infrastructure, spatial map coordinates, directional paths, and location directories with high precision.
                </p>
              </div>
            </div>

            {/* Interactive Module Cards Grid */}
            <div>
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-xl font-bold tracking-tight text-slate-900">
                  Management Modules
                </h3>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Select a module to proceed
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {adminCards.map((card, index) => (
                  <Link
                    key={index}
                    to={card.path}
                    className={`group relative flex flex-col justify-between rounded-3xl border border-slate-200/80 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl ${card.accent}`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-5">
                        <div className={`flex h-14 w-14 items-center justify-center rounded-2xl border ${card.bg}`}>
                          {card.icon}
                        </div>
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 transition-colors group-hover:bg-blue-50 group-hover:text-blue-600">
                          {card.badge}
                        </span>
                      </div>
                      <h4 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {card.title}
                      </h4>
                      <p className="mt-2 text-sm text-slate-500 leading-relaxed">
                        {card.description}
                      </p>
                    </div>

                    <div className="mt-8 flex items-center justify-between pt-4 border-t border-slate-100 text-sm font-semibold text-blue-600">
                      <span className="flex items-center gap-1.5">
                        Launch interface
                      </span>
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 transition-transform duration-200 group-hover:translate-x-1 group-hover:bg-blue-600 group-hover:text-white">
                        <ChevronRight size={16} />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <Outlet />
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;