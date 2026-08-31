import React from "react";

const FloorModal = ({
  show,
  floorForm,
  setFloorForm,
  handleCreateFloor,
  setShowFloorModal,
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[500]">
      <form
        onSubmit={handleCreateFloor}
        className="bg-white w-[500px] rounded-2xl shadow-2xl p-6"
      >
        <h2 className="text-xl font-bold mb-5">
          Create Floor
        </h2>

        <div className="space-y-4">
          <input
            required
            placeholder="Floor Name"
            value={floorForm.name}
            onChange={(e) =>
              setFloorForm({
                ...floorForm,
                name: e.target.value,
              })
            }
            className="w-full px-4 py-3 border rounded-lg"
          />

          <div className="grid grid-cols-3 gap-3">
            <input
              type="number"
              placeholder="Floor No."
              value={floorForm.floorNumber}
              onChange={(e) =>
                setFloorForm({
                  ...floorForm,
                  floorNumber:
                    e.target.value,
                })
              }
              className="px-3 py-2 border rounded-lg"
            />

            <input
              type="number"
              placeholder="Width"
              value={floorForm.width}
              onChange={(e) =>
                setFloorForm({
                  ...floorForm,
                  width: e.target.value,
                })
              }
              className="px-3 py-2 border rounded-lg"
            />

            <input
              type="number"
              placeholder="Height"
              value={floorForm.height}
              onChange={(e) =>
                setFloorForm({
                  ...floorForm,
                  height: e.target.value,
                })
              }
              className="px-3 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="text-sm text-slate-500">
              Floor Height
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
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="text-sm text-slate-500">
              Background
            </label>

            <input
              type="color"
              value={
                floorForm.backgroundColor
              }
              onChange={(e) =>
                setFloorForm({
                  ...floorForm,
                  backgroundColor:
                    e.target.value,
                })
              }
              className="w-full h-10 mt-1"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={() =>
              setShowFloorModal(false)
            }
            className="px-5 py-2 border rounded-lg"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="px-5 py-2 bg-purple-600 text-white rounded-lg"
          >
            Create Floor
          </button>
        </div>
      </form>
    </div>
  );
};

export default FloorModal;