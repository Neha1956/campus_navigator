
import React from "react";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  Grid,
  Environment,
  Html,
} from "@react-three/drei";
import * as THREE from "three";

/* =========================================================
   COLORS
========================================================= */

const COLORS = {
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

/* =========================================================
   HELPER
========================================================= */

const getPosition = (element) => {
  const position = element?.position || {};

  return {
    x: Number(position.x || 0),
    y: Number(position.y || 0),
    z: Number(position.z || 0),
  };
};

const getDimensions = (element) => {
  const dimensions = element?.dimensions || {};

  return {
    width: Number(dimensions.width || 100),
    height: Number(
      dimensions.height || 20
    ),
    depth: Number(
      dimensions.depth || dimensions.height || 80
    ),
  };
};

/* =========================================================
   ROOM / ELEMENT
========================================================= */

const Element3D = ({
  element,
  selected,
  onSelect,
}) => {
  const position = getPosition(element);
  const dimensions = getDimensions(element);

  const color =
    element.color ||
    COLORS[element.type] ||
    "#CBD5E1";

  const x =
    position.x + dimensions.width / 2;

  const y =
    position.z +
    dimensions.height / 2;

  const z =
    position.y +
    dimensions.depth / 2;

  return (
    <group
      position={[x, y, z]}
      onClick={(event) => {
        event.stopPropagation();
        onSelect?.(element);
      }}
    >
      {/* MAIN OBJECT */}

      <mesh castShadow receiveShadow>
        <boxGeometry
          args={[
            dimensions.width,
            dimensions.height,
            dimensions.depth,
          ]}
        />

        <meshStandardMaterial
          color={color}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* BORDER */}

      <lineSegments>
        <edgesGeometry
          args={[
            new THREE.BoxGeometry(
              dimensions.width,
              dimensions.height,
              dimensions.depth
            ),
          ]}
        />

        <lineBasicMaterial
          color={
            selected
              ? "#2563EB"
              : "#475569"
          }
          linewidth={selected ? 3 : 1}
        />
      </lineSegments>

      {/* SELECTED BORDER */}

      {selected && (
        <mesh>
          <boxGeometry
            args={[
              dimensions.width + 8,
              dimensions.height + 8,
              dimensions.depth + 8,
            ]}
          />

          <meshBasicMaterial
            color="#2563EB"
            wireframe
          />
        </mesh>
      )}

      {/* NAME */}

      <Html
        position={[
          0,
          dimensions.height / 2 + 10,
          0,
        ]}
        center
        distanceFactor={500}
      >
        <div
          className={`px-2 py-1 rounded-lg text-xs font-semibold whitespace-nowrap shadow ${
            selected
              ? "bg-blue-600 text-white"
              : "bg-white text-gray-800"
          }`}
        >
          {element.name}
        </div>
      </Html>
    </group>
  );
};

/* =========================================================
   FLOOR
========================================================= */

const FloorBase = ({
  width,
  depth,
}) => {
  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[
        width / 2,
        -1,
        depth / 2,
      ]}
      receiveShadow
    >
      <planeGeometry
        args={[width, depth]}
      />

      <meshStandardMaterial
        color="#F8FAFC"
      />
    </mesh>
  );
};

/* =========================================================
   FLOOR LABEL
========================================================= */

const FloorLabel = ({ floor }) => {
  if (!floor) return null;

  return (
    <Html
      position={[0, 5, 0]}
      center
      distanceFactor={800}
    >
      <div className="bg-blue-600 text-white px-4 py-2 rounded-xl shadow-xl font-bold">
        {floor.name}
      </div>
    </Html>
  );
};

/* =========================================================
   SCENE
========================================================= */

