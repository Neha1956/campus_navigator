import React from "react";
import {
  Building2,
  Square,
  Box,
  Eye,
  EyeOff,
  Save,
  ChevronLeft,
} from "lucide-react";

const CampusHeader = ({
  editorMode,
  mapView,
  showGrid,
  setMapView,
  setShowGrid,
  handleBackToCampus,
  buildingsCount,
  roadsCount,
}) => {
  return (
    <header className="h-16 bg-slate-950 text-white flex items-center justify-between px-5 shadow-xl">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg">
          <Building2 size={22} />
        </div>

        <div>
          <h1 className="font-bold text-lg">
            Campus Map Builder
          </h1>

          <p className="text-xs text-slate-400">
            {editorMode === "campus"
              ? "Complete Campus Layout"
              : "Building Floor Editor"}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {editorMode === "floor" && (
          <button
            onClick={handleBackToCampus}
            className="px-3 py-2 rounded-lg text-sm bg-white/10 hover:bg-white/20 flex items-center gap-2"
          >
            <ChevronLeft size={16} />
            Campus
          </button>
        )}

        <button
          onClick={() => setMapView("2d")}
          className={`px-3 py-2 rounded-lg text-sm flex items-center gap-2 ${
            mapView === "2d"
              ? "bg-blue-600"
              : "bg-white/10 hover:bg-white/20"
          }`}
        >
          <Square size={16} />
          2D
        </button>

        <button
          onClick={() => setMapView("3d")}
          className={`px-3 py-2 rounded-lg text-sm flex items-center gap-2 ${
            mapView === "3d"
              ? "bg-blue-600"
              : "bg-white/10 hover:bg-white/20"
          }`}
        >
          <Box size={16} />
          3D
        </button>

        <button
          onClick={() => setShowGrid(!showGrid)}
          className="px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg"
        >
          {showGrid ? (
            <Eye size={17} />
          ) : (
            <EyeOff size={17} />
          )}
        </button>

        <button
          onClick={() => {
            alert(
              "Buildings and floor elements are saved through the database. Campus roads are currently saved locally."
            );
          }}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-sm flex items-center gap-2"
        >
          <Save size={16} />
          Save Map
        </button>
      </div>
    </header>
  );
};

export default CampusHeader;