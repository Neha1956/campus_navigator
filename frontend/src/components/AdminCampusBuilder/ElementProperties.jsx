import React from "react";
import {
  Save,
  MapPin,
  Trash2,
  RotateCw,
} from "lucide-react";

const ElementProperties = ({
  selectedElement,
  handlePropertyChange,
  handlePositionChange,
  handleDimensionChange,
  rotateElement,
  saveSelectedElement,
  handleAddAsLocation,
  handleDeleteElement,
  locationSaving,
}) => {
  return (
    <div className="p-5 space-y-5">
      <div>
        <label className="text-xs font-semibold text-slate-500">
          Name
        </label>

        <input
          value={selectedElement.name || ""}
          onChange={(e) =>
            handlePropertyChange(
              "name",
              e.target.value
            )
          }
          className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"
        />
      </div>

      <div>
        <label className="text-xs font-semibold text-slate-500">
          Type
        </label>

        <input
          value={selectedElement.type || ""}
          disabled
          className="w-full mt-1 px-3 py-2 border rounded-lg text-sm bg-slate-50"
        />
      </div>

      <div>
        <label className="text-xs font-semibold text-slate-500">
          Room Number
        </label>

        <input
          value={
            selectedElement.roomNumber || ""
          }
          onChange={(e) =>
            handlePropertyChange(
              "roomNumber",
              e.target.value
            )
          }
          placeholder="CSE-101"
          className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"
        />
      </div>

      <div>
        <h3 className="text-sm font-bold mb-2">
          Position
        </h3>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs text-slate-500">
              X
            </label>

            <input
              type="number"
              value={
                selectedElement.position?.x ||
                0
              }
              onChange={(e) =>
                handlePositionChange(
                  "x",
                  e.target.value
                )
              }
              className="w-full px-2 py-2 border rounded-lg text-sm"
            />
          </div>

          <div>
            <label className="text-xs text-slate-500">
              Y
            </label>

            <input
              type="number"
              value={
                selectedElement.position?.y ||
                0
              }
              onChange={(e) =>
                handlePositionChange(
                  "y",
                  e.target.value
                )
              }
              className="w-full px-2 py-2 border rounded-lg text-sm"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-bold mb-2">
          Size
        </h3>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs text-slate-500">
              Width
            </label>

            <input
              type="number"
              value={
                selectedElement.dimensions
                  ?.width || 100
              }
              onChange={(e) =>
                handleDimensionChange(
                  "width",
                  e.target.value
                )
              }
              className="w-full px-2 py-2 border rounded-lg text-sm"
            />
          </div>

          <div>
            <label className="text-xs text-slate-500">
              Height
            </label>

            <input
              type="number"
              value={
                selectedElement.dimensions
                  ?.height || 70
              }
              onChange={(e) =>
                handleDimensionChange(
                  "height",
                  e.target.value
                )
              }
              className="w-full px-2 py-2 border rounded-lg text-sm"
            />
          </div>
        </div>
      </div>

      <div>
        <label className="text-xs font-semibold text-slate-500">
          Rotation
        </label>

        <div className="flex gap-2 mt-1">
          <input
            type="number"
            value={
              selectedElement.rotation?.z || 0
            }
            onChange={(e) =>
              handlePropertyChange(
                "rotation",
                {
                  ...selectedElement.rotation,
                  z: Number(e.target.value),
                }
              )
            }
            className="flex-1 px-3 py-2 border rounded-lg text-sm"
          />

          <button
            onClick={rotateElement}
            className="px-3 border rounded-lg hover:bg-slate-50"
          >
            <RotateCw size={16} />
          </button>
        </div>
      </div>

      <div>
        <label className="text-xs font-semibold text-slate-500">
          Color
        </label>

        <input
          type="color"
          value={
            selectedElement.color || "#FFFFFF"
          }
          onChange={(e) =>
            handlePropertyChange(
              "color",
              e.target.value
            )
          }
          className="w-full h-10 mt-1 cursor-pointer"
        />
      </div>

      <div>
        <label className="text-xs font-semibold text-slate-500">
          Description
        </label>

        <textarea
          value={
            selectedElement.description || ""
          }
          onChange={(e) =>
            handlePropertyChange(
              "description",
              e.target.value
            )
          }
          rows={3}
          className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"
        />
      </div>

      <button
        onClick={saveSelectedElement}
        className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold flex items-center justify-center gap-2"
      >
        <Save size={16} />
        Update Element
      </button>

      <button
        onClick={handleAddAsLocation}
        disabled={locationSaving}
        className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white rounded-lg text-sm font-semibold flex items-center justify-center gap-2"
      >
        <MapPin size={16} />

        {locationSaving
          ? "Adding Location..."
          : "Add as Location"}
      </button>

      <button
        onClick={handleDeleteElement}
        className="w-full py-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-sm font-semibold flex items-center justify-center gap-2"
      >
        <Trash2 size={16} />
        Delete Element
      </button>
    </div>
  );
};

export default ElementProperties;