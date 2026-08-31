import React, { useRef } from "react";

const RoadRenderer = ({
  road,
  selectedRoad,
  handleRoadClick,
  handleRoadDragEnd,
}) => {
  const dragRef = useRef(null);

  if (!road) {
    return null;
  }

  const points = Array.isArray(road.points)
    ? road.points
    : [];

  if (points.length < 2) {
    return null;
  }

  const start = points[0];
  const end = points[points.length - 1];

  const startX = Number(start?.x || 0);
  const startY = Number(start?.y || 0);

  const endX = Number(end?.x || 0);
  const endY = Number(end?.y || 0);

  const width = Number(road.width || 20);

  const color = road.color || "#64748B";

  const isSelected =
    selectedRoad?._id === road._id;

  const handlePointerDown = (e) => {
    e.stopPropagation();

    if (!handleRoadDragEnd) {
      return;
    }

    dragRef.current = {
      startClientX: e.clientX,
      startClientY: e.clientY,
      originalPoints: points.map((point) => ({
        x: Number(point.x),
        y: Number(point.y),
      })),
    };

    e.currentTarget.setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (!dragRef.current) {
      return;
    }

    e.stopPropagation();

    const dx =
      e.clientX -
      dragRef.current.startClientX;

    const dy =
      e.clientY -
      dragRef.current.startClientY;

    const updatedPoints =
      dragRef.current.originalPoints.map(
        (point) => ({
          x: point.x + dx,
          y: point.y + dy,
        })
      );

    dragRef.current.previewPoints =
      updatedPoints;
  };

  const handlePointerUp = (e) => {
    if (!dragRef.current) {
      return;
    }

    e.stopPropagation();

    const dx =
      e.clientX -
      dragRef.current.startClientX;

    const dy =
      e.clientY -
      dragRef.current.startClientY;

    const updatedPoints =
      dragRef.current.originalPoints.map(
        (point) => ({
          x: Math.max(0, point.x + dx),
          y: Math.max(0, point.y + dy),
        })
      );

    dragRef.current = null;

    handleRoadDragEnd(
      road,
      updatedPoints
    );
  };

  const handleClick = (e) => {
    e.stopPropagation();

    if (handleRoadClick) {
      handleRoadClick(road);
    }
  };

  const polylinePoints = points
    .map(
      (point) =>
        `${Number(point.x || 0)},${Number(
          point.y || 0
        )}`
    )
    .join(" ");

  const middlePoint =
    points[
      Math.floor(points.length / 2)
    ] || start;

  return (
    <g
      className="cursor-pointer"
      onClick={handleClick}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      {/* SELECTION OUTLINE */}

      {isSelected && (
        <polyline
          points={polylinePoints}
          fill="none"
          stroke="#2563EB"
          strokeWidth={width + 12}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.25"
          pointerEvents="none"
        />
      )}

      {/* ROAD SHADOW */}

      <polyline
        points={polylinePoints}
        fill="none"
        stroke="#0F172A"
        strokeWidth={width + 8}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.2"
        pointerEvents="none"
      />

      {/* ROAD */}

      <polyline
        points={polylinePoints}
        fill="none"
        stroke={color}
        strokeWidth={width}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* CENTER DASHED LINE */}

      <polyline
        points={polylinePoints}
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="2"
        strokeDasharray="12 10"
        strokeLinecap="round"
        strokeLinejoin="round"
        pointerEvents="none"
      />

      {/* START POINT */}

      <circle
        cx={startX}
        cy={startY}
        r={isSelected ? 7 : 5}
        fill="#16A34A"
        stroke="#FFFFFF"
        strokeWidth="2"
      />

      {/* END POINT */}

      <circle
        cx={endX}
        cy={endY}
        r={isSelected ? 7 : 5}
        fill="#DC2626"
        stroke="#FFFFFF"
        strokeWidth="2"
      />

      {/* ROAD NAME */}

      <text
        x={Number(middlePoint.x || 0)}
        y={Number(middlePoint.y || 0) - width / 2 - 8}
        textAnchor="middle"
        fontSize="13"
        fontWeight="700"
        fill="#1E293B"
        stroke="#FFFFFF"
        strokeWidth="4"
        paintOrder="stroke"
        pointerEvents="none"
      >
        {road.name || "Campus Road"}
      </text>

      {/* SELECTED BADGE */}

      {isSelected && (
        <text
          x={Number(middlePoint.x || 0)}
          y={Number(middlePoint.y || 0) + width / 2 + 18}
          textAnchor="middle"
          fontSize="10"
          fontWeight="600"
          fill="#2563EB"
          pointerEvents="none"
        >
          Drag to move
        </text>
      )}
    </g>
  );
};

export default RoadRenderer;