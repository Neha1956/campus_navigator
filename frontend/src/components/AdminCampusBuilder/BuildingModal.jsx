import React from "react";
import { Building2, X } from "lucide-react";

const BuildingModal = ({
  show,
  buildingForm,
  setBuildingForm,
  handleCreateBuilding,
  setShowBuildingModal,
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm transition-opacity">
      <form
        onSubmit={handleCreateBuilding}
        className="relative flex max-h-[90vh] w-full max-w-lg flex-col rounded-2xl bg-white shadow-2xl ring-1 ring-slate-200/80"
      >
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-100 p-5 sm:p-6">
          <div className="flex items-center gap-3.5">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 ring-4 ring-blue-50/50">
              <Building2 size={22} />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight text-slate-800 sm:text-xl">
                Create Building
              </h2>
              <p className="text-xs text-slate-400">
                Add a new building structure to campus layout
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowBuildingModal(false)}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          >
            <X size={18} />
          </button>
        </div>

        {/* BODY */}
        <div className="flex-1 space-y-4 overflow-y-auto p-5 sm:p-6">
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-600">
              Building Name <span className="text-rose-500">*</span>
            </label>
            <input
              required
              placeholder="e.g. Science Block, Academic Core"
              value={buildingForm.name}
              onChange={(e) =>
                setBuildingForm({
                  ...buildingForm,
                  name: e.target.value,
                })
              }
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-600">
              Description
            </label>
            <textarea
              rows={3}
              placeholder="Brief details or department information..."
              value={buildingForm.description}
              onChange={(e) =>
                setBuildingForm({
                  ...buildingForm,
                  description: e.target.value,
                })
              }
              className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
            />
          </div>

          {/* DIMENSIONS */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
              Dimensions (px)
            </label>
            <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
              {["width", "depth", "height"].map((field) => (
                <div key={field} className="rounded-xl border border-slate-200 bg-slate-50/50 p-2">
                  <span className="block text-[10px] font-bold uppercase text-slate-400">
                    {field}
                  </span>
                  <input
                    type="number"
                    value={buildingForm[field]}
                    onChange={(e) =>
                      setBuildingForm({
                        ...buildingForm,
                        [field]: e.target.value,
                      })
                    }
                    className="w-full bg-transparent font-mono text-sm font-semibold text-slate-700 outline-none"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* COORDINATES */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
              Coordinates
            </label>
            <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
              <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-2">
                <span className="block text-[10px] font-bold uppercase text-slate-400">
                  Campus X
                </span>
                <input
                  type="number"
                  value={buildingForm.x}
                  onChange={(e) =>
                    setBuildingForm({
                      ...buildingForm,
                      x: e.target.value,
                    })
                  }
                  className="w-full bg-transparent font-mono text-sm font-semibold text-slate-700 outline-none"
                />
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-2">
                <span className="block text-[10px] font-bold uppercase text-slate-400">
                  Campus Y
                </span>
                <input
                  type="number"
                  value={buildingForm.y}
                  onChange={(e) =>
                    setBuildingForm({
                      ...buildingForm,
                      y: e.target.value,
                    })
                  }
                  className="w-full bg-transparent font-mono text-sm font-semibold text-slate-700 outline-none"
                />
              </div>
            </div>
          </div>

          {/* COLOR */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-600">
              Accent Theme Color
            </label>
            <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-2.5">
              <input
                type="color"
                value={buildingForm.color}
                onChange={(e) =>
                  setBuildingForm({
                    ...buildingForm,
                    color: e.target.value,
                  })
                }
                className="h-9 w-12 cursor-pointer rounded-lg border-0 bg-transparent p-0"
              />
              <span className="font-mono text-xs font-medium uppercase text-slate-600">
                {buildingForm.color}
              </span>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex items-center justify-end gap-3 border-t border-slate-100 p-4 sm:p-5">
          <button
            type="button"
            onClick={() => setShowBuildingModal(false)}
            className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 active:scale-95 sm:text-sm"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="rounded-xl bg-blue-600 px-5 py-2 text-xs font-semibold text-white shadow-sm shadow-blue-500/20 transition hover:bg-blue-700 active:scale-95 sm:text-sm"
          >
            Create Building
          </button>
        </div>
      </form>
    </div>
  );
};

export default BuildingModal;