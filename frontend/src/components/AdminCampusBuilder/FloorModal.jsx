import React from "react";
import { Layers3, X } from "lucide-react";

const FloorModal = ({
  show,
  floorForm,
  setFloorForm,
  handleCreateFloor,
  setShowFloorModal,
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm transition-opacity">
      <form
        onSubmit={handleCreateFloor}
        className="relative flex max-h-[90vh] w-full max-w-md flex-col rounded-2xl bg-white shadow-2xl ring-1 ring-slate-200/80"
      >
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-100 p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-purple-600 ring-4 ring-purple-50/50">
              <Layers3 size={22} />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight text-slate-800 sm:text-xl">
                Create Floor
              </h2>
              <p className="text-xs text-slate-400">
                Add level plan to the active building
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowFloorModal(false)}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          >
            <X size={18} />
          </button>
        </div>

        {/* BODY */}
        <div className="flex-1 space-y-4 overflow-y-auto p-5 sm:p-6 custom-scrollbar">
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-600">
              Floor Name <span className="text-rose-500">*</span>
            </label>
            <input
              required
              placeholder="e.g. Ground Floor, 1st Floor"
              value={floorForm.name}
              onChange={(e) =>
                setFloorForm({
                  ...floorForm,
                  name: e.target.value,
                })
              }
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-purple-500 focus:bg-white focus:ring-4 focus:ring-purple-500/10"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
              Floor Metrics
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-2">
                <span className="block text-[10px] font-bold uppercase text-slate-400">
                  Floor No.
                </span>
                <input
                  type="number"
                  value={floorForm.floorNumber}
                  onChange={(e) =>
                    setFloorForm({
                      ...floorForm,
                      floorNumber: e.target.value,
                    })
                  }
                  className="w-full bg-transparent font-mono text-sm font-semibold text-slate-700 outline-none"
                />
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-2">
                <span className="block text-[10px] font-bold uppercase text-slate-400">
                  Width (px)
                </span>
                <input
                  type="number"
                  value={floorForm.width}
                  onChange={(e) =>
                    setFloorForm({
                      ...floorForm,
                      width: e.target.value,
                    })
                  }
                  className="w-full bg-transparent font-mono text-sm font-semibold text-slate-700 outline-none"
                />
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-2">
                <span className="block text-[10px] font-bold uppercase text-slate-400">
                  Height (px)
                </span>
                <input
                  type="number"
                  value={floorForm.height}
                  onChange={(e) =>
                    setFloorForm({
                      ...floorForm,
                      height: e.target.value,
                    })
                  }
                  className="w-full bg-transparent font-mono text-sm font-semibold text-slate-700 outline-none"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-600">
              Elevation / Height (Z)
            </label>
            <input
              type="number"
              step="0.1"
              value={floorForm.heightZ}
              onChange={(e) =>
                setFloorForm({
                  ...floorForm,
                  heightZ: e.target.value,
                })
              }
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition focus:border-purple-500 focus:bg-white"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-600">
              Background Color
            </label>
            <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-2.5">
              <input
                type="color"
                value={floorForm.backgroundColor || "#F8FAFC"}
                onChange={(e) =>
                  setFloorForm({
                    ...floorForm,
                    backgroundColor: e.target.value,
                  })
                }
                className="h-8 w-12 cursor-pointer rounded-lg border-0 bg-transparent p-0"
              />
              <span className="font-mono text-xs font-medium uppercase text-slate-600">
                {floorForm.backgroundColor || "#F8FAFC"}
              </span>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex items-center justify-end gap-3 border-t border-slate-100 p-4 sm:p-5">
          <button
            type="button"
            onClick={() => setShowFloorModal(false)}
            className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 active:scale-95 sm:text-sm"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-xl bg-purple-600 px-5 py-2 text-xs font-semibold text-white shadow-sm shadow-purple-500/25 transition hover:bg-purple-700 active:scale-95 sm:text-sm"
          >
            Create Floor
          </button>
        </div>
      </form>
    </div>
  );
};

export default FloorModal;