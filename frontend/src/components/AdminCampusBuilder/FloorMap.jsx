
import React from "react";
import {
  Building2,
  Layers3,
  Box,
} from "lucide-react";

import ElementRenderer from "./ElementRenderer";

const FloorMap = ({
  currentFloor,
  currentBuilding,
  elements,

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
  /* =========================================================
     NO FLOOR
  ========================================================= */

  if (!currentFloor) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <Layers3
            size={65}
            className="mx-auto text-slate-300 mb-4"
          />

          <h2 className="text-xl font-bold text-slate-500">
            Select Floor
          </h2>

          <p className="text-sm text-slate-400 mt-2">
            Select a floor from the left panel.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* =====================================================
          FLOOR HEADER
      ===================================================== */}

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 mb-4 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Building2
              size={18}
              className="text-blue-600"
            />

            <h2 className="font-bold text-slate-800">
              {currentBuilding?.name}
            </h2>
          </div>

          <p className="text-xs text-slate-500 mt-1">
            {currentFloor.name} • Floor{" "}
            {currentFloor.floorNumber}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500">
            Elements:
          </span>

          <span className="px-3 py-1 bg-slate-100 rounded-lg text-xs font-semibold">
            {elements.length}
          </span>
        </div>
      </div>

      {/* =====================================================
          FLOOR CANVAS CONTAINER
      ===================================================== */}

      <div className="bg-white rounded-2xl shadow-xl border border-slate-300 overflow-auto p-6">
        <div
          ref={floorCanvasRef}
          onClick={handleCanvasClick}
          className="relative overflow-hidden"
          style={{
            width: floorWidth,
            height: floorHeight,

            minWidth: floorWidth,
            minHeight: floorHeight,

            backgroundColor:
              currentFloor.backgroundColor ||
              "#F8FAFC",

            backgroundImage: showGrid
              ? `
                linear-gradient(
                  #cbd5e1 1px,
                  transparent 1px
                ),
                linear-gradient(
                  90deg,
                  #cbd5e1 1px,
                  transparent 1px
                )
              `
              : "none",

            backgroundSize: "25px 25px",

            perspective:
              mapView === "3d"
                ? "1200px"
                : "none",
          }}
        >
          {/* =================================================
              FLOOR LABEL
          ================================================= */}

          <div className="absolute top-4 left-4 z-[200] px-4 py-2 bg-white/95 backdrop-blur rounded-xl shadow-lg border border-slate-200 pointer-events-none">
            <div className="text-xs font-bold text-slate-700">
              {currentBuilding?.name}
            </div>

            <div className="text-[10px] text-slate-500">
              {currentFloor.name}
            </div>
          </div>

          {/* =================================================
              3D LEFT/BOTTOM SIDE
          ================================================= */}

          {mapView === "3d" && (
            <>
              <div
                className="absolute left-0 bottom-[-25px] w-full h-[25px] bg-slate-400 border border-slate-500 pointer-events-none"
                style={{
                  transform:
                    "skewX(-35deg)",
                  transformOrigin:
                    "top left",
                }}
              />

              {/* =================================================
                  3D RIGHT SIDE
              ================================================= */}

              <div
                className="absolute right-[-25px] top-0 w-[25px] h-full bg-slate-500 border border-slate-600 pointer-events-none"
                style={{
                  transform:
                    "skewY(-35deg)",
                  transformOrigin:
                    "left top",
                }}
              />
            </>
          )}

          {/* =================================================
              FLOOR ELEMENTS
          ================================================= */}

          {elements.map(
            (element) => (
              <ElementRenderer
                key={element._id}
                element={element}
                activeTool={activeTool}
                selectedElement={
                  selectedElement
                }
                mapView={mapView}

                handleDragEnd={
                  handleDragEnd
                }

                handleElementClick={
                  handleElementClick
                }

                handleElementMove={
                  handleElementMove
                }

                handleElementMoveEnd={
                  handleElementMoveEnd
                }

                handleElementResize={
                  handleElementResize
                }

                handleElementResizeEnd={
                  handleElementResizeEnd
                }

                floorWidth={
                  floorWidth
                }

                floorHeight={
                  floorHeight
                }

                /*
                  IMPORTANT:

                  ElementRenderer ko actual canvas ref
                  dena zaroori hai.

                  Isse screen scaling calculate hogi.
                */

                floorCanvasRef={
                  floorCanvasRef
                }
              />
            )
          )}

          {/* =================================================
              EMPTY FLOOR
          ================================================= */}

          {elements.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="bg-white/90 px-6 py-4 rounded-2xl shadow-lg text-center">
                <Box
                  size={35}
                  className="mx-auto text-slate-300 mb-2"
                />

                <p className="text-sm font-semibold text-slate-500">
                  Empty Floor
                </p>

                <p className="text-xs text-slate-400 mt-1">
                  Select an element and click here.
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

