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
} from "lucide-react";

const CAMPUS_ELEMENTS = [
  {
    type: "parking",
    label: "Parking",
    icon: Car,
    color: "#CBD5E1",
  },

  {
    type: "ground",
    label: "Ground",
    icon: Dumbbell,
    color: "#BBF7D0",
  },

  {
    type: "park",
    label: "Park",
    icon: Trees,
    color: "#86EFAC",
  },

  {
    type: "small-room",
    label: "Small Room",
    icon: DoorOpen,
    color: "#FDE68A",
  },
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
  setShowCampusElementModal,
}) => {
  /* =====================================================
      BUILDING SEARCH
  ===================================================== */

  const [buildingSearch, setBuildingSearch] = useState("");

  const filteredBuildings = useMemo(() => {
    const search = buildingSearch.trim().toLowerCase();

    if (!search) {
      return buildings;
    }

    return buildings.filter((building) => {
      const name = String(
        building?.name || ""
      ).toLowerCase();

      const type = String(
        building?.type || ""
      ).toLowerCase();

      return (
        name.includes(search) ||
        type.includes(search)
      );
    });
  }, [buildings, buildingSearch]);

  return (
    <div className="flex h-full flex-col">

      {/* HEADER */}
      <div className="border-b border-slate-200 p-4">
        <div className="flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
            <Building2
              size={20}
              className="text-blue-600"
            />
          </div>

          <div>
            <h2 className="font-bold text-slate-800">
              Campus Builder
            </h2>

            <p className="text-xs text-slate-400">
              Create campus layout
            </p>
          </div>

        </div>
      </div>

      {/* TOOLS */}
      <div className="border-b border-slate-200 p-4">

        <p className="mb-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Tools
        </p>

        <button
          type="button"
          onClick={() =>
            setActiveTool("select")
          }
          className={`mb-2 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold ${
            activeTool === "select"
              ? "bg-blue-600 text-white"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          <MousePointer2 size={17} />
          Select
        </button>

        <button
          type="button"
          onClick={() =>
            setShowBuildingModal(true)
          }
          className="mb-2 flex w-full items-center gap-3 rounded-lg bg-blue-50 px-3 py-2.5 text-sm font-semibold text-blue-700 hover:bg-blue-100"
        >
          <Plus size={17} />
          Add Building
        </button>

        <button
          type="button"
          onClick={() =>
            setShowRoadModal(true)
          }
          className="flex w-full items-center gap-3 rounded-lg bg-slate-100 px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-200"
        >
          <Route size={17} />
          Add Road
        </button>

      </div>

      {/* CAMPUS ELEMENTS */}
      <div className="border-b border-slate-200 p-4">

        <div className="mb-3 flex items-center justify-between">

          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Campus Areas
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Click then click map
            </p>
          </div>

        </div>

        <div className="grid grid-cols-2 gap-2">

          {CAMPUS_ELEMENTS.map(
            (item) => {
              const Icon = item.icon;

              const active =
                activeTool ===
                item.type;

              return (
                <button
                  key={item.type}
                  type="button"
                  onClick={() => {
                    setActiveTool(
                      item.type
                    );
                  }}
                  className={`flex flex-col items-center justify-center gap-1.5 rounded-xl border p-3 text-xs font-semibold transition ${
                    active
                      ? "border-blue-500 bg-blue-50 text-blue-700 ring-2 ring-blue-100"
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <Icon
                    size={21}
                  />

                  {item.label}
                </button>
              );
            }
          )}

        </div>

      </div>

      {/* BUILDINGS */}
      <div className="flex-1 overflow-y-auto p-4">

        <div className="mb-3 flex items-center justify-between">

          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Buildings
          </p>

          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500">
            {buildings.length}
          </span>

        </div>

        {/* =====================================================
            BUILDING SEARCH
        ===================================================== */}

        <div className="relative mb-3">

          <input
            type="text"
            value={buildingSearch}
            onChange={(e) =>
              setBuildingSearch(
                e.target.value
              )
            }
            placeholder="Search building..."
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 pr-9 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
          />

          {buildingSearch && (
            <button
              type="button"
              onClick={() =>
                setBuildingSearch("")
              }
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md px-2 py-1 text-sm font-semibold text-slate-400 hover:bg-slate-200 hover:text-slate-600"
              title="Clear search"
            >
              ×
            </button>
          )}

        </div>

        {buildingLoading ? (
          <div className="py-6 text-center text-xs text-slate-400">
            Loading buildings...
          </div>
        ) : buildings.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 p-4 text-center text-xs text-slate-400">
            No buildings yet.
          </div>
        ) : filteredBuildings.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 p-4 text-center text-xs text-slate-400">
            No buildings found.
          </div>
        ) : (
          <div className="space-y-2">

            {filteredBuildings.map(
              (building) => {

                const selected =
                  selectedBuilding?._id ===
                  building._id;

                return (
                  <div
                    key={building._id}
                    className={`rounded-xl border p-3 transition ${
                      selected
                        ? "border-blue-400 bg-blue-50"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >

                    <button
                      type="button"
                      onClick={() =>
                        handleBuildingSelect(
                          building
                        )
                      }
                      className="flex w-full items-center gap-3 text-left"
                    >

                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-100">
                        <Building2
                          size={17}
                          className="text-blue-600"
                        />
                      </div>

                      <div className="min-w-0 flex-1">

                        <p className="truncate text-sm font-semibold text-slate-800">
                          {building.name}
                        </p>

                        <p className="text-[10px] capitalize text-slate-400">
                          {building.type ||
                            "academic"}
                        </p>

                      </div>

                    </button>

                    {selected && (
                      <button
                        type="button"
                        onClick={() =>
                          handleOpenBuilding(
                            building
                          )
                        }
                        className="mt-2 w-full rounded-lg bg-blue-600 py-2 text-xs font-semibold text-white hover:bg-blue-700"
                      >
                        Open Floors
                      </button>
                    )}

                  </div>
                );
              }
            )}

          </div>
        )}

      </div>

      {/* =====================================================
          BUILDING ROTATION
      ===================================================== */}

      {selectedBuilding && (
        <div className="border-b border-slate-200 p-4">

          <div className="mb-3 flex items-center justify-between">

            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Building Rotation
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Rotate selected building
              </p>
            </div>

            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-600">
              {Number(
                selectedBuilding.rotation || 0
              )}°
            </span>

          </div>

          <div className="grid grid-cols-3 gap-2">

            {/* ROTATE LEFT */}

            <button
              type="button"
              onClick={() =>
                handleBuildingRotation?.(
                  -15
                )
              }
              title="Rotate left 15°"
              className="flex items-center justify-center rounded-lg border border-slate-200 bg-white p-2.5 text-slate-600 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600"
            >
              <RotateCcw size={18} />
            </button>

            {/* RESET */}

            <button
              type="button"
              onClick={() =>
                handleBuildingRotation?.(
                  0,
                  true
                )
              }
              title="Reset rotation"
              className="rounded-lg border border-slate-200 bg-slate-100 p-2.5 text-xs font-bold text-slate-600 transition hover:bg-slate-200"
            >
              Reset
            </button>

            {/* ROTATE RIGHT */}

            <button
              type="button"
              onClick={() =>
                handleBuildingRotation?.(
                  15
                )
              }
              title="Rotate right 15°"
              className="flex items-center justify-center rounded-lg border border-slate-200 bg-white p-2.5 text-slate-600 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600"
            >
              <RotateCw size={18} />
            </button>

          </div>

        </div>
      )}

    </div>
  );
};

export default CampusSidebar;