const Scene = ({
  elements,
  floor,
  selectedElement,
  onSelectElement,
}) => {
  /* =======================================================
     EXISTING FLOOR SIZE
  ======================================================= */

  const baseWidth = Number(
    floor?.width || 1000
  );

  const baseDepth = Number(
    floor?.height || 700
  );

  /* =======================================================
     DYNAMIC FLOOR SIZE

     Existing floor size will remain the minimum size.

     If any element goes outside the floor,
     floor will automatically increase.

     Existing working behaviour is not changed.
  ======================================================= */

  const FLOOR_PADDING = 100;

  const dynamicFloorSize = React.useMemo(() => {
    let requiredWidth = baseWidth;
    let requiredDepth = baseDepth;

    elements.forEach((element) => {
      const position = getPosition(element);
      const dimensions = getDimensions(element);

      /* ---------------------------------------------------
         ELEMENT RIGHT EDGE

         position.x = element starting X
         width       = element width
      --------------------------------------------------- */

      const elementRight =
        position.x + dimensions.width;

      /* ---------------------------------------------------
         ELEMENT BOTTOM EDGE

         position.y = element starting Y
         depth      = element depth
      --------------------------------------------------- */

      const elementBottom =
        position.y + dimensions.depth;

      /* ---------------------------------------------------
         ONLY INCREASE FLOOR SIZE

         Never reduce existing floor size.
      --------------------------------------------------- */

      requiredWidth = Math.max(
        requiredWidth,
        elementRight + FLOOR_PADDING
      );

      requiredDepth = Math.max(
        requiredDepth,
        elementBottom + FLOOR_PADDING
      );
    });

    return {
      width: requiredWidth,
      depth: requiredDepth,
    };
  }, [
    elements,
    baseWidth,
    baseDepth,
  ]);

  /* =======================================================
     FINAL FLOOR SIZE
  ======================================================= */

  const width =
    dynamicFloorSize.width;

  const depth =
    dynamicFloorSize.depth;

  return (
    <>
      <ambientLight intensity={1.5} />

      <directionalLight
        position={[500, 900, 500]}
        intensity={2}
        castShadow
      />

      {/* =====================================================
          DYNAMIC FLOOR
      ===================================================== */}

      <FloorBase
        width={width}
        depth={depth}
      />

      {/* =====================================================
          GRID
      ===================================================== */}

      <Grid
        args={[width, depth]}
        cellSize={20}
        cellThickness={0.5}
        sectionSize={100}
        sectionThickness={1}
        fadeDistance={1500}
        fadeStrength={1}
        position={[
          width / 2,
          0,
          depth / 2,
        ]}
      />

      {/* =====================================================
          FLOOR LABEL
      ===================================================== */}

      <FloorLabel floor={floor} />

      {/* =====================================================
          ELEMENTS
      ===================================================== */}

      {elements.map((element) => (
        <Element3D
          key={element._id}
          element={element}
          selected={
            selectedElement?._id ===
            element._id
          }
          onSelect={onSelectElement}
        />
      ))}

      {/* =====================================================
          ORBIT CONTROLS
      ===================================================== */}

      <OrbitControls
        enableDamping
        dampingFactor={0.08}
        minDistance={100}
        maxDistance={3000}
        maxPolarAngle={
          Math.PI / 2.05
        }
      />
    </>
  );
};

/* =========================================================
   MAIN COMPONENT
========================================================= */

const CampusViewer3D = ({
  building,
  floors = [],
  currentFloor,
  elements = [],
  selectedElement,
  onSelectElement,
}) => {
  if (!currentFloor) {
    return (
      <div className="h-full flex items-center justify-center bg-slate-950 text-white">
        Select a floor
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-[600px] bg-slate-950 relative">
      <Canvas
        shadows
        camera={{
          position: [
            700,
            700,
            800,
          ],
          fov: 45,
          near: 0.1,
          far: 10000,
        }}
      >
        <Environment preset="city" />

        <Scene
          elements={elements}
          floor={currentFloor}
          selectedElement={
            selectedElement
          }
          onSelectElement={
            onSelectElement
          }
        />
      </Canvas>

      <div className="absolute top-4 left-4 bg-black/70 text-white rounded-xl px-4 py-3">
        <p className="font-bold">
          {building?.name}
        </p>

        <p className="text-sm text-gray-300">
          {currentFloor?.name}
        </p>
      </div>

      <div className="absolute bottom-4 right-4 bg-white/90 rounded-xl px-4 py-3 text-xs text-gray-600">
        🖱 Drag = Rotate
        <br />
        🔍 Scroll = Zoom
        <br />
        🖱 Right Click = Pan
      </div>
    </div>
  );
};

export default CampusViewer3D;

