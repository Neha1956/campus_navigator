import React, { useMemo, useRef, useState } from "react";
import { Building2, Layers3, Box, Plus, Minus, RotateCcw } from "lucide-react";
import ElementRenderer from "./ElementRenderer";

const FLOOR_EXTRA_PADDING = 300;
const FLOOR_GROWTH_STEP = 300;
const MIN_ZOOM = 0.5;
const MAX_ZOOM = 2.5;
const ZOOM_STEP = 0.1;

const FloorMap = ({
  currentFloor,
  currentBuilding,
  elements = [],
  floorCanvasRef,
  floorWidth,
  floorHeight,
  showGrid,
  mapView,
  activeTool,
  selectedElement,
  handleCanvasClick,
  handleDragEnd,
  handleElementClick,
  handleElementMove,
  handleElementMoveEnd,
  handleElementResize,
  handleElementResizeEnd,
}) => {
  const mapViewportRef = useRef(null);
  const [zoom, setZoom] = useState(1);

  const dynamicFloorSize = useMemo(() => {
    let minX = 0;
    let minY = 0;
    let maxX = Number(floorWidth) || 1200;
    let maxY = Number(floorHeight) || 800;

    elements.forEach((element) => {
      const x = Number(element?.position?.x) || 0;
      const y = Number(element?.position?.y) || 0;
      const width = Number(element?.dimensions?.width) || 100;
      const height = Number(element?.dimensions?.height) || 70;

      minX = Math.min(minX, x - FLOOR_EXTRA_PADDING);
      minY = Math.min(minY, y - FLOOR_EXTRA_PADDING);
      maxX = Math.max(maxX, x + width + FLOOR_EXTRA_PADDING);
      maxY = Math.max(maxY, y + height + FLOOR_EXTRA_PADDING);
    });

    minX = Math.floor(minX / FLOOR_GROWTH_STEP) * FLOOR_GROWTH_STEP;
    minY = Math.floor(minY / FLOOR_GROWTH_STEP) * FLOOR_GROWTH_STEP;

    const finalWidth = Math.ceil((maxX - minX) / FLOOR_GROWTH_STEP) * FLOOR_GROWTH_STEP;
    const finalHeight = Math.ceil((maxY - minY) / FLOOR_GROWTH_STEP) * FLOOR_GROWTH_STEP;

    return {
      minX,
      minY,
      width: Math.max(Number(floorWidth) || 1200, finalWidth),
      height: Math.max(Number(floorHeight) || 800, finalHeight),
    };
  }, [floorWidth, floorHeight, elements]);

  const floorMinX = dynamicFloorSize.minX;
  const floorMinY = dynamicFloorSize.minY;
  const dynamicFloorWidth = dynamicFloorSize.width;
  const dynamicFloorHeight = dynamicFloorSize.height;

  const clampZoom = (value) => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, value));

  const changeZoom = (nextZoom) => {
    const viewport = mapViewportRef.current;
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
      const currentViewport = mapViewportRef.current;
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

  const handleMapWheel = (event) => {
    if (event.ctrlKey || event.metaKey) {
      event.preventDefault();
      if (event.deltaY < 0) {
        changeZoom(zoom + ZOOM_STEP);
      } else {
        changeZoom(zoom - ZOOM_STEP);
      }
    }
  };

  if (!currentFloor) {
    return (
      <div className="h-full w-full flex items-center justify-center p-6">
        <div className="text-center max-w-sm rounded-2xl bg-white p-8 shadow-sm border border-slate-200">
          <Layers3 size={52} className="mx-auto text-slate-300 mb-3" />
          <h2 className="text-lg font-bold text-slate-700">Select Floor</h2>
          <p className="text-xs text-slate-400 mt-1">
            Open the sidebar tools to choose or add a floor plan.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 w-full h-full">
      {/* RESPONSIVE HEADER */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-3.5 sm:p-4 flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 ring-4 ring-blue-50/50">
            <Building2 size={18} />
          </div>
          <div>
            <h2 className="font-bold text-slate-800 text-sm sm:text-base leading-tight">
              {currentBuilding?.name || "Campus Building"}
            </h2>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {currentFloor.name} • Floor {currentFloor.floorNumber}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 hidden sm:inline">Elements:</span>
          <span className="px-2.5 py-1 bg-slate-100 border border-slate-200 text-slate-700 rounded-lg text-xs font-bold">
            {elements.length}
          </span>
        </div>
      </div>

      {/* CANVAS CONTAINER */}
      <div
        ref={mapViewportRef}
        onWheel={handleMapWheel}
        className="relative flex-1 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-auto p-3 sm:p-6 custom-scrollbar"
      >
        {/* FIXED TOP-LEFT FLOOR BADGE */}
        <div className="sticky top-3 left-3 z-[300] inline-block px-3.5 py-2 bg-white/95 backdrop-blur-md rounded-xl shadow-md border border-slate-200/80 pointer-events-none w-max">
          <div className="text-xs font-bold text-slate-800 truncate max-w-[150px]">
            {currentBuilding?.name}
          </div>
          <div className="text-[10px] text-slate-500 font-medium">
            {currentFloor.name}
          </div>
        </div>

        <div
          ref={floorCanvasRef}
          onClick={handleCanvasClick}
          className="relative overflow-hidden rounded-xl border border-slate-200/80 mt-[-45px]"
          style={{
            width: `${dynamicFloorWidth * zoom}px`,
            height: `${dynamicFloorHeight * zoom}px`,
            minWidth: `${dynamicFloorWidth * zoom}px`,
            minHeight: `${dynamicFloorHeight * zoom}px`,
            position: "relative",
            backgroundColor: currentFloor.backgroundColor || "#F8FAFC",
            backgroundImage: showGrid
              ? `
                linear-gradient(#cbd5e1 ${zoom}px, transparent ${zoom}px),
                linear-gradient(90deg, #cbd5e1 ${zoom}px, transparent ${zoom}px)
              `
              : "none",
            backgroundSize: `${25 * zoom}px ${25 * zoom}px`,
            perspective: mapView === "3d" ? "1200px" : "none",
          }}
        >
          <div
            className="absolute"
            style={{
              left: `${-Math.min(0, floorMinX) * zoom}px`,
              top: `${-Math.min(0, floorMinY) * zoom}px`,
              width: `${dynamicFloorWidth * zoom}px`,
              height: `${dynamicFloorHeight * zoom}px`,
              transform: `scale(${zoom})`,
              transformOrigin: "top left",
            }}
          >
            {/* 3D SKIRT EFFECTS */}
            {mapView === "3d" && (
              <>
                <div
                  className="absolute left-0 bottom-[-25px] w-full h-[25px] bg-slate-400 border border-slate-500 pointer-events-none"
                  style={{
                    transform: "skewX(-35deg)",
                    transformOrigin: "top left",
                  }}
                />
                <div
                  className="absolute right-[-25px] top-0 w-[25px] h-full bg-slate-500 border border-slate-600 pointer-events-none"
                  style={{
                    transform: "skewY(-35deg)",
                    transformOrigin: "left top",
                  }}
                />
              </>
            )}

            {/* RENDER ELEMENTS */}
            {elements.map((element) => (
              <ElementRenderer
                key={element._id}
                element={element}
                activeTool={activeTool}
                selectedElement={selectedElement}
                mapView={mapView}
                handleDragEnd={handleDragEnd}
                handleElementClick={handleElementClick}
                handleElementMove={handleElementMove}
                handleElementMoveEnd={handleElementMoveEnd}
                handleElementResize={handleElementResize}
                handleElementResizeEnd={handleElementResizeEnd}
                floorWidth={dynamicFloorWidth}
                floorHeight={dynamicFloorHeight}
                floorCanvasRef={floorCanvasRef}
              />
            ))}

            {/* EMPTY STATE */}
            {elements.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-4">
                <div className="bg-white/95 backdrop-blur-md px-6 py-5 rounded-2xl shadow-xl border border-slate-200 text-center max-w-xs">
                  <Box size={32} className="mx-auto text-slate-300 mb-2" />
                  <p className="text-sm font-bold text-slate-700">Empty Floor</p>
                  <p className="text-xs text-slate-400 mt-1">
                    Pick any room or element from Tools and tap inside the floor.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RESPONSIVE ZOOM CONTROLS */}
        <div className="absolute right-6 top-6 z-[2500] flex items-center gap-0.5 sm:gap-1 rounded-xl border border-slate-200 bg-white/95 backdrop-blur p-1 sm:p-1.5 shadow-lg">
          <button
            type="button"
            onClick={zoomOut}
            disabled={zoom <= MIN_ZOOM}
            title="Zoom out"
            className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Minus size={15} />
          </button>
          <div className="min-w-[45px] sm:min-w-[50px] px-1 text-center text-[11px] sm:text-xs font-semibold text-slate-600">
            {Math.round(zoom * 100)}%
          </div>
          <button
            type="button"
            onClick={zoomIn}
            disabled={zoom >= MAX_ZOOM}
            title="Zoom in"
            className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Plus size={15} />
          </button>
          <button
            type="button"
            onClick={resetZoom}
            title="Reset zoom"
            className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg text-slate-600 transition hover:bg-slate-100"
          >
            <RotateCcw size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FloorMap;