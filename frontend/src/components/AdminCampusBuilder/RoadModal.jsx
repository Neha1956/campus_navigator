
import React, { useEffect, useState } from "react";
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
    <div className="fixed inset-0 z-[1000] bg-black/50 flex items-center justify-center p-4">

      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl">

        {/* HEADER */}

        <div className="flex items-center justify-between px-6 py-4 border-b">

          <div className="flex items-center gap-3">

            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">

              <Route
                size={20}
                className="text-blue-600"
              />

            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-800">
                Create Road
              </h2>

              <p className="text-xs text-slate-500">
                Connect two campus buildings
              </p>
            </div>

          </div>

          <button
            onClick={() =>
              setShowRoadModal(false)
            }
            className="p-2 rounded-lg hover:bg-slate-100"
          >
            <X size={20} />
          </button>

        </div>

        {/* BODY */}

        <div className="p-6 space-y-4">

          {/* NAME */}

          <div>

            <label className="block text-sm font-medium text-slate-700 mb-1">
              Road Name
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
              placeholder="Main Gate Road"
              className="w-full border border-slate-300 rounded-xl px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
            />

          </div>

          {/* TYPE */}

          <div>

            <label className="block text-sm font-medium text-slate-700 mb-1">
              Road Type
            </label>

            <select
              value={roadForm.type}
              onChange={(e) =>
                setRoadForm({
                  ...roadForm,
                  type: e.target.value,
                })
              }
              className="w-full border border-slate-300 rounded-xl px-3 py-2.5"
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

              <option value="entrance">
                Entrance
              </option>

              <option value="corridor">
                Corridor
              </option>
            </select>

          </div>

          {/* FROM */}

          <div>

            <label className="block text-sm font-medium text-slate-700 mb-1">
              From Building
            </label>

            <select
              value={
                roadForm.fromBuilding || ""
              }
              onChange={(e) =>
                setRoadForm({
                  ...roadForm,
                  fromBuilding:
                    e.target.value,
                })
              }
              className="w-full border border-slate-300 rounded-xl px-3 py-2.5"
            >

              <option value="">
                Select starting building
              </option>

              {buildings.map((building) => (
                <option
                  key={building._id}
                  value={building._id}
                >
                  {building.name}
                </option>
              ))}

            </select>

          </div>

          {/* TO */}

          <div>

            <label className="block text-sm font-medium text-slate-700 mb-1">
              To Building
            </label>

            <select
              value={
                roadForm.toBuilding || ""
              }
              onChange={(e) =>
                setRoadForm({
                  ...roadForm,
                  toBuilding:
                    e.target.value,
                })
              }
              className="w-full border border-slate-300 rounded-xl px-3 py-2.5"
            >

              <option value="">
                Select destination building
              </option>

              {buildings.map((building) => (
                <option
                  key={building._id}
                  value={building._id}
                >
                  {building.name}
                </option>
              ))}

            </select>

          </div>

          {/* WIDTH */}

          <div>

            <label className="block text-sm font-medium text-slate-700 mb-1">
              Road Width
            </label>

            <input
              type="number"
              min="5"
              value={roadForm.width}
              onChange={(e) =>
                setRoadForm({
                  ...roadForm,
                  width:
                    Number(
                      e.target.value
                    ),
                })
              }
              className="w-full border border-slate-300 rounded-xl px-3 py-2.5"
            />

          </div>

          {/* COLOR */}

          <div>

            <label className="block text-sm font-medium text-slate-700 mb-1">
              Road Color
            </label>

            <div className="flex gap-3">

              <input
                type="color"
                value={roadForm.color}
                onChange={(e) =>
                  setRoadForm({
                    ...roadForm,
                    color:
                      e.target.value,
                  })
                }
                className="w-14 h-10 cursor-pointer"
              />

              <input
                type="text"
                value={roadForm.color}
                onChange={(e) =>
                  setRoadForm({
                    ...roadForm,
                    color:
                      e.target.value,
                  })
                }
                className="flex-1 border border-slate-300 rounded-xl px-3 py-2"
              />

            </div>

          </div>

          {/* INFO */}

          <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 text-sm text-blue-700">

            After creating the road, use the campus map to
            define its path between buildings.

          </div>

        </div>

        {/* FOOTER */}

        <div className="px-6 py-4 border-t flex gap-3">

          <button
            onClick={() =>
              setShowRoadModal(false)
            }
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700"
          >
            Cancel
          </button>

          <button
            onClick={handleCreateRoad}
            className="flex-1 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium"
          >
            Create Road
          </button>

        </div>

      </div>

    </div>
  );
};

export default RoadModal;

