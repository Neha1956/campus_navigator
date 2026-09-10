import React, { useMemo, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Grid, Environment, Html } from "@react-three/drei";
import * as THREE from "three";
import {
  Building2,
  MousePointer2,
  Plus,
  Minus,
  RotateCcw,
} from "lucide-react";

import BuildingRenderer from "./BuildingRenderer";
import CampusElementRenderer from "./CampusElementRenderer";

const CAMPUS_ELEMENT_TYPES = [
  "parking",
  "park",
  "ground",
  "small-room",
  "pond",
  "gate",
];

const ELEMENT_COLORS = {
  parking: "#94A3B8",
  park: "#4ADE80",
  ground: "#A3E635",
  "small-room": "#FDE047",
  pond: "#38BDF8",
  gate: "#64748B",
};

const MAP_EXTRA_PADDING = 400;
const MAP_GROWTH_STEP = 400;
const MIN_ZOOM = 0.5;
const MAX_ZOOM = 2.5;
const ZOOM_STEP = 0.1;

const normalizeBuilding = (building) => {
  if (!building) return null;
  const position = building.position || {};
  const dimensions = building.dimensions || {};

  const x = Number(position.x ?? building.x ?? 0);
  const y = Number(position.y ?? building.y ?? 0);
  const z = Number(position.z ?? building.z ?? 0);

  const width = Math.max(60, Number(dimensions.width ?? building.width ?? 250));
  const height = Math.max(60, Number(dimensions.height ?? building.height ?? 180));
  const depth = Math.max(20, Number(dimensions.depth ?? building.depth ?? height));

  return {
    ...building,
    position: { ...position, x, y, z },
    dimensions: { ...dimensions, width, height, depth },
    x,
    y,
    z,
    width,
    height,
    depth,
  };
};

const safeNumber = (value, fallback = 0) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
};

/* =========================================================
   3D DRAGGABLE WRAPPER
========================================================= */

const DraggableObject3D = ({
  position,
  onDragStart,
  onDragEnd,
  onClick,
  children,
  readOnly,
}) => {
  const groupRef = useRef();
  const isDragging = useRef(false);
  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 1, 0), 0), []);
  const offset = useRef(new THREE.Vector3());
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const intersectionPoint = useMemo(() => new THREE.Vector3(), []);

  const handlePointerDown = (e) => {
    if (readOnly) return;
    e.stopPropagation();
    onClick?.();

    isDragging.current = true;
    onDragStart?.();

    const mouse = new THREE.Vector2(
      (e.clientX / window.innerWidth) * 2 - 1,
      -(e.clientY / window.innerHeight) * 2 + 1
    );
    raycaster.setFromCamera(mouse, e.camera);
    if (raycaster.ray.intersectPlane(plane, intersectionPoint)) {
      if (groupRef.current) {
        offset.current.set(
          intersectionPoint.x - groupRef.current.position.x,
          0,
          intersectionPoint.z - groupRef.current.position.z
        );
      }
    }

    const onPointerMove = (moveEvent) => {
      if (!isDragging.current || !groupRef.current) return;
      const moveMouse = new THREE.Vector2(
        (moveEvent.clientX / window.innerWidth) * 2 - 1,
        -(moveEvent.clientY / window.innerHeight) * 2 + 1
      );
      raycaster.setFromCamera(moveMouse, e.camera);
      if (raycaster.ray.intersectPlane(plane, intersectionPoint)) {
        const nextX = Math.round(intersectionPoint.x - offset.current.x);
        const nextZ = Math.round(intersectionPoint.z - offset.current.z);
        groupRef.current.position.x = nextX;
        groupRef.current.position.z = nextZ;
      }
    };

    const onPointerUp = () => {
      if (isDragging.current && groupRef.current) {
        isDragging.current = false;
        window.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("pointerup", onPointerUp);
        onDragEnd?.(groupRef.current.position.x, groupRef.current.position.z);
      }
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
  };

  return (
    <group ref={groupRef} position={position} onPointerDown={handlePointerDown}>
      {children}
    </group>
  );
};

/* =========================================================
   3D BUILDING COMPONENT
========================================================= */

const Building3D = ({
  building,
  onOpen,
  onSelect,
  onDragEnd,
  setOrbitEnabled,
  showOpenFloors,
  readOnly,
}) => {
  const position = building.position || {};
  const dimensions = building.dimensions || {};

  const width = Math.max(60, Number(dimensions.width || 250));
  const height = Math.max(40, Number(dimensions.height || 180));
  const depth = Math.max(40, Number(dimensions.depth || dimensions.height || 180));

  const x = Number(position.x || 0) + width / 2;
  const z = Number(position.y || 0) + depth / 2;
  const y = height / 2;

  const rotation = (Number(building.rotation || 0) * Math.PI) / 180;
  const color = building.color || "#93C5FD";

  return (
    <DraggableObject3D
      position={[x, y, z]}
      readOnly={readOnly}
      onDragStart={() => setOrbitEnabled(false)}
      onDragEnd={(finalX, finalZ) => {
        setOrbitEnabled(true);
        const finalElementX = Math.round(finalX - width / 2);
        const finalElementY = Math.round(finalZ - depth / 2);
        onDragEnd?.(building, { x: finalElementX, y: finalElementY, z: 0 });
      }}
      onClick={() => onSelect?.(building)}
    >
      <group rotation={[0, -rotation, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[width, height, depth]} />
          <meshStandardMaterial color={color} roughness={0.4} metalness={0.1} />
        </mesh>

        <lineSegments>
          <edgesGeometry args={[new THREE.BoxGeometry(width, height, depth)]} />
          <lineBasicMaterial color="#334155" linewidth={1} />
        </lineSegments>

        <Html position={[0, height / 2 + 15, 0]} center distanceFactor={1100} occlude>
          <div className="flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl shadow-lg border border-slate-200 bg-white/95 text-xs font-bold whitespace-nowrap select-none pointer-events-auto">
            <span className="text-slate-800">{building.name}</span>
            {showOpenFloors && onOpen && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpen(building);
                }}
                className="flex items-center gap-1 text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded shadow hover:bg-blue-700"
              >
                <span>Open Floors</span>
              </button>
            )}
          </div>
        </Html>
      </group>
    </DraggableObject3D>
  );
};

