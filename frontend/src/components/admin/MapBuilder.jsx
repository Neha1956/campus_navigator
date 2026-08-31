import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMapElementsByFloor, createMapElement, updateElementPosition, updateElementDimensions, deleteMapElement } from "../../redux/slices/mapElementSlice";
import { Plus, Trash2, Copy, Palette, Move } from "lucide-react";

const MapBuilder = ({ floorId, floorData }) => {
  const dispatch = useDispatch();
  const { elements, loading } = useSelector((state) => state.mapElements);

  const [selectedTool, setSelectedTool] = useState(null);
  const [selectedElement, setSelectedElement] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [showElementForm, setShowElementForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    type: "room",
    x: 0,
    y: 0,
    width: 150,
    height: 100,
    color: "#FFFFFF",
  });
  const canvasRef = useRef(null);

  // Element types and their default colors
  const elementTypes = {
    room: "#DCF7E0",
    wall: "#E8E8E8",
    door: "#FEF3C7",
    staircase: "#FED7AA",
    corridor: "#E0E7FF",
    washroom: "#DBEAFE",
    office: "#F3E8FF",
    lab: "#FFFBEB",
    classroom: "#E0F2FE",
  };

  useEffect(() => {
    if (floorId) {
      dispatch(fetchMapElementsByFloor(floorId));
    }
  }, [floorId, dispatch]);

  const GRID_SIZE = 20;
  const snapToGrid = (value) => Math.round(value / GRID_SIZE) * GRID_SIZE;

  const handleCanvasMouseDown = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = snapToGrid(e.clientX - rect.left);
    const y = snapToGrid(e.clientY - rect.top);

    if (selectedTool && selectedTool !== "select") {
      setFormData({
        ...formData,
        x,
        y,
        color: elementTypes[formData.type] || "#FFFFFF",
      });
      setShowElementForm(true);
      setSelectedTool(null);
    }
  };

  const handleCanvasMouseMove = (e) => {
    if (isDragging && selectedElement) {
      const rect = canvasRef.current.getBoundingClientRect();
      const newX = snapToGrid(e.clientX - rect.left - dragStart.x);
      const newY = snapToGrid(e.clientY - rect.top - dragStart.y);

      // Update position in Redux
      dispatch(
        updateElementPosition({
          id: selectedElement._id,
          position: { x: newX, y: newY, z: selectedElement.position.z || 0 },
        })
      );
    }
  };

  const handleCanvasMouseUp = () => {
    setIsDragging(false);
  };

  const handleElementMouseDown = (e, element) => {
    e.stopPropagation();
    setSelectedElement(element);
    setIsDragging(true);
    setDragStart({ x: e.clientX - element.position.x, y: e.clientY - element.position.y });
  };

  const handleAddElement = async () => {
    if (!formData.name.trim()) {
      alert("Please enter element name");
      return;
    }

    const newElement = {
      floorId,
      name: formData.name,
      type: formData.type,
      position: {
        x: formData.x,
        y: formData.y,
        z: 0,
      },
      dimensions: {
        width: formData.width,
        height: formData.height,
        depth: 0,
      },
      color: formData.color,
      strokeColor: "#334155",
      strokeWidth: 2,
    };

    dispatch(createMapElement(newElement));
    setFormData({
      name: "",
      type: "room",
      x: 0,
      y: 0,
      width: 150,
      height: 100,
      color: "#FFFFFF",
    });
    setShowElementForm(false);
  };

  const handleDeleteElement = (id) => {
    if (window.confirm("Are you sure you want to delete this element?")) {
      dispatch(deleteMapElement(id));
      setSelectedElement(null);
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-100">
      {/* Toolbar */}
      <div className="bg-white border-b border-gray-300 p-3 flex gap-2 flex-wrap items-center">
        <button
          onClick={() => setSelectedTool(selectedTool === "select" ? null : "select")}
          className={`px-3 py-2 rounded flex items-center gap-2 ${
            selectedTool === "select"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          <Move size={18} /> Select
        </button>

        {Object.entries(elementTypes).map(([type]) => (
          <button
            key={type}
            onClick={() => {
              setSelectedTool(type);
              setFormData({ ...formData, type });
            }}
            className={`px-3 py-2 rounded capitalize ${
              selectedTool === type
                ? "bg-blue-500 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            <Plus size={18} className="inline mr-1" />
            {type}
          </button>
        ))}

        {selectedElement && (
          <button
            onClick={() => handleDeleteElement(selectedElement._id)}
            className="px-3 py-2 rounded bg-red-500 text-white hover:bg-red-600 flex items-center gap-2"
          >
            <Trash2 size={18} /> Delete
          </button>
        )}
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Canvas */}
        <div className="flex-1 p-4 overflow-auto bg-gray-100">
          <svg
            ref={canvasRef}
            width={floorData?.width || 800}
            height={floorData?.height || 600}
            className="bg-white border-2 border-gray-400 cursor-crosshair shadow-lg"
            onMouseDown={handleCanvasMouseDown}
            onMouseMove={handleCanvasMouseMove}
            onMouseUp={handleCanvasMouseUp}
            onMouseLeave={handleCanvasMouseUp}
          >
            {/* Grid background */}
            <defs>
              <pattern id="grid" width={GRID_SIZE} height={GRID_SIZE} patternUnits="userSpaceOnUse">
                <path
                  d={`M ${GRID_SIZE} 0 L 0 0 0 ${GRID_SIZE}`}
                  fill="none"
                  stroke="#E0E0E0"
                  strokeWidth="0.5"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />

            {/* Elements */}
            {elements.map((element) => (
              <g key={element._id}>
                <rect
                  x={element.position.x}
                  y={element.position.y}
                  width={element.dimensions.width}
                  height={element.dimensions.height}
                  fill={element.color}
                  stroke={selectedElement?._id === element._id ? "#0066CC" : element.strokeColor}
                  strokeWidth={selectedElement?._id === element._id ? 3 : element.strokeWidth}
                  onMouseDown={(e) => handleElementMouseDown(e, element)}
                  onClick={() => setSelectedElement(element)}
                  className="cursor-move hover:opacity-80 transition"
                />
                <text
                  x={element.position.x + element.dimensions.width / 2}
                  y={element.position.y + element.dimensions.height / 2}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="12"
                  fontWeight="500"
                  fill="#333"
                  pointerEvents="none"
                >
                  {element.name}
                </text>
              </g>
            ))}
          </svg>
        </div>

        {/* Properties Panel */}
        <div className="w-72 bg-white border-l border-gray-300 p-4 overflow-y-auto">
          {selectedElement ? (
            <div className="space-y-4">
              <h3 className="text-lg font-bold">{selectedElement.name}</h3>
              <div className="text-sm text-gray-600">
                <p>
                  <strong>Type:</strong> {selectedElement.type}
                </p>
                <p>
                  <strong>Position:</strong> ({selectedElement.position.x}, {selectedElement.position.y})
                </p>
                <p>
                  <strong>Size:</strong> {selectedElement.dimensions.width} × {selectedElement.dimensions.height}
                </p>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium">Color</label>
                <input
                  type="color"
                  value={selectedElement.color}
                  onChange={(e) =>
                    setSelectedElement({ ...selectedElement, color: e.target.value })
                  }
                  className="w-full h-10 cursor-pointer"
                />
              </div>
              <button
                onClick={() => handleDeleteElement(selectedElement._id)}
                className="w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete Element
              </button>
            </div>
          ) : (
            <p className="text-gray-500 text-center">Select an element to edit</p>
          )}
        </div>
      </div>

      {/* Add Element Form Modal */}
      {showElementForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h2 className="text-2xl font-bold mb-4">Add {formData.type}</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Room 101"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Width</label>
                  <input
                    type="number"
                    value={formData.width}
                    onChange={(e) => setFormData({ ...formData, width: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Height</label>
                  <input
                    type="number"
                    value={formData.height}
                    onChange={(e) => setFormData({ ...formData, height: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Color</label>
                <input
                  type="color"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className="w-full h-10 cursor-pointer"
                />
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  onClick={handleAddElement}
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Add Element
                </button>
                <button
                  onClick={() => setShowElementForm(false)}
                  className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {loading && (
        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <div className="bg-white px-6 py-4 rounded">Loading...</div>
        </div>
      )}
    </div>
  );
};

export default MapBuilder;
