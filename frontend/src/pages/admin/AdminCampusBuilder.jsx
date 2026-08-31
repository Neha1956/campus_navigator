import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

/* =========================================================
   REDUX - CAMPUS ELEMENT
========================================================= */

import {
  fetchCampusElements,
  createCampusElement,
  updateCampusElement,
  deleteCampusElement,
} from "../../redux/slices/campusElementSlice";

/* =========================================================
   REDUX - BUILDING
========================================================= */

import {
  fetchBuildings,
  createBuilding,
  updateBuilding,
  deleteBuilding,
  setCurrentBuilding,
} from "../../redux/slices/buildingSlice";

/* =========================================================
   REDUX - FLOOR
========================================================= */

import {
  fetchFloorsByBuilding,
  createFloor,
  deleteFloor,
  setCurrentFloor,
} from "../../redux/slices/floorSlice";

/* =========================================================
   REDUX - FLOOR MAP ELEMENT
========================================================= */

import {
  fetchMapElementsByFloor,
  createMapElement,
  updateMapElement,
  updateElementPosition,
  updateElementDimensions,
  deleteMapElement,
} from "../../redux/slices/mapElementSlice";

/* =========================================================
   REDUX - ROAD
========================================================= */

import {
  fetchRoads,
  createRoad,
  updateRoad,
  deleteRoad,
} from "../../redux/slices/roadSlice";

/* =========================================================
   COMPONENTS
========================================================= */

import CampusHeader from "../../components/AdminCampusBuilder/CampusHeader";
import CampusMap from "../../components/AdminCampusBuilder/CampusMap";
import CampusSidebar from "../../components/AdminCampusBuilder/CampusSidebar";
import FloorMap from "../../components/AdminCampusBuilder/FloorMap";
import FloorSidebar from "../../components/AdminCampusBuilder/FloorSidebar";
import BuildingModal from "../../components/AdminCampusBuilder/BuildingModal";
import FloorModal from "../../components/AdminCampusBuilder/FloorModal";
import PropertiesPanel from "../../components/AdminCampusBuilder/PropertiesPanel";
import LoadingOverlay from "../../components/AdminCampusBuilder/LoadingOverlay";
import RoadModal from "../../components/AdminCampusBuilder/RoadModal";

/* =========================================================
   CONSTANTS
========================================================= */

const DEFAULT_CAMPUS_WIDTH = 1400;
const DEFAULT_CAMPUS_HEIGHT = 900;

const GRID_SIZE = 20;

/* =========================================================
   CAMPUS ELEMENT TYPES
========================================================= */

const CAMPUS_ELEMENT_TYPES = [
  "parking",
  "park",
  "ground",
  "small-room",
];

/* =========================================================
   COMPONENT
========================================================= */

