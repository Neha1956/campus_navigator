
import React, {
  useState,
  useEffect,
} from "react";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  fetchBuildings,
  setCurrentBuilding,
} from "../redux/slices/buildingSlice";

import {
  fetchFloorsByBuilding,
  setCurrentFloor,
} from "../redux/slices/floorSlice";

import {
  fetchMapElementsByFloor,
} from "../redux/slices/mapElementSlice";

import CampusViewer3D from "../components/map/CampusViewer3D";

import { ChevronDown } from "lucide-react";

const Campus3DMapPage = () => {
  const dispatch = useDispatch();

  const {
    buildings,
    currentBuilding,
  } = useSelector(
    (state) => state.buildings
  );

  const {
    floors,
    currentFloor,
  } = useSelector(
    (state) => state.floors
  );

  const {
    elements,
  } = useSelector(
    (state) => state.mapElements
  );

  const [
    expandedBuilding,
    setExpandedBuilding,
  ] = useState(null);

  const [
    selectedFloor,
    setSelectedFloor,
  ] = useState(null);

  const [
    selectedElement,
    setSelectedElement,
  ] = useState(null);

  /* =====================================================
     LOAD BUILDINGS
  ===================================================== */

  useEffect(() => {
    dispatch(fetchBuildings());
  }, [dispatch]);

  /* =====================================================
     LOAD FLOORS
  ===================================================== */

  useEffect(() => {
    if (currentBuilding?._id) {
      dispatch(
        fetchFloorsByBuilding(
          currentBuilding._id
        )
      );
    }
  }, [
    currentBuilding,
    dispatch,
  ]);

  /* =====================================================
     LOAD ELEMENTS WHEN FLOOR CHANGES
  ===================================================== */

  useEffect(() => {
    if (selectedFloor?._id) {
      dispatch(
        fetchMapElementsByFloor(
          selectedFloor._id
        )
      );

      setSelectedElement(null);
    }
  }, [
    selectedFloor,
    dispatch,
  ]);

  /* =====================================================
     BUILDING
  ===================================================== */

  const handleBuildingClick = (
    building
  ) => {
    const isOpen =
      expandedBuilding ===
      building._id;

    setExpandedBuilding(
      isOpen
        ? null
        : building._id
    );

    if (!isOpen) {
      dispatch(
        setCurrentBuilding(
          building
        )
      );

      dispatch(
        fetchFloorsByBuilding(
          building._id
        )
      );

      setSelectedFloor(null);
      setSelectedElement(null);
    }
  };

  /* =====================================================
     FLOOR
  ===================================================== */

  const handleFloorSelect = (
    floor
  ) => {
    setSelectedFloor(floor);

    dispatch(
      setCurrentFloor(floor)
    );
  };

  /* =====================================================
     ELEMENT
  ===================================================== */

  const handleElementSelect = (
    element
  ) => {
    setSelectedElement(
      element
    );
  };

  return (
    <div className="h-screen flex flex-col bg-gray-900">

      {/* HEADER */}

      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 shadow-lg">

        <h1 className="text-3xl font-bold">
          3D Campus Navigator
        </h1>

        <p className="text-blue-100">
          Explore your campus in 3D
        </p>

      </div>

      <div className="flex flex-1 overflow-hidden">

        {/* SIDEBAR */}

        <div className="w-80 bg-gray-800 text-white border-r border-gray-700 flex flex-col overflow-y-auto">

          <div className="p-4">

            <h2 className="text-lg font-bold mb-3">
              Buildings
            </h2>

            <div className="space-y-2">

              {buildings.map(
                (building) => (
                  <div
                    key={
                      building._id
                    }
                    className="border border-gray-700 rounded"
                  >

                    <button
                      className="w-full flex items-center justify-between px-3 py-3 hover:bg-gray-700"
                      onClick={() =>
                        handleBuildingClick(
                          building
                        )
                      }
                    >

                      <span className="font-medium">
                        {building.name}
                      </span>

                      <ChevronDown
                        size={18}
                        className={`transition ${
                          expandedBuilding ===
                          building._id
                            ? "rotate-180"
                            : ""
                        }`}
                      />

                    </button>

                    {expandedBuilding ===
                      building._id && (
                      <div className="bg-gray-750 border-t border-gray-700 p-3">

                        <p className="text-sm text-gray-400 mb-3">
                          {building.description ||
                            "No description"}
                        </p>

                        <p className="text-xs font-semibold text-gray-400 uppercase mb-2">
                          Floors
                        </p>

                        <div className="space-y-1">

                          {floors.length >
                          0 ? (
                            floors.map(
                              (floor) => (
                                <button
                                  key={
                                    floor._id
                                  }
                                  onClick={() =>
                                    handleFloorSelect(
                                      floor
                                    )
                                  }
                                  className={`w-full px-3 py-2 rounded text-sm text-left ${
                                    selectedFloor?._id ===
                                    floor._id
                                      ? "bg-blue-600 text-white"
                                      : "bg-gray-700 hover:bg-gray-600"
                                  }`}
                                >
                                  {floor.name}
                                </button>
                              )
                            )
                          ) : (
                            <p className="text-xs text-gray-500">
                              No floors created
                            </p>
                          )}

                        </div>

                      </div>
                    )}

                  </div>
                )
              )}

            </div>

            {buildings.length ===
              0 && (
              <p className="text-gray-400 text-center py-4">
                No buildings available
              </p>
            )}

          </div>

          {/* FLOOR DETAILS */}

          {selectedFloor && (
            <div className="p-4 border-t border-gray-700">

              <h3 className="text-sm font-bold mb-3 text-blue-300">
                Floor Details
              </h3>

              <div className="space-y-2 text-sm text-gray-300">

                <p>
                  <span className="text-gray-400">
                    Name:
                  </span>{" "}
                  {selectedFloor.name}
                </p>

                <p>
                  <span className="text-gray-400">
                    Number:
                  </span>{" "}
                  {
                    selectedFloor.floorNumber
                  }
                </p>

                <p>
                  <span className="text-gray-400">
                    Size:
                  </span>{" "}
                  {selectedFloor.width} ×{" "}
                  {
                    selectedFloor.height
                  }
                </p>

                <p>
                  <span className="text-gray-400">
                    Elements:
                  </span>{" "}
                  {elements.length}
                </p>

              </div>

            </div>
          )}

        </div>

        {/* 3D VIEWER */}

        <div className="flex-1 bg-black">

          {currentBuilding &&
          selectedFloor ? (

            <CampusViewer3D
              building={
                currentBuilding
              }
              floors={floors}
              currentFloor={
                selectedFloor
              }
              elements={
                elements
              }
              selectedElement={
                selectedElement
              }
              onSelectElement={
                handleElementSelect
              }
            />

          ) : (

            <div className="h-full flex items-center justify-center">

              <div className="text-center text-gray-400">

                <p className="text-lg mb-2">
                  Select a building
                  and floor
                </p>

                <p className="text-sm">
                  The 3D floor map
                  will appear here
                </p>

              </div>

            </div>

          )}

        </div>

      </div>

    </div>
  );
};

export default Campus3DMapPage;
