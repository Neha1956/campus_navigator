import React, { useRef, useState, useMemo } from "react";
import { Plus, Minus, RotateCcw } from "lucide-react";

const MIN_ZOOM = 0.2;
const MAX_ZOOM = 3;
const ZOOM_STEP = 0.15;

const Floor2DViewer = ({
  floor,
  elements = [],
  routePoints = [],
  routeSource,
  routeDestination,
  routeDirections = [],
}) => {
  const viewportRef = useRef(null);
  const [zoom, setZoom] = useState(1);

  // Dynamic bounds calculation taaki poora floor aur uske elements properly frame ho sakein
  const bounds = useMemo(() => {
    const baseW = Number(floor?.width || 1400);
    const baseH = Number(floor?.height || 900);
    const PADDING = 150;

    let minX = 0;
    let minY = 0;
    let maxX = baseW;
    let maxY = baseH;

    elements.forEach((el) => {
      const pos = el.position || {};
      const dim = el.dimensions || {};
      const x = Number(pos.x || 0);
      const y = Number(pos.y || 0);
      const w = Number(dim.width || 100);
      const h = Number(dim.height || dim.depth || 80);

      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x + w);
      maxY = Math.max(maxY, y + h);
    });

    const calculatedWidth = Math.max(baseW, maxX - minX + PADDING * 2);
    const calculatedHeight = Math.max(baseH, maxY - minY + PADDING * 2);

    return {
      minX: minX - PADDING,
      minY: minY - PADDING,
      width: calculatedWidth,
      height: calculatedHeight,
    };
  }, [floor, elements]);

  const clampZoom = (value) => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, value));

  const changeZoom = (nextZoom) => {
    const viewport = viewportRef.current;
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
      const currentViewport = viewportRef.current;
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

  const handleWheel = (event) => {
    if (event.ctrlKey || event.metaKey) {
      event.preventDefault();
      if (event.deltaY < 0) {
        changeZoom(zoom + ZOOM_STEP);
      } else {
        changeZoom(zoom - ZOOM_STEP);
      }
    }
  };

  const routePolyline = routePoints
    .map((pt) => `${Number(pt.x)},${Number(pt.y)}`)
    .join(" ");

  return (
    <div className="w-full h-full min-h-[300px] sm:min-h-[500px] bg-slate-100 relative overflow-hidden rounded-2xl flex-1 flex flex-col shadow-inner">
      {/* Scrollable Viewport Container */}
      <div
        ref={viewportRef}
        onWheel={handleWheel}
        className="w-full h-full overflow-auto custom-scrollbar relative flex-1"
      >
        <div
          className="relative"
          style={{
            width: `${bounds.width * zoom}px`,
            height: `${bounds.height * zoom}px`,
            minWidth: `${bounds.width * zoom}px`,
            minHeight: `${bounds.height * zoom}px`,
            backgroundColor: floor?.backgroundColor || "#F8FAFC",
          }}
        >
          <svg
            width={bounds.width * zoom}
            height={bounds.height * zoom}
            viewBox={`${bounds.minX} ${bounds.minY} ${bounds.width} ${bounds.height}`}
            preserveAspectRatio="xMidYMid meet"
            className="block"
            style={{
              width: `${bounds.width * zoom}px`,
              height: `${bounds.height * zoom}px`,
              overflow: "visible",
            }}
          >
            <defs>
              <pattern
                id="floor-grid"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 40 0 L 0 0 0 40"
                  fill="none"
                  stroke="rgba(100, 116, 139, 0.1)"
                  strokeWidth="1"
                />
              </pattern>
            </defs>

            {/* Background & Grid */}
            <rect
              x={bounds.minX}
              y={bounds.minY}
              width={bounds.width}
              height={bounds.height}
              fill={floor?.backgroundColor || "#F8FAFC"}
            />
            <rect
              x={bounds.minX}
              y={bounds.minY}
              width={bounds.width}
              height={bounds.height}
              fill="url(#floor-grid)"
            />

            {/* Floor Elements (Rooms, Labs, Corridors) */}
            {elements.map((el) => {
              const pos = el.position || {};
              const dim = el.dimensions || {};
              const x = Number(pos.x || 0);
              const y = Number(pos.y || 0);
              const w = Number(dim.width || 100);
              const h = Number(dim.height || dim.depth || 80);
              const color = el.color || "#94A3B8";

              return (
                <g key={el._id} transform={`translate(${x}, ${y})`}>
                  <rect
                    width={w}
                    height={h}
                    rx={8}
                    fill={color}
                    fillOpacity={0.85}
                    stroke="#334155"
                    strokeWidth={1.5}
                  />
                  <text
                    x={w / 2}
                    y={h / 2}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="12"
                    fontWeight="700"
                    fill="#1E293B"
                    pointerEvents="none"
                  >
                    {el.name}
                  </text>
                </g>
              );
            })}

            {/* Indoor Route Polyline */}
            {routePolyline && (
              <>
                <polyline
                  points={routePolyline}
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <polyline
                  points={routePolyline}
                  fill="none"
                  stroke="#2563EB"
                  strokeWidth="4"
                  strokeDasharray="8 6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </>
            )}
          </svg>
        </div>
      </div>

      {/* Floating Zoom & Controls Toolbar - Responsive (Mobile par bottom-right, Desktop par top-right) */}
      <div className="absolute right-3 bottom-16 sm:bottom-auto sm:right-4 sm:top-4 z-30 flex items-center gap-1 rounded-xl border border-slate-200 bg-white/95 backdrop-blur p-1.5 shadow-xl pointer-events-auto">
        <button
          type="button"
          onClick={zoomOut}
          disabled={zoom <= MIN_ZOOM}
          title="Zoom out"
          className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg text-slate-600 transition hover:bg-slate-100 disabled:opacity-40"
        >
          <Minus size={14} />
        </button>
        <div className="min-w-[45px] sm:min-w-[50px] px-1 text-center text-[11px] sm:text-xs font-semibold text-slate-600">
          {Math.round(zoom * 100)}%
        </div>
        <button
          type="button"
          onClick={zoomIn}
          disabled={zoom >= MAX_ZOOM}
          title="Zoom in"
          className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg text-slate-600 transition hover:bg-slate-100 disabled:opacity-40"
        >
          <Plus size={14} />
        </button>
        <button
          type="button"
          onClick={resetZoom}
          title="Reset zoom"
          className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg text-slate-600 transition hover:bg-slate-100"
        >
          <RotateCcw size={13} />
        </button>
      </div>
    </div>
  );
};

export default Floor2DViewer;