
import React, {
  useMemo,
  useRef,
  useState,
} from "react";

import {
  MapPin,
  Building2,
  Car,
  Trees,
  Dumbbell,
  DoorOpen,
  MousePointer2,
} from "lucide-react";

import BuildingRenderer from "./BuildingRenderer";
import CampusElementRenderer from "./CampusElementRenderer";

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
   CAMPUS ELEMENT ICON
========================================================= */

const getCampusElementIcon = (type) => {
  switch (type) {
    case "parking":
      return Car;

    case "park":
      return Trees;

    case "ground":
      return Dumbbell;

    case "small-room":
      return DoorOpen;

    default:
      return MapPin;
  }
};

/* =========================================================
   NORMALIZE BUILDING
========================================================= */

const normalizeBuilding = (building) => {
  if (!building) return null;

  const position = building.position || {};
  const dimensions = building.dimensions || {};

  const x = Number(
    position.x ??
      building.x ??
      0
  );

  const y = Number(
    position.y ??
      building.y ??
      0
  );

  const z = Number(
    position.z ??
      building.z ??
      0
  );

  const width = Math.max(
    60,
    Number(
      dimensions.width ??
        building.width ??
        250
    )
  );

  const height = Math.max(
    60,
    Number(
      dimensions.height ??
        building.height ??
        180
    )
  );

  const depth = Math.max(
    20,
    Number(
      dimensions.depth ??
        building.depth ??
        height
    )
  );

  return {
    ...building,

    position: {
      ...position,
      x,
      y,
      z,
    },

    dimensions: {
      ...dimensions,
      width,
      height,
      depth,
    },

    /* Old structure compatibility */
    x,
    y,
    z,
    width,
    height,
    depth,
  };
};

/* =========================================================
   COMPONENT
========================================================= */

