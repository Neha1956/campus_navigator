import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PanelLeft, SlidersHorizontal, Save, CheckCircle2 } from "lucide-react";

import {
  fetchCampusElements,
  createCampusElement,
  updateCampusElement,
  deleteCampusElement,
} from "../../redux/slices/campusElementSlice";

import {
  fetchBuildings,
  createBuilding,
  updateBuilding,
  deleteBuilding,
  setCurrentBuilding,
} from "../../redux/slices/buildingSlice";

import {
  fetchFloorsByBuilding,
  createFloor,
  deleteFloor,
  setCurrentFloor,
} from "../../redux/slices/floorSlice";

import {
  fetchMapElementsByFloor,
  createMapElement,
  updateMapElement,
  updateElementPosition,
  updateElementDimensions,
  deleteMapElement,
} from "../../redux/slices/mapElementSlice";

import {
  fetchRoads,
  createRoad,
  updateRoad,
  deleteRoad,
} from "../../redux/slices/roadSlice";

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

const DEFAULT_CAMPUS_WIDTH = 1400;
const DEFAULT_CAMPUS_HEIGHT = 900;
const GRID_SIZE = 20;

const CAMPUS_ELEMENT_TYPES = [
  "parking",
  "park",
  "ground",
  "small-room",
  "gate",
  "pond",
];

const mergePatch = (base, patch) => {
  const next = { ...base, ...patch };
  if (patch.position) next.position = { ...(base.position || {}), ...patch.position };
  if (patch.dimensions) next.dimensions = { ...(base.dimensions || {}), ...patch.dimensions };
  return next;
};

const applyPending = (entity, pendingMap) => {
  const patch = pendingMap[entity._id];
  if (!patch) return entity;
  return mergePatch(entity, patch);
};

