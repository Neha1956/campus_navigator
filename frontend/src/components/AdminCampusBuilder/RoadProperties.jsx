import React from "react";

import {
  Route,
  Trash2,
  Save,
} from "lucide-react";

const RoadProperties = ({
  selectedRoad,
  updateRoad,
  deleteRoad,
}) => {
  if (!selectedRoad) {
    return null;
  }

  const handleChange = (
    field,
    value
  ) => {
    updateRoad(
      field,
      value
    );
  };

  const handleDelete = () => {
    if (!selectedRoad?._id) {
      return;
    }

    deleteRoad(
      selectedRoad._id
    );
  };

  return (
    <div className="p-5 space-y-5">

      {/* HEADER */}

      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
          <Route
            size={20}
            className="text-blue-600"
          />
        </div>

        <div>
          <h3 className="font-bold text-slate-800">
            Road Properties
          </h3>

          <p className="text-xs text-slate-400">
            Edit selected road
          </p>
        </div>
      </div>

      {/* NAME */}

      <div>
        <label className="block text-xs font-semibold text-slate-600 mb-2">
          Road Name
        </label>

        <input
          type="text"
          value={
            selectedRoad.name ||
            ""
          }
          onChange={(e) =>
            handleChange(
              "name",
              e.target.value
            )
          }
          className="w-full px-3 py-2.5 rounded-lg border border-slate-300 outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* TYPE */}

      <div>
        <label className="block text-xs font-semibold text-slate-600 mb-2">
          Road Type
        </label>

        <select
          value={
            selectedRoad.type ||
            "road"
          }
          onChange={(e) =>
            handleChange(
              "type",
              e.target.value
            )
          }
          className="w-full px-3 py-2.5 rounded-lg border border-slate-300 outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="road">
            Road
          </option>

          <option value="path">
            Path
          </option>

          <option value="walkway">
            Walkway
          </option>

          <option value="corridor">
            Corridor
          </option>

          <option value="entrance">
            Entrance
          </option>
        </select>
      </div>

      {/* WIDTH */}

      <div>
        <label className="block text-xs font-semibold text-slate-600 mb-2">
          Road Width
        </label>

        <input
          type="number"
          min="4"
          max="100"
          value={
            selectedRoad.width ||
            20
          }
          onChange={(e) =>
            handleChange(
              "width",
              Number(
                e.target.value
              )
            )
          }
          className="w-full px-3 py-2.5 rounded-lg border border-slate-300 outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* COLOR */}

      <div>
        <label className="block text-xs font-semibold text-slate-600 mb-2">
          Road Color
        </label>

        <div className="flex gap-2">
          <input
            type="color"
            value={
              selectedRoad.color ||
              "#64748B"
            }
            onChange={(e) =>
              handleChange(
                "color",
                e.target.value
              )
            }
            className="w-14 h-11 rounded-lg border border-slate-300 cursor-pointer"
          />

          <input
            type="text"
            value={
              selectedRoad.color ||
              "#64748B"
            }
            onChange={(e) =>
              handleChange(
                "color",
                e.target.value
              )
            }
            className="flex-1 px-3 py-2.5 rounded-lg border border-slate-300"
          />
        </div>
      </div>

      {/* DISTANCE */}

      <div>
        <label className="block text-xs font-semibold text-slate-600 mb-2">
          Distance
        </label>

        <input
          type="number"
          min="0"
          value={
            selectedRoad.distance ||
            0
          }
          onChange={(e) =>
            handleChange(
              "distance",
              Number(
                e.target.value
              )
            )
          }
          className="w-full px-3 py-2.5 rounded-lg border border-slate-300"
        />
      </div>

      {/* WALKING TIME */}

      <div>
        <label className="block text-xs font-semibold text-slate-600 mb-2">
          Walking Time (minutes)
        </label>

        <input
          type="number"
          min="0"
          value={
            selectedRoad.walkingTime ||
            0
          }
          onChange={(e) =>
            handleChange(
              "walkingTime",
              Number(
                e.target.value
              )
            )
          }
          className="w-full px-3 py-2.5 rounded-lg border border-slate-300"
        />
      </div>

      {/* BUILDINGS */}

      <div className="bg-slate-50 rounded-xl p-4 space-y-2">
        <div className="text-xs font-semibold text-slate-500">
          FROM
        </div>

        <div className="text-sm font-semibold text-slate-800">
          {selectedRoad.fromBuilding
            ?.name ||
            "Not connected"}
        </div>

        <div className="text-xs font-semibold text-slate-500 mt-3">
          TO
        </div>

        <div className="text-sm font-semibold text-slate-800">
          {selectedRoad.toBuilding
            ?.name ||
            "Not connected"}
        </div>
      </div>

      {/* POINTS */}

      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
        <div className="text-xs font-bold text-blue-700 mb-2">
          Road Points
        </div>

        <div className="text-xs text-blue-600">
          {selectedRoad.points
            ?.length || 0}{" "}
          points
        </div>

        <div className="text-[11px] text-blue-500 mt-1">
          Drag the road directly on
          the map to move it.
        </div>
      </div>

      {/* DELETE */}

      <button
        type="button"
        onClick={handleDelete}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 font-semibold"
      >
        <Trash2 size={17} />

        Delete Road
      </button>
    </div>
  );
};

export default RoadProperties;