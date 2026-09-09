import React from "react";
import {
  Building2,
  Layers3,
  Plus,
  ArrowLeft,
  X,
  Trash2,
} from "lucide-react";
import { ELEMENT_TYPES } from "./constants";

const FloorSidebar = ({
  currentBuilding,
  floors = [],
  currentFloor,
  setShowFloorModal,
  handleBackToCampus,
  handleFloorSelect,
  activeTool,
  setActiveTool,
  handleDeleteFloor,
  onCloseMobile,
}) => {
  return (
    <div className="flex h-full flex-col bg-white">
      {/* HEADER */}
      <div className="border-b border-slate-100 p-4">
        <div className="flex items-center justify-between mb-3">
          <button
            type="button"
            onClick={handleBackToCampus}
            className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50/70 hover:bg-blue-100 transition"
          >
            <ArrowLeft size={14} /> Back to Campus
          </button>

          {onCloseMobile && (
            <button
              type="button"
              onClick={onCloseMobile}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 lg:hidden"
            >
              <X size={18} />
            </button>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 ring-4 ring-blue-50/50">
            <Building2 size={20} />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="truncate font-bold text-slate-800">
              {currentBuilding?.name || "Building Editor"}
            </h2>
            <p className="text-[11px] text-slate-400 truncate">
              Floor Architecture Plan
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 space-y-5 overflow-y-auto p-4 custom-scrollbar">
        {/* FLOORS LIST */}
        <div>
          <div className="mb-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers3 size={16} className="text-purple-600" />
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Floor Plans
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowFloorModal(true)}
              disabled={!currentBuilding}
              className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-600 text-white shadow-sm shadow-purple-500/30 transition hover:bg-purple-700 disabled:opacity-50"
              title="Add new floor"
            >
              <Plus size={15} />
            </button>
          </div>

          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-0.5 custom-scrollbar">
            {floors.map((floor) => {
              const active = currentFloor?._id === floor._id;
              return (
                <div
                  key={floor._id}
                  className={`flex items-center justify-between rounded-xl border p-2.5 transition ${
                    active
                      ? "border-purple-300 bg-purple-50/70 shadow-sm"
                      : "border-slate-100 bg-white hover:border-slate-200"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => handleFloorSelect(floor)}
                    className="min-w-0 flex-1 text-left"
                  >
                    <div className="truncate text-xs font-semibold text-slate-800">
                      {floor.name}
                    </div>
                    <div className="text-[10px] text-slate-400 font-medium">
                      Floor {floor.floorNumber}
                    </div>
                  </button>

                  {handleDeleteFloor && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteFloor(floor);
                      }}
                      className="ml-2 rounded-lg p-1.5 text-slate-300 hover:bg-rose-50 hover:text-rose-600 transition"
                      title="Delete Floor"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              );
            })}

            {floors.length === 0 && (
              <p className="rounded-xl border border-dashed border-slate-200 py-4 text-center text-xs text-slate-400">
                No floors created yet
              </p>
            )}
          </div>
        </div>

        {/* ADD ELEMENTS */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Floor Elements
            </p>
            <span className="text-[10px] text-slate-400">Tap to place</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {ELEMENT_TYPES.map((item) => {
              const Icon = item.icon;
              const active = activeTool === item.type;
              return (
                <button
                  key={item.type}
                  type="button"
                  disabled={!currentFloor}
                  onClick={() => setActiveTool(item.type)}
                  className={`flex flex-col items-center justify-center gap-1.5 rounded-xl border p-3 text-xs font-medium transition ${
                    active
                      ? "border-blue-500 bg-blue-50/70 text-blue-700 ring-2 ring-blue-500/10"
                      : "border-slate-100 bg-slate-50/60 text-slate-600 hover:border-slate-200 hover:bg-slate-100/70"
                  } disabled:opacity-40 disabled:pointer-events-none`}
                >
                  <Icon size={18} />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* HELPER HINT */}
        <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-3">
          <p className="text-xs leading-relaxed text-blue-800">
            <strong>Tip:</strong> Tap an element from above, then tap anywhere on the canvas to place it. Select an item to drag or resize.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FloorSidebar;