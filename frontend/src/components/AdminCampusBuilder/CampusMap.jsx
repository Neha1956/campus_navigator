
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
  Plus,
  Minus,
  RotateCcw,
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
   DYNAMIC MAP SETTINGS

   campusWidth / campusHeight received from parent are now
   treated as MINIMUM dimensions.

   The actual map grows automatically according to the
   buildings, roads, campus elements and locations.
========================================================= */

const MAP_EXTRA_PADDING = 400;
const MAP_GROWTH_STEP = 400;

const MIN_ZOOM = 0.5;
const MAX_ZOOM = 2.5;
const ZOOM_STEP = 0.1;

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
   NUMBER HELPER
========================================================= */

const safeNumber = (
  value,
  fallback = 0
) => {
  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : fallback;
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
     MAP VIEWPORT
  ========================================================= */

  const mapViewportRef = useRef(null);

  const [
    zoom,
    setZoom,
  ] = useState(1);

  /* =========================================================
     ROAD MOVE
  ========================================================= */

  const [
    draggingRoadId,
    setDraggingRoadId,
  ] = useState(null);

  const roadDragRef = useRef(null);

  /*
    IMPORTANT FIX:
    useRef keeps latest preview available inside
    window pointerup event.
  */

  const roadPreviewRef = useRef(null);

  const [
    roadPreview,
    setRoadPreview,
  ] = useState(null);

  /* =========================================================
     ROAD RESIZE
  ========================================================= */

  const roadResizeRef = useRef(null);

  const [
    resizingRoad,
    setResizingRoad,
  ] = useState(null);

  const roadResizePreviewRef =
    useRef(null);

  const [
    roadResizePreview,
    setRoadResizePreview,
  ] = useState(null);

  /* =========================================================
     NORMALIZED BUILDINGS
  ========================================================= */

  const normalizedBuildings =
    useMemo(() => {
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

  const gridBackground =
    useMemo(() => {
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

  const getRoadPoints = (
    road
  ) => {
    if (
      Array.isArray(
        road?.points
      ) &&
      road.points.length >= 2
    ) {
      return road.points;
    }

    const fromX =
      Number(
        road?.fromBuilding
          ?.position?.x ??
          road?.from
            ?.position?.x ??
          road?.fromBuilding?.x ??
          road?.from?.x ??
          0
      );

    const fromY =
      Number(
        road?.fromBuilding
          ?.position?.y ??
          road?.from
            ?.position?.y ??
          road?.fromBuilding?.y ??
          road?.from?.y ??
          0
      );

    const toX =
      Number(
        road?.toBuilding
          ?.position?.x ??
          road?.to
            ?.position?.x ??
          road?.toBuilding?.x ??
          road?.to?.x ??
          0
      );

    const toY =
      Number(
        road?.toBuilding
          ?.position?.y ??
          road?.to
            ?.position?.y ??
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

  const pointsToString = (
    points
  ) =>
    points
      .map(
        (point) =>
          `${Number(
            point.x
          )},${Number(point.y)}`
      )
      .join(" ");

  /* =========================================================
     DYNAMIC CAMPUS SIZE

     THIS IS THE MAIN CHANGE.

     Map starts from the parent's minimum size.

     When an object is located near / beyond the current
     edge, the SVG automatically becomes larger.

     Nothing is deleted or moved.
========================================================= */

  const dynamicCampusSize =
    useMemo(() => {
      let requiredWidth =
        safeNumber(
          campusWidth,
          1400
        );

      let requiredHeight =
        safeNumber(
          campusHeight,
          900
        );

      /* -----------------------------------------------------
         BUILDINGS
      ----------------------------------------------------- */

      normalizedBuildings.forEach(
        (building) => {
          const x =
            safeNumber(
              building?.position?.x ??
                building?.x
            );

          const y =
            safeNumber(
              building?.position?.y ??
                building?.y
            );

          const width =
            Math.max(
              0,
              safeNumber(
                building?.dimensions
                  ?.width ??
                  building?.width,
                250
              )
            );

          const height =
            Math.max(
              0,
              safeNumber(
                building?.dimensions
                  ?.height ??
                  building?.height,
                180
              )
            );

          requiredWidth =
            Math.max(
              requiredWidth,
              x +
                width +
                MAP_EXTRA_PADDING
            );

          requiredHeight =
            Math.max(
              requiredHeight,
              y +
                height +
                MAP_EXTRA_PADDING
            );
        }
      );

      /* -----------------------------------------------------
         CAMPUS ELEMENTS
      ----------------------------------------------------- */

      (
        Array.isArray(
          campusElements
        )
          ? campusElements
          : []
      ).forEach(
        (element) => {
          const x =
            safeNumber(
              element?.position?.x
            );

          const y =
            safeNumber(
              element?.position?.y
            );

          const width =
            Math.max(
              0,
              safeNumber(
                element
                  ?.dimensions?.width,
                150
              )
            );

          const height =
            Math.max(
              0,
              safeNumber(
                element
                  ?.dimensions?.height,
                100
              )
            );

          requiredWidth =
            Math.max(
              requiredWidth,
              x +
                width +
                MAP_EXTRA_PADDING
            );

          requiredHeight =
            Math.max(
              requiredHeight,
              y +
                height +
                MAP_EXTRA_PADDING
            );
        }
      );

      /* -----------------------------------------------------
         ROADS
      ----------------------------------------------------- */

      (
        Array.isArray(
          campusRoads
        )
          ? campusRoads
          : []
      ).forEach(
        (road) => {
          const points =
            getRoadPoints(
              road
            );

          points.forEach(
            (point) => {
              const x =
                safeNumber(
                  point?.x
                );

              const y =
                safeNumber(
                  point?.y
                );

              requiredWidth =
                Math.max(
                  requiredWidth,
                  x +
                    MAP_EXTRA_PADDING
                );

              requiredHeight =
                Math.max(
                  requiredHeight,
                  y +
                    MAP_EXTRA_PADDING
                );
            }
          );
        }
      );

      /* -----------------------------------------------------
         LOCATIONS
      ----------------------------------------------------- */

      (
        Array.isArray(
          locations
        )
          ? locations
          : []
      ).forEach(
        (location) => {
          const x =
            safeNumber(
              location?.x
            );

          const y =
            safeNumber(
              location?.y
            );

          requiredWidth =
            Math.max(
              requiredWidth,
              x +
                MAP_EXTRA_PADDING
            );

          requiredHeight =
            Math.max(
              requiredHeight,
              y +
                MAP_EXTRA_PADDING
            );
        }
      );

      /* -----------------------------------------------------
         ROUTE LOCATIONS
      ----------------------------------------------------- */

      (
        Array.isArray(
          routeLocations
        )
          ? routeLocations
          : []
      ).forEach(
        (location) => {
          const x =
            safeNumber(
              location?.x
            );

          const y =
            safeNumber(
              location?.y
            );

          requiredWidth =
            Math.max(
              requiredWidth,
              x +
                MAP_EXTRA_PADDING
            );

          requiredHeight =
            Math.max(
              requiredHeight,
              y +
                MAP_EXTRA_PADDING
            );
        }
      );

      /* -----------------------------------------------------
         ROUTE PATH
      ----------------------------------------------------- */

      (
        Array.isArray(
          routePath
        )
          ? routePath
          : []
      ).forEach(
        (point) => {
          const x =
            safeNumber(
              point?.x
            );

          const y =
            safeNumber(
              point?.y
            );

          requiredWidth =
            Math.max(
              requiredWidth,
              x +
                MAP_EXTRA_PADDING
            );

          requiredHeight =
            Math.max(
              requiredHeight,
              y +
                MAP_EXTRA_PADDING
            );
        }
      );

      /* -----------------------------------------------------
         ROUND UP TO GROWTH STEP

         Example:

         1400 -> 1400
         1530 -> 1600
         1880 -> 2000
         2370 -> 2400
      ----------------------------------------------------- */

      const finalWidth =
        Math.ceil(
          requiredWidth /
            MAP_GROWTH_STEP
        ) *
        MAP_GROWTH_STEP;

      const finalHeight =
        Math.ceil(
          requiredHeight /
            MAP_GROWTH_STEP
        ) *
        MAP_GROWTH_STEP;

      return {
        width: Math.max(
          campusWidth,
          finalWidth
        ),

        height: Math.max(
          campusHeight,
          finalHeight
        ),
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
    ]);

  const mapWidth =
    dynamicCampusSize.width;

  const mapHeight =
    dynamicCampusSize.height;

  /* =========================================================
     ZOOM
  ========================================================= */

  const clampZoom = (
    value
  ) => {
    return Math.min(
      MAX_ZOOM,
      Math.max(
        MIN_ZOOM,
        value
      )
    );
  };

  const changeZoom = (
    nextZoom
  ) => {
    const viewport =
      mapViewportRef.current;

    const newZoom =
      clampZoom(nextZoom);

    if (!viewport) {
      setZoom(newZoom);
      return;
    }

    const oldZoom =
      zoom;

    if (
      oldZoom ===
      newZoom
    ) {
      return;
    }

    /*
      Keep the visible center while zooming.
    */

    const centerX =
      viewport.scrollLeft +
      viewport.clientWidth /
        2;

    const centerY =
      viewport.scrollTop +
      viewport.clientHeight /
        2;

    const scale =
      newZoom /
      oldZoom;

    setZoom(newZoom);

    requestAnimationFrame(
      () => {
        const currentViewport =
          mapViewportRef.current;

        if (
          !currentViewport
        ) {
          return;
        }

        currentViewport.scrollLeft =
          Math.max(
            0,
            centerX *
              scale -
              currentViewport.clientWidth /
                2
          );

        currentViewport.scrollTop =
          Math.max(
            0,
            centerY *
              scale -
              currentViewport.clientHeight /
                2
          );
      }
    );
  };

  const zoomIn =
    () => {
      changeZoom(
        zoom +
          ZOOM_STEP
      );
    };

  const zoomOut =
    () => {
      changeZoom(
        zoom -
          ZOOM_STEP
      );
    };

  const resetZoom =
    () => {
      changeZoom(1);
    };

  /* =========================================================
     MAP WHEEL

     Normal wheel:
       vertical/horizontal scrolling

     Ctrl + wheel / Cmd + wheel:
       zoom
  ========================================================= */

  const handleMapWheel =
    (event) => {
      if (
        event.ctrlKey ||
        event.metaKey
      ) {
        event.preventDefault();

        if (
          event.deltaY <
          0
        ) {
          changeZoom(
            zoom +
              ZOOM_STEP
          );
        } else {
          changeZoom(
            zoom -
              ZOOM_STEP
          );
        }
      }
    };

  /* =========================================================
     SVG POINT
  ========================================================= */

  const getSvgPoint = (
    event
  ) => {
    const svg =
      campusCanvasRef?.current ||
      event?.currentTarget
        ?.ownerSVGElement ||
      document.querySelector(
        "svg[data-campus-map='true']"
      );

    if (!svg) {
      return null;
    }

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
      return null;
    }

    return point.matrixTransform(
      matrix
    );
  };

  /* =========================================================
     ROAD MOVE CLEANUP
  ========================================================= */

  const cleanupRoadDrag =
    () => {
      roadDragRef.current =
        null;

      roadPreviewRef.current =
        null;

      setDraggingRoadId(
        null
      );

      setRoadPreview(
        null
      );

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

  const handleRoadPointerDown =
    (
      event,
      road
    ) => {
      if (
        event.button !==
          undefined &&
        event.button !== 0
      ) {
        return;
      }

      if (
        activeTool !==
        "select"
      ) {
        return;
      }

      /*
        If clicking resize handle, don't start
        whole-road movement.
      */

      if (
        event.target?.dataset
          ?.roadResizeHandle ===
        "true"
      ) {
        return;
      }

      event.stopPropagation();
      event.preventDefault();

      handleRoadClick?.(
        road
      );

      const svgPoint =
        getSvgPoint(
          event
        );

      if (!svgPoint) {
        return;
      }

      const points =
        getRoadPoints(
          road
        );

      roadDragRef.current =
        {
          road,

          startX:
            svgPoint.x,

          startY:
            svgPoint.y,

          originalPoints:
            points.map(
              (point) => ({
                x: Number(
                  point.x
                ),
                y: Number(
                  point.y
                ),
              })
            ),
        };

      roadPreviewRef.current =
        {
          roadId:
            road._id,

          points:
            points.map(
              (point) => ({
                x: Number(
                  point.x
                ),
                y: Number(
                  point.y
                ),
              })
            ),
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

  const handleRoadPointerMove =
    (event) => {
      const data =
        roadDragRef.current;

      if (!data) {
        return;
      }

      const svgPoint =
        getSvgPoint(
          event
        );

      if (!svgPoint) {
        return;
      }

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
              point.x +
              dx,

            y:
              point.y +
              dy,
          })
        );

      const preview =
        {
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

  const handleRoadPointerUp =
    () => {
      const data =
        roadDragRef.current;

      if (!data) {
        cleanupRoadDrag();
        return;
      }

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

  const cleanupRoadResize =
    () => {
      roadResizeRef.current =
        null;

      roadResizePreviewRef.current =
        null;

      setResizingRoad(
        null
      );

      setRoadResizePreview(
        null
      );

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

  const handleRoadResizeDown =
    (
      event,
      road,
      endpointIndex
    ) => {
      if (
        event.button !==
          undefined &&
        event.button !== 0
      ) {
        return;
      }

      if (
        activeTool !==
        "select"
      ) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      handleRoadClick?.(
        road
      );

      const svgPoint =
        getSvgPoint(
          event
        );

      if (!svgPoint) {
        return;
      }

      const points =
        getRoadPoints(
          road
        );

      if (
        points.length <
        2
      ) {
        return;
      }

      const originalPoints =
        points.map(
          (point) => ({
            x: Number(
              point.x
            ),
            y: Number(
              point.y
            ),
          })
        );

      roadResizeRef.current =
        {
          road,

          endpointIndex,

          startX:
            svgPoint.x,

          startY:
            svgPoint.y,

          originalPoints,
        };

      roadResizePreviewRef.current =
        {
          roadId:
            road._id,

          points:
            originalPoints,
        };

      setResizingRoad(
        {
          roadId:
            road._id,

          endpointIndex,
        }
      );

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

  const handleRoadResizeMove =
    (event) => {
      const data =
        roadResizeRef.current;

      if (!data) {
        return;
      }

      const svgPoint =
        getSvgPoint(
          event
        );

      if (!svgPoint) {
        return;
      }

      const updatedPoints =
        data.originalPoints.map(
          (point) => ({
            ...point,
          })
        );

      /*
        Only move selected endpoint.

        IMPORTANT:
        We intentionally do NOT clamp to the old
        campusWidth/campusHeight.

        This allows the map to grow dynamically.
      */

      updatedPoints[
        data.endpointIndex
      ] = {
        x: Math.max(
          0,
          Math.round(
            svgPoint.x
          )
        ),

        y: Math.max(
          0,
          Math.round(
            svgPoint.y
          )
        ),
      };

      const preview =
        {
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

  const handleRoadResizeUp =
    () => {
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

  const clearSelection =
    () => {
      setSelectedBuilding?.(
        null
      );

      setSelectedRoad?.(
        null
      );

      setSelectedElement?.(
        null
      );

      setSelectedCampusElement?.(
        null
      );
    };

  /* =========================================================
     MAP LOCATIONS
  ========================================================= */

  const mapLocations =
    Array.isArray(
      locations
    )
      ? locations.filter(
          (location) =>
            location &&
            location.x !==
              undefined &&
            location.y !==
              undefined
        )
      : [];

  /* =========================================================
     ROUTE
  ========================================================= */

  const routePoints =
    Array.isArray(
      routePath
    )
      ? routePath
      : [];

  const routePolyline =
    routePoints
      .map(
        (point) =>
          `${Number(
            point.x
          )},${Number(
            point.y
          )}`
      )
      .join(" ");

  /* =========================================================
     BACKGROUND CLICK
  ========================================================= */

  const handleBackgroundClick =
    (event) => {
      if (
        onMapPointSelected
      ) {
        const svg =
          campusCanvasRef?.current ||
          event?.currentTarget
            ?.ownerSVGElement;

        if (svg) {
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

          if (matrix) {
            const svgPoint =
              point.matrixTransform(
                matrix
              );

            onMapPointSelected(
              event,
              svgPoint
            );
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
        activeTool ===
          "select" ||
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

  /* =========================================================
     MAP POINT CAPTURE
  ========================================================= */

  const handleMapPointCapture =
    (event) => {
      const svg =
        campusCanvasRef?.current;

      if (
        !svg ||
        !onMapPointSelected
      ) {
        return;
      }

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

      if (matrix) {
        onMapPointSelected(
          event,
          point.matrixTransform(
            matrix
          )
        );
      }
    };

  /* =========================================================
     TOOL MESSAGE
  ========================================================= */

  const getToolMessage =
    () => {
      if (
        CAMPUS_ELEMENT_TYPES.includes(
          activeTool
        )
      ) {
        return `Click anywhere on the map to place ${activeTool}`;
      }

      if (
        activeTool ===
        "select"
      ) {
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
      className={
        fitToContainer
          ? "relative h-full w-full min-h-0"
          : "relative min-w-max"
      }
    >
      {/* =====================================================
          TOOL MESSAGE
      ===================================================== */}

      {!readOnly &&
        getToolMessage() && (
          <div className="sticky top-0 z-[2000] mb-3 inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm text-white shadow-lg">
            <MousePointer2
              size={16}
            />

            {getToolMessage()}
          </div>
        )}

      {/* =====================================================
          MAP VIEWPORT

          For user page / fitToContainer:
          internal horizontal + vertical scrolling.

          For admin:
          map keeps its natural dynamic size and parent
          container can scroll.
      ===================================================== */}

      <div
        ref={
          fitToContainer
            ? mapViewportRef
            : undefined
        }
        onWheel={
          fitToContainer
            ? handleMapWheel
            : undefined
        }
        className={
          fitToContainer
            ? "relative h-full w-full overflow-auto rounded-2xl border border-slate-300 bg-slate-100 shadow-xl"
            : "relative rounded-2xl border border-slate-300 bg-white shadow-xl overflow-auto"
        }
        style={
          fitToContainer
            ? {
                backgroundColor:
                  "#f8fafc",
              }
            : {
                backgroundImage:
                  gridBackground,
                backgroundColor:
                  "#f8fafc",
              }
        }
      >
        {/* ===================================================
            DYNAMIC MAP WRAPPER
        =================================================== */}

        <div
          className="relative"
          style={{
            width: `${
              mapWidth *
              zoom
            }px`,

            height: `${
              mapHeight *
              zoom
            }px`,

            minWidth: `${
              mapWidth *
              zoom
            }px`,

            minHeight: `${
              mapHeight *
              zoom
            }px`,

            backgroundImage:
              gridBackground,

            backgroundColor:
              "#f8fafc",
          }}
        >
          {/* =================================================
              SVG
          ================================================= */}

          <svg
            ref={
              campusCanvasRef
            }
            data-campus-map="true"

            /*
              IMPORTANT:
              width / height are dynamic.
              viewBox remains in logical map coordinates.
            */

            width={
              mapWidth *
              zoom
            }

            height={
              mapHeight *
              zoom
            }

            viewBox={`0 0 ${mapWidth} ${mapHeight}`}

            preserveAspectRatio="none"

            className="block"

            style={{
              width: `${
                mapWidth *
                zoom
              }px`,

              height: `${
                mapHeight *
                zoom
              }px`,

              overflow:
                "visible",

              cursor:
                !readOnly &&
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
              width={
                mapWidth
              }
              height={
                mapHeight
              }
              fill={
                mapView ===
                "3d"
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
              width={Math.max(
                0,
                mapWidth - 40
              )}
              height={Math.max(
                0,
                mapHeight - 40
              )}
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
              {(
                Array.isArray(
                  campusRoads
                )
                  ? campusRoads
                  : []
              ).map(
                (road) => {
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
                      points.length -
                        1
                    ];

                  return (
                    <g
                      key={
                        road._id
                      }
                      data-road-id={
                        road._id
                      }
                    >
                      {/* =====================================
                          ROAD SHADOW
                      ===================================== */}

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

                      {/* =====================================
                          ROAD
                      ===================================== */}

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
                            ? width +
                              6
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
                        onPointerDown={
                          readOnly
                            ? undefined
                            : (
                                event
                              ) =>
                                handleRoadPointerDown(
                                  event,
                                  road
                                )
                        }
                        onClick={
                          readOnly
                            ? undefined
                            : (
                                event
                              ) => {
                                event.stopPropagation();

                                handleRoadClick?.(
                                  road
                                );
                              }
                        }
                      />

                      {/* =====================================
                          CENTER LINE
                      ===================================== */}

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

                      {/* =====================================
                          ROAD LABEL
                      ===================================== */}

                      <text
                        x={
                          points[0]
                            ?.x ||
                          0
                        }
                        y={
                          (points[0]
                            ?.y ||
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
                        {
                          road.name
                        }
                      </text>

                      {/* =====================================
                          ROAD RESIZE HANDLES
                      ===================================== */}

                      {!readOnly &&
                        selected &&
                        activeTool ===
                          "select" &&
                        firstPoint &&
                        lastPoint && (
                          <g>
                            {/* START HANDLE */}

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

                            {/* END HANDLE */}

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

                            {/* RESIZE LABEL */}

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
                }
              )}
            </g>

            {/* =================================================
                ROUTE PATH
            ================================================= */}

            {routePolyline && (
              <>
                <polyline
                  points={
                    routePolyline
                  }
                  fill="none"
                  stroke="rgba(255,255,255,0.95)"
                  strokeWidth="14"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  pointerEvents="none"
                />

                <polyline
                  points={
                    routePolyline
                  }
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

            {/* =================================================
                LOCATION PINS
            ================================================= */}

            {mapLocations.length >
              0 && (
              <g data-layer="location-pins">
                {mapLocations.map(
                  (
                    location
                  ) => {
                    const isSelected =
                      selectedLocation?._id ===
                      location._id;

                    const pinColor =
                      isSelected
                        ? "#2563eb"
                        : "#ef4444";

                    return (
                      <g
                        key={
                          location._id ||
                          `${location.name}-${location.x}-${location.y}`
                        }
                        transform={`translate(${Number(
                          location.x
                        )}, ${Number(
                          location.y
                        )})`}
                        onClick={(
                          event
                        ) => {
                          event.stopPropagation();

                          onLocationClick?.(
                            location
                          );
                        }}
                        style={{
                          cursor:
                            "pointer",
                        }}
                      >
                        <circle
                          r={
                            isSelected
                              ? 28
                              : 22
                          }
                          fill={
                            pinColor
                          }
                          opacity={
                            isSelected
                              ? 0.12
                              : 0.08
                          }
                        />

                        <path
                          d="M0,-26 C-10,-26 -18,-18 -18,-8 C-18,5 -2,22 0,26 C2,22 18,5 18,-8 C18,-18 10,-26 0,-26 Z"
                          fill={
                            pinColor
                          }
                          stroke="#ffffff"
                          strokeWidth="2"
                        />

                        <circle
                          r="7"
                          fill="#ffffff"
                        />

                        <text
                          x="0"
                          y="38"
                          textAnchor="middle"
                          fontSize="10"
                          fontWeight="700"
                          fill="#334155"
                        >
                          {location
                            .name
                            ?.length >
                          15
                            ? `${location.name.slice(
                                0,
                                14
                              )}...`
                            : location.name}
                        </text>
                      </g>
                    );
                  }
                )}
              </g>
            )}

            {/* =================================================
                SOURCE LOCATION
            ================================================= */}

            {sourceLocation && (
              <g
                transform={`translate(${Number(
                  sourceLocation.x
                )}, ${Number(
                  sourceLocation.y
                )})`}
              >
                <circle
                  r="18"
                  fill="#2563eb"
                  stroke="#ffffff"
                  strokeWidth="4"
                />

                <circle
                  r="6"
                  fill="#ffffff"
                />
              </g>
            )}

            {/* =================================================
                DESTINATION LOCATION
            ================================================= */}

            {destinationLocation && (
              <g
                transform={`translate(${Number(
                  destinationLocation.x
                )}, ${Number(
                  destinationLocation.y
                )})`}
              >
                <circle
                  r="18"
                  fill="#ef4444"
                  stroke="#ffffff"
                  strokeWidth="4"
                />

                <circle
                  r="6"
                  fill="#ffffff"
                />
              </g>
            )}

            {/* =================================================
                CAMPUS ELEMENTS
            ================================================= */}

            <g data-layer="campus-elements">
              {(
                Array.isArray(
                  campusElements
                )
                  ? campusElements
                  : []
              ).map(
                (element) => (
                  <CampusElementRenderer
                    key={
                      element._id
                    }
                    element={
                      element
                    }
                    selected={
                      selectedCampusElement?._id ===
                      element._id
                    }
                    onSelect={
                      readOnly
                        ? undefined
                        : handleCampusElementSelect
                    }
                    onDragEnd={
                      readOnly
                        ? undefined
                        : handleCampusElementDragEnd
                    }
                    onResizeEnd={
                      readOnly
                        ? undefined
                        : handleCampusElementResizeEnd
                    }
                  />
                )
              )}
            </g>

            {/* =================================================
                BUILDINGS

                IMPORTANT:
                BuildingRenderer is SVG <g>.
                Therefore it MUST remain inside SVG.
            ================================================= */}

            <g
              data-layer="buildings"
              style={{
                pointerEvents:
                  "auto",
              }}
            >
              {normalizedBuildings.map(
                (
                  building
                ) => {
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
                      key={
                        buildingId
                      }
                      building={
                        building
                      }
                      activeTool={
                        readOnly
                          ? "view"
                          : activeTool
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

                      /*
                        Existing building functionality
                        preserved.
                      */

                      onDragEnd={
                        readOnly
                          ? undefined
                          : handleBuildingDragEnd
                      }

                      onSelect={
                        handleBuildingSelect
                      }

                      onOpen={
                        handleOpenBuilding
                      }

                      onDelete={
                        readOnly
                          ? undefined
                          : handleDeleteBuilding
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

            {/* =================================================
                LOCATION LABELS
            ================================================= */}

            {(
              routeLocations.length >
              0
                ? routeLocations
                : mapLocations
            ).length >
              0 && (
              <g data-layer="location-labels">
                {(
                  routeLocations.length >
                  0
                    ? routeLocations
                    : mapLocations
                ).map(
                  (
                    location
                  ) => (
                    <g
                      key={`label-${
                        location._id ||
                        location.name
                      }`}
                      transform={`translate(${Number(
                        location.x
                      )}, ${Number(
                        location.y
                      )})`}
                      onClick={(
                        event
                      ) => {
                        event.stopPropagation();

                        onLocationClick?.(
                          location
                        );
                      }}
                      style={{
                        cursor:
                          "pointer",
                      }}
                    >
                      <circle
                        r="14"
                        fill="#ef4444"
                        stroke="#ffffff"
                        strokeWidth="3"
                      />

                      <circle
                        r="5"
                        fill="#ffffff"
                      />

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
                        {location
                          .name
                          ?.length >
                        22
                          ? `${location.name.slice(
                              0,
                              21
                            )}...`
                          : location.name}
                      </text>
                    </g>
                  )
                )}
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
                      mapWidth /
                        2 -
                      180
                    }
                    y={
                      mapHeight /
                        2 -
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
                      mapWidth /
                        2 -
                      25
                    }
                    y={
                      mapHeight /
                        2 -
                      60
                    }
                    width="50"
                    height="50"
                  >
                    <div className="flex h-full w-full items-center justify-center">
                      <Building2
                        size={
                          36
                        }
                        className="text-slate-400"
                      />
                    </div>
                  </foreignObject>

                  <text
                    x={
                      mapWidth /
                      2
                    }
                    y={
                      mapHeight /
                        2 +
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
                      mapWidth /
                      2
                    }
                    y={
                      mapHeight /
                        2 +
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

      {/* =====================================================
          ZOOM CONTROLS

          Only useful when map is inside its own viewport.
      ===================================================== */}

      {fitToContainer && (
        <div className="absolute right-4 top-4 z-[2500] flex items-center gap-1 rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg">
          <button
            type="button"
            onClick={
              zoomOut
            }
            disabled={
              zoom <=
              MIN_ZOOM
            }
            title="Zoom out"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Minus
              size={18}
            />
          </button>

          <div className="min-w-[55px] px-1 text-center text-xs font-semibold text-slate-600">
            {Math.round(
              zoom * 100
            )}
            %
          </div>

          <button
            type="button"
            onClick={
              zoomIn
            }
            disabled={
              zoom >=
              MAX_ZOOM
            }
            title="Zoom in"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Plus
              size={18}
            />
          </button>

          <button
            type="button"
            onClick={
              resetZoom
            }
            title="Reset zoom"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 transition hover:bg-slate-100"
          >
            <RotateCcw
              size={16}
            />
          </button>
        </div>
      )}

      {/* =====================================================
          MAP SIZE INFORMATION

          Admin ko pata chalega map kitna bada ho gaya.
      ===================================================== */}

      {!readOnly && (
        <div className="pointer-events-none absolute bottom-4 right-4 z-[2000] rounded-lg border border-slate-200 bg-white/95 px-3 py-2 text-xs font-semibold text-slate-600 shadow-md backdrop-blur">
          Canvas:{" "}
          {mapWidth} ×{" "}
          {mapHeight}
        </div>
      )}
    </div>
  );
};

export default CampusMap;

