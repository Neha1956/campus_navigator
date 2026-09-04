import {
  Menu,
  X,
  MapPinned,
  Navigation,
  Settings,
  LogOut,
} from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/slices/authSlice";

const Navbar = ({ sidebarOpen, setSidebarOpen }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/admin/login");
  };

  const navClass = ({ isActive }) =>
    `rounded-lg px-4 py-2 text-sm font-medium transition ${
      isActive
        ? "bg-blue-50 text-blue-600"
        : "text-slate-600 hover:bg-slate-100 hover:text-blue-600"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo + Mobile Menu */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="rounded-lg p-2 text-slate-700 hover:bg-slate-100 lg:hidden"
          >
            {sidebarOpen ? <X size={23} /> : <Menu size={23} />}
          </button>

          <NavLink to="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
              <MapPinned size={21} />
            </div>
            <div>
              <h1 className="text-sm font-bold text-slate-900 sm:text-base">
                Campus Navigator
              </h1>
              <p className="hidden text-[10px] text-slate-500 sm:block sm:text-xs">
                Ramchandra Chandravanshi University
              </p>
            </div>
          </NavLink>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 lg:flex">
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
            <span className="flex items-center gap-2">
              <Navigation size={16} />
              Directions
            </span>
          </NavLink>
        </nav>

        {/* Admin Section - Desktop */}
        {isAuthenticated ? (
          <div className="flex items-center gap-2">
            <NavLink
              to="/admin"
              className="hidden lg:flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-blue-50 hover:text-blue-600"
            >
              <Settings size={17} />
              <span>Dashboard</span>
            </NavLink>
            <button
              onClick={handleLogout}
              className="hidden lg:flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-red-700"
            >
              <LogOut size={17} />
              <span>Logout</span>
            </button>
          </div>
        ) : (
          <NavLink
            to="/admin/login"
            className={({ isActive }) =>
              `hidden lg:flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition ${
                isActive
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-slate-50 text-slate-700 border border-slate-200 hover:bg-blue-50 hover:text-blue-600"
              }`
            }
          >
            <Settings size={17} />
            <span>Admin Panel</span>
          </NavLink>
        )}
      </div>
    </header>
  );
};

export default Navbar;