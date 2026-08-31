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
  const isSelected =
    selectedElement?._id === element?._id;

  const width =
    Number(element?.dimensions?.width) || 100;

  const height =
    Number(element?.dimensions?.height) || 70;

  const x =
    Number(element?.position?.x) || 0;

  const y =
    Number(element?.position?.y) || 0;

  /*
   * Your schema may store rotation as:
   * rotation: 90
   * OR
   * rotation: { z: 90 }
   */
  const rotation =
    typeof element?.rotation === "object"
      ? Number(element?.rotation?.z) || 0
      : Number(element?.rotation) || 0;

  const resizeRef = useRef(null);

  /*
   =========================================================
   SELECT ELEMENT
   =========================================================
   */

  const selectElement = (e) => {
    e.preventDefault();
    e.stopPropagation();

    /*
     IMPORTANT:
     Parent function expects only element.

     OLD:
     handleElementClick?.(e, element)

     NEW:
     handleElementClick?.(element)
    */

    handleElementClick?.(element);
  };

  /*
   =========================================================
   MOVE ELEMENT
   =========================================================
   */

  const handlePointerDown = (e) => {
    /*
     Resize handle ko move nahi karna hai
    */
    if (
      e.target?.dataset?.resize === "true"
    ) {
      return;
    }

    if (activeTool !== "select") {
      return;
    }

    e.preventDefault();
    e.stopPropagation();

    /*
     Select element first
    */
    handleElementClick?.(element);

    const startMouseX = e.clientX;
    const startMouseY = e.clientY;

    const startX = x;
    const startY = y;

    const handlePointerMove = (moveEvent) => {
      const deltaX =
        moveEvent.clientX - startMouseX;

      const deltaY =
        moveEvent.clientY - startMouseY;

      let newX = startX + deltaX;
      let newY = startY + deltaY;

      /*
       =====================================================
       FLOOR BOUNDARY
       =====================================================
      */

      const maxX = Math.max(
        0,
        Number(floorWidth) - width
      );

      const maxY = Math.max(
        0,
        Number(floorHeight) - height
      );

      newX = Math.max(
        0,
        Math.min(newX, maxX)
      );

      newY = Math.max(
        0,
        Math.min(newY, maxY)
      );

      /*
       Live movement
      */
      handleElementMove?.(
        element,
        newX,
        newY
      );
    };

    const handlePointerUp = (upEvent) => {
      const deltaX =
        upEvent.clientX - startMouseX;

      const deltaY =
        upEvent.clientY - startMouseY;

      let finalX = startX + deltaX;
      let finalY = startY + deltaY;

      const maxX = Math.max(
        0,
        Number(floorWidth) - width
      );

      const maxY = Math.max(
        0,
        Number(floorHeight) - height
      );

      finalX = Math.max(
        0,
        Math.min(finalX, maxX)
      );

      finalY = Math.max(
        0,
        Math.min(finalY, maxY)
      );

      /*
       Save final position to database
      */
      handleElementMoveEnd?.(
        element,
        Math.round(finalX),
        Math.round(finalY)
      );

      document.removeEventListener(
        "pointermove",
        handlePointerMove
      );

      document.removeEventListener(
        "pointerup",
        handlePointerUp
      );
    };

    document.addEventListener(
      "pointermove",
      handlePointerMove
    );

    document.addEventListener(
      "pointerup",
      handlePointerUp
    );
  };

  /*
   =========================================================
   RESIZE ELEMENT
   =========================================================
   */

  const handleResizePointerDown = (
    e,
    direction = "se"
  ) => {
    if (activeTool !== "select") {
      return;
    }

    e.preventDefault();
    e.stopPropagation();

    /*
     Select current element
    */
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

    const handlePointerMove = (
      moveEvent
    ) => {
      const resizeData =
        resizeRef.current;

      if (!resizeData) {
        return;
      }

      const deltaX =
        moveEvent.clientX -
        resizeData.startMouseX;

      const deltaY =
        moveEvent.clientY -
        resizeData.startMouseY;

      let newWidth =
        resizeData.startWidth;

      let newHeight =
        resizeData.startHeight;

      let newX =
        resizeData.startX;

      let newY =
        resizeData.startY;

      /*
       =====================================================
       BOTTOM RIGHT
       =====================================================
      */

      if (
        resizeData.direction === "se"
      ) {
        newWidth =
          resizeData.startWidth +
          deltaX;

        newHeight =
          resizeData.startHeight +
          deltaY;
      }

      /*
       =====================================================
       BOTTOM LEFT
       =====================================================
      */

      if (
        resizeData.direction === "sw"
      ) {
        newWidth =
          resizeData.startWidth -
          deltaX;

        newHeight =
          resizeData.startHeight +
          deltaY;

        newX =
          resizeData.startX +
          deltaX;
      }

      /*
       =====================================================
       TOP RIGHT
       =====================================================
      */

      if (
        resizeData.direction === "ne"
      ) {
        newWidth =
          resizeData.startWidth +
          deltaX;

        newHeight =
          resizeData.startHeight -
          deltaY;

        newY =
          resizeData.startY +
          deltaY;
      }

      /*
       =====================================================
       TOP LEFT
       =====================================================
      */

      if (
        resizeData.direction === "nw"
      ) {
        newWidth =
          resizeData.startWidth -
          deltaX;

        newHeight =
          resizeData.startHeight -
          deltaY;

        newX =
          resizeData.startX +
          deltaX;

        newY =
          resizeData.startY +
          deltaY;
      }

      /*
       =====================================================
       MINIMUM SIZE
       =====================================================
      */

      if (newWidth < MIN_WIDTH) {
        if (
          resizeData.direction === "sw" ||
          resizeData.direction === "nw"
        ) {
          newX =
            resizeData.startX +
            resizeData.startWidth -
            MIN_WIDTH;
        }

        newWidth = MIN_WIDTH;
      }

      if (newHeight < MIN_HEIGHT) {
        if (
          resizeData.direction === "ne" ||
          resizeData.direction === "nw"
        ) {
          newY =
            resizeData.startY +
            resizeData.startHeight -
            MIN_HEIGHT;
        }

        newHeight = MIN_HEIGHT;
      }

      /*
       =====================================================
       FLOOR BOUNDARY
       =====================================================
      */

      newX = Math.max(
        0,
        newX
      );

      newY = Math.max(
        0,
        newY
      );

      /*
       Width boundary
      */
      const maxWidth =
        Number(floorWidth) - newX;

      if (newWidth > maxWidth) {
        newWidth = maxWidth;
      }

      /*
       Height boundary
      */
      const maxHeight =
        Number(floorHeight) - newY;

      if (newHeight > maxHeight) {
        newHeight = maxHeight;
      }

      /*
       Final safety
      */
      newWidth = Math.max(
        MIN_WIDTH,
        newWidth
      );

      newHeight = Math.max(
        MIN_HEIGHT,
        newHeight
      );

      /*
       =====================================================
       LIVE RESIZE
       =====================================================
      */

      handleElementResize?.(
        element,
        Math.round(newWidth),
        Math.round(newHeight)
      );

      /*
       =====================================================
       LIVE POSITION CHANGE
       FOR TOP / LEFT HANDLES
       =====================================================
      */

      if (
        resizeData.direction === "sw" ||
        resizeData.direction === "ne" ||
        resizeData.direction === "nw"
      ) {
        handleElementMove?.(
          element,
          Math.round(newX),
          Math.round(newY)
        );
      }
    };

    const handlePointerUp = (
      upEvent
    ) => {
      const resizeData =
        resizeRef.current;

      if (!resizeData) {
        return;
      }

      const deltaX =
        upEvent.clientX -
        resizeData.startMouseX;

      const deltaY =
        upEvent.clientY -
        resizeData.startMouseY;

      let finalWidth =
        resizeData.startWidth;

      let finalHeight =
        resizeData.startHeight;

      let finalX =
        resizeData.startX;

      let finalY =
        resizeData.startY;

      /*
       =====================================================
       FINAL RESIZE CALCULATION
       =====================================================
      */

      if (
        resizeData.direction === "se"
      ) {
        finalWidth =
          resizeData.startWidth +
          deltaX;

        finalHeight =
          resizeData.startHeight +
          deltaY;
      }

      if (
        resizeData.direction === "sw"
      ) {
        finalWidth =
          resizeData.startWidth -
          deltaX;

        finalHeight =
          resizeData.startHeight +
          deltaY;

        finalX =
          resizeData.startX +
          deltaX;
      }

      if (
        resizeData.direction === "ne"
      ) {
        finalWidth =
          resizeData.startWidth +
          deltaX;

        finalHeight =
          resizeData.startHeight -
          deltaY;

        finalY =
          resizeData.startY +
          deltaY;
      }

      if (
        resizeData.direction === "nw"
      ) {
        finalWidth =
          resizeData.startWidth -
          deltaX;

        finalHeight =
          resizeData.startHeight -
          deltaY;

        finalX =
          resizeData.startX +
          deltaX;

        finalY =
          resizeData.startY +
          deltaY;
      }

      /*
       =====================================================
       MINIMUM SIZE
       =====================================================
      */

      finalWidth = Math.max(
        MIN_WIDTH,
        finalWidth
      );

      finalHeight = Math.max(
        MIN_HEIGHT,
        finalHeight
      );

      /*
       =====================================================
       FLOOR BOUNDARY
       =====================================================
      */

      finalX = Math.max(
        0,
        finalX
      );

      finalY = Math.max(
        0,
        finalY
      );

      const maxWidth =
        Number(floorWidth) - finalX;

      const maxHeight =
        Number(floorHeight) - finalY;

      finalWidth = Math.min(
        finalWidth,
        maxWidth
      );

      finalHeight = Math.min(
        finalHeight,
        maxHeight
      );

      finalWidth = Math.max(
        MIN_WIDTH,
        finalWidth
      );

      finalHeight = Math.max(
        MIN_HEIGHT,
        finalHeight
      );

      /*
       =====================================================
       SAVE SIZE TO DATABASE
       =====================================================
      */

      handleElementResizeEnd?.(
        element,
        Math.round(finalWidth),
        Math.round(finalHeight)
      );

      /*
       =====================================================
       SAVE POSITION FOR LEFT/TOP RESIZE
       =====================================================
      */

      if (
        resizeData.direction === "sw" ||
        resizeData.direction === "ne" ||
        resizeData.direction === "nw"
      ) {
        handleElementMoveEnd?.(
          element,
          Math.round(finalX),
          Math.round(finalY)
        );
      }

      resizeRef.current = null;

      document.removeEventListener(
        "pointermove",
        handlePointerMove
      );

      document.removeEventListener(
        "pointerup",
        handlePointerUp
      );
    };

    document.addEventListener(
      "pointermove",
      handlePointerMove
    );

    document.addEventListener(
      "pointerup",
      handlePointerUp
    );
  };

  /*
   =========================================================
   OLD DRAG SUPPORT
   =========================================================
   */

  const handleOldDragEnd = (e) => {
    handleDragEnd?.(
      element,
      {
        x,
        y,
      }
    );
  };

  /*
   =========================================================
   RENDER
   =========================================================
   */

  return (
    <div
      key={element._id}
      draggable={false}
      onDragEnd={handleOldDragEnd}
      onPointerDown={handlePointerDown}
      onClick={selectElement}
      className="absolute flex items-center justify-center select-none"
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
            ? `linear-gradient(
                135deg,
                ${
                  element.color ||
                  "#CBD5E1"
                },
                rgba(255,255,255,.45)
              )`
            : element.color ||
              "#FFFFFF",

        border: `${
          element.strokeWidth || 2
        }px solid ${
          isSelected
            ? "#2563EB"
            : element.strokeColor ||
              "#334155"
        }`,

        borderRadius:
          element.type === "corridor"
            ? "10px"
            : "4px",

        transform:
          `rotate(${rotation}deg)`,

        boxShadow:
          mapView === "3d"
            ? isSelected
              ? "8px 12px 0 rgba(37,99,235,.25)"
              : "6px 8px 0 rgba(15,23,42,.18)"
            : isSelected
            ? "0 0 0 3px rgba(37,99,235,.20)"
            : "none",

        zIndex:
          isSelected
            ? 100
            : 10,
      }}
    >
      {/* =================================================
          3D TOP EFFECT
      ================================================= */}

      {mapView === "3d" && (
        <div
          className="absolute inset-x-0 top-0 h-2 bg-white/40 pointer-events-none"
        />
      )}

      {/* =================================================
          CONTENT
      ================================================= */}

      <div className="text-center px-2 pointer-events-none">
        <div className="font-semibold text-xs text-slate-800">
          {element.name}
        </div>

        {element.roomNumber && (
          <div className="text-[10px] text-slate-500">
            {element.roomNumber}
          </div>
        )}

        <div className="text-[9px] uppercase text-slate-400">
          {element.type}
        </div>
      </div>

      {/* =================================================
          RESIZE HANDLES
      ================================================= */}

      {isSelected &&
        activeTool === "select" && (
          <>
            {/* TOP LEFT */}

            <div
              data-resize="true"
              onPointerDown={(e) =>
                handleResizePointerDown(
                  e,
                  "nw"
                )
              }
              className="absolute -left-1.5 -top-1.5 w-3 h-3 bg-blue-600 border-2 border-white rounded-sm z-[400] cursor-nwse-resize"
            />

            {/* TOP RIGHT */}

            <div
              data-resize="true"
              onPointerDown={(e) =>
                handleResizePointerDown(
                  e,
                  "ne"
                )
              }
              className="absolute -right-1.5 -top-1.5 w-3 h-3 bg-blue-600 border-2 border-white rounded-sm z-[400] cursor-nesw-resize"
            />

            {/* BOTTOM LEFT */}

            <div
              data-resize="true"
              onPointerDown={(e) =>
                handleResizePointerDown(
                  e,
                  "sw"
                )
              }
              className="absolute -left-1.5 -bottom-1.5 w-3 h-3 bg-blue-600 border-2 border-white rounded-sm z-[400] cursor-nesw-resize"
            />

            {/* BOTTOM RIGHT */}

            <div
              data-resize="true"
              onPointerDown={(e) =>
                handleResizePointerDown(
                  e,
                  "se"
                )
              }
              className="absolute -right-1.5 -bottom-1.5 w-4 h-4 bg-blue-600 border-2 border-white rounded-sm z-[400] cursor-nwse-resize"
            />
          </>
        )}
    </div>
  );
};

export default ElementRenderer;