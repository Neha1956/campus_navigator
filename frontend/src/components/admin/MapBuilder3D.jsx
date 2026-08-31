
import React, {
  useEffect,
  useState,
} from "react";
import * as THREE from "three";
import {
  Canvas,
} from "@react-three/fiber";

import {
  OrbitControls,
  Grid,
  Html,
} from "@react-three/drei";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  fetchMapElementsByFloor,
  createMapElement,
  updateElementPosition,
  updateElementDimensions,
  deleteMapElement,
} from "../../redux/slices/mapElementSlice";

import {
  Plus,
  Trash2,
  Move,
  Save,
} from "lucide-react";

/* =========================================================
   COLORS
========================================================= */

const ELEMENT_TYPES = {
  room: "#86EFAC",
  classroom: "#7DD3FC",
  lab: "#FDE68A",
  office: "#D8B4FE",
  corridor: "#CBD5E1",
  door: "#FBBF24",
  staircase: "#FDBA74",
  washroom: "#93C5FD",
  wall: "#94A3B8",
  lift: "#67E8F9",
};

/* =========================================================
   3D ELEMENT
========================================================= */

const EditorElement = ({
  element,
  selected,
  onSelect,
}) => {
  const position =
    element.position || {};

  const dimensions =
    element.dimensions || {};

  const width = Number(
    dimensions.width || 100
  );

  const height = Number(
    dimensions.height || 25
  );

  const depth = Number(
    dimensions.depth ||
      dimensions.height ||
      80
  );

  const x = Number(
    position.x || 0
  );

  const y = Number(
    position.z || 0
  );

  const z = Number(
    position.y || 0
  );

  return (
    <group
      position={[
        x + width / 2,
        height / 2 + z,
        y + depth / 2,
      ]}
      onClick={(event) => {
        event.stopPropagation();

        onSelect(element);
      }}
    >

      <mesh castShadow>

        <boxGeometry
          args={[
            width,
            height,
            depth,
          ]}
        />

        <meshStandardMaterial
          color={
            element.color ||
            ELEMENT_TYPES[
              element.type
            ] ||
            "#CBD5E1"
          }
        />

      </mesh>

      <lineSegments>

        <edgesGeometry
          args={[
            new THREE.BoxGeometry(
              width,
              height,
              depth
            ),
          ]}
        />

        <lineBasicMaterial
          color={
            selected
              ? "#2563EB"
              : "#475569"
          }
        />

      </lineSegments>

      {selected && (
        <mesh>

          <boxGeometry
            args={[
              width + 6,
              height + 6,
              depth + 6,
            ]}
          />

          <meshBasicMaterial
            color="#2563EB"
            wireframe
          />

        </mesh>
      )}

      <Html
        center
        position={[
          0,
          height / 2 + 8,
          0,
        ]}
        distanceFactor={500}
      >
        <div
          className={`px-2 py-1 rounded text-xs whitespace-nowrap ${
            selected
              ? "bg-blue-600 text-white"
              : "bg-white text-gray-800"
          }`}
        >
          {element.name}
        </div>
      </Html>

    </group>
  );
};

/* =========================================================
   SCENE
========================================================= */

const EditorScene = ({
  floor,
  elements,
  selectedElement,
  setSelectedElement,
  handleMapClick,
}) => {

  const width = Number(
    floor?.width || 1000
  );

  const depth = Number(
    floor?.height || 700
  );

  return (
    <>

      <ambientLight intensity={1.5} />

      <directionalLight
        position={[
          500,
          900,
          500,
        ]}
        intensity={2}
        castShadow
      />

      {/* FLOOR */}

      <mesh
        rotation={[
          -Math.PI / 2,
          0,
          0,
        ]}
        position={[
          width / 2,
          -2,
          depth / 2,
        ]}
        onClick={handleMapClick}
      >

        <planeGeometry
          args={[
            width,
            depth,
          ]}
        />

        <meshStandardMaterial
          color="#F8FAFC"
        />

      </mesh>

      <Grid
        args={[
          width,
          depth,
        ]}
        cellSize={20}
        sectionSize={100}
        position={[
          width / 2,
          0,
          depth / 2,
        ]}
      />

      {/* ELEMENTS */}

      {elements.map(
        (element) => (
          <EditorElement
            key={
              element._id
            }
            element={
              element
            }
            selected={
              selectedElement?._id ===
              element._id
            }
            onSelect={
              setSelectedElement
            }
          />
        )
      )}

      <OrbitControls
        enableDamping
        minDistance={100}
        maxDistance={3000}
        maxPolarAngle={
          Math.PI / 2.05
        }
      />

    </>
  );
};

/* =========================================================
   MAIN BUILDER
========================================================= */

