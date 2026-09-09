import React, { useMemo } from "react";
import { Building2, Layers3, Box } from "lucide-react";
import ElementRenderer from "./ElementRenderer";

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

  const dynamicFloorSize = useMemo(() => {
    const minimumWidth = Number(floorWidth) || 1200;
    const minimumHeight = Number(floorHeight) || 800;
    const FLOOR_PADDING = 250;

    let requiredWidth = minimumWidth;
    let requiredHeight = minimumHeight;

    elements.forEach((element) => {
      const x = Number(element?.position?.x) || 0;
      const y = Number(element?.position?.y) || 0;
      const width = Number(element?.dimensions?.width) || 100;
      const height = Number(element?.dimensions?.height) || 70;

      const elementRight = x + width + FLOOR_PADDING;
      const elementBottom = y + height + FLOOR_PADDING;

      requiredWidth = Math.max(requiredWidth, elementRight);
      requiredHeight = Math.max(requiredHeight, elementBottom);
    });

    return {
      width: requiredWidth,
      height: requiredHeight,
    };
  }, [floorWidth, floorHeight, elements]);

  const dynamicFloorWidth = dynamicFloorSize.width;
  const dynamicFloorHeight = dynamicFloorSize.height;

  return (
    <div className="flex flex-col gap-3 w-full">
      {/* RESPONSIVE HEADER */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-3.5 sm:p-4 flex flex-wrap items-center justify-between gap-3">
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
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-auto p-3 sm:p-6 custom-scrollbar">
        <div
          ref={floorCanvasRef}
          onClick={handleCanvasClick}
          className="relative overflow-hidden rounded-xl border border-slate-200/80"
          style={{
            width: dynamicFloorWidth,
            height: dynamicFloorHeight,
            minWidth: dynamicFloorWidth,
            minHeight: dynamicFloorHeight,
            backgroundColor: currentFloor.backgroundColor || "#F8FAFC",
            backgroundImage: showGrid
              ? `
                linear-gradient(#cbd5e1 1px, transparent 1px),
                linear-gradient(90deg, #cbd5e1 1px, transparent 1px)
              `
              : "none",
            backgroundSize: "25px 25px",
            perspective: mapView === "3d" ? "1200px" : "none",
          }}
        >
          {/* FLOOR BADGE */}
          <div className="absolute top-3 left-3 z-[200] px-3.5 py-2 bg-white/95 backdrop-blur-md rounded-xl shadow-md border border-slate-200/80 pointer-events-none">
            <div className="text-xs font-bold text-slate-800 truncate max-w-[150px]">
              {currentBuilding?.name}
            </div>
            <div className="text-[10px] text-slate-500 font-medium">
              {currentFloor.name}
            </div>
          </div>

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
    </div>
  );
};

export default FloorMap;