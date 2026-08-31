
import React from "react";
import {
  Building2,
  Layers3,
  Save,
} from "lucide-react";

const BuildingProperties = ({
  selectedBuilding,
  handleBuildingSelect,
  handleBuildingPositionChange,
  handleBuildingDimensionChange,
}) => {
  if (!selectedBuilding) {
    return (
      <div className="p-5">
        <div className="text-sm text-slate-500 text-center py-10">
          Select a building to view properties
        </div>
      </div>
    );
  }

  const position = selectedBuilding.position || {};
  const dimensions = selectedBuilding.dimensions || {};

  const x = Number(position.x ?? 0);
  const y = Number(position.y ?? 0);

  const width = Number(dimensions.width ?? 250);
  const height = Number(dimensions.height ?? 180);
  const depth = Number(dimensions.depth ?? 180);

  return (
    <div className="p-5 space-y-5 overflow-y-auto">

      {/* =====================================================
          BUILDING HEADER
      ===================================================== */}
      <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
        <div className="flex items-center gap-3">

          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
            <Building2
              size={22}
              className="text-blue-600"
            />
          </div>

          <div className="min-w-0">
            <div className="font-bold text-slate-800 truncate">
              {selectedBuilding.name}
            </div>

            <div className="text-xs text-slate-500">
              Building
            </div>
          </div>

        </div>
      </div>

      {/* =====================================================
          POSITION
      ===================================================== */}
      <div>
        <div className="text-sm font-bold text-slate-800 mb-3">
          Position
        </div>

        <div className="grid grid-cols-2 gap-3">

          {/* X */}
          <div>
            <label className="text-xs font-semibold text-slate-500">
              X Position
            </label>

            <input
              type="number"
              value={x}
              onChange={(e) =>
                handleBuildingPositionChange?.(
                  "x",
                  e.target.value
                )
              }
              className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Y */}
          <div>
            <label className="text-xs font-semibold text-slate-500">
              Y Position
            </label>

            <input
              type="number"
              value={y}
              onChange={(e) =>
                handleBuildingPositionChange?.(
                  "y",
                  e.target.value
                )
              }
              className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

        </div>
      </div>

      {/* =====================================================
          DIMENSIONS
      ===================================================== */}
      <div>

        <div className="flex items-center justify-between mb-3">
          <div className="text-sm font-bold text-slate-800">
            Building Dimensions
          </div>

          <div className="text-[10px] text-slate-400">
            SVG / 3D Size
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">

          {/* WIDTH */}
          <div>
            <label className="text-xs font-semibold text-slate-500">
              Width
            </label>

            <input
              type="number"
              min="20"
              step="10"
              value={width}
              onChange={(e) =>
                handleBuildingDimensionChange?.(
                  "width",
                  e.target.value
                )
              }
              className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* DEPTH */}
          <div>
            <label className="text-xs font-semibold text-slate-500">
              Depth
            </label>

            <input
              type="number"
              min="20"
              step="10"
              value={depth}
              onChange={(e) =>
                handleBuildingDimensionChange?.(
                  "depth",
                  e.target.value
                )
              }
              className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* HEIGHT */}
          <div className="col-span-2">
            <label className="text-xs font-semibold text-slate-500">
              Height
            </label>

            <input
              type="number"
              min="20"
              step="10"
              value={height}
              onChange={(e) =>
                handleBuildingDimensionChange?.(
                  "height",
                  e.target.value
                )
              }
              className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

        </div>

        <div className="mt-2 text-[11px] text-slate-400">
          Width = horizontal size, Depth = front/back size,
          Height = vertical 3D size.
        </div>

      </div>

      {/* =====================================================
          CURRENT SIZE PREVIEW
      ===================================================== */}
      <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">

        <div className="text-xs font-semibold text-slate-500 mb-2">
          Current Size
        </div>

        <div className="grid grid-cols-3 gap-2 text-center">

          <div>
            <div className="text-xs text-slate-400">
              W
            </div>

            <div className="font-bold text-slate-700">
              {width}
            </div>
          </div>

          <div>
            <div className="text-xs text-slate-400">
              D
            </div>

            <div className="font-bold text-slate-700">
              {depth}
            </div>
          </div>

          <div>
            <div className="text-xs text-slate-400">
              H
            </div>

            <div className="font-bold text-slate-700">
              {height}
            </div>
          </div>

        </div>
      </div>

      {/* =====================================================
          OPEN FLOORS
      ===================================================== */}
      <button
        type="button"
        onClick={() =>
          handleBuildingSelect?.(selectedBuilding)
        }
        className="w-full py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition"
      >
        <Layers3 size={17} />
        Open Building Floors
      </button>

    </div>
  );
};

export default BuildingProperties;