const MapBuilder3D = ({
  floorId,
  floorData,
}) => {

  const dispatch =
    useDispatch();

  const {
    elements,
    loading,
  } = useSelector(
    (state) =>
      state.mapElements
  );

  const [
    selectedTool,
    setSelectedTool,
  ] = useState(null);

  const [
    selectedElement,
    setSelectedElement,
  ] = useState(null);

  const [
    showForm,
    setShowForm,
  ] = useState(false);

  const [
    formData,
    setFormData,
  ] = useState({
    name: "",
    type: "room",
    x: 0,
    y: 0,
    width: 150,
    height: 25,
    depth: 100,
    color:
      ELEMENT_TYPES.room,
  });

  /* =====================================================
     LOAD ELEMENTS
  ===================================================== */

  useEffect(() => {

    if (floorId) {

      dispatch(
        fetchMapElementsByFloor(
          floorId
        )
      );

    }

  }, [
    floorId,
    dispatch,
  ]);

  /* =====================================================
     TOOL
  ===================================================== */

  const selectTool = (
    type
  ) => {

    setSelectedTool(type);

    setFormData(
      (previous) => ({
        ...previous,
        type,
        color:
          ELEMENT_TYPES[
            type
          ] || "#FFFFFF",
      })
    );

  };

  /* =====================================================
     MAP CLICK
  ===================================================== */

  const handleMapClick = (
    event
  ) => {

    if (
      !selectedTool ||
      selectedTool ===
        "select"
    ) {
      return;
    }

    const point =
      event.point;

    setFormData(
      (previous) => ({
        ...previous,
        x: Math.round(
          point.x / 20
        ) * 20,
        y: Math.round(
          point.z / 20
        ) * 20,
      })
    );

    setShowForm(true);

    setSelectedTool(null);

  };

  /* =====================================================
     ADD ELEMENT
  ===================================================== */

  const handleAddElement =
    async () => {

      if (
        !formData.name.trim()
      ) {

        alert(
          "Please enter element name"
        );

        return;
      }

      const data = {

        floorId,

        name:
          formData.name,

        type:
          formData.type,

        position: {
          x: formData.x,
          y: formData.y,
          z: 0,
        },

        dimensions: {
          width:
            Number(
              formData.width
            ),

          height:
            Number(
              formData.height
            ),

          depth:
            Number(
              formData.depth
            ),
        },

        color:
          formData.color,

        strokeColor:
          "#334155",

        strokeWidth: 2,
      };

      await dispatch(
        createMapElement(
          data
        )
      );

      setShowForm(false);

      setFormData({
        name: "",
        type: "room",
        x: 0,
        y: 0,
        width: 150,
        height: 25,
        depth: 100,
        color:
          ELEMENT_TYPES.room,
      });

      dispatch(
        fetchMapElementsByFloor(
          floorId
        )
      );
    };

  /* =====================================================
     DELETE
  ===================================================== */

  const handleDelete =
    async (id) => {

      if (
        !window.confirm(
          "Delete this element?"
        )
      ) {
        return;
      }

      await dispatch(
        deleteMapElement(id)
      );

      setSelectedElement(null);

    };

  /* =====================================================
     UPDATE SIZE
  ===================================================== */

  const updateSize = async (
    field,
    value
  ) => {

    if (!selectedElement)
      return;

    const dimensions = {
      ...selectedElement.dimensions,
      [field]:
        Number(value),
    };

    await dispatch(
      updateElementDimensions(
        {
          id:
            selectedElement._id,

          dimensions,
        }
      )
    );

    setSelectedElement({
      ...selectedElement,
      dimensions,
    });

  };

  /* =====================================================
     UI
  ===================================================== */

  return (
    <div className="h-full flex flex-col bg-gray-100">

      {/* TOOLBAR */}

      <div className="bg-white border-b p-3 flex gap-2 flex-wrap">

        <button
          onClick={() =>
            setSelectedTool(
              selectedTool ===
                "select"
                ? null
                : "select"
            )
          }
          className={`px-3 py-2 rounded flex items-center gap-2 ${
            selectedTool ===
            "select"
              ? "bg-blue-600 text-white"
              : "bg-gray-200"
          }`}
        >
          <Move size={18} />
          Select
        </button>

        {Object.keys(
          ELEMENT_TYPES
        ).map((type) => (

          <button
            key={type}
            onClick={() =>
              selectTool(type)
            }
            className={`px-3 py-2 rounded capitalize flex items-center gap-1 ${
              selectedTool ===
              type
                ? "bg-blue-600 text-white"
                : "bg-gray-200"
            }`}
          >

            <Plus size={16} />

            {type}

          </button>

        ))}

        {selectedElement && (
          <button
            onClick={() =>
              handleDelete(
                selectedElement._id
              )
            }
            className="px-3 py-2 bg-red-500 text-white rounded flex items-center gap-2"
          >
            <Trash2 size={17} />
            Delete
          </button>
        )}

      </div>

      {/* MAIN */}

      <div className="flex flex-1 overflow-hidden">

        {/* 3D */}

        <div className="flex-1">

          <Canvas
            shadows
            camera={{
              position: [
                700,
                700,
                800,
              ],
              fov: 45,
            }}
          >

            <EditorScene
              floor={
                floorData
              }
              elements={
                elements
              }
              selectedElement={
                selectedElement
              }
              setSelectedElement={
                setSelectedElement
              }
              handleMapClick={
                handleMapClick
              }
            />

          </Canvas>

        </div>

        {/* PROPERTY PANEL */}

        <div className="w-80 bg-white border-l p-4 overflow-y-auto">

          {selectedElement ? (

            <div className="space-y-4">

              <h2 className="text-xl font-bold">
                {selectedElement.name}
              </h2>

              <p className="text-sm text-gray-500">
                Type:{" "}
                {
                  selectedElement.type
                }
              </p>

              <div>

                <label className="text-sm font-medium">
                  Width
                </label>

                <input
                  type="number"
                  value={
                    selectedElement
                      .dimensions
                      ?.width || 100
                  }
                  onChange={(e) =>
                    updateSize(
                      "width",
                      e.target.value
                    )
                  }
                  className="w-full border rounded px-3 py-2 mt-1"
                />

              </div>

              <div>

                <label className="text-sm font-medium">
                  Height
                </label>

                <input
                  type="number"
                  value={
                    selectedElement
                      .dimensions
                      ?.height || 25
                  }
                  onChange={(e) =>
                    updateSize(
                      "height",
                      e.target.value
                    )
                  }
                  className="w-full border rounded px-3 py-2 mt-1"
                />

              </div>

              <div>

                <label className="text-sm font-medium">
                  Depth
                </label>

                <input
                  type="number"
                  value={
                    selectedElement
                      .dimensions
                      ?.depth || 100
                  }
                  onChange={(e) =>
                    updateSize(
                      "depth",
                      e.target.value
                    )
                  }
                  className="w-full border rounded px-3 py-2 mt-1"
                />

              </div>

              <button
                onClick={() =>
                  handleDelete(
                    selectedElement._id
                  )
                }
                className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded"
              >
                Delete Element
              </button>

            </div>

          ) : (

            <div className="text-center text-gray-500 mt-10">

              <p>
                Select an element
              </p>

              <p className="text-sm mt-2">
                Or select a tool and
                click on the 3D floor
              </p>

            </div>

          )}

        </div>

      </div>

      {/* ADD FORM */}

      {showForm && (

        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

          <div className="bg-white rounded-2xl p-6 w-[420px] shadow-2xl">

            <h2 className="text-xl font-bold mb-5">
              Add{" "}
              <span className="capitalize">
                {formData.type}
              </span>
            </h2>

            <div className="space-y-4">

              <div>

                <label className="text-sm font-medium">
                  Name
                </label>

                <input
                  type="text"
                  value={
                    formData.name
                  }
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      name:
                        e.target.value,
                    })
                  }
                  placeholder="CSE Lab"
                  className="w-full border rounded px-3 py-2 mt-1"
                />

              </div>

              <div className="grid grid-cols-3 gap-3">

                <div>

                  <label className="text-xs">
                    Width
                  </label>

                  <input
                    type="number"
                    value={
                      formData.width
                    }
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        width:
                          Number(
                            e.target.value
                          ),
                      })
                    }
                    className="w-full border rounded px-2 py-2"
                  />

                </div>

                <div>

                  <label className="text-xs">
                    Height
                  </label>

                  <input
                    type="number"
                    value={
                      formData.height
                    }
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        height:
                          Number(
                            e.target.value
                          ),
                      })
                    }
                    className="w-full border rounded px-2 py-2"
                  />

                </div>

                <div>

                  <label className="text-xs">
                    Depth
                  </label>

                  <input
                    type="number"
                    value={
                      formData.depth
                    }
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        depth:
                          Number(
                            e.target.value
                          ),
                      })
                    }
                    className="w-full border rounded px-2 py-2"
                  />

                </div>

              </div>

              <div>

                <label className="text-sm font-medium">
                  Color
                </label>

                <input
                  type="color"
                  value={
                    formData.color
                  }
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      color:
                        e.target.value,
                    })
                  }
                  className="w-full h-10"
                />

              </div>

              <div className="flex gap-3 pt-3">

                <button
                  onClick={
                    handleAddElement
                  }
                  className="flex-1 bg-blue-600 text-white py-2 rounded"
                >
                  Add Element
                </button>

                <button
                  onClick={() =>
                    setShowForm(false)
                  }
                  className="flex-1 bg-gray-200 py-2 rounded"
                >
                  Cancel
                </button>

              </div>

            </div>

          </div>

        </div>

      )}

      {loading && (

        <div className="absolute inset-0 bg-black/20 flex items-center justify-center pointer-events-none">

          <div className="bg-white px-5 py-3 rounded-xl shadow">
            Loading...
          </div>

        </div>

      )}

    </div>
  );
};

export default MapBuilder3D;