/* =========================================================
   3D CAMPUS ELEMENT COMPONENT
========================================================= */

const CampusElement3D = ({
  element,
  onSelect,
  onDragEnd,
  setOrbitEnabled,
  readOnly,
}) => {
  const position = element.position || {};
  const dimensions = element.dimensions || {};

  const width = Math.max(40, Number(dimensions.width || 180));
  const depth = Math.max(40, Number(dimensions.height || 120));
  const height = element.type === "gate" ? 50 : 6;

  const x = Number(position.x || 0) + width / 2;
  const z = Number(position.y || 0) + depth / 2;
  const y = height / 2;

  const color = element.color || ELEMENT_COLORS[element.type] || "#CBD5E1";

  return (
    <DraggableObject3D
      position={[x, y, z]}
      readOnly={readOnly}
      onDragStart={() => setOrbitEnabled(false)}
      onDragEnd={(finalX, finalZ) => {
        setOrbitEnabled(true);
        const finalElementX = Math.round(finalX - width / 2);
        const finalElementY = Math.round(finalZ - depth / 2);
        onDragEnd?.(element, { x: finalElementX, y: finalElementY, z: 0 });
      }}
      onClick={() => onSelect?.(element)}
    >
      {element.type === "pond" ? (
        <mesh receiveShadow position={[0, 1, 0]}>
          <cylinderGeometry args={[width / 2, width / 2, 4, 32]} />
          <meshStandardMaterial
            color="#0284C7"
            roughness={0.1}
            metalness={0.8}
            transparent
            opacity={0.85}
          />
        </mesh>
      ) : element.type === "gate" ? (
        <group>
          <mesh position={[-width / 2 + 10, 25, 0]} castShadow>
            <boxGeometry args={[16, 50, 16]} />
            <meshStandardMaterial color="#475569" />
          </mesh>
          <mesh position={[width / 2 - 10, 25, 0]} castShadow>
            <boxGeometry args={[16, 50, 16]} />
            <meshStandardMaterial color="#475569" />
          </mesh>
          <mesh position={[0, 50, 0]} castShadow>
            <boxGeometry args={[width + 10, 12, 20]} />
            <meshStandardMaterial color="#334155" />
          </mesh>
        </group>
      ) : (
        <mesh receiveShadow castShadow>
          <boxGeometry args={[width, height, depth]} />
          <meshStandardMaterial color={color} roughness={0.7} />
        </mesh>
      )}

      <Html position={[0, height + 8, 0]} center distanceFactor={1100} occlude>
        <div className="px-2 py-0.5 rounded text-[11px] font-semibold whitespace-nowrap shadow bg-white/90 text-slate-700 pointer-events-none select-none">
          {element.name || element.type}
        </div>
      </Html>
    </DraggableObject3D>
  );
};

const Road3D = ({ road, getRoadPoints, onSelect }) => {
  const points = getRoadPoints(road);
  if (!points || points.length < 2) return null;

  const width = Number(road.width) || 24;

  return (
    <group
      onClick={(e) => {
        e.stopPropagation();
        onSelect?.(road);
      }}
    >
      {points.slice(0, -1).map((pt1, idx) => {
        const pt2 = points[idx + 1];
        const dx = Number(pt2.x) - Number(pt1.x);
        const dz = Number(pt2.y) - Number(pt1.y);
        const distance = Math.hypot(dx, dz);
        const angle = Math.atan2(dz, dx);

        const midX = (Number(pt1.x) + Number(pt2.x)) / 2;
        const midZ = (Number(pt1.y) + Number(pt2.y)) / 2;

        return (
          <group key={idx} position={[midX, 1, midZ]} rotation={[0, -angle, 0]}>
            <mesh receiveShadow>
              <boxGeometry args={[distance, 2, width]} />
              <meshStandardMaterial color={road.color || "#475569"} roughness={0.9} />
            </mesh>
            <mesh position={[0, 1.1, 0]}>
              <boxGeometry args={[distance * 0.9, 0.5, Math.max(2, width * 0.1)]} />
              <meshStandardMaterial color="#E2E8F0" />
            </mesh>
          </group>
        );
      })}
    </group>
  );
};

