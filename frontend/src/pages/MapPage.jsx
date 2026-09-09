import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Grid, Environment, Html } from "@react-three/drei";
import * as THREE from "three";
import {
  Search,
  SlidersHorizontal,
  Navigation,
  X,
  Boxes,
  Map as MapIcon,
  Layers,
  ChevronRight,
  Building2,
  ArrowLeft,
  Route,
} from "lucide-react";

import {
  fetchBuildings,
  setCurrentBuilding,
} from "../redux/slices/buildingSlice";

import { fetchRoads } from "../redux/slices/roadSlice";
import { fetchCampusElements } from "../redux/slices/campusElementSlice";
import {
  fetchLocations,
  setSelectedLocation,
} from "../redux/slices/locationSlice";
import { fetchRoutes } from "../redux/slices/routeSlice";
import { fetchFloorsByBuilding, setCurrentFloor } from "../redux/slices/floorSlice";
import { fetchMapElementsByFloor } from "../redux/slices/mapElementSlice";

import CampusMap from "../components/AdminCampusBuilder/CampusMap";
import IndoorDirectionsPanel from "../components/map/IndoorDirectionsPanel";
import { getIndoorElementCenter } from "../utils/indoorRoute";

/* =========================================================
   3D INLINE COMPONENTS (CAMPUS)
========================================================= */

const ELEMENT_COLORS = {
  parking: "#94A3B8",
  park: "#4ADE80",
  ground: "#A3E635",
  "small-room": "#FDE047",
  pond: "#38BDF8",
  gate: "#64748B",
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

const Building3D = ({ building, onOpen, hideLabels }) => {
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
    <group position={[x, y, z]} rotation={[0, -rotation, 0]}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial color={color} roughness={0.4} metalness={0.1} />
      </mesh>

      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(width, height, depth)]} />
        <lineBasicMaterial color="#334155" linewidth={1} />
      </lineSegments>

      {!hideLabels && (
        <Html
          position={[0, height / 2 + 15, 0]}
          center
          distanceFactor={1000}
          occlude
        >
          <div className="flex flex-col items-center gap-1.5 px-3 py-1.5 rounded-xl shadow-lg border border-slate-200 bg-white/95 text-xs font-bold whitespace-nowrap pointer-events-auto select-none">
            <span className="text-slate-800">{building.name}</span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onOpen(building);
              }}
              className="flex items-center gap-1 text-[10px] bg-blue-600 text-white px-2.5 py-1 rounded-lg shadow hover:bg-blue-700 active:scale-95 transition"
            >
              <Layers size={12} />
              Open Floors
            </button>
          </div>
        </Html>
      )}
    </group>
  );
};

const CampusElement3D = ({ element, hideLabels }) => {
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
    <group position={[x, y, z]}>
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

      {!hideLabels && (
        <Html
          position={[0, height + 8, 0]}
          center
          distanceFactor={1000}
          occlude
        >
          <div className="px-2 py-0.5 rounded text-[11px] font-semibold whitespace-nowrap shadow bg-white/90 text-slate-700 pointer-events-none select-none">
            {element.name || element.type}
          </div>
        </Html>
      )}
    </group>
  );
};

