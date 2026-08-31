import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Building2,
  Trash2,
  DoorOpen,
  MapPin,
} from "lucide-react";

/* =========================================================
   SVG POINT HELPER
========================================================= */

const getSvgPoint = (
  event,
  svg
) => {
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
   NUMBER HELPER
========================================================= */

const toNumber = (
  value,
  fallback = 0
) => {
  const number =
    Number(value);

  return Number.isFinite(
    number
  )
    ? number
    : fallback;
};

/* =========================================================
   COMPONENT
========================================================= */

const BuildingRenderer = ({
  building,

  activeTool = "select",

  selected = false,

  mapView = "3d",

  svgRef,

  onDragEnd,
  onSelect,
  onOpen,
  onDelete,

  onEntranceSelect,

  showEntrance = true,
}) => {
  const dragRef =
    useRef(null);

  const [
    dragPosition,
    setDragPosition,
  ] = useState(null);

  /* =========================================================
     SAFETY
  ========================================================= */

  if (!building) {
    return null;
  }

  /* =========================================================
     DIMENSIONS
  ========================================================= */

  const width = Math.max(
    80,
    toNumber(
      building?.dimensions
        ?.width,
      toNumber(
        building?.width,
        250
      )
    )
  );

  const height = Math.max(
    70,
    toNumber(
      building?.dimensions
        ?.height,
      toNumber(
        building?.height,
        180
      )
    )
  );

  const depth = Math.max(
    20,
    toNumber(
      building?.dimensions
        ?.depth,
      toNumber(
        building?.depth,
        180
      )
    )
  );

  /* =========================================================
     POSITION
  ========================================================= */

  const originalX =
    toNumber(
      building?.position?.x,
      toNumber(
        building?.x,
        0
      )
    );

  const originalY =
    toNumber(
      building?.position?.y,
      toNumber(
        building?.y,
        0
      )
    );

  const originalZ =
    toNumber(
      building?.position?.z,
      toNumber(
        building?.z,
        0
      )
    );

  const x =
    toNumber(
      dragPosition?.x,
      originalX
    );

  const y =
    toNumber(
      dragPosition?.y,
      originalY
    );

  /* =========================================================
     COLOR
  ========================================================= */

  const buildingColor =
    building?.color ||
    "#BFDBFE";

  const is3D =
    mapView === "3d";

  /* =========================================================
     3D DEPTH
  ========================================================= */

  const sideDepth = is3D
    ? Math.min(
        34,
        Math.max(
          18,
          depth * 0.14
        )
      )
    : 0;

  const topDepth = is3D
    ? Math.min(
        28,
        Math.max(
          14,
          depth * 0.11
        )
      )
    : 0;

  /* =========================================================
     ID
  ========================================================= */

  const buildingId =
    building?._id ||
    building?.id ||
    `building-${originalX}-${originalY}`;

  /* =========================================================
     ENTRANCE
  ========================================================= */

  const entranceLocalX =
    toNumber(
      building?.entrance?.x,
      width / 2
    );

  const entranceLocalY =
    toNumber(
      building?.entrance?.y,
      height
    );

  /* =========================================================
     WINDOWS
  ========================================================= */

  const windowCount =
    Math.min(
      10,
      Math.max(
        2,
        Math.floor(
          width / 45
        )
      )
    );

  /* =========================================================
     GET SVG
  ========================================================= */

  const getMapSvg =
    useCallback(
      (event) => {
        if (
          svgRef?.current
        ) {
          return svgRef.current;
        }

        if (
          event?.currentTarget
            ?.ownerSVGElement
        ) {
          return event
            .currentTarget
            .ownerSVGElement;
        }

        return document.querySelector(
          "svg[data-campus-map='true']"
        );
      },
      [svgRef]
    );

  /* =========================================================
     POINTER MOVE
  ========================================================= */

  const handlePointerMove =
    useCallback(
      (event) => {
        const data =
          dragRef.current;

        if (!data) return;

        const svg =
          data.svg ||
          svgRef?.current;

        if (!svg) return;

        const point =
          getSvgPoint(
            event,
            svg
          );

        if (!point) return;

        const dx =
          point.x -
          data.mouseX;

        const dy =
          point.y -
          data.mouseY;

        const newX =
          Math.max(
            0,
            data.buildingX +
              dx
          );

        const newY =
          Math.max(
            0,
            data.buildingY +
              dy
          );

        setDragPosition({
          x: newX,
          y: newY,
        });
      },
      [svgRef]
    );

  /* =========================================================
     CLEANUP DRAG
  ========================================================= */

  const cleanupDrag =
    useCallback(() => {
      dragRef.current =
        null;

      window.removeEventListener(
        "pointermove",
        handlePointerMove
      );

      window.removeEventListener(
        "pointerup",
        handlePointerUp
      );
    }, [
      handlePointerMove,
    ]);

  /* =========================================================
     POINTER UP
  ========================================================= */

  const handlePointerUp =
    useCallback(
      (event) => {
        const data =
          dragRef.current;

        if (!data) {
          cleanupDrag();
          return;
        }

        const svg =
          data.svg ||
          svgRef?.current;

        if (!svg) {
          cleanupDrag();
          return;
        }

        const point =
          getSvgPoint(
            event,
            svg
          );

        if (!point) {
          cleanupDrag();
          return;
        }

        const dx =
          point.x -
          data.mouseX;

        const dy =
          point.y -
          data.mouseY;

        const finalPosition =
          {
            x: Math.round(
              Math.max(
                0,
                data.buildingX +
                  dx
              )
            ),

            y: Math.round(
              Math.max(
                0,
                data.buildingY +
                  dy
              )
            ),

            z: originalZ,
          };

        setDragPosition(
          finalPosition
        );

        onDragEnd?.(
          building,
          finalPosition
        );

        cleanupDrag();
      },
      [
        building,
        cleanupDrag,
        onDragEnd,
        originalZ,
        svgRef,
      ]
    );

  /* =========================================================
     POINTER DOWN
  ========================================================= */

  const handlePointerDown =
    useCallback(
      (event) => {
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

        const svg =
          getMapSvg(event);

        if (!svg) return;

        const point =
          getSvgPoint(
            event,
            svg
          );

        if (!point) return;

        /* SELECT */

        onSelect?.(
          building
        );

        /* START DRAG */

        dragRef.current = {
          mouseX: point.x,
          mouseY: point.y,

          buildingX:
            originalX,

          buildingY:
            originalY,

          svg,
        };

        window.addEventListener(
          "pointermove",
          handlePointerMove
        );

        window.addEventListener(
          "pointerup",
          handlePointerUp
        );
      },
      [
        activeTool,
        building,
        getMapSvg,
        handlePointerMove,
        handlePointerUp,
        onSelect,
        originalX,
        originalY,
      ]
    );

  /* =========================================================
     CLICK
  ========================================================= */

  const handleClick =
    (event) => {
      event.stopPropagation();

      if (
        activeTool !==
        "select"
      ) {
        return;
      }

      onSelect?.(
        building
      );
    };

  /* =========================================================
     DOUBLE CLICK
  ========================================================= */

  const handleDoubleClick =
    (event) => {
      event.stopPropagation();

      onOpen?.(
        building
      );
    };

  /* =========================================================
     DELETE
  ========================================================= */

  const handleDelete =
    (event) => {
      event.preventDefault();
      event.stopPropagation();

      onDelete?.(
        building?._id ||
          building?.id
      );
    };

  /* =========================================================
     ENTRANCE CLICK
  ========================================================= */

  const handleEntranceClick =
    (event) => {
      event.preventDefault();
      event.stopPropagation();

      onEntranceSelect?.({
        building,

        entrance: {
          id:
            building
              ?.entrance
              ?.id ||
            "main-entrance",

          x:
            x +
            entranceLocalX,

          y:
            y +
            entranceLocalY,

          localX:
            entranceLocalX,

          localY:
            entranceLocalY,
        },
      });
    };

  /* =========================================================
     RESET DRAG
  ========================================================= */

  useEffect(() => {
    if (
      !dragRef.current
    ) {
      setDragPosition(
        null
      );
    }
  }, [
    originalX,
    originalY,
  ]);

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <g
      data-building-id={
        buildingId
      }
      data-building="true"
      transform={`translate(${x} ${y})`}
      onClick={
        handleClick
      }
      onDoubleClick={
        handleDoubleClick
      }
      style={{
        cursor:
          activeTool ===
          "select"
            ? "move"
            : "default",

        userSelect:
          "none",

        touchAction:
          "none",
      }}
    >
      {/* =====================================================
          3D SHADOW
      ===================================================== */}

      {is3D && (
        <rect
          x="10"
          y="14"
          width={width}
          height={height}
          rx="14"
          fill="#0f172a"
          opacity="0.15"
          transform={`translate(${sideDepth} ${topDepth})`}
          pointerEvents="none"
        />
      )}

      {/* =====================================================
          RIGHT SIDE
      ===================================================== */}

      {is3D && (
        <polygon
          points={`
            ${width},0
            ${width + sideDepth},-${topDepth}
            ${width + sideDepth},${height - topDepth}
            ${width},${height}
          `}
          fill="#64748B"
          opacity="0.96"
          stroke="#334155"
          strokeWidth="1.5"
          pointerEvents="none"
        />
      )}

      {/* =====================================================
          BOTTOM SIDE
      ===================================================== */}

      {is3D && (
        <polygon
          points={`
            0,${height}
            ${width},${height}
            ${width + sideDepth},${height - topDepth}
            ${sideDepth},${height + topDepth}
          `}
          fill="#475569"
          opacity="0.96"
          stroke="#334155"
          strokeWidth="1.5"
          pointerEvents="none"
        />
      )}

      {/* =====================================================
          3D ROOF
      ===================================================== */}

      {is3D && (
        <polygon
          points={`
            0,0
            ${sideDepth},-${topDepth}
            ${width + sideDepth},-${topDepth}
            ${width},0
          `}
          fill={
            buildingColor
          }
          stroke="#334155"
          strokeWidth="2"
          pointerEvents="none"
        />
      )}

      {/* =====================================================
          BUILDING BODY
      ===================================================== */}

      <rect
        x="0"
        y="0"
        width={width}
        height={height}
        rx="12"
        fill={
          buildingColor
        }
        stroke={
          selected
            ? "#2563EB"
            : "#334155"
        }
        strokeWidth={
          selected
            ? 5
            : 3
        }
        filter={
          is3D
            ? "url(#building-shadow)"
            : undefined
        }
        onPointerDown={
          handlePointerDown
        }
      />

      {/* =====================================================
          HEADER
      ===================================================== */}

      <rect
        x="12"
        y="12"
        width={Math.max(
          80,
          width - 24
        )}
        height="48"
        rx="8"
        fill="#FFFFFF"
        opacity="0.95"
        pointerEvents="none"
      />

      {/* =====================================================
          BUILDING ICON
      ===================================================== */}

      <foreignObject
        x="20"
        y="20"
        width="30"
        height="30"
        pointerEvents="none"
      >
        <div className="flex h-full w-full items-center justify-center">
          <Building2
            size={18}
            className="text-slate-700"
          />
        </div>
      </foreignObject>

      {/* =====================================================
          BUILDING NAME
      ===================================================== */}

      <text
        x="55"
        y="38"
        fontSize="14"
        fontWeight="700"
        fill="#1E293B"
        pointerEvents="none"
      >
        {building?.name ||
          "Building"}
      </text>

      {/* =====================================================
          BUILDING TYPE
      ===================================================== */}

      <text
        x="55"
        y="54"
        fontSize="9"
        fill="#64748B"
        pointerEvents="none"
      >
        {building?.type ||
          "Campus Building"}
      </text>

      {/* =====================================================
          WINDOWS
      ===================================================== */}

      <g pointerEvents="none">
        {Array.from({
          length:
            windowCount,
        }).map(
          (_, index) => {
            const gap =
              width /
              (windowCount +
                1);

            const windowX =
              gap *
                (index + 1) -
              14;

            return (
              <rect
                key={index}
                x={windowX}
                y={
                  height -
                  55
                }
                width="28"
                height="22"
                rx="4"
                fill="#E0F2FE"
                stroke="#475569"
                strokeWidth="2"
              />
            );
          }
        )}
      </g>

      {/* =====================================================
          DOOR
      ===================================================== */}

      <rect
        x={
          width / 2 -
          28
        }
        y={
          height - 60
        }
        width="56"
        height="60"
        rx="8"
        fill="#334155"
        stroke="#1E293B"
        strokeWidth="3"
        pointerEvents="none"
      />

      <foreignObject
        x={
          width / 2 -
          12
        }
        y={
          height - 48
        }
        width="24"
        height="24"
        pointerEvents="none"
      >
        <div className="flex h-full w-full items-center justify-center">
          <DoorOpen
            size={18}
            className="text-white"
          />
        </div>
      </foreignObject>

      {/* =====================================================
          MAIN ENTRANCE
      ===================================================== */}

      {showEntrance && (
        <g
          transform={`translate(
            ${entranceLocalX}
            ${entranceLocalY}
          )`}
          onClick={
            handleEntranceClick
          }
          style={{
            cursor:
              onEntranceSelect
                ? "crosshair"
                : "default",
          }}
        >
          <line
            x1="0"
            y1="0"
            x2="0"
            y2="18"
            stroke="#16A34A"
            strokeWidth="4"
            strokeLinecap="round"
            pointerEvents="none"
          />

          <circle
            cx="0"
            cy="18"
            r="8"
            fill="#FFFFFF"
            stroke="#16A34A"
            strokeWidth="3"
          />

          <foreignObject
            x="-7"
            y="11"
            width="14"
            height="14"
            pointerEvents="none"
          >
            <div className="flex h-full w-full items-center justify-center">
              <MapPin
                size={12}
                className="text-green-600"
              />
            </div>
          </foreignObject>
        </g>
      )}

      {/* =====================================================
          DELETE BUTTON
      ===================================================== */}

      {selected && (
        <g
          onClick={
            handleDelete
          }
          style={{
            cursor:
              "pointer",
          }}
        >
          <rect
            x={
              width - 38
            }
            y="-42"
            width="30"
            height="30"
            rx="7"
            fill="#FEE2E2"
            stroke="#EF4444"
            strokeWidth="2"
          />

          <foreignObject
            x={
              width - 34
            }
            y="-38"
            width="22"
            height="22"
            pointerEvents="none"
          >
            <div className="flex h-full w-full items-center justify-center">
              <Trash2
                size={15}
                className="text-red-600"
              />
            </div>
          </foreignObject>
        </g>
      )}

      {/* =====================================================
          SELECTED BORDER
      ===================================================== */}

      {selected && (
        <rect
          x="-8"
          y="-8"
          width={
            width + 16
          }
          height={
            height + 16
          }
          rx="16"
          fill="none"
          stroke="#2563EB"
          strokeWidth="3"
          strokeDasharray="8 6"
          pointerEvents="none"
        />
      )}

      {/* =====================================================
          ENTRANCE LABEL
      ===================================================== */}

      {selected && (
        <text
          x={
            entranceLocalX
          }
          y={
            entranceLocalY +
            34
          }
          textAnchor="middle"
          fontSize="10"
          fontWeight="700"
          fill="#16A34A"
          pointerEvents="none"
        >
          Main Entrance
        </text>
      )}

      {/* =====================================================
          BUILDING INFO
      ===================================================== */}

      {selected && (
        <g pointerEvents="none">
          <rect
            x="0"
            y={
              height + 42
            }
            width={Math.min(
              width,
              260
            )}
            height="30"
            rx="6"
            fill="#FFFFFF"
            stroke="#CBD5E1"
          />

          <text
            x="10"
            y={
              height + 62
            }
            fontSize="10"
            fontWeight="600"
            fill="#475569"
          >
            {Math.round(
              width
            )}{" "}
            ×{" "}
            {Math.round(
              height
            )}
          </text>
        </g>
      )}

      {/* =====================================================
          DRAG HELP
      ===================================================== */}

      {selected && (
        <text
          x={
            width / 2
          }
          y={
            height + 92
          }
          textAnchor="middle"
          fontSize="11"
          fontWeight="700"
          fill="#2563EB"
          pointerEvents="none"
        >
          Drag to move • Double click to open
        </text>
      )}
    </g>
  );
};

export default BuildingRenderer;