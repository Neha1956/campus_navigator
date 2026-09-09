import React, { useRef } from "react";

const MIN_WIDTH = 40;
const MIN_HEIGHT = 30;

const ElementRenderer = ({
  element,
  activeTool,
  selectedElement,
  mapView,
  handleDragEnd,
  handleElementClick,
  handleElementMove,
  handleElementMoveEnd,
  handleElementResize,
  handleElementResizeEnd,
  floorWidth,
  floorHeight,
}) => {
  const isSelected = selectedElement?._id === element?._id;

  const width = Number(element?.dimensions?.width) || 100;
  const height = Number(element?.dimensions?.height) || 70;
  const x = Number(element?.position?.x) || 0;
  const y = Number(element?.position?.y) || 0;

  const rotation =
    typeof element?.rotation === "object"
      ? Number(element?.rotation?.z) || 0
      : Number(element?.rotation) || 0;

  const resizeRef = useRef(null);

  /* SELECT ELEMENT */
  const selectElement = (e) => {
    e.preventDefault();
    e.stopPropagation();
    handleElementClick?.(element);
  };

  /* MOVE ELEMENT */
  const handlePointerDown = (e) => {
    if (e.target?.dataset?.resize === "true") return;
    if (activeTool !== "select") return;

    e.preventDefault();
    e.stopPropagation();

    handleElementClick?.(element);

    const startMouseX = e.clientX;
    const startMouseY = e.clientY;
    const startX = x;
    const startY = y;

    const handlePointerMove = (moveEvent) => {
      const deltaX = moveEvent.clientX - startMouseX;
      const deltaY = moveEvent.clientY - startMouseY;

      let newX = startX + deltaX;
      let newY = startY + deltaY;

      const maxX = Math.max(0, Number(floorWidth) - width);
      const maxY = Math.max(0, Number(floorHeight) - height);

      newX = Math.max(0, Math.min(newX, maxX));
      newY = Math.max(0, Math.min(newY, maxY));

      handleElementMove?.(element, newX, newY);
    };

    const handlePointerUp = (upEvent) => {
      const deltaX = upEvent.clientX - startMouseX;
      const deltaY = upEvent.clientY - startMouseY;

      let finalX = startX + deltaX;
      let finalY = startY + deltaY;

      const maxX = Math.max(0, Number(floorWidth) - width);
      const maxY = Math.max(0, Number(floorHeight) - height);

      finalX = Math.max(0, Math.min(finalX, maxX));
      finalY = Math.max(0, Math.min(finalY, maxY));

      handleElementMoveEnd?.(element, Math.round(finalX), Math.round(finalY));

      document.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("pointerup", handlePointerUp);
    };

    document.addEventListener("pointermove", handlePointerMove);
    document.addEventListener("pointerup", handlePointerUp);
  };

  /* RESIZE ELEMENT */
  const handleResizePointerDown = (e, direction = "se") => {
    if (activeTool !== "select") return;

    e.preventDefault();
    e.stopPropagation();

    handleElementClick?.(element);

    resizeRef.current = {
      startMouseX: e.clientX,
      startMouseY: e.clientY,
      startWidth: width,
      startHeight: height,
      startX: x,
      startY: y,
      direction,
    };

    const handlePointerMove = (moveEvent) => {
      const resizeData = resizeRef.current;
      if (!resizeData) return;

      const deltaX = moveEvent.clientX - resizeData.startMouseX;
      const deltaY = moveEvent.clientY - resizeData.startMouseY;

      let newWidth = resizeData.startWidth;
      let newHeight = resizeData.startHeight;
      let newX = resizeData.startX;
      let newY = resizeData.startY;

      if (resizeData.direction === "se") {
        newWidth = resizeData.startWidth + deltaX;
        newHeight = resizeData.startHeight + deltaY;
      }
      if (resizeData.direction === "sw") {
        newWidth = resizeData.startWidth - deltaX;
        newHeight = resizeData.startHeight + deltaY;
        newX = resizeData.startX + deltaX;
      }
      if (resizeData.direction === "ne") {
        newWidth = resizeData.startWidth + deltaX;
        newHeight = resizeData.startHeight - deltaY;
        newY = resizeData.startY + deltaY;
      }
      if (resizeData.direction === "nw") {
        newWidth = resizeData.startWidth - deltaX;
        newHeight = resizeData.startHeight - deltaY;
        newX = resizeData.startX + deltaX;
        newY = resizeData.startY + deltaY;
      }

      if (newWidth < MIN_WIDTH) {
        if (resizeData.direction === "sw" || resizeData.direction === "nw") {
          newX = resizeData.startX + resizeData.startWidth - MIN_WIDTH;
        }
        newWidth = MIN_WIDTH;
      }

      if (newHeight < MIN_HEIGHT) {
        if (resizeData.direction === "ne" || resizeData.direction === "nw") {
          newY = resizeData.startY + resizeData.startHeight - MIN_HEIGHT;
        }
        newHeight = MIN_HEIGHT;
      }

      newX = Math.max(0, newX);
      newY = Math.max(0, newY);

      const maxWidth = Number(floorWidth) - newX;
      if (newWidth > maxWidth) newWidth = maxWidth;

      const maxHeight = Number(floorHeight) - newY;
      if (newHeight > maxHeight) newHeight = maxHeight;

      newWidth = Math.max(MIN_WIDTH, newWidth);
      newHeight = Math.max(MIN_HEIGHT, newHeight);

      handleElementResize?.(element, Math.round(newWidth), Math.round(newHeight));

      if (
        resizeData.direction === "sw" ||
        resizeData.direction === "ne" ||
        resizeData.direction === "nw"
      ) {
        handleElementMove?.(element, Math.round(newX), Math.round(newY));
      }
    };

    const handlePointerUp = (upEvent) => {
      const resizeData = resizeRef.current;
      if (!resizeData) return;

      const deltaX = upEvent.clientX - resizeData.startMouseX;
      const deltaY = upEvent.clientY - resizeData.startMouseY;

      let finalWidth = resizeData.startWidth;
      let finalHeight = resizeData.startHeight;
      let finalX = resizeData.startX;
      let finalY = resizeData.startY;

      if (resizeData.direction === "se") {
        finalWidth = resizeData.startWidth + deltaX;
        finalHeight = resizeData.startHeight + deltaY;
      }
      if (resizeData.direction === "sw") {
        finalWidth = resizeData.startWidth - deltaX;
        finalHeight = resizeData.startHeight + deltaY;
        finalX = resizeData.startX + deltaX;
      }
      if (resizeData.direction === "ne") {
        finalWidth = resizeData.startWidth + deltaX;
        finalHeight = resizeData.startHeight - deltaY;
        finalY = resizeData.startY + deltaY;
      }
      if (resizeData.direction === "nw") {
        finalWidth = resizeData.startWidth - deltaX;
        finalHeight = resizeData.startHeight - deltaY;
        finalX = resizeData.startX + deltaX;
        finalY = resizeData.startY + deltaY;
      }

      finalWidth = Math.max(MIN_WIDTH, finalWidth);
      finalHeight = Math.max(MIN_HEIGHT, finalHeight);

      finalX = Math.max(0, finalX);
      finalY = Math.max(0, finalY);

      const maxWidth = Number(floorWidth) - finalX;
      const maxHeight = Number(floorHeight) - finalY;

      finalWidth = Math.min(finalWidth, maxWidth);
      finalHeight = Math.min(finalHeight, maxHeight);
      finalWidth = Math.max(MIN_WIDTH, finalWidth);
      finalHeight = Math.max(MIN_HEIGHT, finalHeight);

      handleElementResizeEnd?.(element, Math.round(finalWidth), Math.round(finalHeight));

      if (
        resizeData.direction === "sw" ||
        resizeData.direction === "ne" ||
        resizeData.direction === "nw"
      ) {
        handleElementMoveEnd?.(element, Math.round(finalX), Math.round(finalY));
      }

      resizeRef.current = null;
      document.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("pointerup", handlePointerUp);
    };

    document.addEventListener("pointermove", handlePointerMove);
    document.addEventListener("pointerup", handlePointerUp);
  };

  const handleOldDragEnd = () => {
    handleDragEnd?.(element, { x, y });
  };

  return (
    <div
      key={element._id}
      draggable={false}
      onDragEnd={handleOldDragEnd}
      onPointerDown={handlePointerDown}
      onClick={selectElement}
      className="absolute flex items-center justify-center select-none transition-shadow rounded-lg"
      style={{
        left: x,
        top: y,
        width,
        height,
        cursor:
          activeTool === "select"
            ? isSelected
              ? "move"
              : "pointer"
            : "default",
        touchAction: "none",
        background:
          mapView === "3d"
            ? `linear-gradient(135deg, ${element.color || "#CBD5E1"}, rgba(255,255,255,.45))`
            : element.color || "#FFFFFF",
        border: `${element.strokeWidth || 2}px solid ${
          isSelected ? "#2563EB" : element.strokeColor || "#334155"
        }`,
        borderRadius: element.type === "corridor" ? "12px" : "8px",
        transform: `rotate(${rotation}deg)`,
        boxShadow:
          mapView === "3d"
            ? isSelected
              ? "8px 12px 0 rgba(37,99,235,.25)"
              : "6px 8px 0 rgba(15,23,42,.18)"
            : isSelected
            ? "0 0 0 3px rgba(37,99,235,.25), 0 8px 20px -4px rgba(0,0,0,0.12)"
            : "0 2px 6px rgba(0,0,0,0.06)",
        zIndex: isSelected ? 100 : 10,
      }}
    >
      {mapView === "3d" && (
        <div className="absolute inset-x-0 top-0 h-2 bg-white/40 pointer-events-none rounded-t-lg" />
      )}

      {/* CONTENT */}
      <div className="text-center px-1.5 w-full overflow-hidden pointer-events-none">
        <div className="font-bold text-xs text-slate-800 truncate leading-tight">
          {element.name}
        </div>
        {element.roomNumber && (
          <div className="text-[10px] text-slate-600 font-mono leading-tight truncate">
            {element.roomNumber}
          </div>
        )}
        <div className="text-[8px] sm:text-[9px] uppercase tracking-wider font-semibold text-slate-500 opacity-80 truncate">
          {element.type}
        </div>
      </div>

      {/* RESIZE HANDLES */}
      {isSelected && activeTool === "select" && (
        <>
          <div
            data-resize="true"
            onPointerDown={(e) => handleResizePointerDown(e, "nw")}
            className="absolute -left-2 -top-2 w-4 h-4 sm:w-3.5 sm:h-3.5 bg-blue-600 border-2 border-white rounded-md shadow-md z-[400] cursor-nwse-resize active:scale-125 transition-transform"
          />
          <div
            data-resize="true"
            onPointerDown={(e) => handleResizePointerDown(e, "ne")}
            className="absolute -right-2 -top-2 w-4 h-4 sm:w-3.5 sm:h-3.5 bg-blue-600 border-2 border-white rounded-md shadow-md z-[400] cursor-nesw-resize active:scale-125 transition-transform"
          />
          <div
            data-resize="true"
            onPointerDown={(e) => handleResizePointerDown(e, "sw")}
            className="absolute -left-2 -bottom-2 w-4 h-4 sm:w-3.5 sm:h-3.5 bg-blue-600 border-2 border-white rounded-md shadow-md z-[400] cursor-nesw-resize active:scale-125 transition-transform"
          />
          <div
            data-resize="true"
            onPointerDown={(e) => handleResizePointerDown(e, "se")}
            className="absolute -right-2 -bottom-2 w-4 h-4 sm:w-3.5 sm:h-3.5 bg-blue-600 border-2 border-white rounded-md shadow-md z-[400] cursor-nwse-resize active:scale-125 transition-transform"
          />
        </>
      )}
    </div>
  );
};

export default ElementRenderer;