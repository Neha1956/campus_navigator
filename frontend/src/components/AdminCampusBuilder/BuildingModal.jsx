import React from "react";
import { Building2 } from "lucide-react";

const BuildingModal = ({
  show,
  buildingForm,
  setBuildingForm,
  handleCreateBuilding,
  setShowBuildingModal,
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[500]">
      <form
        onSubmit={handleCreateBuilding}
        className="bg-white w-[520px] rounded-2xl shadow-2xl p-6"
      >
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
            <Building2
              size={20}
              className="text-blue-600"
            />
          </div>

          <div>
            <h2 className="text-xl font-bold">
              Create Building
            </h2>

            <p className="text-xs text-slate-500">
              Add building to campus layout
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <input
            required
            placeholder="Building Name"
            value={buildingForm.name}
            onChange={(e) =>
              setBuildingForm({
                ...buildingForm,
                name: e.target.value,
              })
            }
            className="w-full px-4 py-3 border rounded-lg"
          />

          <textarea
            placeholder="Description"
            value={buildingForm.description}
            onChange={(e) =>
              setBuildingForm({
                ...buildingForm,
                description:
                  e.target.value,
              })
            }
            className="w-full px-4 py-3 border rounded-lg"
          />

          <div className="grid grid-cols-3 gap-3">
            {["width", "depth", "height"].map(
              (field) => (
                <div key={field}>
                  <label className="text-xs text-slate-500 capitalize">
                    {field}
                  </label>

                  <input
                    type="number"
                    value={
                      buildingForm[field]
                    }
                    onChange={(e) =>
                      setBuildingForm({
                        ...buildingForm,
                        [field]:
                          e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              )
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-500">
                Campus X
              </label>

              <input
                type="number"
                value={buildingForm.x}
                onChange={(e) =>
                  setBuildingForm({
                    ...buildingForm,
                    x: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="text-xs text-slate-500">
                Campus Y
              </label>

              <input
                type="number"
                value={buildingForm.y}
                onChange={(e) =>
                  setBuildingForm({
                    ...buildingForm,
                    y: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-slate-500">
              Building Color
            </label>

            <input
              type="color"
              value={buildingForm.color}
              onChange={(e) =>
                setBuildingForm({
                  ...buildingForm,
                  color: e.target.value,
                })
              }
              className="w-full h-12 mt-1"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={() =>
              setShowBuildingModal(false)
            }
            className="px-5 py-2 border rounded-lg"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="px-5 py-2 bg-blue-600 text-white rounded-lg"
          >
            Create Building
          </button>
        </div>
      </form>
    </div>
  );
};

export default BuildingModal;