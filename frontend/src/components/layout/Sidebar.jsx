import {
  Map,
  Building2,
  Library,
  Utensils,
  Navigation,
  Settings,
  DoorOpen,
  X,
  Home,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const sidebarItems = [
  {
    label: "Home",
    icon: Home,
    path: "/",
  },
  {
    label: "Campus Map",
    icon: Map,
    path: "/map",
  },
  {
    label: "Locations",
    icon: Building2,
    path: "/locations",
  },
  {
    label: "Library",
    icon: Library,
    path: "/locations?category=Library",
  },
  {
    label: "Canteen",
    icon: Utensils,
    path: "/locations?category=Canteen",
  },
  {
    label: "Main Gate",
    icon: DoorOpen,
    path: "/locations?category=Gate",
  },
  {
    label: "Directions",
    icon: Navigation,
    path: "/directions",
  },
];

const sidebarClass = ({ isActive }) =>
  `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
    isActive
      ? "bg-blue-50 text-blue-600 shadow-sm"
      : "text-slate-600 hover:bg-slate-50 hover:text-blue-600"
  }`;

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  return (
    <>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-[2px] lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 top-16 z-50 h-[calc(100vh-64px)]
          w-72 border-r border-slate-200 bg-white
          shadow-xl transition-transform duration-300

          lg:sticky lg:top-16 lg:z-30
          lg:h-[calc(100vh-64px)]
          lg:w-60 lg:translate-x-0
          lg:shadow-none

          ${
            sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >
        <div className="flex h-full flex-col overflow-y-auto p-4">

          {/* Mobile Header */}
          <div className="mb-4 flex items-center justify-between lg:hidden">
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

          {/* Desktop Title */}
          <div className="mb-4 hidden px-3 lg:block">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Explore Campus
            </p>
          </div>

          {/* ================================================= */}
          {/* TOP NAVIGATION - Mobile Only */}
          {/* ================================================= */}

          <div className="mb-4 border-b border-slate-100 pb-4 lg:hidden">

            <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Main Menu
            </p>

            <nav className="space-y-1">

              {sidebarItems.map((item) => {
                const Icon = item.icon;

                return (
                  <NavLink
                    key={item.label}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={sidebarClass}
                  >
                    <Icon size={19} />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}

            </nav>

          </div>

          {/* ================================================= */}
          {/* DESKTOP / EXPLORE MENU */}
          {/* ================================================= */}

          <div>

            <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400 lg:hidden">
              Explore
            </p>

            <nav className="space-y-1">

              <NavLink
                to="/locations"
                onClick={() => setSidebarOpen(false)}
                className={sidebarClass}
              >
                <Building2 size={19} />
                <span>Buildings</span>
              </NavLink>

              <NavLink
                to="/locations?category=Library"
                onClick={() => setSidebarOpen(false)}
                className={sidebarClass}
              >
                <Library size={19} />
                <span>Library</span>
              </NavLink>

              <NavLink
                to="/locations?category=Canteen"
                onClick={() => setSidebarOpen(false)}
                className={sidebarClass}
              >
                <Utensils size={19} />
                <span>Canteen</span>
              </NavLink>

              <NavLink
                to="/locations?category=Gate"
                onClick={() => setSidebarOpen(false)}
                className={sidebarClass}
              >
                <DoorOpen size={19} />
                <span>Main Gate</span>
              </NavLink>

            </nav>

          </div>

          {/* Admin */}
          <div className="mt-auto border-t border-slate-100 pt-4">

            <NavLink
              to="/admin"
              onClick={() => setSidebarOpen(false)}
              className={sidebarClass}
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