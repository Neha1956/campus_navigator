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

const getSvgPoint = (event) => {
  const svg = event.currentTarget.ownerSVGElement;
  if (!svg) return null;

  const point = svg.createSVGPoint();
  point.x = event.clientX;
  point.y = event.clientY;

  const matrix = svg.getScreenCTM()?.inverse();
  if (!matrix) return null;

  return point.matrixTransform(matrix);
};

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

  useEffect(() => {
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointermove", handleResizeMove);
      window.removeEventListener("pointerup", handleResizeUp);
    };
  }, []);

  if (!element) return null;

  const baseX = Number(element.position?.x) || 0;
  const baseY = Number(element.position?.y) || 0;
  const baseWidth = Number(element.dimensions?.width) || 200;
  const baseHeight = Number(element.dimensions?.height) || 120;

  const x = Number(previewPosition?.x ?? baseX);
  const y = Number(previewPosition?.y ?? baseY);
  const width = Number(previewDimensions?.width ?? baseWidth);
  const height = Number(previewDimensions?.height ?? baseHeight);

  const rotation = Number(element.rotation) || 0;

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

  const selectElement = (event) => {
    event.stopPropagation();
    onSelect?.(element);
  };

  const handlePointerDown = (event) => {
    if (event.button !== undefined && event.button !== 0) return;
    event.stopPropagation();
    event.preventDefault();

    const point = getSvgPoint(event);
    if (!point) return;

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

  const handlePointerMove = (event) => {
    const start = dragStartRef.current;
    if (!start || !isDragging) return;

    const svg = document.querySelector("svg[data-campus-map='true']");
    if (!svg) return;

    const point = svg.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;

    const matrix = svg.getScreenCTM()?.inverse();
    if (!matrix) return;

    const svgPoint = point.matrixTransform(matrix);
    const dx = svgPoint.x - start.mouseX;
    const dy = svgPoint.y - start.mouseY;

    setPreviewPosition({
      x: Math.max(0, start.elementX + dx),
      y: Math.max(0, start.elementY + dy),
    });
  };

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
        finalX = Math.max(0, Math.round(start.elementX + svgPoint.x - start.mouseX));
        finalY = Math.max(0, Math.round(start.elementY + svgPoint.y - start.mouseY));
      }
    }

    onDragEnd?.(element, {
      x: finalX,
      y: finalY,
      z: Number(element.position?.z) || 0,
    });

    cleanupDrag();
  };

  const cleanupDrag = () => {
    dragStartRef.current = null;
    setIsDragging(false);
    setPreviewPosition(null);
    window.removeEventListener("pointermove", handlePointerMove);
    window.removeEventListener("pointerup", handlePointerUp);
  };

  const handleResizeStart = (event) => {
    event.stopPropagation();
    event.preventDefault();

    const point = getSvgPoint(event);
    if (!point) return;

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

  const handleResizeMove = (event) => {
    const start = resizeStartRef.current;
    if (!start || !isResizing) return;

    const svg = document.querySelector("svg[data-campus-map='true']");
    if (!svg) return;

    const point = svg.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;
    const matrix = svg.getScreenCTM()?.inverse();
    if (!matrix) return;

    const svgPoint = point.matrixTransform(matrix);
    const dx = svgPoint.x - start.mouseX;
    const dy = svgPoint.y - start.mouseY;

    setPreviewDimensions({
      width: Math.max(40, Math.round(start.width + dx)),
      height: Math.max(40, Math.round(start.height + dy)),
    });
  };

  const handleResizeUp = () => {
    const start = resizeStartRef.current;
    if (!start) {
      cleanupResize();
      return;
    }

    const finalWidth = previewDimensions?.width || start.width;
    const finalHeight = previewDimensions?.height || start.height;

    onResizeEnd?.(element, {
      width: finalWidth,
      height: finalHeight,
      depth: Number(element.dimensions?.depth) || finalHeight,
    });

    cleanupResize();
  };

  const cleanupResize = () => {
    resizeStartRef.current = null;
    setIsResizing(false);
    setPreviewDimensions(null);
    window.removeEventListener("pointermove", handleResizeMove);
    window.removeEventListener("pointerup", handleResizeUp);
  };

  return (
    <g
      transform={`translate(${x} ${y}) rotate(${rotation} ${width / 2} ${height / 2})`}
      onClick={selectElement}
    >
      {/* SOFT SHADOW */}
      <rect
        x="3"
        y="5"
        width={width}
        height={height}
        rx="12"
        fill="#0f172a"
        opacity="0.1"
        pointerEvents="none"
      />

      {/* MAIN BODY */}
      <rect
        x="0"
        y="0"
        width={width}
        height={height}
        rx="12"
        fill={color}
        stroke={selected ? "#2563EB" : stroke}
        strokeWidth={selected ? 2.5 : strokeWidth}
        className={isDragging ? "cursor-grabbing" : "cursor-grab"}
        onPointerDown={handlePointerDown}
      />

      {/* PARK */}
      {element.type === "park" && (
        <g pointerEvents="none">
          <circle cx={width * 0.25} cy={height * 0.35} r="14" fill="#22c55e" opacity="0.6" />
          <circle cx={width * 0.65} cy={height * 0.6} r="16" fill="#16a34a" opacity="0.6" />
          <circle cx={width * 0.82} cy={height * 0.25} r="11" fill="#15803d" opacity="0.6" />
          <path
            d={`M ${width * 0.08} ${height * 0.75} Q ${width * 0.45} ${height * 0.55} ${width * 0.9} ${height * 0.78}`}
            fill="none"
            stroke="#166534"
            strokeWidth="4"
            opacity="0.4"
          />
        </g>
      )}

      {/* PARKING */}
      {element.type === "parking" && (
        <g opacity="0.55" pointerEvents="none">
          {Array.from({ length: Math.max(2, Math.floor(width / 35)) }).map((_, index) => {
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
                strokeDasharray="5 3"
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
            r={Math.min(width, height) * 0.26}
            fill="#84cc16"
            opacity="0.25"
          />
          <path
            d={`M ${width * 0.15} ${height * 0.5} H ${width * 0.85} M ${width * 0.5} ${height * 0.15} V ${height * 0.85}`}
            stroke="#92400e"
            strokeWidth="2.5"
            opacity="0.3"
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
          rx="6"
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
            ry={height * 0.28}
            fill="#38bdf8"
            opacity="0.45"
          />
          <path
            d={`M ${width * 0.2} ${height * 0.45} Q ${width * 0.35} ${height * 0.35}, ${width * 0.5} ${height * 0.45} T ${width * 0.8} ${height * 0.45}`}
            fill="none"
            stroke="#0284c7"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.6"
          />
        </g>
      )}

      {/* GATE */}
      {element.type === "gate" && (
        <g pointerEvents="none">
          <rect x={width * 0.15} y={height * 0.15} width={width * 0.1} height={height * 0.7} rx="3" fill="#475569" opacity="0.75" />
          <rect x={width * 0.75} y={height * 0.15} width={width * 0.1} height={height * 0.7} rx="3" fill="#475569" opacity="0.75" />
          <rect x={width * 0.12} y={height * 0.12} width={width * 0.76} height={height * 0.12} rx="2" fill="#334155" opacity="0.85" />
          <line x1={width * 0.25} y1={height * 0.55} x2={width * 0.75} y2={height * 0.55} stroke="#dc2626" strokeWidth="2.5" strokeDasharray="5 3" opacity="0.8" />
        </g>
      )}

      {/* ICON */}
      <foreignObject
        x={width / 2 - 18}
        y={height / 2 - 28}
        width="36"
        height="36"
        pointerEvents="none"
      >
        <div className="flex h-full w-full items-center justify-center text-slate-700">
          <Icon size={22} />
        </div>
      </foreignObject>

      {/* LABEL */}
      <text
        x={width / 2}
        y={height - 10}
        textAnchor="middle"
        fontSize="11"
        fontWeight="600"
        fill="#1e293b"
        pointerEvents="none"
      >
        {element.name || getLabel(element.type)}
      </text>

      {/* SELECTION BORDER & RESIZER */}
      {selected && (
        <>
          <rect
            x="-4"
            y="-4"
            width={width + 8}
            height={height + 8}
            rx="14"
            fill="none"
            stroke="#2563EB"
            strokeWidth="2"
            strokeDasharray="6 4"
            pointerEvents="none"
          />
          <circle
            cx={width + 1}
            cy={height + 1}
            r="7"
            fill="#2563EB"
            stroke="white"
            strokeWidth="2"
            className="cursor-nwse-resize drop-shadow"
            onPointerDown={handleResizeStart}
          />
        </>
      )}

      {/* DRAG/RESIZE GHOST OUTLINE */}
      {(isDragging || isResizing) && (
        <rect
          x="0"
          y="0"
          width={width}
          height={height}
          fill="none"
          stroke="#2563EB"
          strokeWidth="2"
          strokeDasharray="4 4"
          pointerEvents="none"
        />
      )}
    </g>
  );
};

export default CampusElementRenderer;