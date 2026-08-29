import { useMemo, useState } from "react";
import {
  Building2,
  Library,
  Utensils,
  DoorOpen,
  MapPin,
  Computer,
  Home,
  Store,
  School,
  Building,
} from "lucide-react";
import LocationPreviewModal from "../location/LocationPreviewModal";

const getIcon = (category) => {
  switch (category?.toLowerCase()) {
    case "library":
      return Library;
    case "canteen":
      return Utensils;
    case "gate":
      return DoorOpen;
    case "computer":
    case "lab":
      return Computer;
    case "department":
    case "admin":
    case "medical college":
    case "academic":
      return Building2;
    case "office":
    case "hod office":
      return Building;
    case "shop":
      return Store;
    case "school":
      return School;
    case "guest house":
      return Home;
    default:
      return MapPin;
  }
};

const getLocationColor = (category) => {
  switch (category?.toLowerCase()) {
    case "library":
      return "#7c3aed";
    case "canteen":
      return "#ea580c";
    case "gate":
      return "#16a34a";
    case "department":
    case "academic":
      return "#2563eb";
    case "admin":
      return "#0891b2";
    case "lab":
    case "computer":
      return "#db2777";
    case "hod office":
    case "office":
      return "#4f46e5";
    default:
      return "#475569";
  }
};