const CampusMap = ({
  campusCanvasRef,

  campusWidth = 1400,
  campusHeight = 900,

  showGrid,
  mapView = "3d",
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
}) => {
  const wrapperRef = useRef(null);

  /* =========================================================
     ROAD MOVE
  ========================================================= */

  const [draggingRoadId, setDraggingRoadId] =
    useState(null);

  const roadDragRef = useRef(null);

  /*
    IMPORTANT FIX:
    useRef keeps latest preview available inside
    window pointerup event.
  */

  const roadPreviewRef = useRef(null);

  const [roadPreview, setRoadPreview] =
    useState(null);

  /* =========================================================
     ROAD RESIZE
  ========================================================= */

  const roadResizeRef = useRef(null);

  const [resizingRoad, setResizingRoad] =
    useState(null);

  const roadResizePreviewRef = useRef(null);

  const [roadResizePreview, setRoadResizePreview] =
    useState(null);

  /* =========================================================
     NORMALIZED BUILDINGS
  ========================================================= */

  const normalizedBuildings = useMemo(() => {
    return (
      Array.isArray(buildings)
        ? buildings
        : []
    )
      .map(normalizeBuilding)
      .filter(Boolean);
  }, [buildings]);

  /* =========================================================
     GRID
  ========================================================= */

  const gridBackground = useMemo(() => {
    if (!showGrid) {
      return "none";
    }

    return `
      repeating-linear-gradient(
        0deg,
        rgba(100,116,139,.10) 0px,
        rgba(100,116,139,.10) 1px,
        transparent 1px,
        transparent 20px
      ),
      repeating-linear-gradient(
        90deg,
        rgba(100,116,139,.10) 0px,
        rgba(100,116,139,.10) 1px,
        transparent 1px,
        transparent 20px
      )
    `;
  }, [showGrid]);

  /* =========================================================
     ROAD POINTS
  ========================================================= */

  const getRoadPoints = (road) => {
    if (
      Array.isArray(road?.points) &&
      road.points.length >= 2
    ) {
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
      {
        x: fromX,
        y: fromY,
      },
      {
        x: toX,
        y: toY,
      },
    ];
  };

  /* =========================================================
     POINTS TO STRING
  ========================================================= */

  const pointsToString = (points) =>
    points
      .map(
        (point) =>
          `${Number(point.x)},${Number(point.y)}`
      )
      .join(" ");

  /* =========================================================
     SVG POINT
  ========================================================= */

  const getSvgPoint = (event) => {
    const svg =
      campusCanvasRef?.current ||
      event?.currentTarget?.ownerSVGElement ||
      document.querySelector(
        "svg[data-campus-map='true']"
      );

    if (!svg) return null;

    const point =
      svg.createSVGPoint();

    point.x = event.clientX;
    point.y = event.clientY;

    const matrix =
      svg.getScreenCTM()?.inverse();

    if (!matrix) return null;

    return point.matrixTransform(
      matrix
    );
  };

  /* =========================================================
     ROAD MOVE CLEANUP
  ========================================================= */

  const cleanupRoadDrag = () => {
    roadDragRef.current = null;

    roadPreviewRef.current = null;

    setDraggingRoadId(null);
    setRoadPreview(null);

    window.removeEventListener(
      "pointermove",
      handleRoadPointerMove
    );

    window.removeEventListener(
      "pointerup",
      handleRoadPointerUp
    );
  };

  /* =========================================================
     ROAD MOVE POINTER DOWN
  ========================================================= */

  const handleRoadPointerDown = (
    event,
    road
  ) => {
    if (
      event.button !== undefined &&
      event.button !== 0
    ) {
      return;
    }

    if (activeTool !== "select") {
      return;
    }

    /*
      If clicking resize handle, don't start
      whole-road movement.
    */

    if (
      event.target?.dataset?.roadResizeHandle ===
      "true"
    ) {
      return;
    }

    event.stopPropagation();
    event.preventDefault();

    handleRoadClick?.(road);

    const svgPoint =
      getSvgPoint(event);

    if (!svgPoint) return;

    const points =
      getRoadPoints(road);

    roadDragRef.current = {
      road,

      startX: svgPoint.x,
      startY: svgPoint.y,

      originalPoints:
        points.map((point) => ({
          x: Number(point.x),
          y: Number(point.y),
        })),
    };

    roadPreviewRef.current = {
      roadId: road._id,
      points:
        points.map((point) => ({
          x: Number(point.x),
          y: Number(point.y),
        })),
    };

    setDraggingRoadId(
      road._id
    );

    setRoadPreview(
      roadPreviewRef.current
    );

    window.addEventListener(
      "pointermove",
      handleRoadPointerMove
    );

    window.addEventListener(
      "pointerup",
      handleRoadPointerUp
    );
  };

  /* =========================================================
     ROAD MOVE POINTER MOVE
  ========================================================= */

  const handleRoadPointerMove = (
    event
  ) => {
    const data =
      roadDragRef.current;

    if (!data) return;

    const svgPoint =
      getSvgPoint(event);

    if (!svgPoint) return;

    const dx =
      svgPoint.x -
      data.startX;

    const dy =
      svgPoint.y -
      data.startY;

    const updatedPoints =
      data.originalPoints.map(
        (point) => ({
          x:
            point.x + dx,
          y:
            point.y + dy,
        })
      );

    const preview = {
      roadId:
        data.road._id,
      points:
        updatedPoints,
    };

    roadPreviewRef.current =
      preview;

    setRoadPreview(
      preview
    );
  };

  /* =========================================================
     ROAD MOVE POINTER UP
  ========================================================= */

  const handleRoadPointerUp = () => {
    const data =
      roadDragRef.current;

    if (!data) {
      cleanupRoadDrag();
      return;
    }

    /*
      IMPORTANT:
      Read from ref, not state.
      This prevents stale roadPreview.
    */

    const preview =
      roadPreviewRef.current;

    if (
      preview &&
      preview.roadId ===
        data.road._id
    ) {
      handleRoadDragEnd?.(
        data.road,
        preview.points
      );
    }

    cleanupRoadDrag();
  };

  /* =========================================================
     ROAD RESIZE CLEANUP
  ========================================================= */

  const cleanupRoadResize = () => {
    roadResizeRef.current =
      null;

    roadResizePreviewRef.current =
      null;

    setResizingRoad(null);
    setRoadResizePreview(null);

    window.removeEventListener(
      "pointermove",
      handleRoadResizeMove
    );

    window.removeEventListener(
      "pointerup",
      handleRoadResizeUp
    );
  };

  /* =========================================================
     ROAD RESIZE POINTER DOWN
  ========================================================= */

  const handleRoadResizeDown = (
    event,
    road,
    endpointIndex
  ) => {
    if (
      event.button !== undefined &&
      event.button !== 0
    ) {
      return;
    }

    if (activeTool !== "select") {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    handleRoadClick?.(road);

    const svgPoint =
      getSvgPoint(event);

    if (!svgPoint) return;

    const points =
      getRoadPoints(road);

    if (points.length < 2) {
      return;
    }

    const originalPoints =
      points.map((point) => ({
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
      roadId:
        road._id,
      points:
        originalPoints,
    };

    setResizingRoad({
      roadId:
        road._id,
      endpointIndex,
    });

    setRoadResizePreview(
      roadResizePreviewRef.current
    );

    window.addEventListener(
      "pointermove",
      handleRoadResizeMove
    );

    window.addEventListener(
      "pointerup",
      handleRoadResizeUp
    );
  };

  /* =========================================================
     ROAD RESIZE POINTER MOVE
  ========================================================= */

  const handleRoadResizeMove = (
    event
  ) => {
    const data =
      roadResizeRef.current;

    if (!data) return;

    const svgPoint =
      getSvgPoint(event);

    if (!svgPoint) return;

    const updatedPoints =
      data.originalPoints.map(
        (point) => ({
          ...point,
        })
      );

    /*
      Only move selected endpoint.
    */

    updatedPoints[
      data.endpointIndex
    ] = {
      x: Math.max(
        0,
        Math.min(
          campusWidth,
          Math.round(
            svgPoint.x
          )
        )
      ),

      y: Math.max(
        0,
        Math.min(
          campusHeight,
          Math.round(
            svgPoint.y
          )
        )
      ),
    };

    const preview = {
      roadId:
        data.road._id,

      points:
        updatedPoints,
    };

    roadResizePreviewRef.current =
      preview;

    setRoadResizePreview(
      preview
    );
  };

  /* =========================================================
     ROAD RESIZE POINTER UP
  ========================================================= */

  const handleRoadResizeUp = () => {
    const data =
      roadResizeRef.current;

    if (!data) {
      cleanupRoadResize();
      return;
    }

    const preview =
      roadResizePreviewRef.current;

    if (
      preview &&
      preview.roadId ===
        data.road._id
    ) {
      /*
        Same existing callback is used.
        No new parent handler required.
      */

      handleRoadDragEnd?.(
        data.road,
        preview.points
      );
    }

    cleanupRoadResize();
  };

  /* =========================================================
     CLEAR SELECTION
  ========================================================= */

  const clearSelection = () => {
    setSelectedBuilding?.(null);
    setSelectedRoad?.(null);
    setSelectedElement?.(null);
    setSelectedCampusElement?.(null);
  };

  const mapLocations = Array.isArray(locations)
    ? locations.filter(
        (location) =>
          location &&
          location.x !== undefined &&
          location.y !== undefined
      )
    : [];

  const routePoints = Array.isArray(routePath)
    ? routePath
    : [];

  const routePolyline = routePoints
    .map((point) => `${Number(point.x)},${Number(point.y)}`)
    .join(" ");

  /* =========================================================
     BACKGROUND CLICK
  ========================================================= */

  const handleBackgroundClick = (
    event
  ) => {
    if (onMapPointSelected) {
      const svg =
        campusCanvasRef?.current ||
        event?.currentTarget?.ownerSVGElement;

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

    /*
      Only handle actual SVG background.
      Building/Road clicks are stopped by
      their own components.
    */

    if (
      event.target !==
      event.currentTarget
    ) {
      return;
    }

    if (
      activeTool === "select" ||
      !activeTool
    ) {
      clearSelection();
      return;
    }

    if (
      CAMPUS_ELEMENT_TYPES.includes(
        activeTool
      )
    ) {
      handleCampusCanvasClick?.(
        event
      );
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

  /* =========================================================
     TOOL MESSAGE
  ========================================================= */

  const getToolMessage = () => {
    if (
      CAMPUS_ELEMENT_TYPES.includes(
        activeTool
      )
    ) {
      return `Click anywhere on the map to place ${activeTool}`;
    }

    if (activeTool === "select") {
      return "Select, move, resize or edit an object";
    }

    return "";
  };

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div
      ref={wrapperRef}
      className={fitToContainer ? "relative h-full w-full" : "relative min-w-max"}
    >
      {/* =====================================================
          TOOL MESSAGE
      ===================================================== */}

      {getToolMessage() && (
        <div className="sticky top-0 z-[2000] mb-3 inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm text-white shadow-lg">
          <MousePointer2 size={16} />

          {getToolMessage()}
        </div>
      )}

      {/* =====================================================
          MAP CONTAINER
      ===================================================== */}

      <div
        className="relative rounded-2xl border border-slate-300 bg-white shadow-xl overflow-hidden"
        style={{
          width: fitToContainer ? "100%" : `${campusWidth}px`,
          height: fitToContainer ? "100%" : `${campusHeight}px`,
          backgroundImage:
            gridBackground,
          backgroundColor:
            "#f8fafc",
        }}
      >
        {/* ===================================================
            SVG
        =================================================== */}

        <svg
          ref={campusCanvasRef}
          data-campus-map="true"
          width={campusWidth}
          height={campusHeight}
          viewBox={`0 0 ${campusWidth} ${campusHeight}`}
          className="absolute inset-0 h-full w-full"
          style={{
            overflow: "visible",

            cursor:
              CAMPUS_ELEMENT_TYPES.includes(
                activeTool
              )
                ? "crosshair"
                : "default",
          }}
          onClick={
            handleBackgroundClick
          }
          onClickCapture={
            onMapPointSelected
              ? handleMapPointCapture
              : undefined
          }
        >
          {/* =================================================
              SVG DEFS
          ================================================= */}

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

          {/* =================================================
              BACKGROUND
          ================================================= */}

          <rect
            x="0"
            y="0"
            width={campusWidth}
            height={campusHeight}
            fill={
              mapView === "3d"
                ? "#eef2f7"
                : "#f8fafc"
            }
            pointerEvents="none"
          />

          {/* =================================================
              CAMPUS BORDER
          ================================================= */}

          <rect
            x="20"
            y="20"
            width={
              campusWidth - 40
            }
            height={
              campusHeight - 40
            }
            rx="24"
            fill="transparent"
            stroke="#94a3b8"
            strokeWidth="2"
            pointerEvents="none"
          />

          {/* =================================================
              ROADS
          ================================================= */}

          <g data-layer="roads">
            {(Array.isArray(
              campusRoads
            )
              ? campusRoads
              : []
            ).map((road) => {
              /*
                NORMAL ROAD POINTS
              */

              let points =
                getRoadPoints(
                  road
                );

              /*
                MOVE PREVIEW
              */

              if (
                roadPreview?.roadId ===
                road._id
              ) {
                points =
                  roadPreview.points;
              }

              /*
                RESIZE PREVIEW
              */

              if (
                roadResizePreview?.roadId ===
                road._id
              ) {
                points =
                  roadResizePreview.points;
              }

              const selected =
                selectedRoad?._id ===
                road._id;

              const width =
                Number(
                  road.width
                ) || 20;

              /*
                ENDPOINTS
              */

              const firstPoint =
                points[0];

              const lastPoint =
                points[
                  points.length - 1
                ];

              return (
                <g
                  key={road._id}
                  data-road-id={
                    road._id
                  }
                >
                  {/* =========================================
                      ROAD SHADOW
                  ========================================= */}

                  <polyline
                    points={pointsToString(
                      points
                    )}
                    fill="none"
                    stroke="#0f172a"
                    strokeOpacity="0.15"
                    strokeWidth={
                      width + 8
                    }
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    pointerEvents="none"
                  />

                  {/* =========================================
                      ROAD
                  ========================================= */}

                  <polyline
                    points={pointsToString(
                      points
                    )}
                    fill="none"
                    stroke={
                      selected
                        ? "#2563EB"
                        : road.color ||
                          "#64748B"
                    }
                    strokeWidth={
                      selected
                        ? width + 6
                        : width
                    }
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={
                      activeTool ===
                      "select"
                        ? "cursor-move"
                        : "cursor-default"
                    }
                    onPointerDown={readOnly ? undefined : (
                      event
                    ) =>
                      handleRoadPointerDown(
                        event,
                        road
                      )
                    }
                    onClick={readOnly ? undefined : (
                      event
                    ) => {
                      event.stopPropagation();

                      handleRoadClick?.(
                        road
                      );
                    }}
                  />

                  {/* =========================================
                      CENTER LINE
                  ========================================= */}

                  <polyline
                    points={pointsToString(
                      points
                    )}
                    fill="none"
                    stroke="#e2e8f0"
                    strokeWidth={Math.max(
                      2,
                      width *
                        0.12
                    )}
                    strokeDasharray="12 10"
                    strokeLinecap="round"
                    pointerEvents="none"
                  />

                  {/* =========================================
                      ROAD LABEL
                  ========================================= */}

                  <text
                    x={
                      points[0]?.x ||
                      0
                    }
                    y={
                      (points[0]?.y ||
                        0) - 12
                    }
                    fontSize="13"
                    fontWeight="700"
                    fill={
                      selected
                        ? "#1d4ed8"
                        : "#475569"
                    }
                    pointerEvents="none"
                  >
                    {road.name}
                  </text>

                  {/* =================================================
                      ROAD RESIZE HANDLES
                      
                      ONLY VISIBLE WHEN SELECTED
                  ================================================= */}

                  {selected &&
                    activeTool ===
                      "select" &&
                    firstPoint &&
                    lastPoint && (
                      <g>
                        {/* =========================================
                            START HANDLE
                        ========================================= */}

                        <circle
                          cx={
                            firstPoint.x
                          }
                          cy={
                            firstPoint.y
                          }
                          r="11"
                          fill="#ffffff"
                          stroke="#2563EB"
                          strokeWidth="3"
                          data-road-resize-handle="true"
                          className="cursor-ew-resize"
                          onPointerDown={(
                            event
                          ) =>
                            handleRoadResizeDown(
                              event,
                              road,
                              0
                            )
                          }
                        />

                        <circle
                          cx={
                            firstPoint.x
                          }
                          cy={
                            firstPoint.y
                          }
                          r="4"
                          fill="#2563EB"
                          pointerEvents="none"
                        />

                        {/* =========================================
                            END HANDLE
                        ========================================= */}

                        <circle
                          cx={
                            lastPoint.x
                          }
                          cy={
                            lastPoint.y
                          }
                          r="11"
                          fill="#ffffff"
                          stroke="#2563EB"
                          strokeWidth="3"
                          data-road-resize-handle="true"
                          className="cursor-ew-resize"
                          onPointerDown={(
                            event
                          ) =>
                            handleRoadResizeDown(
                              event,
                              road,
                              points.length -
                                1
                            )
                          }
                        />

                        <circle
                          cx={
                            lastPoint.x
                          }
                          cy={
                            lastPoint.y
                          }
                          r="4"
                          fill="#2563EB"
                          pointerEvents="none"
                        />

                        {/* =========================================
                            RESIZE LABEL
                        ========================================= */}

                        <text
                          x={
                            (firstPoint.x +
                              lastPoint.x) /
                            2
                          }
                          y={
                            (firstPoint.y +
                              lastPoint.y) /
                              2 -
                            18
                          }
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
            })}
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
                    transform={`translate(${Number(location.x)}, ${Number(location.y)})`}
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

          {sourceLocation && (
            <g transform={`translate(${Number(sourceLocation.x)}, ${Number(sourceLocation.y)})`}>
              <circle r="18" fill="#2563eb" stroke="#ffffff" strokeWidth="4" />
              <circle r="6" fill="#ffffff" />
            </g>
          )}

          {destinationLocation && (
            <g transform={`translate(${Number(destinationLocation.x)}, ${Number(destinationLocation.y)})`}>
              <circle r="18" fill="#ef4444" stroke="#ffffff" strokeWidth="4" />
              <circle r="6" fill="#ffffff" />
            </g>
          )}

          {/* =================================================
              CAMPUS ELEMENTS
          ================================================= */}

          <g data-layer="campus-elements">
            {(Array.isArray(
              campusElements
            )
              ? campusElements
              : []
            ).map((element) => (
              <CampusElementRenderer
                key={element._id}
                element={element}
                selected={
                  selectedCampusElement?._id ===
                  element._id
                }
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
            ))}
          </g>

          {/* =================================================
              BUILDINGS

              IMPORTANT:
              BuildingRenderer is SVG <g>.
              Therefore it MUST be inside SVG.
          ================================================= */}

          <g
            data-layer="buildings"
            style={{
              pointerEvents:
                "auto",
            }}
          >
            {normalizedBuildings.map(
              (building) => {
                const buildingId =
                  building._id ||
                  building.id;

                const isSelected =
                  selectedBuilding?._id ===
                    buildingId ||
                  selectedBuilding?.id ===
                    buildingId;

                return (
                  <BuildingRenderer
                    key={buildingId}
                    building={
                      building
                    }
                    activeTool={
                      readOnly ? "view" : activeTool
                    }
                    selected={
                      isSelected
                    }
                    mapView={
                      mapView
                    }
                    svgRef={
                      campusCanvasRef
                    }

                    onDragEnd={
                      handleBuildingDragEnd
                    }

                    onSelect={
                      handleBuildingSelect
                    }

                    onOpen={
                      handleOpenBuilding
                    }

                    onDelete={
                      handleDeleteBuilding
                    }

                    onEntranceSelect={
                      undefined
                    }

                    showEntrance={
                      true
                    }
                  />
                );
              }
            )}
          </g>

          {(routeLocations.length > 0 ? routeLocations : mapLocations).length > 0 && (
            <g data-layer="location-labels">
              {(routeLocations.length > 0 ? routeLocations : mapLocations).map((location) => (
                <g
                  key={`label-${location._id || location.name}`}
                  transform={`translate(${Number(location.x)}, ${Number(location.y)})`}
                  onClick={(event) => {
                    event.stopPropagation();
                    onLocationClick?.(location);
                  }}
                  style={{ cursor: "pointer" }}
                >
                  <circle r="14" fill="#ef4444" stroke="#ffffff" strokeWidth="3" />
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

          {/* =================================================
              EMPTY MAP
          ================================================= */}

          {normalizedBuildings.length ===
            0 &&
            campusElements.length ===
              0 &&
            campusRoads.length ===
              0 && (
              <g pointerEvents="none">
                <rect
                  x={
                    campusWidth / 2 -
                    180
                  }
                  y={
                    campusHeight / 2 -
                    90
                  }
                  width="360"
                  height="180"
                  rx="20"
                  fill="#ffffff"
                  fillOpacity="0.92"
                  stroke="#cbd5e1"
                />

                <foreignObject
                  x={
                    campusWidth / 2 -
                    25
                  }
                  y={
                    campusHeight / 2 -
                    60
                  }
                  width="50"
                  height="50"
                >
                  <div className="flex h-full w-full items-center justify-center">
                    <Building2
                      size={36}
                      className="text-slate-400"
                    />
                  </div>
                </foreignObject>

                <text
                  x={
                    campusWidth / 2
                  }
                  y={
                    campusHeight / 2 +
                    10
                  }
                  textAnchor="middle"
                  fontSize="18"
                  fontWeight="700"
                  fill="#334155"
                >
                  Campus Map
                </text>

                <text
                  x={
                    campusWidth / 2
                  }
                  y={
                    campusHeight / 2 +
                    38
                  }
                  textAnchor="middle"
                  fontSize="13"
                  fill="#64748b"
                >
                  Add buildings, roads and
                  campus elements
                </text>
              </g>
            )}
        </svg>
      </div>
    </div>
  );
};

export default CampusMap;

