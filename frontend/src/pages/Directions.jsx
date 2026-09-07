import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Grid, Environment, Html } from "@react-three/drei";
import * as THREE from "three";
import {
  ArrowLeft,
  ArrowLeftRight,
  Navigation,
  MapPin,
  Route as RouteIcon,
  Footprints,
  LocateFixed,
  Boxes,
  Map as MapIcon,
} from "lucide-react";

import CampusMap from "../components/AdminCampusBuilder/CampusMap";
import SearchableSelect from "../components/common/SearchableSelect";
import { fetchBuildings } from "../redux/slices/buildingSlice";
import { fetchRoads } from "../redux/slices/roadSlice";
import { fetchCampusElements } from "../redux/slices/campusElementSlice";
import { fetchLocations } from "../redux/slices/locationSlice";
import { fetchRouteBetweenLocations } from "../redux/slices/routeSlice";

/* =========================================================
   3D INLINE VIEWPORT COMPONENTS (DIRECTIONS SUPPORTED)
========================================================= */

const ELEMENT_COLORS = {
  parking: "#94A3B8",
  park: "#4ADE80",
  ground: "#A3E635",
  "small-room": "#FDE047",
  pond: "#38BDF8",
  gate: "#64748B",
};

const Building3D = ({ building }) => {
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

      <Html position={[0, height / 2 + 15, 0]} center distanceFactor={1100} occlude>
        <div className="px-2.5 py-1 rounded-lg shadow-md border border-slate-200 bg-white/95 text-xs font-bold text-slate-800 whitespace-nowrap select-none pointer-events-none">
          {building.name}
        </div>
      </Html>
    </group>
  );
};

const CampusElement3D = ({ element }) => {
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

      <Html position={[0, height + 8, 0]} center distanceFactor={1100} occlude>
        <div className="px-2 py-0.5 rounded text-[11px] font-semibold whitespace-nowrap shadow bg-white/90 text-slate-700 select-none pointer-events-none">
          {element.name || element.type}
        </div>
      </Html>
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

/* =========================================================
   NEW ULTRA-VISIBLE GLOWING 3D TUBE PATH (ALWAYS ON TOP)
========================================================= */

const DirectionPath3D = ({ routePoints = [], source, destination }) => {
  if (!routePoints || routePoints.length < 2) return null;

  const curve = useMemo(() => {
    const points3D = routePoints.map(
      (p) => new THREE.Vector3(Number(p.x), 12, Number(p.y))
    );
    return new THREE.CatmullRomCurve3(points3D, false, "catmullrom", 0.1);
  }, [routePoints]);

  return (
    <group>
      {/* 1. OUTER GLOW CASING */}
      <mesh renderOrder={998}>
        <tubeGeometry args={[curve, 120, 9, 12, false]} />
        <meshBasicMaterial
          color="#1E40AF"
          transparent
          opacity={0.4}
          depthTest={false}
        />
      </mesh>

      {/* 2. CORE NEON BRIGHT ARTERY TUBE */}
      <mesh renderOrder={999}>
        <tubeGeometry args={[curve, 120, 5.5, 12, false]} />
        <meshBasicMaterial
          color="#38BDF8"
          depthTest={false}
        />
      </mesh>

      {/* 3. INNER WHITE HOTLINE */}
      <mesh renderOrder={1000}>
        <tubeGeometry args={[curve, 120, 2, 8, false]} />
        <meshBasicMaterial
          color="#FFFFFF"
          depthTest={false}
        />
      </mesh>

      {/* 4. SOURCE BEACON & RINGS */}
      {source && (
        <group position={[Number(source.x), 0, Number(source.y)]} renderOrder={1001}>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 4, 0]}>
            <ringGeometry args={[14, 28, 32]} />
            <meshBasicMaterial color="#2563EB" transparent opacity={0.7} depthTest={false} />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 4.2, 0]}>
            <circleGeometry args={[12, 32]} />
            <meshBasicMaterial color="#60A5FA" transparent opacity={0.8} depthTest={false} />
          </mesh>
          <mesh position={[0, 35, 0]}>
            <cylinderGeometry args={[4, 4, 70, 16]} />
            <meshBasicMaterial color="#2563EB" transparent opacity={0.6} depthTest={false} />
          </mesh>
          <mesh position={[0, 70, 0]}>
            <sphereGeometry args={[16, 24, 24]} />
            <meshBasicMaterial color="#1D4ED8" depthTest={false} />
          </mesh>
          <Html center distanceFactor={800} position={[0, 95, 0]}>
            <div className="bg-blue-600 border-2 border-white text-white font-extrabold text-xs px-3 py-1 rounded-full shadow-2xl whitespace-nowrap">
              START: {source.name}
            </div>
          </Html>
        </group>
      )}

      {/* 5. DESTINATION BEACON & RINGS */}
      {destination && (
        <group position={[Number(destination.x), 0, Number(destination.y)]} renderOrder={1001}>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 4, 0]}>
            <ringGeometry args={[14, 28, 32]} />
            <meshBasicMaterial color="#DC2626" transparent opacity={0.7} depthTest={false} />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 4.2, 0]}>
            <circleGeometry args={[12, 32]} />
            <meshBasicMaterial color="#F87171" transparent opacity={0.8} depthTest={false} />
          </mesh>
          <mesh position={[0, 35, 0]}>
            <cylinderGeometry args={[4, 4, 70, 16]} />
            <meshBasicMaterial color="#EF4444" transparent opacity={0.6} depthTest={false} />
          </mesh>
          <mesh position={[0, 70, 0]}>
            <sphereGeometry args={[16, 24, 24]} />
            <meshBasicMaterial color="#DC2626" depthTest={false} />
          </mesh>
          <Html center distanceFactor={800} position={[0, 95, 0]}>
            <div className="bg-red-600 border-2 border-white text-white font-extrabold text-xs px-3 py-1 rounded-full shadow-2xl whitespace-nowrap">
              GOAL: {destination.name}
            </div>
          </Html>
        </group>
      )}
    </group>
  );
};