const CampusMap = ({
  locations = [],
  routes = [],
  selectedLocation,
  onLocationClick,
}) => {
  const [previewLocation, setPreviewLocation] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const activeLocations = useMemo(
    () => locations.filter((location) => location.isActive !== false),
    [locations]
  );
  
  const activeRoutes = useMemo(
    () => routes.filter((route) => route.isActive !== false),
    [routes]
  );

  const handleLocationClick = (location) => {
    setPreviewLocation(location);
    setIsPreviewOpen(true);
    if (onLocationClick) {
      onLocationClick(location);
    }
  };

  return (
    <div className="relative h-full w-full overflow-hidden rounded-3xl border border-slate-200/80 bg-slate-50/50 shadow-inner">

      {/* Map Header Badge */}
      <div className="absolute left-5 top-5 z-20 flex items-center gap-3 rounded-2xl border border-slate-200/60 bg-white/90 px-4 py-3 shadow-xl backdrop-blur-md transition-all">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 shadow-sm">
          <Building2 size={18} />
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
            Interactive Campus & Indoor Map
          </p>
          <p className="text-xs font-bold text-slate-800 sm:text-sm">
            Ramchandra Chandravanshi University
          </p>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="h-full w-full overflow-auto cursor-grab active:cursor-grabbing">
        <svg
          viewBox="0 0 1400 1300"
          className="h-full min-h-[600px] min-w-[900px] w-full select-none"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Background */}
          <rect width="1400" height="1300" fill="#f8fafc" />

          {/* Campus Outer Boundary */}
          <rect
            x="35"
            y="35"
            width="1330"
            height="1230"
            rx="40"
            fill="#f1f5f9"
            stroke="#e2e8f0"
            strokeWidth="3"
          />

          <rect
            x="60"
            y="60"
            width="1280"
            height="1180"
            rx="30"
            fill="#ecfdf5"
            stroke="#d1fae5"
            strokeWidth="2"
          />

          {/* ========================================= */}
          // RCIT INDOOR BUILDING ZONE (Bada Zone)
          // =========================================
          <g transform="translate(500, 850)">
            <rect
              x="-180"
              y="-120"
              width="550"
              height="340"
              rx="24"
              fill="#ffffff"
              stroke="#cbd5e1"
              strokeWidth="4"
              style={{ filter: "drop-shadow(0px 10px 25px rgba(0,0,0,0.08))" }}
            />
            <text
              x="-155"
              y="-90"
              fontSize="13"
              fontWeight="800"
              fill="#64748b"
              letterSpacing="1.5"
            >
              RCIT BUILDING (INDOOR LAYOUT)
            </text>

            {/* Indoor Floor Layout Grid lines */}
            <line x1="-180" y1="-70" x2="370" y2="-70" stroke="#f1f5f9" strokeWidth="2" strokeDasharray="6 6" />
            <line x1="90" y1="-70" x2="90" y2="220" stroke="#f1f5f9" strokeWidth="2" strokeDasharray="6 6" />
            
            <text x="-155" y="-45" fontSize="10" fontWeight="600" fill="#94a3b8">Ground Floor & Labs Area</text>
            <text x="110" y="-45" fontSize="10" fontWeight="600" fill="#94a3b8">First Floor & HOD Cabins</text>
          </g>

          {/* Dynamic Roads & Paths */}
          <g fill="none" stroke="#cbd5e1" strokeWidth="38" strokeLinecap="round" strokeLinejoin="round">
            {activeRoutes.map((route) => {
              if (!route.from || !route.to) return null;
              return (
                <line
                  key={route._id}
                  x1={route.from.x}
                  y1={route.from.y}
                  x2={route.to.x}
                  y2={route.to.y}
                />
              );
            })}
          </g>

          {/* Road Center Dashed Lines */}
          <g fill="none" stroke="#ffffff" strokeWidth="2.5" strokeDasharray="12 12" strokeLinecap="round">
            {activeRoutes.map((route) => {
              if (!route.from || !route.to) return null;
              return (
                <line
                  key={`center-${route._id}`}
                  x1={route.from.x}
                  y1={route.from.y}
                  x2={route.to.x}
                  y2={route.to.y}
                />
              );
            })}
          </g>

          {/* Campus Watermark / Label */}
          <text
            x="700"
            y="1260"
            textAnchor="middle"
            fontSize="14"
            fontWeight="700"
            letterSpacing="2"
            fill="#94a3b8"
          >
            RAMCHANDRA CHANDRAVANSHI UNIVERSITY - CAMPUS & INDOOR MAP
          </text>

          {/* Locations */}
          {activeLocations.map((location) => {
            const Icon = getIcon(location.category);
            const color = getLocationColor(location.category);
            const isSelected = selectedLocation?._id === location._id;

            return (
              <g
                key={location._id}
                transform={`translate(${location.x}, ${location.y})`}
                onClick={() => handleLocationClick(location)}
                className="cursor-pointer group transition-transform duration-300"
              >
                {/* Selection Ring Animation */}
                {isSelected && (
                  <circle r="42" fill={color} opacity="0.15">
                    <animate attributeName="r" from="32" to="48" dur="1.8s" repeatCount="indefinite" />
                    <animate attributeName="opacity" from="0.3" to="0" dur="1.8s" repeatCount="indefinite" />
                  </circle>
                )}

                {/* Building Pin Card */}
                <rect
                  x="-26"
                  y="-26"
                  width="52"
                  height="52"
                  rx="14"
                  fill="white"
                  stroke={color}
                  strokeWidth={isSelected ? "3.5" : "2"}
                  className="transition-all duration-200 group-hover:scale-105"
                  style={{
                    filter: isSelected
                      ? `drop-shadow(0px 8px 16px ${color}40)`
                      : "drop-shadow(0px 4px 8px rgba(0,0,0,0.08))",
                  }}
                />

                {/* Icon Wrapper */}
                <foreignObject x="-13" y="-13" width="26" height="26">
                  <div
                    xmlns="http://www.w3.org/1999/xhtml"
                    className="flex h-6 w-6 items-center justify-center transition-transform group-hover:scale-110"
                    style={{ color }}
                  >
                    <Icon size={20} />
                  </div>
                </foreignObject>

                {/* Location Label Badge */}
                <g className="transition-opacity duration-200">
                  <rect
                    x="-65"
                    y="34"
                    width="130"
                    height="26"
                    rx="8"
                    fill="white"
                    stroke="#e2e8f0"
                    strokeWidth="1"
                    opacity="0.95"
                    style={{ filter: "drop-shadow(0px 2px 4px rgba(0,0,0,0.06))" }}
                  />
                  <text
                    x="0"
                    y="50"
                    textAnchor="middle"
                    fontSize="10"
                    fontWeight="600"
                    fill="#1e293b"
                  >
                    {location.name.length > 18
                      ? `${location.name.slice(0, 16)}...`
                      : location.name}
                  </text>
                </g>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Floating Location Count Badge */}
      <div className="absolute bottom-5 left-5 rounded-xl border border-slate-200/80 bg-white/90 px-3.5 py-2 text-xs font-semibold text-slate-600 shadow-md backdrop-blur-sm">
        <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 mr-2"></span>
        {activeLocations.length} Active Locations (Outdoor & Indoor)
      </div>

      {/* Location Preview Modal */}
      <LocationPreviewModal
        location={previewLocation}
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
      />
    </div>
  );
};

export default CampusMap;