const AdminCampusBuilder = () => {
  const dispatch = useDispatch();

  const buildingState = useSelector((state) => state.buildings || {});
  const floorState = useSelector((state) => state.floors || {});
  const elementState = useSelector((state) => state.mapElements || {});
  const campusElementState = useSelector((state) => state.campusElements || {});
  const roadState = useSelector((state) => state.roads || {});

  const rawBuildings = buildingState.buildings || [];
  const buildingLoading = buildingState.loading || false;
  const currentBuilding = buildingState.currentBuilding || null;

  const floors = floorState.floors || [];
  const floorLoading = floorState.loading || false;
  const currentFloor = floorState.currentFloor || null;

  const rawElements = elementState.elements || [];
  const elementLoading = elementState.loading || false;

  const rawCampusElements = campusElementState.elements || [];
  const campusElementLoading = campusElementState.loading || false;

  const rawRoads = roadState.roads || [];
  const roadLoading = roadState.loading || false;

  const [buildingDrafts, setBuildingDrafts] = useState({});
  const [roadDrafts, setRoadDrafts] = useState({});
  const [campusElementDrafts, setCampusElementDrafts] = useState({});
  const [floorElementDrafts, setFloorElementDrafts] = useState({});

  const [savingMap, setSavingMap] = useState(false);

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [mobilePropertiesOpen, setMobilePropertiesOpen] = useState(false);

  const hasUnsavedChanges =
    Object.keys(buildingDrafts).length > 0 ||
    Object.keys(roadDrafts).length > 0 ||
    Object.keys(campusElementDrafts).length > 0 ||
    Object.keys(floorElementDrafts).length > 0;

  const buildings = rawBuildings.map((b) => applyPending(b, buildingDrafts));
  const campusRoads = rawRoads.map((r) => applyPending(r, roadDrafts));
  const campusElements = rawCampusElements.map((e) => applyPending(e, campusElementDrafts));
  const renderedElements = rawElements.map((e) => applyPending(e, floorElementDrafts));

  const [editorMode, setEditorMode] = useState("campus");
  const [mapView, setMapView] = useState("2d");
  const [showGrid, setShowGrid] = useState(true);
  const [activeTool, setActiveTool] = useState("select");

  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [selectedRoad, setSelectedRoad] = useState(null);
  const [selectedElement, setSelectedElement] = useState(null);
  const [selectedCampusElement, setSelectedCampusElement] = useState(null);

  const [showBuildingModal, setShowBuildingModal] = useState(false);
  const [showFloorModal, setShowFloorModal] = useState(false);
  const [showRoadModal, setShowRoadModal] = useState(false);

  const [buildingForm, setBuildingForm] = useState({
    name: "",
    description: "",
    type: "academic",
    x: 100,
    y: 100,
    width: 250,
    height: 180,
    color: "#BFDBFE",
  });

  const [floorForm, setFloorForm] = useState({
    name: "",
    floorNumber: 0,
    width: 1000,
    height: 700,
    heightZ: 4,
    description: "",
  });

  const [roadForm, setRoadForm] = useState({
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

  const campusCanvasRef = useRef(null);
  const floorCanvasRef = useRef(null);

  const floorWidth = Number(currentFloor?.width || floorForm.width || 1000);
  const floorHeight = Number(currentFloor?.height || floorForm.height || 700);
  const [locationSaving, setLocationSaving] = useState(false);

  useEffect(() => {
    dispatch(fetchBuildings());
    dispatch(fetchRoads());
    dispatch(fetchCampusElements());
  }, [dispatch]);

  useEffect(() => {
    if (currentBuilding?._id) {
      dispatch(fetchFloorsByBuilding(currentBuilding._id));
    }
  }, [currentBuilding?._id, dispatch]);

  useEffect(() => {
    if (currentFloor?._id) {
      dispatch(fetchMapElementsByFloor(currentFloor._id));
    }
  }, [currentFloor?._id, dispatch]);

  useEffect(() => {
    setFloorElementDrafts({});
    setSelectedElement(null);
  }, [currentFloor?._id]);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (!hasUnsavedChanges) return;
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges]);

  const snapToGrid = (value) => {
    const number = Number(value) || 0;
    if (!showGrid) return number;
    return Math.round(number / GRID_SIZE) * GRID_SIZE;
  };

  const clearSelections = () => {
    setSelectedBuilding(null);
    setSelectedRoad(null);
    setSelectedElement(null);
    setSelectedCampusElement(null);
  };

  const confirmDiscardIfDirty = () => {
    if (!hasUnsavedChanges) return true;
    return window.confirm(
      'You have unsaved changes on the map. Continue and lose them? Click Cancel and press "Save Map" first if you want to keep them.'
    );
  };

  const handleSaveMap = async () => {
    if (!hasUnsavedChanges || savingMap) return;
    setSavingMap(true);

    try {
      for (const id of Object.keys(buildingDrafts)) {
        await dispatch(updateBuilding({ id, data: buildingDrafts[id] })).unwrap();
      }

      for (const id of Object.keys(roadDrafts)) {
        await dispatch(updateRoad({ id, data: roadDrafts[id] })).unwrap();
      }

      for (const id of Object.keys(campusElementDrafts)) {
        await dispatch(updateCampusElement({ id, data: campusElementDrafts[id] })).unwrap();
      }

      for (const id of Object.keys(floorElementDrafts)) {
        const patch = floorElementDrafts[id];
        const original = rawElements.find((el) => el._id === id);
        if (!original) continue;

        if (patch.position) {
          await dispatch(
            updateElementPosition({
              id,
              position: { ...(original.position || {}), ...patch.position },
            })
          ).unwrap();
        }

        if (patch.dimensions) {
          await dispatch(
            updateElementDimensions({
              id,
              dimensions: { ...(original.dimensions || {}), ...patch.dimensions },
            })
          ).unwrap();
        }

        const otherFields = { ...patch };
        delete otherFields.position;
        delete otherFields.dimensions;

        if (Object.keys(otherFields).length > 0) {
          await dispatch(updateMapElement({ id, data: otherFields })).unwrap();
        }
      }

      setBuildingDrafts({});
      setRoadDrafts({});
      setCampusElementDrafts({});
      setFloorElementDrafts({});

      dispatch(fetchBuildings());
      dispatch(fetchRoads());
      dispatch(fetchCampusElements());

      if (currentFloor?._id) {
        dispatch(fetchMapElementsByFloor(currentFloor._id));
      }

      alert("Map saved successfully.");
    } catch (error) {
      console.error("Save map error:", error);
      alert(error?.message || "Failed to save map.");
    } finally {
      setSavingMap(false);
    }
  };

  const handleElementMove = (element, newX, newY) => {
    if (!element?._id) return;
    const x = Math.round(newX);
    const y = Math.round(newY);

    setFloorElementDrafts((prev) => ({
      ...prev,
      [element._id]: mergePatch(prev[element._id] || {}, { position: { x, y } }),
    }));

    setSelectedElement((prev) =>
      prev?._id === element._id ? { ...prev, position: { ...(prev.position || {}), x, y } } : prev
    );
  };

  const handleElementMoveEnd = (element, newX, newY) => {
    handleElementMove(element, newX, newY);
  };

  const handleElementResize = (element, newWidth, newHeight) => {
    if (!element?._id) return;
    const width = Math.round(newWidth);
    const height = Math.round(newHeight);

    setFloorElementDrafts((prev) => ({
      ...prev,
      [element._id]: mergePatch(prev[element._id] || {}, { dimensions: { width, height } }),
    }));

    setSelectedElement((prev) =>
      prev?._id === element._id ? { ...prev, dimensions: { ...(prev.dimensions || {}), width, height } } : prev
    );
  };

  const handleElementResizeEnd = (element, newWidth, newHeight) => {
    handleElementResize(element, newWidth, newHeight);
  };

  const handleBuildingSelect = (building) => {
    if (!building) return;
    setSelectedBuilding(building);
    setSelectedRoad(null);
    setSelectedElement(null);
    setSelectedCampusElement(null);
    dispatch(setCurrentBuilding(building));
    setActiveTool("select");
  };

  const handleOpenBuilding = (building) => {
    handleBuildingSelect(building);
    setEditorMode("floor");
    setActiveTool("select");
  };

  const handleBackToCampus = () => {
    if (!confirmDiscardIfDirty()) return;
    setEditorMode("campus");
    setActiveTool("select");
    clearSelections();
    setFloorElementDrafts({});
    dispatch(setCurrentFloor(null));
  };

  const handleFloorSelect = (floor) => {
    if (currentFloor?._id !== floor?._id && !confirmDiscardIfDirty()) return;
    dispatch(setCurrentFloor(floor));
    setSelectedElement(null);
    setSelectedRoad(null);
    setSelectedCampusElement(null);
    setActiveTool("select");
  };

  const handleCreateBuilding = async () => {
    if (!buildingForm.name.trim()) {
      alert("Please enter building name");
      return;
    }

    const data = {
      name: buildingForm.name.trim(),
      description: buildingForm.description,
      type: buildingForm.type,
      position: {
        x: snapToGrid(buildingForm.x),
        y: snapToGrid(buildingForm.y),
        z: 0,
      },
      dimensions: {
        width: Number(buildingForm.width) || 250,
        height: Number(buildingForm.height) || 180,
        depth: Number(buildingForm.height) || 180,
      },
      color: buildingForm.color,
    };

    try {
      await dispatch(createBuilding(data)).unwrap();
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
      alert(error?.message || "Failed to create building");
    }
  };

  const handleDeleteBuilding = async (id) => {
    if (!id) return;
    if (!window.confirm("Are you sure you want to delete this building?")) return;

    try {
      await dispatch(deleteBuilding(id)).unwrap();
      setSelectedBuilding(null);
      setBuildingDrafts((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      dispatch(fetchBuildings());
    } catch (error) {
      alert(error?.message || "Failed to delete building");
    }
  };

  const patchBuildingDraft = (id, patch) => {
    setBuildingDrafts((prev) => ({
      ...prev,
      [id]: mergePatch(prev[id] || {}, patch),
    }));
  };

  const handleBuildingPropertyChange = (field, value) => {
    if (!selectedBuilding?._id) return;
    patchBuildingDraft(selectedBuilding._id, { [field]: value });
    setSelectedBuilding((prev) => ({ ...prev, [field]: value }));
  };

  const handleBuildingPositionChange = (field, value) => {
    if (!selectedBuilding?._id) return;
    const numericValue = Number(value);
    if (!Number.isFinite(numericValue)) return;
    patchBuildingDraft(selectedBuilding._id, { position: { [field]: numericValue } });
    setSelectedBuilding((prev) => ({
      ...prev,
      position: { ...(prev.position || {}), [field]: numericValue },
    }));
  };

  const handleBuildingDimensionChange = (field, value) => {
    if (!selectedBuilding?._id) return;
    const numericValue = Number(value);
    if (!Number.isFinite(numericValue) || numericValue <= 0) return;
    patchBuildingDraft(selectedBuilding._id, { dimensions: { [field]: numericValue } });
    setSelectedBuilding((prev) => ({
      ...prev,
      dimensions: { ...(prev.dimensions || {}), [field]: numericValue },
    }));
  };

  const handleBuildingRotation = (angle = 15, reset = false) => {
    if (!selectedBuilding?._id) return;
    const currentRotation = Number(selectedBuilding.rotation || 0);
    const rotation = reset ? 0 : (currentRotation + angle + 360) % 360;

    patchBuildingDraft(selectedBuilding._id, { rotation });
    setSelectedBuilding((prev) => (prev ? { ...prev, rotation } : prev));
  };

  const handleBuildingDragEnd = (building, position) => {
    if (!building?._id) return;
    patchBuildingDraft(building._id, { position });
    setSelectedBuilding((prev) =>
      prev?._id === building._id ? { ...prev, position: { ...(prev.position || {}), ...position } } : prev
    );
  };

  const handleCreateCampusElement = async (data) => {
    if (!data) return;
    try {
      await dispatch(createCampusElement(data)).unwrap();
      await dispatch(fetchCampusElements());
      setActiveTool("select");
    } catch (error) {
      console.error("Create campus element error:", error);
      alert(error?.message || "Failed to create campus element");
    }
  };

  const handleCampusCanvasClick = (event, worldCoords = null) => {
    let targetX = 0;
    let targetY = 0;

    if (worldCoords && typeof worldCoords.x === "number") {
      targetX = worldCoords.x;
      targetY = worldCoords.y;
    } else if (event && campusCanvasRef.current) {
      const svg = campusCanvasRef.current;
      const point = svg.createSVGPoint();
      point.x = event.clientX;
      point.y = event.clientY;

      const matrix = svg.getScreenCTM()?.inverse();
      if (!matrix) return;
      const svgPoint = point.matrixTransform(matrix);
      targetX = svgPoint.x;
      targetY = svgPoint.y;
    } else {
      return;
    }

    const snappedX = Math.max(0, snapToGrid(targetX));
    const snappedY = Math.max(0, snapToGrid(targetY));

    if (activeTool === "road") {
      const newRoadData = {
        name: "Campus Pathway",
        type: "road",
        points: [
          { x: snappedX - 60, y: snappedY },
          { x: snappedX + 60, y: snappedY },
        ],
        width: Number(roadForm.width) || 20,
        color: roadForm.color || "#64748B",
        distance: 0,
        walkingTime: 0,
      };
      createCampusRoad(newRoadData);
      setActiveTool("select");
      return;
    }

    if (!CAMPUS_ELEMENT_TYPES.includes(activeTool)) return;

    const defaultColors = {
      parking: "#CBD5E1",
      park: "#BBF7D0",
      ground: "#FDE68A",
      "small-room": "#C4B5FD",
      pond: "#BAE6FD",
      gate: "#E2E8F0",
    };

    const strokeColors = {
      parking: "#334155",
      park: "#166534",
      ground: "#92400e",
      "small-room": "#334155",
      pond: "#0284C7",
      gate: "#334155",
    };

    const dimensions = {
      parking: { width: 220, height: 130 },
      park: { width: 220, height: 160 },
      ground: { width: 280, height: 180 },
      "small-room": { width: 150, height: 100 },
      pond: { width: 200, height: 140 },
      gate: { width: 160, height: 70 },
    };

    const size = dimensions[activeTool] || dimensions["small-room"];

    const data = {
      name: activeTool.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase()),
      type: activeTool,
      position: { x: snappedX, y: snappedY, z: 0 },
      dimensions: { width: size.width, height: size.height, depth: size.height },
      color: defaultColors[activeTool] || "#CBD5E1",
      strokeColor: strokeColors[activeTool] || "#334155",
      strokeWidth: 2,
      rotation: 0,
    };

    handleCreateCampusElement(data);
  };

  const handleCampusElementSelect = (element) => {
    if (!element) return;
    setSelectedCampusElement(element);
    setSelectedBuilding(null);
    setSelectedRoad(null);
    setSelectedElement(null);
    setActiveTool("select");
  };

  const patchCampusElementDraft = (id, patch) => {
    setCampusElementDrafts((prev) => ({
      ...prev,
      [id]: mergePatch(prev[id] || {}, patch),
    }));
  };

  const handleCampusElementDragEnd = (element, position) => {
    if (!element?._id) return;
    patchCampusElementDraft(element._id, { position });
    setSelectedCampusElement((prev) =>
      prev?._id === element._id ? { ...prev, position: { ...(prev.position || {}), ...position } } : prev
    );
  };

  const handleCampusElementResizeEnd = (element, dimensions) => {
    if (!element?._id) return;
    patchCampusElementDraft(element._id, { dimensions });
    setSelectedCampusElement((prev) =>
      prev?._id === element._id ? { ...prev, dimensions: { ...(prev.dimensions || {}), ...dimensions } } : prev
    );
  };

  const handleCampusElementPropertyChange = (field, value) => {
    if (!selectedCampusElement?._id) return;
    patchCampusElementDraft(selectedCampusElement._id, { [field]: value });
    setSelectedCampusElement((prev) => ({ ...prev, [field]: value }));
  };

  const handleCampusElementPositionChange = (field, value) => {
    if (!selectedCampusElement?._id) return;
    const numericValue = Number(value);
    if (!Number.isFinite(numericValue)) return;
    patchCampusElementDraft(selectedCampusElement._id, { position: { [field]: numericValue } });
    setSelectedCampusElement((prev) => ({
      ...prev,
      position: { ...(prev.position || {}), [field]: numericValue },
    }));
  };

  const handleCampusElementDimensionChange = (field, value) => {
    if (!selectedCampusElement?._id) return;
    const numericValue = Number(value);
    if (!Number.isFinite(numericValue) || numericValue <= 0) return;
    patchCampusElementDraft(selectedCampusElement._id, { dimensions: { [field]: numericValue } });
    setSelectedCampusElement((prev) => ({
      ...prev,
      dimensions: { ...(prev.dimensions || {}), [field]: numericValue },
    }));
  };

  const handleDeleteCampusElement = async (id) => {
    if (!id) return;
    if (!window.confirm("Are you sure you want to delete this campus element?")) return;

    try {
      await dispatch(deleteCampusElement(id)).unwrap();
      setSelectedCampusElement(null);
      setCampusElementDrafts((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      dispatch(fetchCampusElements());
    } catch (error) {
      alert(error?.message || "Failed to delete campus element");
    }
  };

  const handleCreateRoad = async () => {
    if (!roadForm.name.trim()) {
      alert("Please enter road name");
      return;
    }

    let defaultPoints = [
      { x: 150, y: 150 },
      { x: 350, y: 150 },
    ];

    if (roadForm.fromBuilding && roadForm.toBuilding) {
      const fromBuilding = buildings.find((b) => b._id === roadForm.fromBuilding);
      const toBuilding = buildings.find((b) => b._id === roadForm.toBuilding);
      if (fromBuilding && toBuilding) {
        defaultPoints = [
          { x: Number(fromBuilding.position?.x || 0), y: Number(fromBuilding.position?.y || 0) },
          { x: Number(toBuilding.position?.x || 0), y: Number(toBuilding.position?.y || 0) },
        ];
      }
    }

    const points =
      Array.isArray(roadForm.points) && roadForm.points.length >= 2
        ? roadForm.points
        : defaultPoints;

    try {
      await dispatch(
        createRoad({
          name: roadForm.name.trim(),
          type: roadForm.type || "road",
          fromBuilding: roadForm.fromBuilding || null,
          toBuilding: roadForm.toBuilding || null,
          points,
          width: Number(roadForm.width) || 20,
          color: roadForm.color || "#64748B",
          distance: Number(roadForm.distance) || 0,
          walkingTime: Number(roadForm.walkingTime) || 0,
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
      dispatch(fetchRoads());
    } catch (error) {
      alert(error?.message || "Failed to create road");
    }
  };

  const createCampusRoad = async (roadData) => {
    if (!roadData) return;
    try {
      await dispatch(
        createRoad({
          ...roadData,
          name: roadData.name?.trim() || "Campus Road",
          type: roadData.type || "road",
          width: Number(roadData.width) || 20,
          color: roadData.color || "#64748B",
          points: Array.isArray(roadData.points) ? roadData.points : [],
          distance: Number(roadData.distance) || 0,
          walkingTime: Number(roadData.walkingTime) || 0,
        })
      ).unwrap();
      dispatch(fetchRoads());
    } catch (error) {
      alert(error?.message || "Failed to create campus road");
    }
  };

  const handleRoadClick = (road) => {
    if (!road) return;
    setSelectedRoad(road);
    setSelectedBuilding(null);
    setSelectedElement(null);
    setSelectedCampusElement(null);
    setActiveTool("select");
  };

  const patchRoadDraft = (id, patch) => {
    setRoadDrafts((prev) => ({
      ...prev,
      [id]: mergePatch(prev[id] || {}, patch),
    }));
  };

  const handleRoadDragEnd = (road, updatedPoints) => {
    if (!road?._id || !Array.isArray(updatedPoints) || updatedPoints.length < 2) return;
    patchRoadDraft(road._id, { points: updatedPoints });
    setSelectedRoad((prev) =>
      prev?._id === road._id ? { ...prev, points: updatedPoints } : prev
    );
  };

  const handleUpdateRoad = (field, value) => {
    if (!selectedRoad?._id) return;
    const numericFields = ["width", "distance", "walkingTime"];
    const finalValue = numericFields.includes(field) ? Number(value) : value;
    patchRoadDraft(selectedRoad._id, { [field]: finalValue });
    setSelectedRoad((prev) => ({ ...prev, [field]: finalValue }));
  };

  const handleDeleteRoad = async (id) => {
    if (!id) return;
    if (!window.confirm("Are you sure you want to delete this road?")) return;

    try {
      await dispatch(deleteRoad(id)).unwrap();
      setSelectedRoad(null);
      setRoadDrafts((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      dispatch(fetchRoads());
    } catch (error) {
      alert(error?.message || "Failed to delete road");
    }
  };

  const handleCreateFloor = async () => {
    if (!currentBuilding?._id) {
      alert("Please select a building first");
      return;
    }
    if (!floorForm.name.trim()) {
      alert("Please enter floor name");
      return;
    }

    try {
      await dispatch(
        createFloor({
          buildingId: currentBuilding._id,
          name: floorForm.name.trim(),
          floorNumber: Number(floorForm.floorNumber),
          width: Number(floorForm.width),
          height: Number(floorForm.height),
          heightZ: Number(floorForm.heightZ) || 4,
          description: floorForm.description,
        })
      ).unwrap();

      setShowFloorModal(false);
      setFloorForm({
        name: "",
        floorNumber: 0,
        width: 1000,
        height: 700,
        heightZ: 4,
        description: "",
      });
      dispatch(fetchFloorsByBuilding(currentBuilding._id));
    } catch (error) {
      alert(error?.message || "Failed to create floor");
    }
  };

  const handleDeleteFloor = async (floor) => {
    if (!floor?._id) return;
    if (!window.confirm(`Delete ${floor.name}?`)) return;

    try {
      await dispatch(deleteFloor(floor._id)).unwrap();
      dispatch(setCurrentFloor(null));
      setSelectedElement(null);
      setFloorElementDrafts({});
      if (currentBuilding?._id) {
        dispatch(fetchFloorsByBuilding(currentBuilding._id));
      }
    } catch (error) {
      console.error("Delete floor error:", error);
    }
  };

  const handleCanvasClick = (event) => {
    if (activeTool === "select" || !activeTool) return;
    if (!currentFloor?._id) return;

    const rect = floorCanvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = snapToGrid(event.clientX - rect.left);
    const y = snapToGrid(event.clientY - rect.top);

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
      floorId: currentFloor._id,
      name: activeTool,
      type: activeTool,
      position: { x, y, z: 0 },
      dimensions: { width: 150, height: 100, depth: 100 },
      color: defaultColors[activeTool] || "#CBD5E1",
      strokeColor: "#334155",
      strokeWidth: 2,
      rotation: 0,
    };

    handleCreateElement(data);
    setActiveTool("select");
  };

  const handleCreateElement = async (data) => {
    try {
      await dispatch(createMapElement(data)).unwrap();
      if (currentFloor?._id) {
        dispatch(fetchMapElementsByFloor(currentFloor._id));
      }
    } catch (error) {
      alert(error?.message || "Failed to create element");
    }
  };

  const handleElementClick = (element) => {
    if (!element) return;
    setSelectedElement(element);
    setSelectedBuilding(null);
    setSelectedRoad(null);
    setSelectedCampusElement(null);
    setActiveTool("select");
  };

  const handleDragEnd = (element, position) => {
    if (!element?._id) return;
    handleElementMove(element, position.x, position.y);
  };

  const patchFloorElementDraft = (id, patch) => {
    setFloorElementDrafts((prev) => ({
      ...prev,
      [id]: mergePatch(prev[id] || {}, patch),
    }));
  };

  const handlePropertyChange = (field, value) => {
    if (!selectedElement?._id) return;
    patchFloorElementDraft(selectedElement._id, { [field]: value });
    setSelectedElement((prev) => ({ ...prev, [field]: value }));
  };

  const handlePositionChange = (field, value) => {
    if (!selectedElement?._id) return;
    const numericValue = Number(value);
    if (!Number.isFinite(numericValue)) return;
    patchFloorElementDraft(selectedElement._id, { position: { [field]: numericValue } });
    setSelectedElement((prev) => ({
      ...prev,
      position: { ...(prev.position || {}), [field]: numericValue },
    }));
  };

  const handleDimensionChange = (field, value) => {
    if (!selectedElement?._id) return;
    const numeric = Number(value);
    if (!Number.isFinite(numeric) || numeric <= 0) return;
    patchFloorElementDraft(selectedElement._id, { dimensions: { [field]: numeric } });
    setSelectedElement((prev) => ({
      ...prev,
      dimensions: { ...(prev.dimensions || {}), [field]: numeric },
    }));
  };

  const rotateElement = (angle = 90) => {
    if (!selectedElement?._id) return;
    const rotation = (Number(selectedElement.rotation || 0) + angle) % 360;
    patchFloorElementDraft(selectedElement._id, { rotation });
    setSelectedElement((prev) => ({ ...prev, rotation }));
  };

  const saveSelectedElement = () => {
    if (!selectedElement?._id) return;
    handleSaveMap();
  };

  const handleDeleteElement = async (id) => {
    if (!id) return;
    if (!window.confirm("Are you sure you want to delete this element?")) return;

    try {
      await dispatch(deleteMapElement(id)).unwrap();
      setSelectedElement(null);
      setFloorElementDrafts((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      if (currentFloor?._id) {
        dispatch(fetchMapElementsByFloor(currentFloor._id));
      }
    } catch (error) {
      console.error("Delete floor element error:", error);
    }
  };

  const handleAddAsLocation = async () => {
    const source = selectedElement || selectedCampusElement;
    if (!source) return;

    try {
      setLocationSaving(true);
      const locationData = {
        name: source.name,
        category: source.type,
        floor: currentFloor?._id,
        building: currentBuilding?._id,
        description: source.description || "",
        x: source.position?.x || 0,
        y: source.position?.y || 0,
        icon: source.icon || "location",
      };
      console.log("Location data prepared:", locationData);
      alert("Location data prepared successfully.");
    } catch (error) {
      console.error("Location save error:", error);
    } finally {
      setLocationSaving(false);
    }
  };

  const isLoading =
    buildingLoading || floorLoading || elementLoading || campusElementLoading || roadLoading;

  const hasAnySelection = Boolean(
    selectedBuilding || selectedRoad || selectedElement || selectedCampusElement
  );

  return (
    <div className="relative flex h-screen w-screen flex-col overflow-hidden bg-slate-900 font-sans">
      <CampusHeader
        editorMode={editorMode}
        mapView={mapView}
        showGrid={showGrid}
        setMapView={setMapView}
        setShowGrid={setShowGrid}
        handleBackToCampus={handleBackToCampus}
        buildingsCount={buildings.length}
        roadsCount={campusRoads.length}
      />

      <div className="relative flex flex-1 overflow-hidden">
        {/* MOBILE SIDEBAR BACKDROP */}
        {mobileSidebarOpen && (
          <div
            onClick={() => setMobileSidebarOpen(false)}
            className="fixed inset-0 z-[110] bg-slate-950/60 backdrop-blur-sm lg:hidden"
          />
        )}

        {/* LEFT DRAWER / DESKTOP SIDEBAR */}
        <aside
          className={`fixed inset-y-0 left-0 z-[120] w-80 max-w-[85vw] transform border-r border-slate-200 bg-white transition-transform duration-300 ease-in-out lg:static lg:z-auto lg:w-72 lg:translate-x-0 xl:w-80 ${
            mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {editorMode === "campus" && (
            <CampusSidebar
              buildings={buildings}
              buildingLoading={buildingLoading}
              selectedBuilding={selectedBuilding}
              activeTool={activeTool}
              setActiveTool={setActiveTool}
              setShowBuildingModal={setShowBuildingModal}
              setShowRoadModal={setShowRoadModal}
              handleBuildingSelect={(b) => {
                handleBuildingSelect(b);
                setMobileSidebarOpen(false);
              }}
              handleOpenBuilding={(b) => {
                handleOpenBuilding(b);
                setMobileSidebarOpen(false);
              }}
              handleBuildingRotation={handleBuildingRotation}
              onCloseMobile={() => setMobileSidebarOpen(false)}
            />
          )}

          {editorMode === "floor" && (
            <FloorSidebar
              currentBuilding={currentBuilding || selectedBuilding}
              floors={floors}
              currentFloor={currentFloor}
              setShowFloorModal={setShowFloorModal}
              handleBackToCampus={handleBackToCampus}
              handleFloorSelect={(f) => {
                handleFloorSelect(f);
                setMobileSidebarOpen(false);
              }}
              activeTool={activeTool}
              setActiveTool={setActiveTool}
              handleDeleteFloor={handleDeleteFloor}
              onCloseMobile={() => setMobileSidebarOpen(false)}
            />
          )}
        </aside>

        {/* MAIN CANVAS VIEWPORT */}
        <main className="relative flex flex-1 flex-col overflow-hidden bg-slate-100">
          {/* TOP CONTROLS BAR */}
          <div className="pointer-events-none absolute inset-x-0 top-0 z-[100] flex items-center justify-between p-2.5 sm:p-4">
            <div className="pointer-events-auto flex items-center gap-2">
              <button
                type="button"
                onClick={() => setMobileSidebarOpen(true)}
                className="flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white/95 px-3 py-2 text-xs font-bold text-slate-800 shadow-md backdrop-blur transition hover:bg-slate-50 active:scale-95 lg:hidden"
              >
                <PanelLeft size={16} className="text-blue-600" />
                <span>Tools</span>
              </button>

              {hasAnySelection && (
                <button
                  type="button"
                  onClick={() => setMobilePropertiesOpen(true)}
                  className="flex items-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50/95 px-3 py-2 text-xs font-bold text-blue-700 shadow-md backdrop-blur transition hover:bg-blue-100 active:scale-95 lg:hidden"
                >
                  <SlidersHorizontal size={16} />
                  <span>Properties</span>
                </button>
              )}
            </div>

            <div className="pointer-events-auto ml-auto">
              <button
                type="button"
                onClick={handleSaveMap}
                disabled={!hasUnsavedChanges || savingMap}
                className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold shadow-md transition active:scale-95 sm:px-4 sm:py-2 sm:text-sm ${
                  !hasUnsavedChanges
                    ? "cursor-not-allowed border border-slate-200 bg-white/80 text-slate-400 backdrop-blur"
                    : savingMap
                    ? "cursor-wait bg-blue-600 text-white"
                    : "bg-emerald-600 text-white shadow-emerald-600/30 hover:bg-emerald-700"
                }`}
              >
                {savingMap ? (
                  <>
                    <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>Saving...</span>
                  </>
                ) : hasUnsavedChanges ? (
                  <>
                    <Save size={15} />
                    <span className="hidden sm:inline">Save Changes</span>
                    <span className="sm:hidden">Save</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={15} className="text-slate-400" />
                    <span className="hidden sm:inline">All Saved</span>
                    <span className="sm:hidden">Saved</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* CANVAS MOUNT WITH TOP CLEARANCE */}
          <div className="relative flex-1 overflow-auto p-2 pt-14 sm:p-4 sm:pt-16 custom-scrollbar">
            {editorMode === "campus" && (
              <CampusMap
                campusCanvasRef={campusCanvasRef}
                campusWidth={DEFAULT_CAMPUS_WIDTH}
                campusHeight={DEFAULT_CAMPUS_HEIGHT}
                showGrid={showGrid}
                mapView={mapView}
                activeTool={activeTool}
                buildings={buildings}
                campusRoads={campusRoads}
                campusElements={campusElements}
                selectedBuilding={selectedBuilding}
                selectedRoad={selectedRoad}
                selectedCampusElement={selectedCampusElement}
                createCampusRoad={createCampusRoad}
                handleCampusCanvasClick={handleCampusCanvasClick}
                handleBuildingDragEnd={handleBuildingDragEnd}
                handleDeleteBuilding={handleDeleteBuilding}
                handleBuildingSelect={handleBuildingSelect}
                handleOpenBuilding={handleOpenBuilding}
                handleCampusElementSelect={handleCampusElementSelect}
                handleCampusElementDragEnd={handleCampusElementDragEnd}
                handleCampusElementResizeEnd={handleCampusElementResizeEnd}
                handleRoadDragEnd={handleRoadDragEnd}
                handleRoadClick={handleRoadClick}
                setSelectedBuilding={setSelectedBuilding}
                setSelectedRoad={setSelectedRoad}
                setSelectedElement={setSelectedElement}
                setSelectedCampusElement={setSelectedCampusElement}
                fitToContainer={true}
                showOpenFloorsOn3D={false}
              />
            )}

            {editorMode === "floor" && (
              <FloorMap
                currentFloor={currentFloor}
                currentBuilding={currentBuilding}
                elements={renderedElements}
                floorCanvasRef={floorCanvasRef}
                floorWidth={floorWidth}
                floorHeight={floorHeight}
                showGrid={showGrid}
                mapView={mapView}
                activeTool={activeTool}
                selectedElement={selectedElement}
                handleCanvasClick={handleCanvasClick}
                handleDragEnd={handleDragEnd}
                handleElementClick={handleElementClick}
                setSelectedElement={setSelectedElement}
                handleElementMove={handleElementMove}
                handleElementMoveEnd={handleElementMoveEnd}
                handleElementResize={handleElementResize}
                handleElementResizeEnd={handleElementResizeEnd}
              />
            )}
          </div>
        </main>

        {/* MOBILE PROPERTIES BACKDROP */}
        {mobilePropertiesOpen && (
          <div
            onClick={() => setMobilePropertiesOpen(false)}
            className="fixed inset-0 z-[110] bg-slate-950/60 backdrop-blur-sm lg:hidden"
          />
        )}

        {/* RIGHT DRAWER / PROPERTIES PANEL */}
        <aside
          className={`fixed inset-y-0 right-0 z-[120] w-80 max-w-[85vw] transform border-l border-slate-200 bg-white shadow-2xl transition-transform duration-300 ease-in-out lg:static lg:z-auto lg:w-72 lg:translate-x-0 lg:shadow-none xl:w-80 ${
            mobilePropertiesOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <PropertiesPanel
            editorMode={editorMode}
            selectedBuilding={selectedBuilding}
            selectedRoad={selectedRoad}
            selectedElement={selectedElement}
            selectedCampusElement={selectedCampusElement}
            handleBuildingSelect={handleBuildingSelect}
            updateRoad={handleUpdateRoad}
            deleteRoad={handleDeleteRoad}
            handlePropertyChange={handlePropertyChange}
            handlePositionChange={handlePositionChange}
            handleDimensionChange={handleDimensionChange}
            rotateElement={rotateElement}
            saveSelectedElement={saveSelectedElement}
            handleAddAsLocation={handleAddAsLocation}
            handleDeleteElement={handleDeleteElement}
            locationSaving={locationSaving}
            handleDeleteBuilding={handleDeleteBuilding}
            handleBuildingPropertyChange={handleBuildingPropertyChange}
            handleBuildingPositionChange={handleBuildingPositionChange}
            handleBuildingDimensionChange={handleBuildingDimensionChange}
            handleCampusElementPropertyChange={handleCampusElementPropertyChange}
            handleCampusElementPositionChange={handleCampusElementPositionChange}
            handleCampusElementDimensionChange={handleCampusElementDimensionChange}
            handleDeleteCampusElement={handleDeleteCampusElement}
            onCloseMobile={() => setMobilePropertiesOpen(false)}
          />
        </aside>
      </div>

      {/* MODALS & OVERLAYS */}
      <BuildingModal
        show={showBuildingModal}
        buildingForm={buildingForm}
        setBuildingForm={setBuildingForm}
        handleCreateBuilding={handleCreateBuilding}
        setShowBuildingModal={setShowBuildingModal}
      />

      <FloorModal
        show={showFloorModal}
        floorForm={floorForm}
        setFloorForm={setFloorForm}
        handleCreateFloor={handleCreateFloor}
        setShowFloorModal={setShowFloorModal}
      />

      <RoadModal
        show={showRoadModal}
        buildings={buildings}
        roadForm={roadForm}
        setRoadForm={setRoadForm}
        handleCreateRoad={handleCreateRoad}
        setShowRoadModal={setShowRoadModal}
      />

      <LoadingOverlay
        show={isLoading || savingMap}
        message={
          savingMap
            ? "Saving map state..."
            : editorMode === "campus"
            ? "Loading campus..."
            : "Loading floor map..."
        }
      />
    </div>
  );
};

export default AdminCampusBuilder;