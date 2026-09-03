import React, { useEffect, useRef, useState } from "react";
import {
  Car,
  Trees,
  Dumbbell,
  DoorOpen,
  Maximize2,
  Waves,
  DoorClosed,
} from "lucide-react";

/* =========================================================
   ICON
========================================================= */

const getIcon = (type) => {
  switch (type) {
    case "parking":
      return Car;

    case "park":
      return Trees;

    case "ground":
      return Dumbbell;

    case "small-room":
      return DoorOpen;

    case "pond":
      return Waves;

    case "gate":
      return DoorClosed;

    default:
      return Maximize2;
  }
};

/* =========================================================
   LABEL
========================================================= */

const getLabel = (type) => {
  switch (type) {
    case "parking":
      return "Parking";

    case "ground":
      return "Ground";

    case "park":
      return "Park";

    case "small-room":
      return "Small Room";

    case "pond":
      return "Pond";

    case "gate":
      return "Gate";

    default:
      return "Campus Area";
  }
};

/* =========================================================
   SVG POINT HELPER
========================================================= */

const getSvgPoint = (event) => {
  const svg = event.currentTarget.ownerSVGElement;

  if (!svg) {
    return null;
  }

  const point = svg.createSVGPoint();

  point.x = event.clientX;
  point.y = event.clientY;

  const matrix = svg.getScreenCTM()?.inverse();

  if (!matrix) {
    return null;
  }

  return point.matrixTransform(matrix);
};

/* =========================================================
   COMPONENT
========================================================= */