const CampusViewer3DCanvas = ({
  buildings = [],
  campusElements = [],
  campusRoads = [],
  getRoadPoints,
  onOpenBuilding,
  onBuildingSelect,
  onCampusElementSelect,
  onBuildingDragEnd,
  onCampusElementDragEnd,
  onRoadSelect,
  onGroundClick,
  showOpenFloors = false,
  mapWidth,
  mapHeight,
  activeTool,
  readOnly,
  currentLocation,
}) => {
  const [orbitEnabled, setOrbitEnabled] = useState(true);

  return (
    <div className="absolute inset-0 w-full h-full min-h-[380px] sm:min-h-[500px] lg:min-h-[600px] bg-slate-950">
      <Canvas
        shadows
        camera={{
          position: [mapWidth * 0.75, 800, mapHeight * 0.95],
          fov: 45,
          near: 1,
          far: 20000,
        }}
      >
        <ambientLight intensity={1.5} />
        <directionalLight
          position={[mapWidth * 0.5, 1200, mapHeight * 0.5]}
          intensity={2.2}
          castShadow
        />
        <Environment preset="city" />

        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[mapWidth / 2, -1, mapHeight / 2]}
          receiveShadow
          onClick={(e) => {
            e.stopPropagation();
            if (onGroundClick) {
              onGroundClick({ x: e.point.x, y: e.point.z });
            }
          }}
        >
          <planeGeometry args={[mapWidth, mapHeight]} />
          <meshStandardMaterial color="#F1F5F9" roughness={0.8} />
        </mesh>

        <Grid
          args={[mapWidth, mapHeight]}
          cellSize={20}
          cellThickness={0.6}
          sectionSize={100}
          sectionThickness={1.2}
          fadeDistance={4000}
          fadeStrength={1}
          position={[mapWidth / 2, 0.2, mapHeight / 2]}
        />

        {campusRoads.map((road) => (
          <Road3D
            key={road._id}
            road={road}
            getRoadPoints={getRoadPoints}
            onSelect={onRoadSelect}
          />
        ))}

        {campusElements.map((el) => (
          <CampusElement3D
            key={el._id}
            element={el}
            readOnly={readOnly}
            setOrbitEnabled={setOrbitEnabled}
            onSelect={onCampusElementSelect}
            onDragEnd={onCampusElementDragEnd}
          />
        ))}

        {buildings.map((b) => (
          <Building3D
            key={b._id}
            building={b}
            readOnly={readOnly}
            setOrbitEnabled={setOrbitEnabled}
            onOpen={onOpenBuilding}
            onSelect={onBuildingSelect}
            onDragEnd={onBuildingDragEnd}
            showOpenFloors={showOpenFloors}
          />
        ))}

        {/* GOOGLE MAPS STYLE 3D BLUE PIN */}
        {currentLocation && (
          <group position={[Number(currentLocation.x), 18, Number(currentLocation.y)]} renderOrder={1001}>
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 2, 0]}>
              <ringGeometry args={[16, 32, 32]} />
              <meshBasicMaterial color="#3B82F6" transparent opacity={0.6} depthTest={false} />
            </mesh>
            <mesh position={[0, 30, 0]}>
              <coneGeometry args={[14, 35, 24]} />
              <meshStandardMaterial color="#2563EB" emissive="#1D4ED8" emissiveIntensity={0.8} />
            </mesh>
            <Html position={[0, 65, 0]} center distanceFactor={900}>
              <div className="rounded-full border-2 border-white bg-blue-600 px-3.5 py-1 text-[11px] font-extrabold uppercase text-white shadow-2xl whitespace-nowrap">
                {currentLocation.name}
              </div>
            </Html>
          </group>
        )}

        <OrbitControls
          enabled={orbitEnabled}
          enableDamping
          dampingFactor={0.08}
          minDistance={100}
          maxDistance={5000}
          maxPolarAngle={Math.PI / 2.05}
          target={[
            currentLocation ? Number(currentLocation.x) : mapWidth / 2,
            0,
            currentLocation ? Number(currentLocation.y) : mapHeight / 2,
          ]}
        />
      </Canvas>

      <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 bg-white/90 backdrop-blur rounded-xl px-3 py-2 text-[10px] sm:text-[11px] text-slate-600 shadow-xl pointer-events-none">
        {CAMPUS_ELEMENT_TYPES.includes(activeTool) ? (
          <span className="text-blue-600 font-bold">
            🖱 Click Ground to place {activeTool} in 3D
          </span>
        ) : (
          "🖱 Drag = Move • 🖱 Orbit = Rotate"
        )}
      </div>
    </div>
  );
};

