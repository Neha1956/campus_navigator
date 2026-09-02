import {
  Map,
  Building2,
  Navigation,
  Settings,
  X,
  Home,
} from "lucide-react";

import { NavLink, useLocation } from "react-router-dom";

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const currentCategory = searchParams.get("category");
  const currentPath = location.pathname;

  const getSidebarClass = (path, category = null) => {
    let isActive = false;

    if (category) {
      isActive =
        currentPath === "/locations" &&
        currentCategory === category;
    } else if (path === "/locations") {
      isActive =
        currentPath === "/locations" &&
        !currentCategory;
    } else {
      isActive = currentPath === path;
    }

    return `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
      isActive
        ? "bg-blue-50 text-blue-600 shadow-sm"
        : "text-slate-600 hover:bg-slate-50 hover:text-blue-600"
    }`;
  };

  return (
    <>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-[2px] lg:hidden"
        />
      )}

      {/* Sidebar - MOBILE ONLY */}
      <aside
        className={`
          fixed left-0 top-16 z-50
          h-[calc(100vh-64px)]
          w-72
          border-r border-slate-200
          bg-white
          shadow-xl
          transition-transform duration-300

          lg:hidden

          ${
            sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >
        <div className="flex h-full flex-col overflow-y-auto p-4">

          {/* Mobile Header */}
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Navigation
              </p>

              <p className="mt-1 text-sm font-bold text-slate-900">
                Explore Campus
              </p>
            </div>

            <button
              onClick={() => setSidebarOpen(false)}
              className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
            >
              <X size={20} />
            </button>
          </div>

          {/* Main Navigation */}
          <div className="border-b border-slate-100 pb-4">
            <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Main Menu
            </p>

            <nav className="space-y-1">

              <NavLink
                to="/"
                end
                onClick={() => setSidebarOpen(false)}
                className={getSidebarClass("/")}
              >
                <Home size={19} />
                <span>Home</span>
              </NavLink>

              <NavLink
                to="/map"
                onClick={() => setSidebarOpen(false)}
                className={getSidebarClass("/map")}
              >
                <Map size={19} />
                <span>Campus Map</span>
              </NavLink>

              <NavLink
                to="/locations"
                onClick={() => setSidebarOpen(false)}
                className={getSidebarClass("/locations")}
              >
                <Building2 size={19} />
                <span>Locations</span>
              </NavLink>

              <NavLink
                to="/directions"
                onClick={() => setSidebarOpen(false)}
                className={getSidebarClass("/directions")}
              >
                <Navigation size={19} />
                <span>Directions</span>
              </NavLink>

            </nav>
          </div>

          {/* Admin */}
          <div className="mt-auto border-t border-slate-100 pt-4">
            <NavLink
              to="/admin"
              onClick={() => setSidebarOpen(false)}
              className={getSidebarClass("/admin")}
            >
              <Settings size={19} />
              <span>Admin Panel</span>
            </NavLink>
          </div>

        </div>
      </aside>
    </>
  );
};

export default Sidebar;