const CampusElementRenderer = ({
  element,
  selected,
  onSelect,
  onDragEnd,
  onResizeEnd,
}) => {
  const dragStartRef = useRef(null);
  const resizeStartRef = useRef(null);

  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);

  const [previewPosition, setPreviewPosition] = useState(null);
  const [previewDimensions, setPreviewDimensions] = useState(null);

  /* =======================================================
     CLEANUP
  ======================================================= */

  useEffect(() => {
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointermove", handleResizeMove);
      window.removeEventListener("pointerup", handleResizeUp);
    };
  }, []);

  /* =======================================================
     VALUES
  ======================================================= */

  if (!element) {
    return null;
  }

  const baseX = Number(element.position?.x) || 0;
  const baseY = Number(element.position?.y) || 0;

  const baseWidth = Number(element.dimensions?.width) || 200;
  const baseHeight = Number(element.dimensions?.height) || 120;

  const x = Number(previewPosition?.x ?? baseX);
  const y = Number(previewPosition?.y ?? baseY);

  const width = Number(previewDimensions?.width ?? baseWidth);
  const height = Number(previewDimensions?.height ?? baseHeight);

  const rotation = Number(element.rotation) || 0;

  // Type ke basis par default color match
  const getDefaultColor = (type) => {
    switch (type) {
      case "pond":
        return "#BAE6FD";
      case "gate":
        return "#E2E8F0";
      default:
        return "#CBD5E1";
    }
  };

  const getDefaultStroke = (type) => {
    switch (type) {
      case "pond":
        return "#0284C7";
      case "gate":
        return "#334155";
      default:
        return "#475569";
    }
  };

  const color = element.color || getDefaultColor(element.type);
  const stroke = element.strokeColor || getDefaultStroke(element.type);
  const strokeWidth = Number(element.strokeWidth) || 2;

  const Icon = getIcon(element.type);

  /* =======================================================
     SELECT
  ======================================================= */

  const selectElement = (event) => {
    event.stopPropagation();
    onSelect?.(element);
  };

  /* =======================================================
     DRAG START
  ======================================================= */

  const handlePointerDown = (event) => {
    if (event.button !== undefined && event.button !== 0) {
      return;
    }

    event.stopPropagation();
    event.preventDefault();

    const point = getSvgPoint(event);

    if (!point) {
      return;
    }

    onSelect?.(element);

    dragStartRef.current = {
      mouseX: point.x,
      mouseY: point.y,
      elementX: baseX,
      elementY: baseY,
    };

    setIsDragging(true);

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
  };

  /* =======================================================
     DRAG MOVE
  ======================================================= */

  const handlePointerMove = (event) => {
    const start = dragStartRef.current;

    if (!start || !isDragging) {
      return;
    }

    const svg = document.querySelector("svg[data-campus-map='true']");

    if (!svg) {
      return;
    }

    const point = svg.createSVGPoint();

    point.x = event.clientX;
    point.y = event.clientY;

    const matrix = svg.getScreenCTM()?.inverse();

    if (!matrix) {
      return;
    }

    const svgPoint = point.matrixTransform(matrix);

    const dx = svgPoint.x - start.mouseX;
    const dy = svgPoint.y - start.mouseY;

    const newX = Math.max(0, start.elementX + dx);
    const newY = Math.max(0, start.elementY + dy);

    setPreviewPosition({
      x: newX,
      y: newY,
    });
  };

  /* =======================================================
     DRAG END
  ======================================================= */

  const handlePointerUp = (event) => {
    const start = dragStartRef.current;

    if (!start) {
      cleanupDrag();
      return;
    }

    const svg = document.querySelector("svg[data-campus-map='true']");

    let finalX = start.elementX;
    let finalY = start.elementY;

    if (svg) {
      const point = svg.createSVGPoint();

      point.x = event.clientX;
      point.y = event.clientY;

      const matrix = svg.getScreenCTM()?.inverse();

      if (matrix) {
        const svgPoint = point.matrixTransform(matrix);

        finalX = Math.max(
          0,
          Math.round(start.elementX + svgPoint.x - start.mouseX)
        );

        finalY = Math.max(
          0,
          Math.round(start.elementY + svgPoint.y - start.mouseY)
        );
      }
    }

    onDragEnd?.(element, {
      x: finalX,
      y: finalY,
      z: Number(element.position?.z) || 0,
    });

    cleanupDrag();
  };

  /* =======================================================
     DRAG CLEANUP
  ======================================================= */

  const cleanupDrag = () => {
    dragStartRef.current = null;
    setIsDragging(false);
    setPreviewPosition(null);

    window.removeEventListener("pointermove", handlePointerMove);
    window.removeEventListener("pointerup", handlePointerUp);
  };

  /* =======================================================
     RESIZE START
  ======================================================= */

  const handleResizeStart = (event) => {
    event.stopPropagation();
    event.preventDefault();

    const point = getSvgPoint(event);

    if (!point) {
      return;
    }

    onSelect?.(element);

    resizeStartRef.current = {
      mouseX: point.x,
      mouseY: point.y,
      width: baseWidth,
      height: baseHeight,
    };

    setIsResizing(true);

    window.addEventListener("pointermove", handleResizeMove);
    window.addEventListener("pointerup", handleResizeUp);
  };

  /* =======================================================
     RESIZE MOVE
  ======================================================= */

  const handleResizeMove = (event) => {
    const start = resizeStartRef.current;

    if (!start || !isResizing) {
      return;
    }

    const svg = document.querySelector("svg[data-campus-map='true']");

    if (!svg) {
      return;
    }

    const point = svg.createSVGPoint();

    point.x = event.clientX;
    point.y = event.clientY;

    const matrix = svg.getScreenCTM()?.inverse();

    if (!matrix) {
      return;
    }

    const svgPoint = point.matrixTransform(matrix);

    const dx = svgPoint.x - start.mouseX;
    const dy = svgPoint.y - start.mouseY;

    const newWidth = Math.max(40, Math.round(start.width + dx));
    const newHeight = Math.max(40, Math.round(start.height + dy));

    setPreviewDimensions({
      width: newWidth,
      height: newHeight,
    });
  };

  /* =======================================================
     RESIZE END
  ======================================================= */

  const handleResizeUp = (event) => {
    const start = resizeStartRef.current;

    if (!start) {
      cleanupResize();
      return;
    }

    const svg = document.querySelector("svg[data-campus-map='true']");

    let finalWidth = start.width;
    let finalHeight = start.height;

    if (svg) {
      const point = svg.createSVGPoint();

      point.x = event.clientX;
      point.y = event.clientY;

      const matrix = svg.getScreenCTM()?.inverse();

      if (matrix) {
        const svgPoint = point.matrixTransform(matrix);

        finalWidth = Math.max(
          40,
          Math.round(start.width + svgPoint.x - start.mouseX)
        );

        finalHeight = Math.max(
          40,
          Math.round(start.height + svgPoint.y - start.mouseY)
        );
      }
    }

    onResizeEnd?.(element, {
      width: finalWidth,
      height: finalHeight,
      depth: Number(element.dimensions?.depth) || finalHeight,
    });

    cleanupResize();
  };

  /* =======================================================
     RESIZE CLEANUP
  ======================================================= */

  const cleanupResize = () => {
    resizeStartRef.current = null;
    setIsResizing(false);
    setPreviewDimensions(null);

    window.removeEventListener("pointermove", handleResizeMove);
    window.removeEventListener("pointerup", handleResizeUp);
  };

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <g
      transform={`
        translate(${x} ${y})
        rotate(
          ${rotation}
          ${width / 2}
          ${height / 2}
        )
      `}
      onClick={selectElement}
    >
      {/* SHADOW */}
      <rect
        x="6"
        y="8"
        width={width}
        height={height}
        rx="10"
        fill="#0f172a"
        opacity="0.14"
        pointerEvents="none"
      />

      {/* MAIN BODY */}
      <rect
        x="0"
        y="0"
        width={width}
        height={height}
        rx="10"
        fill={color}
        stroke={selected ? "#2563EB" : stroke}
        strokeWidth={selected ? 3 : strokeWidth}
        className={isDragging ? "cursor-grabbing" : "cursor-grab"}
        onPointerDown={handlePointerDown}
      />

      {/* PARK */}
      {element.type === "park" && (
        <g pointerEvents="none">
          <circle
            cx={width * 0.25}
            cy={height * 0.35}
            r="15"
            fill="#22c55e"
            opacity="0.65"
          />
          <circle
            cx={width * 0.65}
            cy={height * 0.6}
            r="18"
            fill="#16a34a"
            opacity="0.65"
          />
          <circle
            cx={width * 0.82}
            cy={height * 0.25}
            r="12"
            fill="#15803d"
            opacity="0.65"
          />
          <path
            d={`
              M ${width * 0.08} ${height * 0.75}
              Q ${width * 0.45} ${height * 0.55} ${width * 0.9} ${height * 0.78}
            `}
            fill="none"
            stroke="#166534"
            strokeWidth="5"
            opacity="0.45"
          />
        </g>
      )}

      {/* PARKING */}
      {element.type === "parking" && (
        <g opacity="0.6" pointerEvents="none">
          {Array.from({
            length: Math.max(2, Math.floor(width / 35)),
          }).map((_, index) => {
            const lineX = 20 + index * 35;
            return (
              <line
                key={index}
                x1={lineX}
                y1={height * 0.18}
                x2={lineX}
                y2={height * 0.82}
                stroke="#475569"
                strokeWidth="2"
                strokeDasharray="6 4"
              />
            );
          })}
        </g>
      )}

      {/* GROUND */}
      {element.type === "ground" && (
        <g pointerEvents="none">
          <circle
            cx={width / 2}
            cy={height / 2}
            r={Math.min(width, height) * 0.28}
            fill="#84cc16"
            opacity="0.3"
          />
          <path
            d={`
              M ${width * 0.15} ${height * 0.5}
              H ${width * 0.85}
              M ${width * 0.5} ${height * 0.15}
              V ${height * 0.85}
            `}
            stroke="#92400e"
            strokeWidth="3"
            opacity="0.35"
          />
        </g>
      )}

      {/* SMALL ROOM */}
      {element.type === "small-room" && (
        <rect
          x={width * 0.1}
          y={height * 0.12}
          width={width * 0.8}
          height={height * 0.7}
          rx="5"
          fill="white"
          opacity="0.25"
          pointerEvents="none"
        />
      )}

      {/* POND */}
      {element.type === "pond" && (
        <g pointerEvents="none">
          <ellipse
            cx={width / 2}
            cy={height / 2}
            rx={width * 0.38}
            ry={height * 0.3}
            fill="#38bdf8"
            opacity="0.45"
          />
          <path
            d={`
              M ${width * 0.2} ${height * 0.42}
              Q ${width * 0.32} ${height * 0.32}, ${width * 0.45} ${height * 0.42}
              T ${width * 0.7} ${height * 0.42}
            `}
            fill="none"
            stroke="#0284c7"
            strokeWidth="2.5"
            strokeLinecap="round"
            opacity="0.6"
          />
          <path
            d={`
              M ${width * 0.3} ${height * 0.62}
              Q ${width * 0.45} ${height * 0.52}, ${width * 0.6} ${height * 0.62}
              T ${width * 0.8} ${height * 0.62}
            `}
            fill="none"
            stroke="#0369a1"
            strokeWidth="2.5"
            strokeLinecap="round"
            opacity="0.5"
          />
        </g>
      )}

      {/* GATE */}
      {element.type === "gate" && (
        <g pointerEvents="none">
          {/* Left Pillar */}
          <rect
            x={width * 0.15}
            y={height * 0.15}
            width={width * 0.1}
            height={height * 0.7}
            rx="3"
            fill="#475569"
            opacity="0.75"
          />
          {/* Right Pillar */}
          <rect
            x={width * 0.75}
            y={height * 0.15}
            width={width * 0.1}
            height={height * 0.7}
            rx="3"
            fill="#475569"
            opacity="0.75"
          />
          {/* Top Beam */}
          <rect
            x={width * 0.12}
            y={height * 0.12}
            width={width * 0.76}
            height={height * 0.12}
            rx="2"
            fill="#334155"
            opacity="0.85"
          />
          {/* Barrier/Access Line */}
          <line
            x1={width * 0.25}
            y1={height * 0.55}
            x2={width * 0.75}
            y2={height * 0.55}
            stroke="#dc2626"
            strokeWidth="3"
            strokeDasharray="6 4"
            opacity="0.8"
          />
        </g>
      )}

      {/* ICON */}
      <foreignObject
        x={width / 2 - 20}
        y={height / 2 - 30}
        width="40"
        height="40"
        pointerEvents="none"
      >
        <div className="flex h-full w-full items-center justify-center">
          <Icon size={26} className="text-slate-700" />
        </div>
      </foreignObject>

      {/* LABEL */}
      <text
        x={width / 2}
        y={height - 12}
        textAnchor="middle"
        fontSize="13"
        fontWeight="700"
        fill="#1e293b"
        pointerEvents="none"
      >
        {element.name || getLabel(element.type)}
      </text>

      {/* SELECTION BORDER */}
      {selected && (
        <>
          <rect
            x="-5"
            y="-5"
            width={width + 10}
            height={height + 10}
            rx="13"
            fill="none"
            stroke="#2563EB"
            strokeWidth="2"
            strokeDasharray="7 5"
            pointerEvents="none"
          />

          {/* RESIZE HANDLE */}
          <rect
            x={width - 12}
            y={height - 12}
            width="18"
            height="18"
            rx="3"
            fill="#2563EB"
            stroke="white"
            strokeWidth="2"
            className="cursor-nwse-resize"
            onPointerDown={handleResizeStart}
          />

          <circle
            cx={width - 3}
            cy={height - 3}
            r="3"
            fill="white"
            pointerEvents="none"
          />
        </>
      )}

      {/* DRAGGING OVERLAY */}
      {(isDragging || isResizing) && (
        <rect
          x="0"
          y="0"
          width={width}
          height={height}
          fill="transparent"
          stroke="#2563EB"
          strokeWidth="2"
          strokeDasharray="5 5"
          pointerEvents="none"
        />
      )}
    </g>
  );
};

export default CampusElementRenderer;