const DirectionsViewer3D = ({
  buildings = [],
  campusElements = [],
  roads = [],
  routePoints = [],
  source,
  destination,
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
    <div className="w-full h-full min-h-[520px] bg-slate-950 relative overflow-hidden rounded-2xl">
      <Canvas
        shadows
        camera={{
          position: [bounds.width * 0.5, 1150, bounds.height * 0.95],
          fov: 45,
          near: 1,
          far: 20000,
        }}
      >
        <ambientLight intensity={1.5} />
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

        {roads.map((road) => (
          <Road3D key={road._id} road={road} />
        ))}

        {campusElements.map((el) => (
          <CampusElement3D key={el._id} element={el} />
        ))}

        {buildings.map((b) => (
          <Building3D key={b._id} building={b} />
        ))}

        <DirectionPath3D
          routePoints={routePoints}
          source={source}
          destination={destination}
        />

        <OrbitControls
          enableDamping
          dampingFactor={0.08}
          minDistance={100}
          maxDistance={5000}
          maxPolarAngle={Math.PI / 2.05}
          target={[bounds.width / 2, 0, bounds.height / 2]}
        />
      </Canvas>

      <div className="absolute top-16 left-4 bg-slate-900/85 backdrop-blur border border-slate-700 text-white rounded-xl px-4 py-2 shadow-xl pointer-events-none">
        <h3 className="font-bold text-xs flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
          3D Walking Route
        </h3>
        <p className="text-[11px] text-slate-400">
          Glowing neon path shows direction
        </p>
      </div>

      <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur rounded-xl px-4 py-2.5 text-[11px] text-slate-600 shadow-xl pointer-events-none">
        🖱 Drag = Rotate • 🔍 Scroll = Zoom • 🖱 Right Click = Pan
      </div>
    </div>
  );
};

/* =========================================================
   DIRECTIONS MAP CONTAINER (2D & 3D SWITCHABLE)
========================================================= */

