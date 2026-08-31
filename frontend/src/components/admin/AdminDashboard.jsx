import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchBuildings,
  createBuilding,
  deleteBuilding,
  setCurrentBuilding,
} from "../../redux/slices/buildingSlice";
import {
  fetchFloorsByBuilding,
  createFloor,
  deleteFloor,
  setCurrentFloor,
} from "../../redux/slices/floorSlice";
import MapBuilder from "./MapBuilder";
import { Plus, Trash2, Edit2, ChevronDown } from "lucide-react";

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { buildings, currentBuilding, loading } = useSelector(
    (state) => state.buildings
  );
  const { floors, currentFloor } = useSelector((state) => state.floors);

  const [showBuildingForm, setShowBuildingForm] = useState(false);
  const [showFloorForm, setShowFloorForm] = useState(false);
  const [buildingFormData, setBuildingFormData] = useState({
    name: "",
    description: "",
    position: { x: 0, y: 0, z: 0 },
    dimensions: { width: 100, depth: 80, height: 35 },
  });
  const [floorFormData, setFloorFormData] = useState({
    name: "",
    floorNumber: 0,
    width: 800,
    height: 600,
    heightZ: 0,
  });
  const [expandedBuilding, setExpandedBuilding] = useState(null);

  useEffect(() => {
    dispatch(fetchBuildings());
  }, [dispatch]);

  useEffect(() => {
    if (currentBuilding) {
      dispatch(fetchFloorsByBuilding(currentBuilding._id));
    }
  }, [currentBuilding, dispatch]);

  const handleCreateBuilding = async () => {
    if (!buildingFormData.name.trim()) {
      alert("Please enter building name");
      return;
    }

    dispatch(createBuilding(buildingFormData));
    setBuildingFormData({
      name: "",
      description: "",
      position: { x: 0, y: 0, z: 0 },
      dimensions: { width: 100, depth: 80, height: 35 },
    });
    setShowBuildingForm(false);
  };

  const handleCreateFloor = async () => {
    if (!floorFormData.name.trim() || !currentBuilding) {
      alert("Please select building and enter floor name");
      return;
    }

    dispatch(
      createFloor({
        ...floorFormData,
        buildingId: currentBuilding._id,
      })
    );
    setFloorFormData({
      name: "",
      floorNumber: 0,
      width: 800,
      height: 600,
      heightZ: 0,
    });
    setShowFloorForm(false);
  };

  const handleDeleteBuilding = (id) => {
    if (window.confirm("Are you sure?")) {
      dispatch(deleteBuilding(id));
      if (currentBuilding?._id === id) {
        dispatch(setCurrentBuilding(null));
      }
    }
  };

  const handleDeleteFloor = (id) => {
    if (window.confirm("Are you sure?")) {
      dispatch(deleteFloor(id));
      if (currentFloor?._id === id) {
        dispatch(setCurrentFloor(null));
      }
    }
  };

  return (
    <div className="h-screen flex bg-gray-100">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-300 flex flex-col">
        {/* Buildings Section */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold">Buildings</h2>
              <button
                onClick={() => setShowBuildingForm(true)}
                className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                <Plus size={18} />
              </button>
            </div>

            <div className="space-y-2">
              {buildings.map((building) => (
                <div
                  key={building._id}
                  className="border border-gray-300 rounded-lg overflow-hidden"
                >
                  <button
                    onClick={() => {
                      setExpandedBuilding(
                        expandedBuilding === building._id ? null : building._id
                      );
                      dispatch(setCurrentBuilding(building));
                    }}
                    className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 flex items-center justify-between text-left"
                  >
                    <span className="font-medium">{building.name}</span>
                    <ChevronDown
                      size={18}
                      className={`transition ${
                        expandedBuilding === building._id ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {expandedBuilding === building._id && (
                    <div className="bg-white border-t border-gray-200 p-3 space-y-2 max-h-64 overflow-y-auto">
                      {/* Floors */}
                      <div className="mb-3">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-sm font-semibold">Floors</h4>
                          <button
                            onClick={() => setShowFloorForm(true)}
                            className="p-1 bg-green-500 text-white rounded hover:bg-green-600"
                          >
                            <Plus size={14} />
                          </button>
                        </div>

                        <div className="space-y-1">
                          {floors.map((floor) => (
                            <div
                              key={floor._id}
                              className={`p-2 rounded cursor-pointer text-sm transition ${
                                currentFloor?._id === floor._id
                                  ? "bg-blue-100 border-l-4 border-blue-500"
                                  : "bg-gray-50 hover:bg-gray-100"
                              }`}
                              onClick={() => dispatch(setCurrentFloor(floor))}
                            >
                              <div className="flex items-center justify-between">
                                <span>{floor.name}</span>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteFloor(floor._id);
                                  }}
                                  className="p-1 hover:bg-red-100 rounded"
                                >
                                  <Trash2 size={14} className="text-red-500" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <button
                        onClick={() => handleDeleteBuilding(building._id)}
                        className="w-full mt-3 px-3 py-2 bg-red-500 text-white text-sm rounded hover:bg-red-600 flex items-center justify-center gap-2"
                      >
                        <Trash2 size={14} /> Delete Building
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {currentFloor ? (
          <MapBuilder
            floorId={currentFloor._id}
            floorData={{
              width: currentFloor.width,
              height: currentFloor.height,
            }}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-100">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-700 mb-2">
                Welcome to Campus Map Builder
              </h2>
              <p className="text-gray-600">
                {currentBuilding
                  ? "Create or select a floor to start editing"
                  : "Select a building from the left panel to get started"}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Building Form Modal */}
      {showBuildingForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h2 className="text-2xl font-bold mb-4">Create Building</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Building Name
                </label>
                <input
                  type="text"
                  value={buildingFormData.name}
                  onChange={(e) =>
                    setBuildingFormData({
                      ...buildingFormData,
                      name: e.target.value,
                    })
                  }
                  placeholder="e.g., RCIT Building"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Description
                </label>
                <textarea
                  value={buildingFormData.description}
                  onChange={(e) =>
                    setBuildingFormData({
                      ...buildingFormData,
                      description: e.target.value,
                    })
                  }
                  placeholder="Building description"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 h-20 resize-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-sm font-medium mb-1">Width</label>
                  <input
                    type="number"
                    value={buildingFormData.dimensions.width}
                    onChange={(e) =>
                      setBuildingFormData({
                        ...buildingFormData,
                        dimensions: {
                          ...buildingFormData.dimensions,
                          width: parseInt(e.target.value),
                        },
                      })
                    }
                    className="w-full px-2 py-1 border border-gray-300 rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Depth</label>
                  <input
                    type="number"
                    value={buildingFormData.dimensions.depth}
                    onChange={(e) =>
                      setBuildingFormData({
                        ...buildingFormData,
                        dimensions: {
                          ...buildingFormData.dimensions,
                          depth: parseInt(e.target.value),
                        },
                      })
                    }
                    className="w-full px-2 py-1 border border-gray-300 rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Height</label>
                  <input
                    type="number"
                    value={buildingFormData.dimensions.height}
                    onChange={(e) =>
                      setBuildingFormData({
                        ...buildingFormData,
                        dimensions: {
                          ...buildingFormData.dimensions,
                          height: parseInt(e.target.value),
                        },
                      })
                    }
                    className="w-full px-2 py-1 border border-gray-300 rounded"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  onClick={handleCreateBuilding}
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Create
                </button>
                <button
                  onClick={() => setShowBuildingForm(false)}
                  className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floor Form Modal */}
      {showFloorForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h2 className="text-2xl font-bold mb-4">Create Floor</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Floor Name
                </label>
                <input
                  type="text"
                  value={floorFormData.name}
                  onChange={(e) =>
                    setFloorFormData({
                      ...floorFormData,
                      name: e.target.value,
                    })
                  }
                  placeholder="e.g., Ground Floor"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Floor Number
                </label>
                <input
                  type="number"
                  value={floorFormData.floorNumber}
                  onChange={(e) =>
                    setFloorFormData({
                      ...floorFormData,
                      floorNumber: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Width</label>
                  <input
                    type="number"
                    value={floorFormData.width}
                    onChange={(e) =>
                      setFloorFormData({
                        ...floorFormData,
                        width: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Height</label>
                  <input
                    type="number"
                    value={floorFormData.height}
                    onChange={(e) =>
                      setFloorFormData({
                        ...floorFormData,
                        height: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Floor Height (Z)
                </label>
                <input
                  type="number"
                  value={floorFormData.heightZ}
                  onChange={(e) =>
                    setFloorFormData({
                      ...floorFormData,
                      heightZ: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  onClick={handleCreateFloor}
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Create
                </button>
                <button
                  onClick={() => setShowFloorForm(false)}
                  className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white px-6 py-4 rounded">Loading...</div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
