import React from "react";
import {
  Building2,
  Layers3,
  Plus,
} from "lucide-react";

import { ELEMENT_TYPES } from "./constants";

const FloorSidebar = ({
  currentBuilding,
  floors,
  currentFloor,
  setShowFloorModal,
  handleBackToCampus,
  handleFloorSelect,
  activeTool,
  setActiveTool,
}) => {
  return (
    <>
      <div className="p-4 border-b border-slate-200">
        <button
          onClick={handleBackToCampus}
          className="text-xs text-blue-600 flex items-center gap-1 mb-3"
        >
          ← Back to Campus
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
            <Building2
              size={20}
              className="text-blue-600"
            />
          </div>

          <div>
            <h2 className="font-bold text-slate-800">
              {currentBuilding?.name}
            </h2>

            <p className="text-xs text-slate-500">
              Building Floor Editor
            </p>
          </div>
        </div>
      </div>

      <div className="p-4 border-b border-slate-200">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Layers3
              size={18}
              className="text-purple-600"
            />

            <h2 className="font-bold text-slate-800">
              Floors
            </h2>
          </div>

          <button
            onClick={() =>
              setShowFloorModal(true)
            }
            disabled={!currentBuilding}
            className="w-8 h-8 rounded-lg bg-purple-600 disabled:bg-slate-300 text-white flex items-center justify-center"
          >
            <Plus size={18} />
          </button>
        </div>

        <div className="space-y-2 max-h-52 overflow-y-auto">
          {floors.map((floor) => (
            <button
              key={floor._id}
              onClick={() =>
                handleFloorSelect(floor)
              }
              className={`w-full text-left p-3 rounded-lg border ${
                currentFloor?._id === floor._id
                  ? "bg-purple-50 border-purple-400 text-purple-700"
                  : "bg-slate-50 border-slate-200 hover:bg-slate-100"
              }`}
            >
              <div className="font-semibold text-sm">
                {floor.name}
              </div>

              <div className="text-xs text-slate-500">
                Floor {floor.floorNumber}
              </div>
            </button>
          ))}

          {floors.length === 0 && (
            <div className="text-xs text-slate-400 text-center py-4">
              No floors created.
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <h2 className="font-bold text-slate-800 mb-3">
          Add Elements
        </h2>

        <div className="grid grid-cols-2 gap-2">
          {ELEMENT_TYPES.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.type}
                disabled={!currentFloor}
                onClick={() =>
                  setActiveTool(item.type)
                }
                className={`p-3 rounded-lg border text-xs font-medium flex flex-col items-center gap-2 ${
                  activeTool === item.type
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-slate-200 bg-white hover:bg-slate-50"
                } disabled:opacity-40`}
              >
                <Icon size={19} />
                {item.label}
              </button>
            );
          })}
        </div>

        <div className="mt-5 p-3 bg-blue-50 rounded-xl border border-blue-100">
          <p className="text-xs text-blue-700 leading-5">
            <strong>Floor Editor:</strong>
            <br />
            Select room/class/lab and click on
            the floor.
            <br />
            Existing elements can be moved and
            edited.
          </p>
        </div>
      </div>
    </>
  );
};

export default FloorSidebar;