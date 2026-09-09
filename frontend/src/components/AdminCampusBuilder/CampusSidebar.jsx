import React, { useMemo, useState } from "react";
import {
  Building2,
  Plus,
  MousePointer2,
  Car,
  Trees,
  Dumbbell,
  DoorOpen,
  Route,
  RotateCcw,
  RotateCw,
  Waves,
  DoorClosed,
  Search,
  X,
} from "lucide-react";

const CAMPUS_ELEMENTS = [
  { type: "parking", label: "Parking", icon: Car },
  { type: "ground", label: "Ground", icon: Dumbbell },
  { type: "park", label: "Park", icon: Trees },
  { type: "small-room", label: "Room", icon: DoorOpen },
  { type: "pond", label: "Pond", icon: Waves },
  { type: "gate", label: "Gate", icon: DoorClosed },
];

const CampusSidebar = ({
  buildings = [],
  buildingLoading,
  selectedBuilding,
  activeTool,
  setActiveTool,
  setShowBuildingModal,
  setShowRoadModal,
  handleBuildingSelect,
  handleOpenBuilding,
  handleBuildingRotation,
  onCloseMobile,
}) => {
  const [buildingSearch, setBuildingSearch] = useState("");

  const filteredBuildings = useMemo(() => {
    const search = buildingSearch.trim().toLowerCase();
    if (!search) return buildings;

    return buildings.filter((building) => {
      const name = String(building?.name || "").toLowerCase();
      const type = String(building?.type || "").toLowerCase();
      return name.includes(search) || type.includes(search);
    });
  }, [buildings, buildingSearch]);

  return (
    <div className="flex h-full flex-col bg-white">
      {/* HEADER */}
      <div className="flex items-center justify-between border-b border-slate-100 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 ring-4 ring-blue-50/50">
            <Building2 size={20} />
          </div>
          <div>
            <h2 className="font-bold text-slate-800">Campus Builder</h2>
            <p className="text-[11px] text-slate-400">Layout & Architecture</p>
          </div>
        </div>

        {/* Mobile Close Button */}
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

      <div className="flex-1 space-y-5 overflow-y-auto p-4 custom-scrollbar">
        {/* PRIMARY ACTIONS */}
        <div>
          <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Editor Modes
          </p>
          <div className="space-y-1.5">
            <button
              type="button"
              onClick={() => setActiveTool("select")}
              className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold transition ${
                activeTool === "select"
                  ? "bg-blue-600 text-white shadow-sm shadow-blue-500/20"
                  : "bg-slate-50 text-slate-700 hover:bg-slate-100"
              }`}
            >
              <MousePointer2 size={16} />
              Select & Transform
            </button>

            <button
              type="button"
              onClick={() => setShowBuildingModal(true)}
              className="flex w-full items-center gap-3 rounded-xl bg-blue-50 px-3.5 py-2.5 text-xs font-semibold text-blue-700 transition hover:bg-blue-100 active:scale-[0.99]"
            >
              <Plus size={16} />
              Add Building
            </button>

            <button
              type="button"
              onClick={() => setShowRoadModal(true)}
              className="flex w-full items-center gap-3 rounded-xl bg-slate-50 px-3.5 py-2.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 active:scale-[0.99]"
            >
              <Route size={16} />
              Add Road / Pathway
            </button>
          </div>
        </div>

        {/* CAMPUS ELEMENTS */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Campus Areas
            </p>
            <span className="text-[10px] text-slate-400">Tap to place</span>
          </div>

          <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-2">
            {CAMPUS_ELEMENTS.map((item) => {
              const Icon = item.icon;
              const active = activeTool === item.type;
              return (
                <button
                  key={item.type}
                  type="button"
                  onClick={() => setActiveTool(item.type)}
                  className={`flex flex-col items-center justify-center gap-1 rounded-xl border p-2.5 text-[11px] font-medium transition ${
                    active
                      ? "border-blue-500 bg-blue-50/70 text-blue-700 ring-2 ring-blue-500/10"
                      : "border-slate-100 bg-slate-50/60 text-slate-600 hover:border-slate-200 hover:bg-slate-100/70"
                  }`}
                >
                  <Icon size={18} />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* BUILDINGS DIRECTORY */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Buildings Directory
            </p>
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500">
              {buildings.length}
            </span>
          </div>

          <div className="relative mb-2.5">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              value={buildingSearch}
              onChange={(e) => setBuildingSearch(e.target.value)}
              placeholder="Search buildings..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-7 text-xs text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white"
            />
            {buildingSearch && (
              <button
                type="button"
                onClick={() => setBuildingSearch("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X size={12} />
              </button>
            )}
          </div>

          <div className="space-y-1.5 max-h-52 overflow-y-auto pr-0.5 custom-scrollbar">
            {buildingLoading ? (
              <p className="py-4 text-center text-xs text-slate-400">Loading...</p>
            ) : filteredBuildings.length === 0 ? (
              <p className="rounded-xl border border-dashed border-slate-200 py-4 text-center text-xs text-slate-400">
                No buildings found
              </p>
            ) : (
              filteredBuildings.map((building) => {
                const selected = selectedBuilding?._id === building._id;
                return (
                  <div
                    key={building._id}
                    className={`rounded-xl border p-2.5 transition ${
                      selected
                        ? "border-blue-300 bg-blue-50/70 shadow-sm"
                        : "border-slate-100 bg-white hover:border-slate-200"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => handleBuildingSelect(building)}
                      className="flex w-full items-center gap-2.5 text-left"
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-100/60 text-blue-600">
                        <Building2 size={15} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-semibold text-slate-800">
                          {building.name}
                        </p>
                        <p className="text-[10px] capitalize text-slate-400">
                          {building.type || "academic"}
                        </p>
                      </div>
                    </button>

                    {selected && (
                      <button
                        type="button"
                        onClick={() => handleOpenBuilding(building)}
                        className="mt-2 w-full rounded-lg bg-blue-600 py-1.5 text-[11px] font-semibold text-white shadow-sm transition hover:bg-blue-700"
                      >
                        Open Floors
                      </button>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* ROTATION CONTROLS */}
        {selectedBuilding && (
          <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3">
            <div className="mb-2.5 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Orientation
                </p>
                <span className="text-[10px] text-slate-400">Selected Block</span>
              </div>
              <span className="rounded-md bg-white px-2 py-0.5 font-mono text-[10px] font-bold text-slate-700 shadow-sm border border-slate-200">
                {Number(selectedBuilding.rotation || 0)}°
              </span>
            </div>

            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => handleBuildingRotation?.(-15)}
                className="flex items-center justify-center rounded-lg border border-slate-200 bg-white py-2 text-slate-600 hover:bg-slate-50"
                title="-15°"
              >
                <RotateCcw size={15} />
              </button>
              <button
                type="button"
                onClick={() => handleBuildingRotation?.(0, true)}
                className="rounded-lg border border-slate-200 bg-white text-[11px] font-semibold text-slate-600 hover:bg-slate-50"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={() => handleBuildingRotation?.(15)}
                className="flex items-center justify-center rounded-lg border border-slate-200 bg-white py-2 text-slate-600 hover:bg-slate-50"
                title="+15°"
              >
                <RotateCw size={15} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CampusSidebar;