const Road3D = ({ road }) => {
  const points = road.points || [];
  if (!points || points.length < 2) return null;

  const width = Number(road.width) || 24;

  return (
    <group>
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

const CampusViewer3DInternal = ({
  buildings = [],
  campusElements = [],
  campusRoads = [],
  onOpenBuilding,
  hideLabels = false,
}) => {
  const bounds = useMemo(() => {
    let w = 1400;
    let h = 900;

    buildings.forEach((b) => {
      const bx = Number(b.position?.x || 0) + Number(b.dimensions?.width || 250);
      const by = Number(b.position?.y || 0) + Number(b.dimensions?.height || 180);
      w = Math.max(w, bx + 200);
      h = Math.max(h, by + 200);
    });

    campusElements.forEach((el) => {
      const ex = Number(el.position?.x || 0) + Number(el.dimensions?.width || 180);
      const ey = Number(el.position?.y || 0) + Number(el.dimensions?.height || 120);
      w = Math.max(w, ex + 200);
      h = Math.max(h, ey + 200);
    });

    return { width: w, height: h };
  }, [buildings, campusElements]);

  return (
    <div className="w-full h-full min-h-[380px] sm:min-h-[500px] lg:min-h-[600px] bg-slate-950 relative overflow-hidden rounded-2xl">
      <Canvas
        shadows
        camera={{
          position: [bounds.width * 0.8, 900, bounds.height * 1.1],
          fov: 45,
          near: 1,
          far: 15000,
        }}
      >
        <ambientLight intensity={1.4} />
        <directionalLight
          position={[bounds.width * 0.5, 1200, bounds.height * 0.5]}
          intensity={2.2}
          castShadow
        />
        <Environment preset="city" />

        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[bounds.width / 2, -1, bounds.height / 2]}
          receiveShadow
        >
          <planeGeometry args={[bounds.width, bounds.height]} />
          <meshStandardMaterial color="#F1F5F9" roughness={0.8} />
        </mesh>

        <Grid
          args={[bounds.width, bounds.height]}
          cellSize={20}
          cellThickness={0.6}
          sectionSize={100}
          sectionThickness={1.2}
          fadeDistance={4000}
          fadeStrength={1}
          position={[bounds.width / 2, 0.2, bounds.height / 2]}
        />

        {campusRoads.map((road) => (
          <Road3D key={road._id} road={road} />
        ))}

        {campusElements.map((el) => (
          <CampusElement3D key={el._id} element={el} hideLabels={hideLabels} />
        ))}

        {buildings.map((b) => (
          <Building3D
            key={b._id}
            building={b}
            onOpen={onOpenBuilding}
            hideLabels={hideLabels}
          />
        ))}

        <OrbitControls
          enableDamping
          dampingFactor={0.08}
          minDistance={100}
          maxDistance={5000}
          maxPolarAngle={Math.PI / 2.05}
          target={[bounds.width / 2, 0, bounds.height / 2]}
        />
      </Canvas>

      {!hideLabels && (
        <div className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-slate-900/80 backdrop-blur border border-slate-700 text-white rounded-xl px-3 py-2 sm:px-4 sm:py-2.5 shadow-xl pointer-events-none max-w-[80vw]">
          <h3 className="font-bold text-xs sm:text-sm">Campus 3D View</h3>
          <p className="text-[10px] sm:text-xs text-slate-400 truncate">
            {buildings.length} Buildings • {campusElements.length} Areas • {campusRoads.length} Roads
          </p>
        </div>
      )}

      <div className="hidden sm:block absolute bottom-3 right-3 sm:bottom-4 sm:right-4 bg-white/90 backdrop-blur rounded-xl px-3 py-2 text-[11px] text-slate-600 shadow-xl pointer-events-none">
        🖱 Drag = Rotate • 🔍 Scroll = Zoom • 🖱 Right Click = Pan
      </div>
    </div>
  );
};

/* =========================================================
   3D FLOOR VIEWER (DYNAMIC & RESPONSIVE)
========================================================= */

const IndoorRoute3D = ({ routePoints = [], source, destination }) => {
  const routeDots = useMemo(() => {
    const dots = [];
    const spacing = 28;

    routePoints.slice(0, -1).forEach((start, index) => {
      const end = routePoints[index + 1];
      const startX = Number(start.x);
      const startZ = Number(start.y);
      const endX = Number(end.x);
      const endZ = Number(end.y);
      const distance = Math.hypot(endX - startX, endZ - startZ);
      const dotCount = Math.max(2, Math.ceil(distance / spacing));

      for (let dotIndex = 0; dotIndex < dotCount; dotIndex += 1) {
        const progress = dotIndex / dotCount;
        dots.push([
          startX + (endX - startX) * progress,
          28,
          startZ + (endZ - startZ) * progress,
        ]);
      }
    });

    return dots;
  }, [routePoints]);

  const destinationPoint = destination ? getIndoorElementCenter(destination) : null;

  return (
    <>
      {routeDots.map((position, index) => (
        <mesh key={`indoor-route-dot-${index}`} position={position} renderOrder={1000}>
          <sphereGeometry args={[6, 12, 12]} />
          <meshBasicMaterial color="#2563EB" depthTest={false} />
        </mesh>
      ))}
      {source && (
        <Html position={[getIndoorElementCenter(source).x, 65, getIndoorElementCenter(source).y]} center distanceFactor={800}>
          <div className="rounded-full border-2 border-white bg-blue-600 px-2.5 py-0.5 sm:px-3 sm:py-1 text-[10px] sm:text-xs font-extrabold text-white shadow-xl whitespace-nowrap">
            START: {source.name}
          </div>
        </Html>
      )}
      {destinationPoint && (
        <Html position={[destinationPoint.x, 65, destinationPoint.y]} center distanceFactor={800}>
          <div className="rounded-full border-2 border-white bg-red-600 px-2.5 py-0.5 sm:px-3 sm:py-1 text-[10px] sm:text-xs font-extrabold text-white shadow-xl whitespace-nowrap">
            DESTINATION: {destination.name}
          </div>
        </Html>
      )}
    </>
  );
};

const Floor3DViewer = ({
  building,
  floor,
  elements = [],
  onBack,
  routePoints = [],
  routeSource,
  routeDestination,
  routeDirections = [],
}) => {
  const bounds = useMemo(() => {
    const baseW = Number(floor?.width || 1200);
    const baseH = Number(floor?.height || 800);
    const PADDING = 250;

    let minX = 0;
    let minZ = 0;
    let maxX = baseW;
    let maxZ = baseH;

    elements.forEach((el) => {
      const pos = el.position || {};
      const dim = el.dimensions || {};

      const x = Number(pos.x || 0);
      const z = Number(pos.y || 0);
      const w = Number(dim.width || 100);
      const d = Number(dim.depth || dim.height || 80);

      minX = Math.min(minX, x);
      minZ = Math.min(minZ, z);
      maxX = Math.max(maxX, x + w);
      maxZ = Math.max(maxZ, z + d);
    });

    const calculatedWidth = Math.max(baseW, maxX - minX + PADDING * 2);
    const calculatedDepth = Math.max(baseH, maxZ - minZ + PADDING * 2);

    const centerX = (minX + maxX) / 2;
    const centerZ = (minZ + maxZ) / 2;

    return {
      width: calculatedWidth,
      depth: calculatedDepth,
      centerX,
      centerZ,
    };
  }, [floor, elements]);

  const cameraDist = Math.max(bounds.width, bounds.depth);

  return (
    <div className="w-full h-full min-h-[380px] sm:min-h-[500px] lg:min-h-[600px] bg-slate-950 relative overflow-hidden rounded-2xl">
      <Canvas
        shadows
        camera={{
          position: [bounds.centerX + cameraDist * 0.6, Math.max(cameraDist * 0.7, 700), bounds.centerZ + cameraDist * 0.7],
          fov: 45,
          near: 0.1,
          far: 20000,
        }}
      >
        <ambientLight intensity={1.5} />
        <directionalLight
          position={[bounds.centerX + 400, 1200, bounds.centerZ + 400]}
          intensity={2}
          castShadow
        />
        <Environment preset="city" />

        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[bounds.centerX, -1, bounds.centerZ]}
          receiveShadow
        >
          <planeGeometry args={[bounds.width, bounds.depth]} />
          <meshStandardMaterial color={floor?.backgroundColor || "#F8FAFC"} />
        </mesh>

        <Grid
          args={[bounds.width, bounds.depth]}
          cellSize={20}
          cellThickness={0.5}
          sectionSize={100}
          sectionThickness={1}
          fadeDistance={Math.max(bounds.width, bounds.depth) * 1.5}
          position={[bounds.centerX, 0, bounds.centerZ]}
        />

        {elements.map((el) => {
          const pos = el.position || {};
          const dim = el.dimensions || {};
          const elW = Number(dim.width || 100);
          const elH = el.type === "corridor" ? 12 : Number(dim.height || 25);
          const elD = el.type === "corridor"
            ? Number(dim.height || 80)
            : Number(dim.depth || dim.height || 80);

          const posX = Number(pos.x || 0) + elW / 2;
          const posZ = Number(pos.y || 0) + elD / 2;
          const posY = Number(pos.z || 0) + elH / 2;
          const color = el.color || ELEMENT_COLORS[el.type] || "#94A3B8";

          return (
            <group key={el._id} position={[posX, posY, posZ]}>
              <mesh castShadow receiveShadow>
                <boxGeometry args={[elW, elH, elD]} />
                <meshStandardMaterial color={color} transparent opacity={0.9} />
              </mesh>
              <lineSegments>
                <edgesGeometry args={[new THREE.BoxGeometry(elW, elH, elD)]} />
                <lineBasicMaterial color="#334155" linewidth={1} />
              </lineSegments>
              <Html position={[0, elH / 2 + 10, 0]} center distanceFactor={800} occlude>
                <div className="px-2 py-0.5 rounded-lg text-[10px] sm:text-xs font-bold whitespace-nowrap bg-white text-slate-800 shadow select-none">
                  {el.name}
                </div>
              </Html>
            </group>
          );
        })}

        <IndoorRoute3D
          routePoints={routePoints}
          source={routeSource}
          destination={routeDestination}
        />

        <OrbitControls
          enableDamping
          dampingFactor={0.08}
          minDistance={100}
          maxDistance={10000}
          maxPolarAngle={Math.PI / 2.05}
          target={[bounds.centerX, 0, bounds.centerZ]}
        />
      </Canvas>

      <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 flex flex-wrap items-center gap-2 sm:gap-3 max-w-[calc(100%-1.5rem)]">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 bg-white text-slate-800 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs font-bold shadow-lg hover:bg-slate-100 transition active:scale-95"
        >
          <ArrowLeft size={15} />
          <span className="hidden xs:inline">Back to Campus Map</span>
          <span className="xs:hidden">Back</span>
        </button>

        <div className="bg-slate-900/90 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl shadow-lg border border-slate-700 backdrop-blur">
          <p className="font-bold text-[11px] sm:text-xs truncate max-w-[140px] sm:max-w-[200px]">{building?.name}</p>
          <p className="text-[10px] sm:text-[11px] text-blue-400 font-semibold">{floor?.name} (Floor {floor?.floorNumber})</p>
        </div>
      </div>

      <div className="hidden sm:block absolute bottom-3 right-3 sm:bottom-4 sm:right-4 bg-white/90 backdrop-blur rounded-xl px-3 py-2 text-[11px] text-slate-600 shadow-xl pointer-events-none">
        🖱 Drag = Rotate Floor • 🔍 Scroll = Zoom • 🖱 Right Click = Pan
      </div>

      {routeDirections.length > 0 && (
        <div className="absolute right-3 top-14 sm:right-4 sm:top-4 z-10 max-h-[min(380px,calc(100%-4rem))] w-[min(320px,calc(100%-2rem))] overflow-y-auto rounded-xl border border-slate-200 bg-white/95 p-3.5 sm:p-4 shadow-xl backdrop-blur custom-scrollbar">
          <p className="text-[11px] font-bold uppercase tracking-wide text-blue-600">Indoor Route</p>
          <div className="mt-2.5 space-y-2.5">
            {routeDirections.map((direction) => (
              <div key={`${direction.step}-${direction.to._id}`} className="flex gap-2.5 items-start">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white mt-0.5">
                  {direction.step}
                </span>
                <p className="text-xs leading-snug text-slate-600">
                  Go from <strong className="text-slate-800">{direction.from.name}</strong> to <strong className="text-slate-800">{direction.to.name}</strong>
                  {direction.floorName ? ` on ${direction.floorName}` : ""}.
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

/* =========================================================
   MAIN MAP PAGE
========================================================= */

const MapPage = () => {
  const dispatch = useDispatch();

  const {
    locations = [],
    loading,
    error,
    selectedLocation,
  } = useSelector((state) => state.locations);

  const { buildings = [] } = useSelector((state) => state.buildings || {});
  const { roads = [] } = useSelector((state) => state.roads || {});
  const { elements: campusElements = [] } = useSelector(
    (state) => state.campusElements || {}
  );
  const { routes = [] } = useSelector((state) => state.routes || {});
  const { floors = [], loading: floorLoading } = useSelector((state) => state.floors || {});
  const { elements: floorMapElements = [] } = useSelector((state) => state.mapElements || {});

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [viewMode, setViewMode] = useState("3d");

  const [activeBuildingForFloors, setActiveBuildingForFloors] = useState(null);
  const [selectedFloorForView, setSelectedFloorForView] = useState(null);
  const [showIndoorDirections, setShowIndoorDirections] = useState(false);
  const [indoorRoute, setIndoorRoute] = useState(null);

  const mapCanvasRef = useRef(null);

  useEffect(() => {
    if (!locations.length) dispatch(fetchLocations());
  }, [dispatch, locations.length]);

  useEffect(() => {
    if (!buildings.length) dispatch(fetchBuildings());
    if (!roads.length) dispatch(fetchRoads());
    if (!campusElements.length) dispatch(fetchCampusElements());
  }, [dispatch, buildings.length, roads.length, campusElements.length]);

  useEffect(() => {
    if (!routes.length) dispatch(fetchRoutes());
  }, [dispatch, routes.length]);

  const categories = useMemo(() => {
    const uniqueCategories = [
      ...new Set(
        locations.map((location) => location.category).filter(Boolean)
      ),
    ];
    return ["All", ...uniqueCategories];
  }, [locations]);

  const filteredLocations = useMemo(() => {
    return locations.filter((location) => {
      const matchesSearch =
        !search ||
        location.name?.toLowerCase().includes(search.toLowerCase()) ||
        location.description?.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        category === "All" || location.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [locations, search, category]);

  const handleLocationClick = (location) => {
    dispatch(setSelectedLocation(location));

    const locationBuildingId =
      typeof location.buildingId === "object"
        ? location.buildingId?._id
        : location.buildingId;

    const building = buildings.find(
      (item) =>
        item._id === locationBuildingId || item.name === location.building
    );

    if (building) {
      dispatch(setCurrentBuilding(building));
    }
  };

  const handleOpenBuilding = (building) => {
    if (!building) return;
    dispatch(setCurrentBuilding(building));
    setActiveBuildingForFloors(building);
    dispatch(fetchFloorsByBuilding(building._id));
  };

  const handleSelectFloor = (floor) => {
    setIndoorRoute(null);
    dispatch(setCurrentFloor(floor));
    dispatch(fetchMapElementsByFloor(floor._id));
    setSelectedFloorForView(floor);
    setActiveBuildingForFloors(null);
  };

  const handleIndoorRoute = (route) => {
    const destinationFloor = floors.find((floor) => floor._id === route.floorId);
    if (!destinationFloor) return;

    setIndoorRoute(route);
    setShowIndoorDirections(false);
    setActiveBuildingForFloors(null);
    dispatch(setCurrentFloor(destinationFloor));
    dispatch(fetchMapElementsByFloor(destinationFloor._id));
    setSelectedFloorForView(destinationFloor);
  };

  const clearSelection = () => {
    dispatch(setSelectedLocation(null));
  };

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-64px)] items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
          <p className="text-sm font-medium text-slate-600">
            Loading campus map...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[calc(100vh-64px)] items-center justify-center bg-slate-50 p-6">
        <div className="w-full max-w-md rounded-2xl border border-red-200 bg-white p-6 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
            !
          </div>
          <h2 className="text-lg font-semibold text-slate-900">
            Unable to load campus map
          </h2>
          <p className="mt-2 text-sm text-slate-500">{error}</p>
          <button
            onClick={() => dispatch(fetchLocations())}
            className="mt-5 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-64px)] min-h-0 flex-col overflow-hidden bg-slate-50 relative">
      {/* RESPONSIVE HEADER */}
      <div className="shrink-0 border-b border-slate-200 bg-white">
        <div className="px-3.5 py-3 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            {/* Title & Icon */}
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                <Navigation size={20} />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-slate-900 leading-tight">
                  Campus Map
                </h1>
                <p className="text-[11px] sm:text-xs text-slate-500">
                  Explore buildings, roads and campus locations
                </p>
              </div>
            </div>

            {/* Filter & View Controls */}
            {!selectedFloorForView && (
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                {/* 2D / 3D Toggle */}
                <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200 shrink-0">
                  <button
                    type="button"
                    onClick={() => setViewMode("2d")}
                    className={`flex items-center gap-1 px-2.5 py-1.5 sm:px-3 rounded-lg text-xs font-bold transition ${
                      viewMode === "2d"
                        ? "bg-white text-blue-600 shadow-sm"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <MapIcon size={14} />
                    <span>2D Map</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode("3d")}
                    className={`flex items-center gap-1 px-2.5 py-1.5 sm:px-3 rounded-lg text-xs font-bold transition ${
                      viewMode === "3d"
                        ? "bg-blue-600 text-white shadow-sm"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <Boxes size={14} />
                    <span>3D View</span>
                  </button>
                </div>

                {/* Search Bar */}
                <div className="relative flex-1 min-w-[140px] sm:min-w-[180px] sm:w-60">
                  <Search
                    size={15}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type="text"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search location..."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-1.5 sm:py-2 pl-8 sm:pl-9 pr-3 text-xs text-slate-700 outline-none transition focus:border-blue-400 focus:bg-white"
                  />
                </div>

                {/* Category Dropdown */}
                <div className="relative shrink-0 w-28 sm:w-36">
                  <SlidersHorizontal
                    size={14}
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                  />
                  <select
                    value={category}
                    onChange={(event) => setCategory(event.target.value)}
                    className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 py-1.5 sm:py-2 pl-7 pr-6 text-xs text-slate-700 outline-none transition focus:border-blue-400 focus:bg-white"
                  >
                    {categories.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MAP VIEWPORT WRAPPER */}
      <div className="min-h-0 flex-1 w-full p-2 sm:p-3 lg:p-4">
        <div className="relative h-full min-h-0 w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {selectedFloorForView ? (
            <Floor3DViewer
              building={activeBuildingForFloors || buildings.find(b => b._id === selectedFloorForView.buildingId)}
              floor={selectedFloorForView}
              elements={floorMapElements}
              routePoints={indoorRoute?.floorId === selectedFloorForView._id ? indoorRoute.routePoints : []}
              routeSource={indoorRoute?.floorId === selectedFloorForView._id ? indoorRoute.source : null}
              routeDestination={indoorRoute?.floorId === selectedFloorForView._id ? indoorRoute.destination : null}
              routeDirections={indoorRoute?.floorId === selectedFloorForView._id ? indoorRoute.directions : []}
              onBack={() => setSelectedFloorForView(null)}
            />
          ) : viewMode === "3d" ? (
            <CampusViewer3DInternal
              buildings={buildings}
              campusRoads={roads}
              campusElements={campusElements}
              onOpenBuilding={handleOpenBuilding}
              hideLabels={Boolean(activeBuildingForFloors)}
            />
          ) : (
            <CampusMap
              campusCanvasRef={mapCanvasRef}
              campusWidth={1400}
              campusHeight={900}
              showGrid={true}
              mapView="2d"
              activeTool="select"
              buildings={buildings}
              campusRoads={roads}
              campusElements={campusElements}
              locations={filteredLocations}
              selectedLocation={selectedLocation}
              onLocationClick={handleLocationClick}
              handleOpenBuilding={handleOpenBuilding}
              readOnly={true}
              fitToContainer={true}
            />
          )}

          {/* LOCATION DETAILS PANEL */}
          {selectedLocation && !selectedFloorForView && (
            <div className="absolute right-3 top-3 sm:right-4 sm:top-4 z-[3000] w-[300px] sm:w-[320px] max-w-[calc(100%-1.5rem)] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl max-h-[85%] overflow-y-auto">
              <div className="flex items-start justify-between border-b border-slate-100 p-3.5 sm:p-4">
                <div className="min-w-0 pr-3">
                  <div className="mb-1 inline-flex rounded-full bg-blue-50 px-2.5 py-0.5 text-[11px] font-medium text-blue-600">
                    {selectedLocation.category || "Location"}
                  </div>
                  <h2 className="truncate text-base sm:text-lg font-bold text-slate-900">
                    {selectedLocation.name}
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={clearSelection}
                  className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-3.5 p-3.5 sm:p-4">
                {selectedLocation.description && (
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                      Description
                    </p>
                    <p className="mt-0.5 text-xs sm:text-sm leading-relaxed text-slate-600">
                      {selectedLocation.description}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2.5">
                  <div className="rounded-xl bg-slate-50 p-2.5">
                    <p className="text-[10px] text-slate-400">X Position</p>
                    <p className="mt-0.5 text-xs font-semibold text-slate-700">
                      {selectedLocation.x ?? "-"}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-2.5">
                    <p className="text-[10px] text-slate-400">Y Position</p>
                    <p className="mt-0.5 text-xs font-semibold text-slate-700">
                      {selectedLocation.y ?? "-"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2">
                  <span className="text-xs text-slate-500">Status</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
                      selectedLocation.isActive
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {selectedLocation.isActive ? "Active" : "Inactive"}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <a
                    href={`/locations/${selectedLocation._id}`}
                    className="rounded-xl bg-slate-100 px-3 py-2 text-center text-xs font-semibold text-slate-700 transition hover:bg-slate-200"
                  >
                    View Details
                  </a>

                  <a
                    href={`/directions?to=${selectedLocation._id}`}
                    className="rounded-xl bg-blue-600 px-3 py-2 text-center text-xs font-semibold text-white transition hover:bg-blue-700 shadow-sm"
                  >
                    Directions
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* SPECIFIC BUILDING FLOORS MODAL */}
      {activeBuildingForFloors && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/80 p-4 select-none backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85dvh]">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50">
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                  <Building2 size={19} />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 truncate">
                    {activeBuildingForFloors.name}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Select floor to view 3D plan
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveBuildingForFloors(null)}
                className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-2.5 custom-scrollbar">
              {floorLoading ? (
                <div className="py-10 text-center text-xs text-slate-400">
                  <div className="mx-auto mb-2 h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600" />
                  Loading building floors...
                </div>
              ) : floors.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-300 p-6 text-center text-xs sm:text-sm text-slate-400">
                  No floors created for this building yet.
                </div>
              ) : (
                floors.map((floor) => (
                  <button
                    key={floor._id}
                    type="button"
                    onClick={() => handleSelectFloor(floor)}
                    className="w-full flex items-center justify-between p-3 sm:p-3.5 rounded-xl border border-slate-200 bg-white hover:border-blue-400 hover:bg-blue-50/60 transition group shadow-sm text-left active:scale-[0.99]"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs group-hover:bg-blue-600 group-hover:text-white transition shrink-0">
                        {floor.floorNumber ?? "F"}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-xs sm:text-sm font-semibold text-slate-800 group-hover:text-blue-700 transition truncate">
                          {floor.name}
                        </h4>
                        <p className="text-[10px] sm:text-[11px] text-slate-400">
                          Floor {floor.floorNumber}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-[11px] sm:text-xs font-semibold text-blue-600 shrink-0">
                      <span>View 3D</span>
                      <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </button>
                ))
              )}
            </div>

            <div className="p-3.5 sm:p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setActiveBuildingForFloors(null)}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => setShowIndoorDirections(true)}
                className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700 shadow-sm"
              >
                <Route size={14} />
                <span>Indoor Directions</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {showIndoorDirections && activeBuildingForFloors && (
        <IndoorDirectionsPanel
          building={activeBuildingForFloors}
          floors={floors}
          onClose={() => setShowIndoorDirections(false)}
          onRoute={handleIndoorRoute}
        />
      )}
    </div>
  );
};

export default MapPage;