const AdminCampusBuilder = () => {
  const dispatch = useDispatch();

  /* =======================================================
     REDUX STATE
  ======================================================= */
 const [floorElementDrafts, setFloorElementDrafts] =
  useState({});
  const buildingState =
    useSelector((state) => state.buildings || {});

  const floorState =
    useSelector((state) => state.floors || {});

  const elementState =
    useSelector((state) => state.mapElements || {});

  const campusElementState =
    useSelector((state) => state.campusElements || {});

  const roadState =
    useSelector((state) => state.roads || {});

  /* =======================================================
     DATA
  ======================================================= */

  const buildings =
    buildingState.buildings || [];

  const buildingLoading =
    buildingState.loading || false;

  const currentBuilding =
    buildingState.currentBuilding || null;

  const floors =
    floorState.floors || [];

  const floorLoading =
    floorState.loading || false;

  const currentFloor =
    floorState.currentFloor || null;

  const elements =
    elementState.elements || [];
    const renderedElements = elements.map((element) => {
  const draft =
    floorElementDrafts[element._id];

  if (!draft) {
    return element;
  }

  return {
    ...element,

    position: {
      ...element.position,
      ...(draft.position || {}),
    },

    dimensions: {
      ...element.dimensions,
      ...(draft.dimensions || {}),
    },
  };
});

  const elementLoading =
    elementState.loading || false;

  const campusElements =
    campusElementState.elements || [];

  const campusElementLoading =
    campusElementState.loading || false;

  const campusRoads =
    roadState.roads || [];

  const roadLoading =
    roadState.loading || false;

  /* =======================================================
     MAIN EDITOR STATE
  ======================================================= */

  const [editorMode, setEditorMode] =
    useState("campus");

  const [mapView, setMapView] =
    useState("3d");

  const [showGrid, setShowGrid] =
    useState(true);

  const [activeTool, setActiveTool] =
    useState("select");

  /* =======================================================
     SELECTION STATE
  ======================================================= */

  const [selectedBuilding, setSelectedBuilding] =
    useState(null);

  const [selectedRoad, setSelectedRoad] =
    useState(null);

  const [selectedElement, setSelectedElement] =
    useState(null);
   

  const [selectedCampusElement, setSelectedCampusElement] =
    useState(null);

  /* =======================================================
     MODALS
  ======================================================= */

  const [showBuildingModal, setShowBuildingModal] =
    useState(false);

  const [showFloorModal, setShowFloorModal] =
    useState(false);

  const [showRoadModal, setShowRoadModal] =
    useState(false);

  /* =======================================================
     BUILDING FORM
  ======================================================= */

  const [buildingForm, setBuildingForm] =
    useState({
      name: "",
      description: "",
      type: "academic",
      x: 100,
      y: 100,
      width: 250,
      height: 180,
      color: "#BFDBFE",
    });

  /* =======================================================
     FLOOR FORM
  ======================================================= */

  const [floorForm, setFloorForm] =
    useState({
      name: "",
      floorNumber: 0,
      width: 1000,
      height: 700,
       heightZ: 4,
      description: "",
    });

  /* =======================================================
     ROAD FORM
  ======================================================= */

  const [roadForm, setRoadForm] =
    useState({
      name: "",
      type: "road",
      fromBuilding: "",
      toBuilding: "",
      points: [],
      width: 20,
      color: "#64748B",
      distance: 0,
      walkingTime: 0,
    });

  /* =======================================================
     REFS
  ======================================================= */

  const campusCanvasRef =
    useRef(null);

  const floorCanvasRef =
    useRef(null);

  /* =======================================================
     FLOOR DIMENSIONS
  ======================================================= */

  const floorWidth =
    Number(
      currentFloor?.width ||
        floorForm.width ||
        1000
    );

  const floorHeight =
    Number(
      currentFloor?.height ||
        floorForm.height ||
        700
    );

  /* =======================================================
     LOCATION SAVING
  ======================================================= */

  const [locationSaving, setLocationSaving] =
    useState(false);

  /* =======================================================
     LOAD CAMPUS DATA
  ======================================================= */

  useEffect(() => {
    dispatch(fetchBuildings());
    dispatch(fetchRoads());
    dispatch(fetchCampusElements());
  }, [dispatch]);

  /* =======================================================
     LOAD FLOORS
  ======================================================= */

  useEffect(() => {
    if (currentBuilding?._id) {
      dispatch(
        fetchFloorsByBuilding(
          currentBuilding._id
        )
      );
    }
  }, [currentBuilding?._id, dispatch]);

  /* =======================================================
     LOAD FLOOR ELEMENTS
  ======================================================= */

  useEffect(() => {
    if (currentFloor?._id) {
      dispatch(
        fetchMapElementsByFloor(
          currentFloor._id
        )
      );
    }
  }, [currentFloor?._id, dispatch]);
  useEffect(() => {
  setFloorElementDrafts({});
  setSelectedElement(null);
}, [currentFloor?._id]);

  /* =======================================================
     GRID SNAP
  ======================================================= */

  const snapToGrid = (value) => {
    const number =
      Number(value) || 0;

    if (!showGrid) {
      return number;
    }

    return (
      Math.round(
        number / GRID_SIZE
      ) * GRID_SIZE
    );
  };

  /* =======================================================
     CLEAR ALL SELECTIONS
  ======================================================= */

  const clearSelections = () => {
    setSelectedBuilding(null);
    setSelectedRoad(null);
    setSelectedElement(null);
    setSelectedCampusElement(null);
  };



//floor map
const handleElementMove = (
  element,
  newX,
  newY
) => {
  if (!element?._id) return;

  const x = Math.round(newX);
  const y = Math.round(newY);

  setFloorElementDrafts((prev) => ({
    ...prev,

    [element._id]: {
      ...(prev[element._id] || {}),

      position: {
        ...(prev[element._id]?.position || {}),
        x,
        y,
      },
    },
  }));

  setSelectedElement((prev) =>
    prev?._id === element._id
      ? {
          ...prev,

          position: {
            ...(prev.position || {}),
            x,
            y,
          },
        }
      : prev
  );
};
const handleElementMoveEnd = async (
  element,
  newX,
  newY
) => {
  if (!element?._id) return;

  const position = {
    ...(element.position || {}),
    x: Math.round(newX),
    y: Math.round(newY),
  };

  try {
    await dispatch(
      updateElementPosition({
        id: element._id,
        position,
      })
    ).unwrap();

    setFloorElementDrafts((prev) => {
      const next = { ...prev };

      delete next[element._id];

      return next;
    });

    setSelectedElement((prev) =>
      prev?._id === element._id
        ? {
            ...prev,
            position,
          }
        : prev
    );

    if (currentFloor?._id) {
      dispatch(
        fetchMapElementsByFloor(
          currentFloor._id
        )
      );
    }
  } catch (error) {
    console.error(
      "Floor element move save error:",
      error
    );

    setFloorElementDrafts((prev) => {
      const next = { ...prev };

      delete next[element._id];

      return next;
    });
  }
};

const handleElementResize = (
  element,
  newWidth,
  newHeight
) => {
  if (!element?._id) return;

  const width = Math.round(newWidth);
  const height = Math.round(newHeight);

  setFloorElementDrafts((prev) => ({
    ...prev,

    [element._id]: {
      ...(prev[element._id] || {}),

      dimensions: {
        ...(prev[element._id]?.dimensions || {}),
        width,
        height,
      },
    },
  }));

  setSelectedElement((prev) =>
    prev?._id === element._id
      ? {
          ...prev,

          dimensions: {
            ...(prev.dimensions || {}),
            width,
            height,
          },
        }
      : prev
  );
};
const handleElementResizeEnd = async (
  element,
  newWidth,
  newHeight
) => {
  if (!element?._id) return;

  const dimensions = {
    ...(element.dimensions || {}),

    width: Math.round(newWidth),

    height: Math.round(newHeight),
  };

  try {
    await dispatch(
      updateElementDimensions({
        id: element._id,
        dimensions,
      })
    ).unwrap();

    setFloorElementDrafts((prev) => {
      const next = { ...prev };

      delete next[element._id];

      return next;
    });

    setSelectedElement((prev) =>
      prev?._id === element._id
        ? {
            ...prev,
            dimensions,
          }
        : prev
    );

    if (currentFloor?._id) {
      dispatch(
        fetchMapElementsByFloor(
          currentFloor._id
        )
      );
    }
  } catch (error) {
    console.error(
      "Floor element resize save error:",
      error
    );

    setFloorElementDrafts((prev) => {
      const next = { ...prev };

      delete next[element._id];

      return next;
    });
  }
};


  /* =======================================================
     BUILDING SELECT
  ======================================================= */

  const handleBuildingSelect = (
    building
  ) => {
    if (!building) return;

    setSelectedBuilding(building);

    setSelectedRoad(null);
    setSelectedElement(null);
    setSelectedCampusElement(null);

    dispatch(
      setCurrentBuilding(building)
    );

    setActiveTool("select");
  };

  /* =======================================================
     OPEN BUILDING
  ======================================================= */

  const handleOpenBuilding = (
    building
  ) => {
    handleBuildingSelect(building);

    setEditorMode("floor");

    setActiveTool("select");
  };

  /* =======================================================
     BACK TO CAMPUS
  ======================================================= */

  const handleBackToCampus = () => {
    setEditorMode("campus");

    setActiveTool("select");

    clearSelections();

    dispatch(
      setCurrentFloor(null)
    );
  };

  /* =======================================================
     FLOOR SELECT
  ======================================================= */

  const handleFloorSelect = (
    floor
  ) => {
    dispatch(
      setCurrentFloor(floor)
    );

    setSelectedElement(null);
    setSelectedRoad(null);
    setSelectedCampusElement(null);

    setActiveTool("select");
  };

  /* =======================================================
     CREATE BUILDING
  ======================================================= */

  const handleCreateBuilding =
    async () => {
      if (
        !buildingForm.name.trim()
      ) {
        alert(
          "Please enter building name"
        );
        return;
      }

      const data = {
        name:
          buildingForm.name.trim(),

        description:
          buildingForm.description,

        type:
          buildingForm.type,

        position: {
          x: snapToGrid(
            buildingForm.x
          ),
          y: snapToGrid(
            buildingForm.y
          ),
          z: 0,
        },

        dimensions: {
          width:
            Number(
              buildingForm.width
            ) || 250,

          height:
            Number(
              buildingForm.height
            ) || 180,

          depth:
            Number(
              buildingForm.height
            ) || 180,
        },

        color:
          buildingForm.color,
      };

      try {
        await dispatch(
          createBuilding(data)
        ).unwrap();

        setShowBuildingModal(false);

        setBuildingForm({
          name: "",
          description: "",
          type: "academic",
          x: 100,
          y: 100,
          width: 250,
          height: 180,
          color: "#BFDBFE",
        });

        dispatch(fetchBuildings());
      } catch (error) {
        console.error(
          "Create building error:",
          error
        );

        alert(
          error?.message ||
            "Failed to create building"
        );
      }
    };

  /* =======================================================
     BUILDING DELETE
  ======================================================= */

  const handleDeleteBuilding =
    async (id) => {
      if (!id) return;

      const confirmed =
        window.confirm(
          "Are you sure you want to delete this building?"
        );

      if (!confirmed) return;

      try {
        await dispatch(
          deleteBuilding(id)
        ).unwrap();

        setSelectedBuilding(null);

        dispatch(fetchBuildings());
      } catch (error) {
        console.error(
          "Delete building error:",
          error
        );

        alert(
          error?.message ||
            "Failed to delete building"
        );
      }
    };

  /* =======================================================
     BUILDING PROPERTY UPDATE
  ======================================================= */

  const handleBuildingPropertyChange =
    async (
      field,
      value
    ) => {
      if (
        !selectedBuilding?._id
      ) {
        return;
      }

      try {
        const saved =
          await dispatch(
            updateBuilding({
              id:
                selectedBuilding._id,

              data: {
                [field]: value,
              },
            })
          ).unwrap();

        setSelectedBuilding(
          saved || {
            ...selectedBuilding,
            [field]: value,
          }
        );

        dispatch(
          fetchBuildings()
        );
      } catch (error) {
        console.error(
          "Building property update error:",
          error
        );

        alert(
          error?.message ||
            "Failed to update building"
        );
      }
    };

  /* =======================================================
     BUILDING POSITION UPDATE
  ======================================================= */

  const handleBuildingPositionChange =
    async (
      field,
      value
    ) => {
      if (
        !selectedBuilding?._id
      ) {
        return;
      }

      const numericValue =
        Number(value);

      if (
        !Number.isFinite(
          numericValue
        )
      ) {
        return;
      }

      const position = {
        ...(selectedBuilding.position ||
          {}),
        [field]: numericValue,
      };

      const updated = {
        ...selectedBuilding,
        position,
      };

      setSelectedBuilding(updated);

      try {
        const saved =
          await dispatch(
            updateBuilding({
              id:
                selectedBuilding._id,

              data: {
                position,
              },
            })
          ).unwrap();

        if (saved) {
          setSelectedBuilding(
            saved
          );
        }

        dispatch(
          fetchBuildings()
        );
      } catch (error) {
        console.error(
          "Building position update error:",
          error
        );

        alert(
          error?.message ||
            "Failed to update building position"
        );
      }
    };

  /* =======================================================
     BUILDING DIMENSION UPDATE
  ======================================================= */

  const handleBuildingDimensionChange =
    async (
      field,
      value
    ) => {
      if (
        !selectedBuilding?._id
      ) {
        return;
      }

      const numericValue =
        Number(value);

      if (
        !Number.isFinite(
          numericValue
        ) ||
        numericValue <= 0
      ) {
        return;
      }

      const dimensions = {
        ...(selectedBuilding.dimensions ||
          {}),
        [field]: numericValue,
      };

      const updated = {
        ...selectedBuilding,
        dimensions,
      };

      setSelectedBuilding(updated);

      try {
        const saved =
          await dispatch(
            updateBuilding({
              id:
                selectedBuilding._id,

              data: {
                dimensions,
              },
            })
          ).unwrap();

        if (saved) {
          setSelectedBuilding(
            saved
          );
        }

        dispatch(
          fetchBuildings()
        );
      } catch (error) {
        console.error(
          "Building dimension update error:",
          error
        );

        alert(
          error?.message ||
            "Failed to update building dimensions"
        );
      }
    };

  /* =======================================================
     BUILDING DRAG
  ======================================================= */

  const handleBuildingDragEnd =
    async (
      building,
      position
    ) => {
      if (!building?._id) {
        return;
      }

      const updatedPosition = {
        ...(building.position ||
          {}),
        ...position,
      };

      try {
        const saved =
          await dispatch(
            updateBuilding({
              id: building._id,

              data: {
                position:
                  updatedPosition,
              },
            })
          ).unwrap();

        setSelectedBuilding(
          saved || {
            ...building,
            position:
              updatedPosition,
          }
        );

        dispatch(
          fetchBuildings()
        );
      } catch (error) {
        console.error(
          "Building drag error:",
          error
        );
      }
    };

  /* =======================================================
     CREATE CAMPUS ELEMENT
  ======================================================= */

  const handleCreateCampusElement =
    async (
      data
    ) => {
      if (!data) return;

      try {
        await dispatch(
          createCampusElement(
            data
          )
        ).unwrap();

        await dispatch(
          fetchCampusElements()
        );

        setActiveTool("select");
      } catch (error) {
        console.error(
          "Create campus element error:",
          error
        );

        alert(
          error?.message ||
            "Failed to create campus element"
        );
      }
    };

  /* =======================================================
     CAMPUS MAP CLICK
  ======================================================= */

  const handleCampusCanvasClick =
    (event) => {
      if (
        !event ||
        !campusCanvasRef.current
      ) {
        return;
      }

      if (
        !CAMPUS_ELEMENT_TYPES.includes(
          activeTool
        )
      ) {
        return;
      }

      const svg =
        campusCanvasRef.current;

      const point =
        svg.createSVGPoint();

      point.x =
        event.clientX;

      point.y =
        event.clientY;

      const matrix =
        svg
          .getScreenCTM()
          ?.inverse();

      if (!matrix) {
        return;
      }

      const svgPoint =
        point.matrixTransform(
          matrix
        );

      const defaultColors = {
        parking: "#CBD5E1",
        park: "#BBF7D0",
        ground: "#FDE68A",
        "small-room":
          "#C4B5FD",
      };

      const dimensions = {
        parking: {
          width: 220,
          height: 130,
        },

        park: {
          width: 220,
          height: 160,
        },

        ground: {
          width: 280,
          height: 180,
        },

        "small-room": {
          width: 150,
          height: 100,
        },
      };

      const size =
        dimensions[activeTool] ||
        dimensions["small-room"];

      const data = {
        name:
          activeTool
            .replace("-", " ")
            .replace(
              /\b\w/g,
              (letter) =>
                letter.toUpperCase()
            ),

        type: activeTool,

        position: {
          x: Math.max(
            0,
            snapToGrid(
              svgPoint.x
            )
          ),

          y: Math.max(
            0,
            snapToGrid(
              svgPoint.y
            )
          ),

          z: 0,
        },

        dimensions: {
          width:
            size.width,

          height:
            size.height,

          depth:
            size.height,
        },

        color:
          defaultColors[
            activeTool
          ] ||
          "#CBD5E1",

        strokeColor:
          "#334155",

        strokeWidth: 2,

        rotation: 0,
      };

      handleCreateCampusElement(
        data
      );
    };

  /* =======================================================
     CAMPUS ELEMENT SELECT
  ======================================================= */

  const handleCampusElementSelect =
    (element) => {
      if (!element) return;

      setSelectedCampusElement(
        element
      );

      setSelectedBuilding(null);
      setSelectedRoad(null);
      setSelectedElement(null);

      setActiveTool("select");
    };

  /* =======================================================
     CAMPUS ELEMENT DRAG
  ======================================================= */

  const handleCampusElementDragEnd =
    async (
      element,
      position
    ) => {
      if (!element?._id) {
        return;
      }

      const updated = {
        ...element,

        position: {
          ...(element.position ||
            {}),
          ...position,
        },
      };

      setSelectedCampusElement(
        updated
      );

      try {
        const saved =
          await dispatch(
            updateCampusElement({
              id:
                element._id,

              data: {
                position:
                  updated.position,
              },
            })
          ).unwrap();

        if (saved) {
          setSelectedCampusElement(
            saved
          );
        }

        dispatch(
          fetchCampusElements()
        );
      } catch (error) {
        console.error(
          "Campus element drag error:",
          error
        );
      }
    };

  /* =======================================================
     CAMPUS ELEMENT RESIZE
  ======================================================= */

  const handleCampusElementResizeEnd =
    async (
      element,
      dimensions
    ) => {
      if (!element?._id) {
        return;
      }

      const updated = {
        ...element,

        dimensions: {
          ...(element.dimensions ||
            {}),
          ...dimensions,
        },
      };

      setSelectedCampusElement(
        updated
      );

      try {
        const saved =
          await dispatch(
            updateCampusElement({
              id:
                element._id,

              data: {
                dimensions:
                  updated.dimensions,
              },
            })
          ).unwrap();

        if (saved) {
          setSelectedCampusElement(
            saved
          );
        }

        dispatch(
          fetchCampusElements()
        );
      } catch (error) {
        console.error(
          "Campus element resize error:",
          error
        );
      }
    };

  /* =======================================================
     CAMPUS ELEMENT PROPERTY UPDATE
  ======================================================= */

  const handleCampusElementPropertyChange =
    async (
      field,
      value
    ) => {
      if (
        !selectedCampusElement?._id
      ) {
        return;
      }

      const updated = {
        ...selectedCampusElement,
        [field]: value,
      };

      setSelectedCampusElement(
        updated
      );

      try {
        const saved =
          await dispatch(
            updateCampusElement({
              id:
                selectedCampusElement._id,

              data: {
                [field]: value,
              },
            })
          ).unwrap();

        if (saved) {
          setSelectedCampusElement(
            saved
          );
        }

        dispatch(
          fetchCampusElements()
        );
      } catch (error) {
        console.error(
          "Campus element property error:",
          error
        );
      }
    };

  /* =======================================================
     CAMPUS ELEMENT POSITION UPDATE
  ======================================================= */

  const handleCampusElementPositionChange =
    async (
      field,
      value
    ) => {
      if (
        !selectedCampusElement?._id
      ) {
        return;
      }

      const numericValue =
        Number(value);

      if (
        !Number.isFinite(
          numericValue
        )
      ) {
        return;
      }

      const position = {
        ...(selectedCampusElement.position ||
          {}),
        [field]: numericValue,
      };

      const updated = {
        ...selectedCampusElement,
        position,
      };

      setSelectedCampusElement(
        updated
      );

      try {
        const saved =
          await dispatch(
            updateCampusElement({
              id:
                selectedCampusElement._id,

              data: {
                position,
              },
            })
          ).unwrap();

        if (saved) {
          setSelectedCampusElement(
            saved
          );
        }

        dispatch(
          fetchCampusElements()
        );
      } catch (error) {
        console.error(
          "Campus element position error:",
          error
        );
      }
    };

  /* =======================================================
     CAMPUS ELEMENT DIMENSION UPDATE
  ======================================================= */

  const handleCampusElementDimensionChange =
    async (
      field,
      value
    ) => {
      if (
        !selectedCampusElement?._id
      ) {
        return;
      }

      const numericValue =
        Number(value);

      if (
        !Number.isFinite(
          numericValue
        ) ||
        numericValue <= 0
      ) {
        return;
      }

      const dimensions = {
        ...(selectedCampusElement.dimensions ||
          {}),
        [field]:
          numericValue,
      };

      const updated = {
        ...selectedCampusElement,
        dimensions,
      };

      setSelectedCampusElement(
        updated
      );

      try {
        const saved =
          await dispatch(
            updateCampusElement({
              id:
                selectedCampusElement._id,

              data: {
                dimensions,
              },
            })
          ).unwrap();

        if (saved) {
          setSelectedCampusElement(
            saved
          );
        }

        dispatch(
          fetchCampusElements()
        );
      } catch (error) {
        console.error(
          "Campus element dimension error:",
          error
        );
      }
    };

  /* =======================================================
     CAMPUS ELEMENT DELETE
  ======================================================= */

  const handleDeleteCampusElement =
    async (
      id
    ) => {
      if (!id) return;

      const confirmed =
        window.confirm(
          "Are you sure you want to delete this campus element?"
        );

      if (!confirmed) {
        return;
      }

      try {
        await dispatch(
          deleteCampusElement(id)
        ).unwrap();

        setSelectedCampusElement(
          null
        );

        dispatch(
          fetchCampusElements()
        );
      } catch (error) {
        console.error(
          "Delete campus element error:",
          error
        );

        alert(
          error?.message ||
            "Failed to delete campus element"
        );
      }
    };

  /* =======================================================
     CREATE ROAD
  ======================================================= */

  const handleCreateRoad =
    async () => {
      if (
        !roadForm.name.trim()
      ) {
        alert(
          "Please enter road name"
        );
        return;
      }

      if (
        !roadForm.fromBuilding ||
        !roadForm.toBuilding
      ) {
        alert(
          "Please select both buildings"
        );
        return;
      }

      if (
        roadForm.fromBuilding ===
        roadForm.toBuilding
      ) {
        alert(
          "From Building and To Building cannot be same"
        );
        return;
      }

      const fromBuilding =
        buildings.find(
          (building) =>
            building._id ===
            roadForm.fromBuilding
        );

      const toBuilding =
        buildings.find(
          (building) =>
            building._id ===
            roadForm.toBuilding
        );

      if (
        !fromBuilding ||
        !toBuilding
      ) {
        alert(
          "Invalid building selection"
        );
        return;
      }

      const fromX =
        Number(
          fromBuilding.position?.x ??
            fromBuilding.x ??
            0
        );

      const fromY =
        Number(
          fromBuilding.position?.y ??
            fromBuilding.y ??
            0
        );

      const toX =
        Number(
          toBuilding.position?.x ??
            toBuilding.x ??
            0
        );

      const toY =
        Number(
          toBuilding.position?.y ??
            toBuilding.y ??
            0
        );

      const points =
        Array.isArray(
          roadForm.points
        ) &&
        roadForm.points.length >= 2
          ? roadForm.points
          : [
              {
                x: fromX,
                y: fromY,
              },
              {
                x: toX,
                y: toY,
              },
            ];

      try {
        await dispatch(
          createRoad({
            ...roadForm,

            points,

            width:
              Number(
                roadForm.width
              ) || 20,

            distance:
              Number(
                roadForm.distance
              ) || 0,

            walkingTime:
              Number(
                roadForm.walkingTime
              ) || 0,
          })
        ).unwrap();

        setShowRoadModal(false);

        setRoadForm({
          name: "",
          type: "road",
          fromBuilding: "",
          toBuilding: "",
          points: [],
          width: 20,
          color: "#64748B",
          distance: 0,
          walkingTime: 0,
        });

        dispatch(
          fetchRoads()
        );
      } catch (error) {
        console.error(
          "Create road error:",
          error
        );

        alert(
          error?.message ||
            "Failed to create road"
        );
      }
    };

  /* =======================================================
     CREATE CAMPUS ROAD
     FIXES: createCampusRoad undefined
  ======================================================= */

  const createCampusRoad =
    async (
      roadData
    ) => {
      if (!roadData) {
        return;
      }

      try {
        await dispatch(
          createRoad({
            ...roadData,

            name:
              roadData.name?.trim() ||
              "Campus Road",

            type:
              roadData.type ||
              "road",

            width:
              Number(
                roadData.width
              ) || 20,

            color:
              roadData.color ||
              "#64748B",

            points:
              Array.isArray(
                roadData.points
              )
                ? roadData.points
                : [],

            distance:
              Number(
                roadData.distance
              ) || 0,

            walkingTime:
              Number(
                roadData.walkingTime
              ) || 0,
          })
        ).unwrap();

        dispatch(
          fetchRoads()
        );
      } catch (error) {
        console.error(
          "Create campus road error:",
          error
        );

        alert(
          error?.message ||
            "Failed to create campus road"
        );
      }
    };

  /* =======================================================
     ROAD SELECT
  ======================================================= */

  const handleRoadClick =
    (road) => {
      if (!road) return;

      setSelectedRoad(road);

      setSelectedBuilding(null);
      setSelectedElement(null);
      setSelectedCampusElement(null);

      setActiveTool("select");
    };

  /* =======================================================
     ROAD DRAG
  ======================================================= */

  const handleRoadDragEnd =
    async (
      road,
      updatedPoints
    ) => {
      if (
        !road?._id ||
        !Array.isArray(
          updatedPoints
        ) ||
        updatedPoints.length < 2
      ) {
        return;
      }

      const updatedRoad = {
        ...road,
        points:
          updatedPoints,
      };

      setSelectedRoad(
        updatedRoad
      );

      try {
        const saved =
          await dispatch(
            updateRoad({
              id: road._id,

              data: {
                points:
                  updatedPoints,
              },
            })
          ).unwrap();

        if (saved) {
          setSelectedRoad(
            saved
          );
        }

        dispatch(
          fetchRoads()
        );
      } catch (error) {
        console.error(
          "Road drag error:",
          error
        );

        alert(
          error?.message ||
            "Failed to move road"
        );
      }
    };

  /* =======================================================
     ROAD UPDATE
  ======================================================= */

  const handleUpdateRoad =
    async (
      field,
      value
    ) => {
      if (
        !selectedRoad?._id
      ) {
        return;
      }

      const updatedRoad = {
        ...selectedRoad,
        [field]: value,
      };

      setSelectedRoad(
        updatedRoad
      );

      try {
        const saved =
          await dispatch(
            updateRoad({
              id:
                selectedRoad._id,

              data: {
                [field]:
                  field ===
                    "width" ||
                  field ===
                    "distance" ||
                  field ===
                    "walkingTime"
                    ? Number(value)
                    : value,
              },
            })
          ).unwrap();

        if (saved) {
          setSelectedRoad(
            saved
          );
        }

        dispatch(
          fetchRoads()
        );
      } catch (error) {
        console.error(
          "Road update error:",
          error
        );
      }
    };

  /* =======================================================
     ROAD DELETE
  ======================================================= */

  const handleDeleteRoad =
    async (
      id
    ) => {
      if (!id) return;

      const confirmed =
        window.confirm(
          "Are you sure you want to delete this road?"
        );

      if (!confirmed) {
        return;
      }

      try {
        await dispatch(
          deleteRoad(id)
        ).unwrap();

        setSelectedRoad(
          null
        );

        dispatch(
          fetchRoads()
        );
      } catch (error) {
        console.error(
          "Delete road error:",
          error
        );

        alert(
          error?.message ||
            "Failed to delete road"
        );
      }
    };

  /* =======================================================
     FLOOR CREATE
  ======================================================= */

  const handleCreateFloor =
    async () => {
      if (
        !currentBuilding?._id
      ) {
        alert(
          "Please select a building first"
        );
        return;
      }

      if (
        !floorForm.name.trim()
      ) {
        alert(
          "Please enter floor name"
        );
        return;
      }

      try {
        await dispatch(
          createFloor({
            buildingId:
              currentBuilding._id,

            name:
              floorForm.name.trim(),

            floorNumber:
              Number(
                floorForm.floorNumber
              ),

            width:
              Number(
                floorForm.width
              ),

            height:
              Number(
                floorForm.height
              ),
               heightZ:
      Number(
        floorForm.heightZ
      ) || 4,


            description:
              floorForm.description,
          })
        ).unwrap();

        setShowFloorModal(
          false
        );

        setFloorForm({
          name: "",
          floorNumber: 0,
          width: 1000,
          height: 700,
            heightZ: 4,
          description: "",
        });

        dispatch(
          fetchFloorsByBuilding(
            currentBuilding._id
          )
        );
      } catch (error) {
        console.error(
          "Create floor error:",
          error
        );

        alert(
          error?.message ||
            "Failed to create floor"
        );
      }
    };

  /* =======================================================
     FLOOR DELETE
  ======================================================= */

  const handleDeleteFloor =
    async (
      floor
    ) => {
      if (!floor?._id) {
        return;
      }

      const confirmed =
        window.confirm(
          `Delete ${floor.name}?`
        );

      if (!confirmed) {
        return;
      }

      try {
        await dispatch(
          deleteFloor(floor._id)
        ).unwrap();

        dispatch(
          setCurrentFloor(null)
        );

        setSelectedElement(
          null
        );

        if (
          currentBuilding?._id
        ) {
          dispatch(
            fetchFloorsByBuilding(
              currentBuilding._id
            )
          );
        }
      } catch (error) {
        console.error(
          "Delete floor error:",
          error
        );
      }
    };

  /* =======================================================
     FLOOR CANVAS CLICK
  ======================================================= */

  const handleCanvasClick =
    (event) => {
      if (
        activeTool ===
          "select" ||
        !activeTool
      ) {
        return;
      }

      if (
        !currentFloor?._id
      ) {
        return;
      }

      const rect =
        floorCanvasRef.current?.getBoundingClientRect();

      if (!rect) return;

      const x =
        snapToGrid(
          event.clientX -
            rect.left
        );

      const y =
        snapToGrid(
          event.clientY -
            rect.top
        );

      const defaultColors = {
        room: "#86EFAC",
        classroom: "#7DD3FC",
        lab: "#FDE68A",
        office: "#D8B4FE",
        corridor: "#CBD5E1",
        door: "#FBBF24",
        staircase: "#FDBA74",
        washroom: "#93C5FD",
        wall: "#94A3B8",
        lift: "#67E8F9",
      };

      const data = {
        floorId:
          currentFloor._id,

        name:
          activeTool,

        type:
          activeTool,

        position: {
          x,
          y,
          z: 0,
        },

        dimensions: {
          width: 150,
          height: 100,
          depth: 100,
        },

        color:
          defaultColors[
            activeTool
          ] ||
          "#CBD5E1",

        strokeColor:
          "#334155",

        strokeWidth: 2,

        rotation: 0,
      };

      handleCreateElement(
        data
      );

      setActiveTool("select");
    };

  /* =======================================================
     FLOOR ELEMENT CREATE
  ======================================================= */

  const handleCreateElement =
    async (
      data
    ) => {
      try {
        await dispatch(
          createMapElement(data)
        ).unwrap();

        if (
          currentFloor?._id
        ) {
          dispatch(
            fetchMapElementsByFloor(
              currentFloor._id
            )
          );
        }
      } catch (error) {
        console.error(
          "Create floor element error:",
          error
        );

        alert(
          error?.message ||
            "Failed to create element"
        );
      }
    };

  /* =======================================================
     FLOOR ELEMENT SELECT
  ======================================================= */

  const handleElementClick =
    (element) => {
      if (!element) return;

      setSelectedElement(
        element
      );

      setSelectedBuilding(null);
      setSelectedRoad(null);
      setSelectedCampusElement(
        null
      );

      setActiveTool("select");
    };

  /* =======================================================
     FLOOR ELEMENT DRAG
  ======================================================= */

  const handleDragEnd =
    async (
      element,
      position
    ) => {
      if (!element?._id) {
        return;
      }

      const updatedPosition = {
        ...(element.position ||
          {}),
        ...position,
      };

      try {
        await dispatch(
          updateElementPosition({
            id:
              element._id,

            position:
              updatedPosition,
          })
        ).unwrap();

        setSelectedElement({
          ...element,
          position:
            updatedPosition,
        });

        if (
          currentFloor?._id
        ) {
          dispatch(
            fetchMapElementsByFloor(
              currentFloor._id
            )
          );
        }
      } catch (error) {
        console.error(
          "Floor element drag error:",
          error
        );
      }
    };

  /* =======================================================
     FLOOR ELEMENT PROPERTY
  ======================================================= */

  const handlePropertyChange =
    async (
      field,
      value
    ) => {
      if (
        !selectedElement?._id
      ) {
        return;
      }

      const updated = {
        ...selectedElement,
        [field]: value,
      };

      setSelectedElement(
        updated
      );

      try {
        await dispatch(
          updateMapElement({
            id:
              selectedElement._id,

            data: {
              [field]: value,
            },
          })
        ).unwrap();

        if (
          currentFloor?._id
        ) {
          dispatch(
            fetchMapElementsByFloor(
              currentFloor._id
            )
          );
        }
      } catch (error) {
        console.error(
          "Element property error:",
          error
        );
      }
    };

  /* =======================================================
     FLOOR ELEMENT POSITION
  ======================================================= */

  const handlePositionChange =
    async (
      field,
      value
    ) => {
      if (
        !selectedElement?._id
      ) {
        return;
      }

      const position = {
        ...(selectedElement.position ||
          {}),
        [field]:
          Number(value),
      };

      try {
        await dispatch(
          updateElementPosition({
            id:
              selectedElement._id,

            position,
          })
        ).unwrap();

        setSelectedElement({
          ...selectedElement,
          position,
        });
      } catch (error) {
        console.error(
          "Position update error:",
          error
        );
      }
    };

  /* =======================================================
     FLOOR ELEMENT DIMENSION
  ======================================================= */

  const handleDimensionChange =
    async (
      field,
      value
    ) => {
      if (
        !selectedElement?._id
      ) {
        return;
      }

      const numeric =
        Number(value);

      if (
        !Number.isFinite(
          numeric
        ) ||
        numeric <= 0
      ) {
        return;
      }

      const dimensions = {
        ...(selectedElement.dimensions ||
          {}),
        [field]: numeric,
      };

      try {
        await dispatch(
          updateElementDimensions({
            id:
              selectedElement._id,

            dimensions,
          })
        ).unwrap();

        setSelectedElement({
          ...selectedElement,
          dimensions,
        });
      } catch (error) {
        console.error(
          "Dimension update error:",
          error
        );
      }
    };

  /* =======================================================
     ROTATE FLOOR ELEMENT
  ======================================================= */

  const rotateElement =
    async (
      angle = 90
    ) => {
      if (
        !selectedElement?._id
      ) {
        return;
      }

      const rotation =
        (
          Number(
            selectedElement.rotation ||
              0
          ) +
          angle
        ) %
        360;

      try {
        await dispatch(
          updateMapElement({
            id:
              selectedElement._id,

            data: {
              rotation,
            },
          })
        ).unwrap();

        setSelectedElement({
          ...selectedElement,
          rotation,
        });
      } catch (error) {
        console.error(
          "Rotation error:",
          error
        );
      }
    };

  /* =======================================================
     SAVE FLOOR ELEMENT
  ======================================================= */

  const saveSelectedElement =
    async () => {
      if (
        !selectedElement?._id
      ) {
        return;
      }

      try {
        await dispatch(
          updateMapElement({
            id:
              selectedElement._id,

            data:
              selectedElement,
          })
        ).unwrap();

        alert(
          "Element saved successfully"
        );
      } catch (error) {
        console.error(
          "Save element error:",
          error
        );
      }
    };

  /* =======================================================
     DELETE FLOOR ELEMENT
  ======================================================= */

  const handleDeleteElement =
    async (
      id
    ) => {
      if (!id) return;

      const confirmed =
        window.confirm(
          "Are you sure you want to delete this element?"
        );

      if (!confirmed) {
        return;
      }

      try {
        await dispatch(
          deleteMapElement(id)
        ).unwrap();

        setSelectedElement(
          null
        );

        if (
          currentFloor?._id
        ) {
          dispatch(
            fetchMapElementsByFloor(
              currentFloor._id
            )
          );
        }
      } catch (error) {
        console.error(
          "Delete floor element error:",
          error
        );
      }
    };

  /* =======================================================
     ADD AS LOCATION
  ======================================================= */

  const handleAddAsLocation =
    async () => {
      const source =
        selectedElement ||
        selectedCampusElement;

      if (!source) {
        return;
      }

      try {
        setLocationSaving(
          true
        );

        const locationData = {
          name:
            source.name,

          category:
            source.type,

          floor:
            currentFloor?._id,

          building:
            currentBuilding?._id,

          description:
            source.description ||
            "",

          x:
            source.position?.x ||
            0,

          y:
            source.position?.y ||
            0,

          icon:
            source.icon ||
            "location",
        };

        console.log(
          "Location data:",
          locationData
        );

        alert(
          "Location data prepared successfully."
        );
      } catch (error) {
        console.error(
          "Location save error:",
          error
        );
      } finally {
        setLocationSaving(
          false
        );
      }
    };

  /* =======================================================
     LOADING
  ======================================================= */

  const isLoading =
    buildingLoading ||
    floorLoading ||
    elementLoading ||
    campusElementLoading ||
    roadLoading;

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="relative h-screen bg-slate-100 flex flex-col overflow-hidden">
      <CampusHeader
        editorMode={editorMode}
        mapView={mapView}
        showGrid={showGrid}
        setMapView={setMapView}
        setShowGrid={setShowGrid}
        handleBackToCampus={
          handleBackToCampus
        }
        buildingsCount={
          buildings.length
        }
        roadsCount={
          campusRoads.length
        }
      />

      <div className="flex flex-1 overflow-hidden">
        {/* =================================================
            LEFT SIDEBAR
        ================================================= */}

        <aside className="w-72 shrink-0 bg-white border-r border-slate-200 flex flex-col overflow-hidden">
          {editorMode ===
            "campus" && (
            <CampusSidebar
              buildings={
                buildings
              }

              buildingLoading={
                buildingLoading
              }

              selectedBuilding={
                selectedBuilding
              }

              activeTool={
                activeTool
              }

              setActiveTool={
                setActiveTool
              }

              setShowBuildingModal={
                setShowBuildingModal
              }

              setShowRoadModal={
                setShowRoadModal
              }

              handleBuildingSelect={
                handleBuildingSelect
              }

              handleOpenBuilding={
                handleOpenBuilding
              }
            />
          )}

          {editorMode ===
            "floor" && (
            <FloorSidebar
              currentBuilding={
                currentBuilding ||
                selectedBuilding
              }

              floors={
                floors
              }

              currentFloor={
                currentFloor
              }

              setShowFloorModal={
                setShowFloorModal
              }

              handleBackToCampus={
                handleBackToCampus
              }

              handleFloorSelect={
                handleFloorSelect
              }

              activeTool={
                activeTool
              }

              setActiveTool={
                setActiveTool
              }

              handleDeleteFloor={
                handleDeleteFloor
              }
            />
          )}
        </aside>

        {/* =================================================
            CENTER
        ================================================= */}

        <main className="relative flex-1 bg-slate-200 overflow-auto p-4">
          {editorMode ===
            "campus" && (
            <CampusMap
              campusCanvasRef={
                campusCanvasRef
              }

              campusWidth={
                DEFAULT_CAMPUS_WIDTH
              }

              campusHeight={
                DEFAULT_CAMPUS_HEIGHT
              }

              showGrid={
                showGrid
              }

              mapView={
                mapView
              }

              activeTool={
                activeTool
              }

              buildings={
                buildings
              }

              campusRoads={
                campusRoads
              }

              campusElements={
                campusElements
              }

              selectedBuilding={
                selectedBuilding
              }

              selectedRoad={
                selectedRoad
              }

              selectedCampusElement={
                selectedCampusElement
              }

              createCampusRoad={
                createCampusRoad
              }

              handleCampusCanvasClick={
                handleCampusCanvasClick
              }

              handleBuildingDragEnd={
                handleBuildingDragEnd
              }

              handleDeleteBuilding={
                handleDeleteBuilding
              }

              handleBuildingSelect={
                handleBuildingSelect
              }

              handleOpenBuilding={
                handleOpenBuilding
              }

              handleCampusElementSelect={
                handleCampusElementSelect
              }

              handleCampusElementDragEnd={
                handleCampusElementDragEnd
              }

              handleCampusElementResizeEnd={
                handleCampusElementResizeEnd
              }

              handleRoadDragEnd={
                handleRoadDragEnd
              }

              handleRoadClick={
                handleRoadClick
              }

              setSelectedBuilding={
                setSelectedBuilding
              }

              setSelectedRoad={
                setSelectedRoad
              }

              setSelectedElement={
                setSelectedElement
              }

              setSelectedCampusElement={
                setSelectedCampusElement
              }
            />
          )}

          {editorMode ===
            "floor" && (
            <FloorMap
              currentFloor={
                currentFloor
              }

              currentBuilding={
                currentBuilding
              }

              elements={
                renderedElements
              }

              floorCanvasRef={
                floorCanvasRef
              }

              floorWidth={
                floorWidth
              }

              floorHeight={
                floorHeight
              }

              showGrid={
                showGrid
              }

              mapView={
                mapView
              }

              activeTool={
                activeTool
              }

              selectedElement={
                selectedElement
              }

              handleCanvasClick={
                handleCanvasClick
              }

              handleDragEnd={
                handleDragEnd
              }

              handleElementClick={
                handleElementClick
              }

              setSelectedElement={
                setSelectedElement
              }
             //  handleCanvasClick={handleCanvasClick}
  //handleDragEnd={handleDragEnd}
  //handleElementClick={handleElementClick}

  handleElementMove={
  handleElementMove
}

handleElementMoveEnd={
  handleElementMoveEnd
}

handleElementResize={
  handleElementResize
}

handleElementResizeEnd={
  handleElementResizeEnd
}
            />
          )}
        </main>

        {/* =================================================
            PROPERTIES
        ================================================= */}

        <PropertiesPanel
          editorMode={
            editorMode
          }

          selectedBuilding={
            selectedBuilding
          }

          selectedRoad={
            selectedRoad
          }

          selectedElement={
            selectedElement
          }

          selectedCampusElement={
            selectedCampusElement
          }

          handleBuildingSelect={
            handleBuildingSelect
          }

          updateRoad={
            handleUpdateRoad
          }

          deleteRoad={
            handleDeleteRoad
          }

          handlePropertyChange={
            handlePropertyChange
          }

          handlePositionChange={
            handlePositionChange
          }

          handleDimensionChange={
            handleDimensionChange
          }

          rotateElement={
            rotateElement
          }

          saveSelectedElement={
            saveSelectedElement
          }

          handleAddAsLocation={
            handleAddAsLocation
          }

          handleDeleteElement={
            handleDeleteElement
          }

          locationSaving={
            locationSaving
          }

          handleDeleteBuilding={
            handleDeleteBuilding
          }

          handleBuildingPropertyChange={
            handleBuildingPropertyChange
          }

          handleBuildingPositionChange={
            handleBuildingPositionChange
          }

          handleBuildingDimensionChange={
            handleBuildingDimensionChange
          }

          handleCampusElementPropertyChange={
            handleCampusElementPropertyChange
          }

          handleCampusElementPositionChange={
            handleCampusElementPositionChange
          }

          handleCampusElementDimensionChange={
            handleCampusElementDimensionChange
          }

          handleDeleteCampusElement={
            handleDeleteCampusElement
          }
        />
      </div>

      {/* =====================================================
          MODALS
      ===================================================== */}

      <BuildingModal
        show={
          showBuildingModal
        }

        buildingForm={
          buildingForm
        }

        setBuildingForm={
          setBuildingForm
        }

        handleCreateBuilding={
          handleCreateBuilding
        }

        setShowBuildingModal={
          setShowBuildingModal
        }
      />

      <FloorModal
        show={
          showFloorModal
        }

        floorForm={
          floorForm
        }

        setFloorForm={
          setFloorForm
        }

        handleCreateFloor={
          handleCreateFloor
        }

        setShowFloorModal={
          setShowFloorModal
        }
      />

      <RoadModal
        show={
          showRoadModal
        }

        buildings={
          buildings
        }

        roadForm={
          roadForm
        }

        setRoadForm={
          setRoadForm
        }

        handleCreateRoad={
          handleCreateRoad
        }

        setShowRoadModal={
          setShowRoadModal
        }
      />

      <LoadingOverlay
        show={
          isLoading
        }

        message={
          editorMode ===
          "campus"
            ? "Loading campus..."
            : "Loading floor map..."
        }
      />
    </div>
  );
};

export default AdminCampusBuilder;