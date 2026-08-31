import React from "react";

import {
  Building2,
  Plus,
  MousePointer2,
  Car,
  Trees,
  Dumbbell,
  DoorOpen,
  Route,
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

  setShowCampusElementModal,
}) => {
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

        {buildingLoading ? (
          <div className="py-6 text-center text-xs text-slate-400">
            Loading buildings...
          </div>
        ) : buildings.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 p-4 text-center text-xs text-slate-400">
            No buildings yet.
          </div>
        ) : (
          <div className="space-y-2">

            {buildings.map(
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

    </div>
  );
};

export default CampusSidebar;