const CampusMap = ({
  campusCanvasRef,
  campusWidth = 1400,
  campusHeight = 900,
  showGrid,
  mapView = "2d",
  activeTool = "select",
  buildings = [],
  campusRoads = [],
  campusElements = [],
  selectedBuilding,
  selectedRoad,
  selectedCampusElement,
  locations = [],
  selectedLocation,
  onLocationClick,
  routePath = [],
  sourceLocation,
  destinationLocation,
  onMapPointSelected,
  readOnly = false,
  fitToContainer = false,
  routeLocations = [],
  createCampusRoad,
  handleCampusCanvasClick,
  handleBuildingDragEnd,
  handleDeleteBuilding,
  handleBuildingSelect,
  handleOpenBuilding,
  handleCampusElementSelect,
  handleCampusElementDragEnd,
  handleCampusElementResizeEnd,
  handleRoadDragEnd,
  handleRoadClick,
  setSelectedBuilding,
  setSelectedRoad,
  setSelectedElement,
  setSelectedCampusElement,
  showOpenFloorsOn3D = true,
  currentLocation = null,
}) => {
  const wrapperRef = useRef(null);
  const mapViewportRef = useRef(null);

  const is3D = mapView === "3d";
  const [zoom, setZoom] = useState(1);

  const [draggingRoadId, setDraggingRoadId] = useState(null);
  const roadDragRef = useRef(null);
  const roadPreviewRef = useRef(null);
  const [roadPreview, setRoadPreview] = useState(null);

  const roadResizeRef = useRef(null);
  const [resizingRoad, setResizingRoad] = useState(null);
  const roadResizePreviewRef = useRef(null);
  const [roadResizePreview, setRoadResizePreview] = useState(null);

  // Active current location marker resolved from props
  const activeCurrentLoc = currentLocation || (sourceLocation?.isCurrentLocation ? sourceLocation : null);

  const normalizedBuildings = useMemo(() => {
    return (Array.isArray(buildings) ? buildings : [])
      .map(normalizeBuilding)
      .filter(Boolean);
  }, [buildings]);

  const gridBackground = useMemo(() => {
    if (!showGrid) return "none";
    return `
      repeating-linear-gradient(0deg, rgba(100,116,139,.10) 0px, rgba(100,116,139,.10) 1px, transparent 1px, transparent 20px),
      repeating-linear-gradient(90deg, rgba(100,116,139,.10) 0px, rgba(100,116,139,.10) 1px, transparent 1px, transparent 20px)
    `;
  }, [showGrid]);

  const getRoadPoints = (road) => {
    if (Array.isArray(road?.points) && road.points.length >= 2) {
      return road.points;
    }
    const fromX = Number(
      road?.fromBuilding?.position?.x ??
        road?.from?.position?.x ??
        road?.fromBuilding?.x ??
        road?.from?.x ??
        0
    );
    const fromY = Number(
      road?.fromBuilding?.position?.y ??
        road?.from?.position?.y ??
        road?.fromBuilding?.y ??
        road?.from?.y ??
        0
    );
    const toX = Number(
      road?.toBuilding?.position?.x ??
        road?.to?.position?.x ??
        road?.toBuilding?.x ??
        road?.to?.x ??
        0
    );
    const toY = Number(
      road?.toBuilding?.position?.y ??
        road?.to?.position?.y ??
        road?.toBuilding?.y ??
        road?.to?.y ??
        0
    );

    return [
      { x: fromX, y: fromY },
      { x: toX, y: toY },
    ];
  };

  const pointsToString = (points) =>
    points.map((point) => `${Number(point.x)},${Number(point.y)}`).join(" ");

  const dynamicCampusSize = useMemo(() => {
    let requiredWidth = safeNumber(campusWidth, 1400);
    let requiredHeight = safeNumber(campusHeight, 900);

    normalizedBuildings.forEach((building) => {
      const x = safeNumber(building?.position?.x ?? building?.x);
      const y = safeNumber(building?.position?.y ?? building?.y);
      const width = Math.max(0, safeNumber(building?.dimensions?.width ?? building?.width, 250));
      const height = Math.max(0, safeNumber(building?.dimensions?.height ?? building?.height, 180));
      requiredWidth = Math.max(requiredWidth, x + width + MAP_EXTRA_PADDING);
      requiredHeight = Math.max(requiredHeight, y + height + MAP_EXTRA_PADDING);
    });

    (Array.isArray(campusElements) ? campusElements : []).forEach((element) => {
      const x = safeNumber(element?.position?.x);
      const y = safeNumber(element?.position?.y);
      const width = Math.max(0, safeNumber(element?.dimensions?.width, 150));
      const height = Math.max(0, safeNumber(element?.dimensions?.height, 100));
      requiredWidth = Math.max(requiredWidth, x + width + MAP_EXTRA_PADDING);
      requiredHeight = Math.max(requiredHeight, y + height + MAP_EXTRA_PADDING);
    });

    (Array.isArray(campusRoads) ? campusRoads : []).forEach((road) => {
      const points = getRoadPoints(road);
      points.forEach((point) => {
        const x = safeNumber(point?.x);
        const y = safeNumber(point?.y);
        requiredWidth = Math.max(requiredWidth, x + MAP_EXTRA_PADDING);
        requiredHeight = Math.max(requiredHeight, y + MAP_EXTRA_PADDING);
      });
    });

    (Array.isArray(locations) ? locations : []).forEach((location) => {
      const x = safeNumber(location?.x);
      const y = safeNumber(location?.y);
      requiredWidth = Math.max(requiredWidth, x + MAP_EXTRA_PADDING);
      requiredHeight = Math.max(requiredHeight, y + MAP_EXTRA_PADDING);
    });

    (Array.isArray(routeLocations) ? routeLocations : []).forEach((location) => {
      const x = safeNumber(location?.x);
      const y = safeNumber(location?.y);
      requiredWidth = Math.max(requiredWidth, x + MAP_EXTRA_PADDING);
      requiredHeight = Math.max(requiredHeight, y + MAP_EXTRA_PADDING);
    });

    (Array.isArray(routePath) ? routePath : []).forEach((point) => {
      const x = safeNumber(point?.x);
      const y = safeNumber(point?.y);
      requiredWidth = Math.max(requiredWidth, x + MAP_EXTRA_PADDING);
      requiredHeight = Math.max(requiredHeight, y + MAP_EXTRA_PADDING);
    });

    if (activeCurrentLoc) {
      const x = safeNumber(activeCurrentLoc.x);
      const y = safeNumber(activeCurrentLoc.y);
      requiredWidth = Math.max(requiredWidth, x + MAP_EXTRA_PADDING);
      requiredHeight = Math.max(requiredHeight, y + MAP_EXTRA_PADDING);
    }

    const finalWidth = Math.ceil(requiredWidth / MAP_GROWTH_STEP) * MAP_GROWTH_STEP;
    const finalHeight = Math.ceil(requiredHeight / MAP_GROWTH_STEP) * MAP_GROWTH_STEP;

    return {
      width: Math.max(campusWidth, finalWidth),
      height: Math.max(campusHeight, finalHeight),
    };
  }, [
    campusWidth,
    campusHeight,
    normalizedBuildings,
    campusElements,
    campusRoads,
    locations,
    routeLocations,
    routePath,
    activeCurrentLoc,
  ]);

  const mapWidth = dynamicCampusSize.width;
  const mapHeight = dynamicCampusSize.height;

  const clampZoom = (value) => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, value));

  const changeZoom = (nextZoom) => {
    const viewport = mapViewportRef.current;
    const newZoom = clampZoom(nextZoom);
    if (!viewport) {
      setZoom(newZoom);
      return;
    }

    const oldZoom = zoom;
    if (oldZoom === newZoom) return;

    const centerX = viewport.scrollLeft + viewport.clientWidth / 2;
    const centerY = viewport.scrollTop + viewport.clientHeight / 2;
    const scale = newZoom / oldZoom;

    setZoom(newZoom);

    requestAnimationFrame(() => {
      const currentViewport = mapViewportRef.current;
      if (!currentViewport) return;
      currentViewport.scrollLeft = Math.max(
        0,
        centerX * scale - currentViewport.clientWidth / 2
      );
      currentViewport.scrollTop = Math.max(
        0,
        centerY * scale - currentViewport.clientHeight / 2
      );
    });
  };

  const zoomIn = () => changeZoom(zoom + ZOOM_STEP);
  const zoomOut = () => changeZoom(zoom - ZOOM_STEP);
  const resetZoom = () => changeZoom(1);

  const handleMapWheel = (event) => {
    if (event.ctrlKey || event.metaKey) {
      event.preventDefault();
      if (event.deltaY < 0) {
        changeZoom(zoom + ZOOM_STEP);
      } else {
        changeZoom(zoom - ZOOM_STEP);
      }
    }
  };

  const getSvgPoint = (event) => {
    const svg =
      campusCanvasRef?.current ||
      event?.currentTarget?.ownerSVGElement ||
      document.querySelector("svg[data-campus-map='true']");

    if (!svg) return null;
    const point = svg.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;

    const matrix = svg.getScreenCTM()?.inverse();
    if (!matrix) return null;

    return point.matrixTransform(matrix);
  };

  const cleanupRoadDrag = () => {
    roadDragRef.current = null;
    roadPreviewRef.current = null;
    setDraggingRoadId(null);
    setRoadPreview(null);
    window.removeEventListener("pointermove", handleRoadPointerMove);
    window.removeEventListener("pointerup", handleRoadPointerUp);
  };

  const handleRoadPointerDown = (event, road) => {
    if (event.button !== undefined && event.button !== 0) return;
    if (activeTool !== "select") return;
    if (event.target?.dataset?.roadResizeHandle === "true") return;

    event.stopPropagation();
    event.preventDefault();

    handleRoadClick?.(road);
    const svgPoint = getSvgPoint(event);
    if (!svgPoint) return;

    const points = getRoadPoints(road);

    roadDragRef.current = {
      road,
      startX: svgPoint.x,
      startY: svgPoint.y,
      originalPoints: points.map((point) => ({
        x: Number(point.x),
        y: Number(point.y),
      })),
    };

    roadPreviewRef.current = {
      roadId: road._id,
      points: points.map((point) => ({
        x: Number(point.x),
        y: Number(point.y),
      })),
    };

    setDraggingRoadId(road._id);
    setRoadPreview(roadPreviewRef.current);

    window.addEventListener("pointermove", handleRoadPointerMove);
    window.addEventListener("pointerup", handleRoadPointerUp);
  };

  const handleRoadPointerMove = (event) => {
    const data = roadDragRef.current;
    if (!data) return;

    const svgPoint = getSvgPoint(event);
    if (!svgPoint) return;

    const dx = svgPoint.x - data.startX;
    const dy = svgPoint.y - data.startY;

    const updatedPoints = data.originalPoints.map((point) => ({
      x: point.x + dx,
      y: point.y + dy,
    }));

    const preview = {
      roadId: data.road._id,
      points: updatedPoints,
    };

    roadPreviewRef.current = preview;
    setRoadPreview(preview);
  };

  const handleRoadPointerUp = () => {
    const data = roadDragRef.current;
    if (!data) {
      cleanupRoadDrag();
      return;
    }

    const preview = roadPreviewRef.current;
    if (preview && preview.roadId === data.road._id) {
      handleRoadDragEnd?.(data.road, preview.points);
    }
    cleanupRoadDrag();
  };

  const cleanupRoadResize = () => {
    roadResizeRef.current = null;
    roadResizePreviewRef.current = null;
    setResizingRoad(null);
    setRoadResizePreview(null);
    window.removeEventListener("pointermove", handleRoadResizeMove);
    window.removeEventListener("pointerup", handleRoadResizeUp);
  };

  const handleRoadResizeDown = (event, road, endpointIndex) => {
    if (event.button !== undefined && event.button !== 0) return;
    if (activeTool !== "select") return;

    event.preventDefault();
    event.stopPropagation();

    handleRoadClick?.(road);
    const svgPoint = getSvgPoint(event);
    if (!svgPoint) return;

    const points = getRoadPoints(road);
    if (points.length < 2) return;

    const originalPoints = points.map((point) => ({
      x: Number(point.x),
      y: Number(point.y),
    }));

    roadResizeRef.current = {
      road,
      endpointIndex,
      startX: svgPoint.x,
      startY: svgPoint.y,
      originalPoints,
    };

    roadResizePreviewRef.current = {
      roadId: road._id,
      points: originalPoints,
    };

    setResizingRoad({
      roadId: road._id,
      endpointIndex,
    });

    setRoadResizePreview(roadResizePreviewRef.current);
    window.addEventListener("pointermove", handleRoadResizeMove);
    window.addEventListener("pointerup", handleRoadResizeUp);
  };

  const handleRoadResizeMove = (event) => {
    const data = roadResizeRef.current;
    if (!data) return;

    const svgPoint = getSvgPoint(event);
    if (!svgPoint) return;

    const updatedPoints = data.originalPoints.map((point) => ({ ...point }));
    updatedPoints[data.endpointIndex] = {
      x: Math.max(0, Math.round(svgPoint.x)),
      y: Math.max(0, Math.round(svgPoint.y)),
    };

    const preview = {
      roadId: data.road._id,
      points: updatedPoints,
    };

    roadResizePreviewRef.current = preview;
    setRoadResizePreview(preview);
  };

  const handleRoadResizeUp = () => {
    const data = roadResizeRef.current;
    if (!data) {
      cleanupRoadResize();
      return;
    }

    const preview = roadResizePreviewRef.current;
    if (preview && preview.roadId === data.road._id) {
      handleRoadDragEnd?.(data.road, preview.points);
    }
    cleanupRoadResize();
  };

  const clearSelection = () => {
    setSelectedBuilding?.(null);
    setSelectedRoad?.(null);
    setSelectedElement?.(null);
    setSelectedCampusElement?.(null);
  };

  const mapLocations = Array.isArray(locations)
    ? locations.filter(
        (location) =>
          location && location.x !== undefined && location.y !== undefined
      )
    : [];

  const routePoints = Array.isArray(routePath) ? routePath : [];
  const routePolyline = routePoints
    .map((point) => `${Number(point.x)},${Number(point.y)}`)
    .join(" ");

  const handleBackgroundClick = (event) => {
    if (onMapPointSelected) {
      const svg =
        campusCanvasRef?.current || event?.currentTarget?.ownerSVGElement;
      if (svg) {
        const point = svg.createSVGPoint();
        point.x = event.clientX;
        point.y = event.clientY;
        const matrix = svg.getScreenCTM()?.inverse();
        if (matrix) {
          const svgPoint = point.matrixTransform(matrix);
          onMapPointSelected(event, svgPoint);
        }
      }
      return;
    }

    if (event.target !== event.currentTarget) return;

    if (activeTool === "select" || !activeTool) {
      clearSelection();
      return;
    }

    if (CAMPUS_ELEMENT_TYPES.includes(activeTool)) {
      handleCampusCanvasClick?.(event);
    }
  };

  const handleMapPointCapture = (event) => {
    const svg = campusCanvasRef?.current;
    if (!svg || !onMapPointSelected) return;

    const point = svg.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;
    const matrix = svg.getScreenCTM()?.inverse();
    if (matrix) {
      onMapPointSelected(event, point.matrixTransform(matrix));
    }
  };

  const getToolMessage = () => {
    if (CAMPUS_ELEMENT_TYPES.includes(activeTool)) {
      return `Click anywhere on map to place ${activeTool}`;
    }
    if (activeTool === "select") {
      return "Select, move, resize or edit";
    }
    return "";
  };

  return (
    <div
      ref={wrapperRef}
      className={
        fitToContainer
          ? "relative h-full w-full min-h-[380px] sm:min-h-[500px]"
          : "relative min-w-max min-h-[380px] sm:min-h-[500px]"
      }
    >
      {!readOnly && !is3D && getToolMessage() && (
        <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-[2000] inline-flex items-center gap-1.5 rounded-lg bg-slate-900/90 backdrop-blur px-3 py-1.5 text-xs text-white shadow-lg pointer-events-none">
          <MousePointer2 size={14} />
          <span>{getToolMessage()}</span>
        </div>
      )}

      {is3D ? (
        <div className="relative w-full h-full min-h-[380px] sm:min-h-[500px] lg:min-h-[600px] overflow-hidden rounded-2xl border border-slate-300 shadow-xl bg-slate-950">
          <CampusViewer3DCanvas
            buildings={buildings}
            campusElements={campusElements}
            campusRoads={campusRoads}
            getRoadPoints={getRoadPoints}
            onOpenBuilding={handleOpenBuilding}
            onBuildingSelect={handleBuildingSelect}
            onCampusElementSelect={handleCampusElementSelect}
            onBuildingDragEnd={handleBuildingDragEnd}
            onCampusElementDragEnd={handleCampusElementDragEnd}
            onRoadSelect={handleRoadClick}
            readOnly={readOnly}
            onGroundClick={(coords) => {
              if (!readOnly && CAMPUS_ELEMENT_TYPES.includes(activeTool)) {
                handleCampusCanvasClick?.(null, coords);
              }
            }}
            showOpenFloors={showOpenFloorsOn3D}
            mapWidth={mapWidth}
            mapHeight={mapHeight}
            activeTool={activeTool}
            currentLocation={activeCurrentLoc}
          />
        </div>
      ) : (
        <div
          ref={fitToContainer ? mapViewportRef : undefined}
          onWheel={fitToContainer ? handleMapWheel : undefined}
          className={
            fitToContainer
              ? "relative h-full w-full min-h-[380px] sm:min-h-[500px] overflow-auto rounded-2xl border border-slate-300 bg-slate-100 shadow-xl custom-scrollbar"
              : "relative rounded-2xl border border-slate-300 bg-white shadow-xl overflow-auto custom-scrollbar"
          }
          style={
            fitToContainer
              ? { backgroundColor: "#f8fafc" }
              : {
                  backgroundImage: gridBackground,
                  backgroundColor: "#f8fafc",
                }
          }
        >
          <div
            className="relative"
            style={{
              width: `${mapWidth * zoom}px`,
              height: `${mapHeight * zoom}px`,
              minWidth: `${mapWidth * zoom}px`,
              minHeight: `${mapHeight * zoom}px`,
              backgroundImage: gridBackground,
              backgroundColor: "#f8fafc",
            }}
          >
            <svg
              ref={campusCanvasRef}
              data-campus-map="true"
              width={mapWidth * zoom}
              height={mapHeight * zoom}
              viewBox={`0 0 ${mapWidth} ${mapHeight}`}
              preserveAspectRatio="none"
              className="block"
              style={{
                width: `${mapWidth * zoom}px`,
                height: `${mapHeight * zoom}px`,
                overflow: "visible",
                cursor:
                  !readOnly && CAMPUS_ELEMENT_TYPES.includes(activeTool)
                    ? "crosshair"
                    : "default",
              }}
              onClick={handleBackgroundClick}
              onClickCapture={
                onMapPointSelected ? handleMapPointCapture : undefined
              }
            >
              <defs>
                <filter
                  id="building-shadow"
                  x="-30%"
                  y="-30%"
                  width="170%"
                  height="180%"
                >
                  <feDropShadow
                    dx="4"
                    dy="7"
                    stdDeviation="5"
                    floodColor="#0f172a"
                    floodOpacity="0.22"
                  />
                </filter>
              </defs>

              <rect
                x="0"
                y="0"
                width={mapWidth}
                height={mapHeight}
                fill={mapView === "3d" ? "#eef2f7" : "#f8fafc"}
                pointerEvents="none"
              />

              <rect
                x="20"
                y="20"
                width={Math.max(0, mapWidth - 40)}
                height={Math.max(0, mapHeight - 40)}
                rx="24"
                fill="transparent"
                stroke="#94a3b8"
                strokeWidth="2"
                pointerEvents="none"
              />

              <g data-layer="roads">
                {(Array.isArray(campusRoads) ? campusRoads : []).map(
                  (road) => {
                    let points = getRoadPoints(road);
                    if (roadPreview?.roadId === road._id)
                      points = roadPreview.points;
                    if (roadResizePreview?.roadId === road._id)
                      points = roadResizePreview.points;

                    const selected = selectedRoad?._id === road._id;
                    const width = Number(road.width) || 20;
                    const firstPoint = points[0];
                    const lastPoint = points[points.length - 1];

                    return (
                      <g key={road._id} data-road-id={road._id}>
                        <polyline
                          points={pointsToString(points)}
                          fill="none"
                          stroke="#0f172a"
                          strokeOpacity="0.15"
                          strokeWidth={width + 8}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          pointerEvents="none"
                        />
                        <polyline
                          points={pointsToString(points)}
                          fill="none"
                          stroke={
                            selected
                              ? "#2563EB"
                              : road.color || "#64748B"
                          }
                          strokeWidth={selected ? width + 6 : width}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className={
                            activeTool === "select"
                              ? "cursor-move"
                              : "cursor-default"
                          }
                          onPointerDown={
                            readOnly
                              ? undefined
                              : (event) =>
                                  handleRoadPointerDown(event, road)
                          }
                          onClick={
                            readOnly
                              ? undefined
                              : (event) => {
                                  event.stopPropagation();
                                  handleRoadClick?.(road);
                                }
                          }
                        />
                        <polyline
                          points={pointsToString(points)}
                          fill="none"
                          stroke="#e2e8f0"
                          strokeWidth={Math.max(2, width * 0.12)}
                          strokeDasharray="12 10"
                          strokeLinecap="round"
                          pointerEvents="none"
                        />
                        <text
                          x={points[0]?.x || 0}
                          y={(points[0]?.y || 0) - 12}
                          fontSize="13"
                          fontWeight="700"
                          fill={selected ? "#1d4ed8" : "#475569"}
                          pointerEvents="none"
                        >
                          {road.name}
                        </text>

                        {!readOnly &&
                          selected &&
                          activeTool === "select" &&
                          firstPoint &&
                          lastPoint && (
                            <g>
                              <circle
                                cx={firstPoint.x}
                                cy={firstPoint.y}
                                r="11"
                                fill="#ffffff"
                                stroke="#2563EB"
                                strokeWidth="3"
                                data-road-resize-handle="true"
                                className="cursor-ew-resize"
                                onPointerDown={(event) =>
                                  handleRoadResizeDown(event, road, 0)
                                }
                              />
                              <circle
                                cx={firstPoint.x}
                                cy={firstPoint.y}
                                r="4"
                                fill="#2563EB"
                                pointerEvents="none"
                              />
                              <circle
                                cx={lastPoint.x}
                                cy={lastPoint.y}
                                r="11"
                                fill="#ffffff"
                                stroke="#2563EB"
                                strokeWidth="3"
                                data-road-resize-handle="true"
                                className="cursor-ew-resize"
                                onPointerDown={(event) =>
                                  handleRoadResizeDown(
                                    event,
                                    road,
                                    points.length - 1
                                  )
                                }
                              />
                              <circle
                                cx={lastPoint.x}
                                cy={lastPoint.y}
                                r="4"
                                fill="#2563EB"
                                pointerEvents="none"
                              />
                              <text
                                x={(firstPoint.x + lastPoint.x) / 2}
                                y={(firstPoint.y + lastPoint.y) / 2 - 18}
                                textAnchor="middle"
                                fontSize="10"
                                fontWeight="700"
                                fill="#2563EB"
                                pointerEvents="none"
                              >
                                Drag endpoints to resize
                              </text>
                            </g>
                          )}
                      </g>
                    );
                  }
                )}
              </g>

              {routePolyline && (
                <>
                  <polyline
                    points={routePolyline}
                    fill="none"
                    stroke="rgba(255,255,255,0.95)"
                    strokeWidth="14"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    pointerEvents="none"
                  />
                  <polyline
                    points={routePolyline}
                    fill="none"
                    stroke="#2563eb"
                    strokeWidth="6"
                    strokeDasharray="1 16"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    pointerEvents="none"
                  />
                </>
              )}

              {mapLocations.length > 0 && (
                <g data-layer="location-pins">
                  {mapLocations.map((location) => {
                    const isSelected = selectedLocation?._id === location._id;
                    const pinColor = isSelected ? "#2563eb" : "#ef4444";

                    return (
                      <g
                        key={
                          location._id ||
                          `${location.name}-${location.x}-${location.y}`
                        }
                        transform={`translate(${Number(
                          location.x
                        )}, ${Number(location.y)})`}
                        onClick={(event) => {
                          event.stopPropagation();
                          onLocationClick?.(location);
                        }}
                        style={{ cursor: "pointer" }}
                      >
                        <circle
                          r={isSelected ? 28 : 22}
                          fill={pinColor}
                          opacity={isSelected ? 0.12 : 0.08}
                        />
                        <path
                          d="M0,-26 C-10,-26 -18,-18 -18,-8 C-18,5 -2,22 0,26 C2,22 18,5 18,-8 C18,-18 10,-26 0,-26 Z"
                          fill={pinColor}
                          stroke="#ffffff"
                          strokeWidth="2"
                        />
                        <circle r="7" fill="#ffffff" />
                        <text
                          x="0"
                          y="38"
                          textAnchor="middle"
                          fontSize="10"
                          fontWeight="700"
                          fill="#334155"
                        >
                          {location.name?.length > 15
                            ? `${location.name.slice(0, 14)}...`
                            : location.name}
                        </text>
                      </g>
                    );
                  })}
                </g>
              )}

              {sourceLocation && !sourceLocation.isCurrentLocation && (
                <g
                  transform={`translate(${Number(
                    sourceLocation.x
                  )}, ${Number(sourceLocation.y)})`}
                >
                  <circle
                    r="18"
                    fill="#2563eb"
                    stroke="#ffffff"
                    strokeWidth="4"
                  />
                  <circle r="6" fill="#ffffff" />
                </g>
              )}

              {/* =========================================================
                  GOOGLE MAPS STYLE LIVE LOCATION PIN (SVG 2D)
              ========================================================= */}
              {activeCurrentLoc && (
                <g
                  transform={`translate(${Number(activeCurrentLoc.x)}, ${Number(
                    activeCurrentLoc.y
                  )})`}
                  style={{ pointerEvents: "none" }}
                >
                  {/* Outer Pulsing Aura */}
                  <circle
                    r="32"
                    fill="#3b82f6"
                    opacity="0.25"
                    className="animate-ping"
                  />
                  <circle r="20" fill="#3b82f6" opacity="0.2" />

                  {/* Google Maps Style Blue Pin Body */}
                  <path
                    d="M0,-32 C-12,-32 -22,-22 -22,-10 C-22,6 0,28 0,32 C0,28 22,6 22,-10 C22,-22 12,-32 0,-32 Z"
                    fill="#2563eb"
                    stroke="#ffffff"
                    strokeWidth="3"
                    filter="drop-shadow(0px 4px 6px rgba(0,0,0,0.3))"
                  />
                  {/* Center White Dot on Pin */}
                  <circle r="7" fill="#ffffff" cy="-10" />

                  {/* "YOU ARE HERE" Floating Banner */}
                  <g transform="translate(0, -42)">
                    <rect
                      x="-60"
                      y="-18"
                      width="120"
                      height="24"
                      rx="8"
                      fill="#0f172a"
                      fillOpacity="0.95"
                      stroke="#ffffff"
                      strokeWidth="2"
                    />
                    <text
                      x="0"
                      y="-3"
                      textAnchor="middle"
                      fontSize="10"
                      fontWeight="800"
                      fill="#ffffff"
                      pointerEvents="none"
                    >
                      YOU ARE HERE
                    </text>
                  </g>
                </g>
              )}

              {destinationLocation && (
                <g
                  transform={`translate(${Number(
                    destinationLocation.x
                  )}, ${Number(destinationLocation.y)})`}
                >
                  <circle
                    r="18"
                    fill="#ef4444"
                    stroke="#ffffff"
                    strokeWidth="4"
                  />
                  <circle r="6" fill="#ffffff" />
                </g>
              )}

              <g data-layer="campus-elements">
                {(Array.isArray(campusElements) ? campusElements : []).map(
                  (element) => (
                    <CampusElementRenderer
                      key={element._id}
                      element={element}
                      selected={selectedCampusElement?._id === element._id}
                      onSelect={
                        readOnly ? undefined : handleCampusElementSelect
                      }
                      onDragEnd={
                        readOnly ? undefined : handleCampusElementDragEnd
                      }
                      onResizeEnd={
                        readOnly ? undefined : handleCampusElementResizeEnd
                      }
                    />
                  )
                )}
              </g>

              <g data-layer="buildings" style={{ pointerEvents: "auto" }}>
                {normalizedBuildings.map((building) => {
                  const buildingId = building._id || building.id;
                  const isSelected =
                    selectedBuilding?._id === buildingId ||
                    selectedBuilding?.id === buildingId;

                  return (
                    <BuildingRenderer
                      key={buildingId}
                      building={building}
                      activeTool={readOnly ? "view" : activeTool}
                      selected={isSelected}
                      mapView={mapView}
                      svgRef={campusCanvasRef}
                      onDragEnd={readOnly ? undefined : handleBuildingDragEnd}
                      onSelect={handleBuildingSelect}
                      onOpen={handleOpenBuilding}
                      onDelete={readOnly ? undefined : handleDeleteBuilding}
                      onEntranceSelect={undefined}
                      showEntrance={true}
                    />
                  );
                })}
              </g>

              {(routeLocations.length > 0 ? routeLocations : mapLocations)
                .length > 0 && (
                <g data-layer="location-labels">
                  {(routeLocations.length > 0
                    ? routeLocations
                    : mapLocations
                  ).map((location) => (
                    <g
                      key={`label-${location._id || location.name}`}
                      transform={`translate(${Number(
                        location.x
                      )}, ${Number(location.y)})`}
                      onClick={(event) => {
                        event.stopPropagation();
                        onLocationClick?.(location);
                      }}
                      style={{ cursor: "pointer" }}
                    >
                      <circle
                        r="14"
                        fill="#ef4444"
                        stroke="#ffffff"
                        strokeWidth="3"
                      />
                      <circle r="5" fill="#ffffff" />
                      <rect
                        x="-70"
                        y="18"
                        width="140"
                        height="24"
                        rx="6"
                        fill="#ffffff"
                        fillOpacity="0.96"
                        stroke="#cbd5e1"
                      />
                      <text
                        x="0"
                        y="34"
                        textAnchor="middle"
                        fontSize="11"
                        fontWeight="700"
                        fill="#1e293b"
                      >
                        {location.name?.length > 22
                          ? `${location.name.slice(0, 21)}...`
                          : location.name}
                      </text>
                    </g>
                  ))}
                </g>
              )}

              {normalizedBuildings.length === 0 &&
                campusElements.length === 0 &&
                campusRoads.length === 0 && (
                  <g pointerEvents="none">
                    <rect
                      x={mapWidth / 2 - 180}
                      y={mapHeight / 2 - 90}
                      width="360"
                      height="180"
                      rx="20"
                      fill="#ffffff"
                      fillOpacity="0.92"
                      stroke="#cbd5e1"
                    />
                    <foreignObject
                      x={mapWidth / 2 - 25}
                      y={mapHeight / 2 - 60}
                      width="50"
                      height="50"
                    >
                      <div className="flex h-full w-full items-center justify-center">
                        <Building2 size={36} className="text-slate-400" />
                      </div>
                    </foreignObject>
                    <text
                      x={mapWidth / 2}
                      y={mapHeight / 2 + 10}
                      textAnchor="middle"
                      fontSize="18"
                      fontWeight="700"
                      fill="#334155"
                    >
                      Campus Map
                    </text>
                    <text
                      x={mapWidth / 2}
                      y={mapHeight / 2 + 38}
                      textAnchor="middle"
                      fontSize="13"
                      fill="#64748b"
                    >
                      Add buildings, roads and campus elements
                    </text>
                  </g>
                )}
            </svg>
          </div>
        </div>
      )}

      {/* RESPONSIVE ZOOM CONTROLS */}
      {fitToContainer && !is3D && (
        <div className="absolute right-2.5 top-2.5 sm:right-4 sm:top-4 z-[2500] flex items-center gap-0.5 sm:gap-1 rounded-xl border border-slate-200 bg-white/95 backdrop-blur p-1 sm:p-1.5 shadow-lg">
          <button
            type="button"
            onClick={zoomOut}
            disabled={zoom <= MIN_ZOOM}
            title="Zoom out"
            className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Minus size={15} />
          </button>
          <div className="min-w-[45px] sm:min-w-[50px] px-1 text-center text-[11px] sm:text-xs font-semibold text-slate-600">
            {Math.round(zoom * 100)}%
          </div>
          <button
            type="button"
            onClick={zoomIn}
            disabled={zoom >= MAX_ZOOM}
            title="Zoom in"
            className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Plus size={15} />
          </button>
          <button
            type="button"
            onClick={resetZoom}
            title="Reset zoom"
            className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg text-slate-600 transition hover:bg-slate-100"
          >
            <RotateCcw size={14} />
          </button>
        </div>
      )}

      {!readOnly && !is3D && (
        <div className="pointer-events-none hidden sm:block absolute bottom-4 right-4 z-[2000] rounded-lg border border-slate-200 bg-white/95 px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-md backdrop-blur">
          Canvas: {mapWidth} × {mapHeight}
        </div>
      )}
    </div>
  );
};

export default CampusMap;