const DirectionsMap = ({
  locations = [],
  selectedRoute,
  buildings = [],
  roads = [],
  campusElements = [],
  viewMode = "2d",
  setViewMode,
}) => {
  const fromId = selectedRoute?.from?._id;
  const toId = selectedRoute?.to?._id;

  const source = locations.find((location) => location._id === fromId);
  const destination = locations.find((location) => location._id === toId);

  const routePoints = useMemo(() => {
    if (!selectedRoute?.path?.length) {
      if (source && destination) {
        return [
          { x: source.x, y: source.y },
          { x: destination.x, y: destination.y },
        ];
      }
      return [];
    }

    const points = [];

    selectedRoute.path.forEach((segment, index) => {
      let start = segment.from;
      let end = segment.to;

      if (segment.reverse) {
        start = segment.to;
        end = segment.from;
      }

      if (index === 0) {
        points.push({ x: start.x, y: start.y });
      }

      points.push({ x: end.x, y: end.y });
    });

    return points;
  }, [selectedRoute, source, destination]);

  const routeLocations = useMemo(() => {
    const namedRouteLocations = selectedRoute?.viaLocations || [];
    const nearbyLocations = locations.filter((location) => {
      return routePoints.some((point, index) => {
        if (index === 0) return false;
        const previousPoint = routePoints[index - 1];
        const deltaX = point.x - previousPoint.x;
        const deltaY = point.y - previousPoint.y;
        const lengthSquared = deltaX ** 2 + deltaY ** 2;
        const ratio = lengthSquared
          ? Math.max(
              0,
              Math.min(
                1,
                ((location.x - previousPoint.x) * deltaX +
                  (location.y - previousPoint.y) * deltaY) /
                  lengthSquared
              )
            )
          : 0;
        const closestX = previousPoint.x + ratio * deltaX;
        const closestY = previousPoint.y + ratio * deltaY;
        return Math.hypot(location.x - closestX, location.y - closestY) <= 80;
      });
    });

    const mergedLocations = [...namedRouteLocations, ...nearbyLocations];
    return mergedLocations.filter(
      (location, index, allLocations) =>
        allLocations.findIndex((item) => item._id === location._id) === index
    );
  }, [locations, routePoints, selectedRoute]);

  return (
    <div className="relative h-full min-h-[520px] overflow-hidden rounded-2xl border border-slate-200 bg-[#f8fafc] shadow-sm">
      <div className="absolute top-4 left-4 z-[3000] flex rounded-xl bg-white/95 p-1 border border-slate-200 shadow-md backdrop-blur">
        <button
          type="button"
          onClick={() => setViewMode("2d")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
            viewMode === "2d"
              ? "bg-blue-600 text-white shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <MapIcon size={14} />
          2D Map
        </button>
        <button
          type="button"
          onClick={() => setViewMode("3d")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
            viewMode === "3d"
              ? "bg-blue-600 text-white shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Boxes size={14} />
          3D View
        </button>
      </div>

      {viewMode === "3d" ? (
        <DirectionsViewer3D
          buildings={buildings}
          campusElements={campusElements}
          roads={roads}
          routePoints={routePoints}
          source={source}
          destination={destination}
        />
      ) : (
        <CampusMap
          campusWidth={1400}
          campusHeight={900}
          showGrid={true}
          mapView="2d"
          activeTool="select"
          buildings={buildings}
          campusRoads={roads}
          campusElements={campusElements}
          locations={locations}
          selectedLocation={source || destination}
          onLocationClick={() => {}}
          routePath={routePoints}
          sourceLocation={source}
          destinationLocation={destination}
          readOnly={true}
          fitToContainer={true}
          routeLocations={
            routeLocations.length > 0
              ? routeLocations
              : [source, destination].filter(Boolean)
          }
        />
      )}
    </div>
  );
};

/* =========================================================
   MAIN DIRECTIONS PAGE
========================================================= */

const Directions = () => {
  const dispatch = useDispatch();

  const { buildings = [] } = useSelector((state) => state.buildings || {});
  const { roads = [] } = useSelector((state) => state.roads || {});
  const { elements: campusElements = [] } = useSelector(
    (state) => state.campusElements || {}
  );

  const { locations = [] } = useSelector((state) => state.locations);

  const { selectedRoute, routeLoading, routeError } = useSelector(
    (state) => state.routes
  );

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [viewMode, setViewMode] = useState("2d");

  const locationOptions = useMemo(
    () =>
      locations.map((location) => ({
        value: location._id,
        label: location.name,
        description: [location.building, location.category].filter(Boolean).join(" • "),
        searchText: `${location.name} ${location.building || ""} ${location.category || ""}`,
      })),
    [locations]
  );

  useEffect(() => {
    if (!buildings.length) dispatch(fetchBuildings());
    if (!roads.length) dispatch(fetchRoads());
    if (!campusElements.length) dispatch(fetchCampusElements());
    if (!locations.length) dispatch(fetchLocations());
  }, [dispatch, locations.length, buildings.length, roads.length, campusElements.length]);

  const handleFindRoute = () => {
    if (!from || !to || from === to) return;

    dispatch(
      fetchRouteBetweenLocations({
        from,
        to,
      })
    );
  };

  const handleSwap = () => {
    setFrom(to);
    setTo(from);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50">
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-[1500px] px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => window.history.back()}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-50"
            >
              <ArrowLeft size={19} />
            </button>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                Navigation
              </p>
              <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                Directions
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1500px] px-4 py-5 sm:px-6 lg:px-8 lg:py-7">
        <div className="grid gap-3 lg:grid-cols-[1fr_auto_1fr_auto] lg:items-end">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <SearchableSelect label="From" icon={MapPin} value={from} options={locationOptions} placeholder="Type a campus location..." onChange={setFrom} />
          </div>

          <button
            onClick={handleSwap}
            disabled={!from && !to}
            className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 disabled:opacity-40 lg:mb-1"
          >
            <ArrowLeftRight size={18} />
          </button>

          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <SearchableSelect label="To" icon={Navigation} value={to} options={locationOptions} placeholder="Type a destination..." onChange={setTo} accent="red" />
          </div>

          <button
            onClick={handleFindRoute}
            disabled={!from || !to || from === to || routeLoading}
            className="flex h-[52px] items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Navigation size={18} />
            {routeLoading ? "Finding Route..." : "Get Directions"}
          </button>
        </div>

        {routeError && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-600">
            {routeError}
          </div>
        )}

        {selectedRoute && (
          <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1.6fr)_minmax(340px,0.8fr)]">
            <div className="min-h-[520px]">
              <DirectionsMap
                locations={locations}
                selectedRoute={selectedRoute}
                buildings={buildings}
                roads={roads}
                campusElements={campusElements}
                viewMode={viewMode}
                setViewMode={setViewMode}
              />
            </div>

            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <RouteIcon size={21} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Total Distance</p>
                    <p className="text-lg font-bold text-slate-900">
                      {selectedRoute.distance} m
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 border-l border-slate-100 pl-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-green-600">
                    <Footprints size={21} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Estimated Time</p>
                    <p className="text-lg font-bold text-slate-900">
                      {selectedRoute.walkingTime} min
                    </p>
                  </div>
                </div>
              </div>

              {selectedRoute.viaLocations?.length > 0 && (
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <h2 className="font-bold text-slate-900">
                    Locations along this route
                  </h2>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {selectedRoute.viaLocations.map((location) => (
                      <span
                        key={location._id}
                        className="rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700"
                      >
                        {location.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-200 px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                      <Navigation size={19} />
                    </div>
                    <div>
                      <h2 className="font-bold text-slate-900">
                        Route Directions
                      </h2>
                      <p className="text-xs text-slate-500">
                        Follow the shortest walking route
                      </p>
                    </div>
                  </div>
                </div>

                <div className="max-h-[530px] overflow-y-auto">
                  <div className="flex gap-3 border-b border-slate-100 px-5 py-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                      1
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex justify-between gap-3">
                        <p className="font-semibold text-slate-800">
                          Start from {selectedRoute.from?.name}
                        </p>
                        <span className="text-xs text-slate-400">0 m</span>
                      </div>
                      <p className="mt-1 text-sm text-slate-500">
                        Start walking towards the route
                      </p>
                    </div>
                  </div>

                  {selectedRoute.directions?.map((direction, index) => (
                    <div
                      key={`${direction.step}-${index}`}
                      className="flex gap-3 border-b border-slate-100 px-5 py-4"
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                        {index + 2}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex justify-between gap-3">
                          <p className="font-semibold text-slate-800">
                            {index === selectedRoute.directions.length - 1
                              ? `Arrive at ${direction.to}`
                              : `Go towards ${direction.to}`}
                          </p>
                          <span className="shrink-0 text-xs font-medium text-slate-500">
                            {direction.distance} m
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-slate-500">
                          {index === selectedRoute.directions.length - 1
                            ? "Your destination"
                            : `Walk from ${direction.from}`}
                        </p>
                        <div className="mt-2 flex items-center gap-1 text-xs text-slate-400">
                          <Footprints size={13} />
                          {direction.walkingTime} min
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
                <div className="flex gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-blue-600 shadow-sm">
                    <LocateFixed size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-blue-700">
                      Shortest walking route found
                    </p>
                    <p className="mt-1 text-xs leading-5 text-blue-600">
                      Toggle between 2D Map and 3D View to inspect elevation, obstacles, and campus surroundings.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {!selectedRoute && !routeLoading && !routeError && (
          <div className="mt-6 flex min-h-[400px] items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white">
            <div className="max-w-sm px-6 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                <Navigation size={28} />
              </div>
              <h2 className="mt-4 text-lg font-bold text-slate-800">
                Find Your Campus Route
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Select your starting location and destination to see the shortest walking route on the 2D/3D campus map.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Directions;