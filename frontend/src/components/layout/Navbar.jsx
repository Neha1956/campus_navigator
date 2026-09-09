import {
  Menu,
  X,
  Navigation,
  Settings,
  LogOut,
  MapPin,
  Sparkles,
} from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/slices/authSlice";

// Assets se university logo import
import universityLogo from "../../assets/universitylogo1.png";

const Navbar = ({ sidebarOpen, setSidebarOpen }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/admin/login");
  };

  const navClass = ({ isActive }) =>
    `relative px-4 py-2.5 text-sm font-bold rounded-xl transition-all duration-250 flex items-center gap-2 ${
      isActive
        ? "bg-blue-50 text-blue-600 shadow-sm shadow-blue-500/15 ring-1 ring-blue-200/80"
        : "text-slate-600 hover:bg-slate-50 hover:text-blue-600 hover:shadow-sm"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/90 bg-white/95 backdrop-blur-xl transition-all shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]">
      <div className="mx-auto flex h-20 max-w-[1600px] items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* LOGO & BRAND */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            type="button"
            aria-label="Toggle navigation menu"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="flex h-11 w-11 items-center justify-center rounded-xl text-slate-700 hover:bg-blue-50 hover:text-blue-600 active:scale-95 transition border border-transparent hover:border-blue-100 lg:hidden"
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <NavLink to="/" className="group flex items-center gap-3.5 select-none">
            {/* Highlighted Big University Logo */}
            <div className="relative flex h-13 w-13 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-2xl bg-white p-1.5 shadow-[0_8px_20px_-4px_rgba(37,99,235,0.22)] ring-2 ring-blue-500/25 transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_10px_25px_-3px_rgba(37,99,235,0.35)] group-hover:ring-blue-500">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-blue-500/10 via-transparent to-cyan-400/15 pointer-events-none" />
              <img
                src={universityLogo}
                alt="University Logo"
                className="h-full w-full object-contain filter drop-shadow-sm transition-transform duration-300 group-hover:scale-105"
              />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
                  Campus Navigator
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-white shadow-sm shadow-blue-500/30">
                  <Sparkles size={11} className="text-cyan-200" />
                  Live 3D
                </span>
              </div>
              <p className="hidden text-xs font-semibold text-slate-500 sm:block tracking-wide truncate max-w-[280px] md:max-w-none">
                Ramchandra Chandravanshi University
              </p>
            </div>
          </NavLink>
        </div>

        {/* DESKTOP NAVIGATION */}
        <nav className="hidden items-center gap-2 lg:flex bg-slate-50/80 p-1.5 rounded-2xl border border-slate-200/80 shadow-inner">
          <NavLink to="/" end className={navClass}>
            Home
          </NavLink>
          <NavLink to="/map" className={navClass}>
            Campus Map
          </NavLink>
          <NavLink to="/locations" className={navClass}>
            Locations
          </NavLink>
          <NavLink to="/directions" className={navClass}>
            <Navigation size={16} className="text-blue-600" />
            <span>Directions</span>
          </NavLink>
        </nav>

        {/* ADMIN ACTIONS */}
        <div className="flex items-center gap-2.5">
          {isAuthenticated ? (
            <div className="flex items-center gap-2.5">
              <NavLink
                to="/admin"
                className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 shadow-sm transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 active:scale-95 lg:flex"
              >
                <Settings size={16} />
                <span>Dashboard</span>
              </NavLink>
              <button
                type="button"
                onClick={handleLogout}
                className="hidden items-center gap-1.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-rose-500/25 transition hover:from-rose-700 hover:to-red-700 active:scale-95 lg:flex"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <NavLink
              to="/admin/login"
              className={({ isActive }) =>
                `hidden items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold transition-all shadow-md active:scale-95 lg:flex ${
                  isActive
                    ? "bg-blue-600 text-white shadow-blue-500/30 ring-2 ring-blue-400/50"
                    : "bg-slate-900 text-white shadow-slate-900/20 hover:bg-blue-600 hover:shadow-blue-500/30"
                }`
              }
            >
              <Settings size={16} />
              <span>Admin Panel</span>
            </NavLink>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;