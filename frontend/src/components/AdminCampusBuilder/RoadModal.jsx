import React from "react";
import { X, Route } from "lucide-react";

const RoadModal = ({
  show,
  buildings = [],
  roadForm,
  setRoadForm,
  handleCreateRoad,
  setShowRoadModal,
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
      <div className="flex max-h-[90vh] w-full max-w-lg flex-col rounded-2xl bg-white shadow-2xl ring-1 ring-slate-200/80">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-100 p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 ring-4 ring-blue-50/50">
              <Route size={22} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800 sm:text-xl">
                Create Pathway / Road
              </h2>
              <p className="text-xs text-slate-400">
                Connect campus buildings or lay free roads
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowRoadModal(false)}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* BODY */}
        <div className="flex-1 space-y-4 overflow-y-auto p-5 sm:p-6 custom-scrollbar">
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-600">
              Road / Pathway Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={roadForm.name}
              onChange={(e) =>
                setRoadForm({
                  ...roadForm,
                  name: e.target.value,
                })
              }
              placeholder="e.g. Main Boulevard, North Pathway"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-600">
              Road Classification
            </label>
            <select
              value={roadForm.type}
              onChange={(e) =>
                setRoadForm({
                  ...roadForm,
                  type: e.target.value,
                })
              }
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white"
            >
              <option value="road">Road</option>
              <option value="path">Path</option>
              <option value="walkway">Walkway</option>
              <option value="entrance">Entrance</option>
              <option value="corridor">Corridor</option>
            </select>
          </div>

          {/* BUILDING LINKS */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-600">
                From Building <span className="text-[10px] text-slate-400">(Optional)</span>
              </label>
              <select
                value={roadForm.fromBuilding || ""}
                onChange={(e) =>
                  setRoadForm({
                    ...roadForm,
                    fromBuilding: e.target.value,
                  })
                }
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white"
              >
                <option value="">-- Free Pathway --</option>
                {buildings.map((building) => (
                  <option key={building._id} value={building._id}>
                    {building.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-600">
                To Building <span className="text-[10px] text-slate-400">(Optional)</span>
              </label>
              <select
                value={roadForm.toBuilding || ""}
                onChange={(e) =>
                  setRoadForm({
                    ...roadForm,
                    toBuilding: e.target.value,
                  })
                }
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white"
              >
                <option value="">-- Free Pathway --</option>
                {buildings.map((building) => (
                  <option key={building._id} value={building._id}>
                    {building.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-600">
              Width (px)
            </label>
            <input
              type="number"
              min="5"
              value={roadForm.width}
              onChange={(e) =>
                setRoadForm({
                  ...roadForm,
                  width: Number(e.target.value),
                })
              }
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-600">
              Road Accent Color
            </label>
            <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-2.5">
              <input
                type="color"
                value={roadForm.color || "#64748B"}
                onChange={(e) =>
                  setRoadForm({
                    ...roadForm,
                    color: e.target.value,
                  })
                }
                className="h-8 w-12 cursor-pointer rounded-lg border-0 bg-transparent p-0"
              />
              <span className="font-mono text-xs font-medium uppercase text-slate-600">
                {roadForm.color || "#64748B"}
              </span>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex items-center justify-end gap-3 border-t border-slate-100 p-4 sm:p-5">
          <button
            type="button"
            onClick={() => setShowRoadModal(false)}
            className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 active:scale-95 sm:text-sm"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleCreateRoad}
            className="rounded-xl bg-blue-600 px-5 py-2 text-xs font-semibold text-white shadow-sm shadow-blue-500/25 transition hover:bg-blue-700 active:scale-95 sm:text-sm"
          >
            Create Road
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoadModal;