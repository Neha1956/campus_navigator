import React from "react";

import {
  Building2,
  Route,
  MapPin,
  Trash2,
  Save,
  RotateCw,
  Plus,
  X,
} from "lucide-react";

/* =========================================================
   SMALL INPUT
========================================================= */

const InputField = ({
  label,
  value,
  onChange,
  type = "text",
  step,
}) => {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-600 mb-1">
        {label}
      </label>

      <input
        type={type}
        step={step}
        value={
          value ?? ""
        }
        onChange={(event) =>
          onChange?.(
            event.target.value
          )
        }
        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />
    </div>
  );
};

/* =========================================================
   SELECT
========================================================= */

const SelectField = ({
  label,
  value,
  onChange,
  options = [],
}) => {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-600 mb-1">
        {label}
      </label>

      <select
        value={
          value ?? ""
        }
        onChange={(event) =>
          onChange?.(
            event.target.value
          )
        }
        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      >
        {options.map(
          (option) => (
            <option
              key={
                option.value
              }
              value={
                option.value
              }
            >
              {
                option.label
              }
            </option>
          )
        )}
      </select>
    </div>
  );
};

/* =========================================================
   SECTION
========================================================= */

const Section = ({
  title,
  children,
}) => {
  return (
    <div className="border-b border-slate-200 pb-4">
      <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">
        {title}
      </h3>

      {children}
    </div>
  );
};

/* =========================================================
   COMPONENT
========================================================= */

const PropertiesPanel = ({
  editorMode,

  selectedBuilding,
  selectedRoad,
  selectedElement,
  selectedCampusElement,

  handleBuildingSelect,

  updateRoad,
  deleteRoad,

  handlePropertyChange,
  handlePositionChange,
  handleDimensionChange,

  rotateElement,
  saveSelectedElement,

  handleAddAsLocation,

  handleDeleteElement,

  locationSaving,

  handleDeleteBuilding,

  handleBuildingPropertyChange,
  handleBuildingPositionChange,
  handleBuildingDimensionChange,

  handleCampusElementPropertyChange,
  handleCampusElementPositionChange,
  handleCampusElementDimensionChange,

  handleDeleteCampusElement,
}) => {
  /* =======================================================
     NO SELECTION
  ======================================================= */

  if (
    !selectedBuilding &&
    !selectedRoad &&
    !selectedElement &&
    !selectedCampusElement
  ) {
    return (
      <aside className="w-80 shrink-0 border-l border-slate-200 bg-white">
        <div className="flex h-full flex-col items-center justify-center px-8 text-center">
          <div className="mb-4 rounded-2xl bg-slate-100 p-4">
            <MapPin
              size={30}
              className="text-slate-400"
            />
          </div>

          <h3 className="font-bold text-slate-700">
            Nothing Selected
          </h3>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Click a building,
            road or campus
            element on the map
            to edit it.
          </p>
        </div>
      </aside>
    );
  }

  /* =======================================================
     BUILDING PANEL
  ======================================================= */

  if (
    selectedBuilding
  ) {
    const position =
      selectedBuilding.position ||
      {};

    const dimensions =
      selectedBuilding.dimensions ||
      {};

    return (
      <aside className="w-80 shrink-0 border-l border-slate-200 bg-white overflow-y-auto">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4">
          <div className="flex items-center gap-2">
            <Building2
              size={19}
              className="text-blue-600"
            />

            <div>
              <h2 className="font-bold text-slate-800">
                Building
              </h2>

              <p className="text-[11px] text-slate-500">
                Edit building
                properties
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              handleBuildingSelect?.(
                null
              )
            }
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={17} />
          </button>
        </div>

        <div className="space-y-5 p-5">
          <Section title="Basic Information">
            <div className="space-y-3">
              <InputField
                label="Name"
                value={
                  selectedBuilding.name
                }
                onChange={(
                  value
                ) =>
                  handleBuildingPropertyChange?.(
                    "name",
                    value
                  )
                }
              />

              <InputField
                label="Type"
                value={
                  selectedBuilding.type
                }
                onChange={(
                  value
                ) =>
                  handleBuildingPropertyChange?.(
                    "type",
                    value
                  )
                }
              />

              <InputField
                label="Description"
                value={
                  selectedBuilding.description
                }
                onChange={(
                  value
                ) =>
                  handleBuildingPropertyChange?.(
                    "description",
                    value
                  )
                }
              />

              <InputField
                label="Color"
                type="color"
                value={
                  selectedBuilding.color ||
                  "#BFDBFE"
                }
                onChange={(
                  value
                ) =>
                  handleBuildingPropertyChange?.(
                    "color",
                    value
                  )
                }
              />
            </div>
          </Section>

          <Section title="Position">
            <div className="grid grid-cols-2 gap-3">
              <InputField
                label="X"
                type="number"
                value={
                  position.x ??
                  0
                }
                onChange={(
                  value
                ) =>
                  handleBuildingPositionChange?.(
                    "x",
                    value
                  )
                }
              />

              <InputField
                label="Y"
                type="number"
                value={
                  position.y ??
                  0
                }
                onChange={(
                  value
                ) =>
                  handleBuildingPositionChange?.(
                    "y",
                    value
                  )
                }
              />
            </div>
          </Section>

          <Section title="Dimensions">
            <div className="grid grid-cols-2 gap-3">
              <InputField
                label="Width"
                type="number"
                value={
                  dimensions.width ??
                  250
                }
                onChange={(
                  value
                ) =>
                  handleBuildingDimensionChange?.(
                    "width",
                    value
                  )
                }
              />

              <InputField
                label="Height"
                type="number"
                value={
                  dimensions.height ??
                  180
                }
                onChange={(
                  value
                ) =>
                  handleBuildingDimensionChange?.(
                    "height",
                    value
                  )
                }
              />
            </div>
          </Section>

          <button
            type="button"
            onClick={() =>
              handleDeleteBuilding?.(
                selectedBuilding._id
              )
            }
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-100"
          >
            <Trash2
              size={17}
            />

            Delete Building
          </button>
        </div>
      </aside>
    );
  }

  /* =======================================================
     ROAD PANEL
  ======================================================= */

  if (
    selectedRoad
  ) {
    return (
      <aside className="w-80 shrink-0 border-l border-slate-200 bg-white overflow-y-auto">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4">
          <div className="flex items-center gap-2">
            <Route
              size={19}
              className="text-emerald-600"
            />

            <div>
              <h2 className="font-bold text-slate-800">
                Road
              </h2>

              <p className="text-[11px] text-slate-500">
                Edit road
                properties
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              deleteRoad?.(
                selectedRoad._id
              )
            }
            className="rounded-lg p-2 text-red-500 hover:bg-red-50"
            title="Delete Road"
          >
            <Trash2
              size={17}
            />
          </button>
        </div>

        <div className="space-y-5 p-5">
          <Section title="Road Information">
            <div className="space-y-3">
              <InputField
                label="Road Name"
                value={
                  selectedRoad.name
                }
                onChange={(
                  value
                ) =>
                  updateRoad?.(
                    "name",
                    value
                  )
                }
              />

              <SelectField
                label="Type"
                value={
                  selectedRoad.type ||
                  "road"
                }
                onChange={(
                  value
                ) =>
                  updateRoad?.(
                    "type",
                    value
                  )
                }
                options={[
                  {
                    label:
                      "Road",
                    value:
                      "road",
                  },
                  {
                    label:
                      "Path",
                    value:
                      "path",
                  },
                  {
                    label:
                      "Walkway",
                    value:
                      "walkway",
                  },
                  {
                    label:
                      "Driveway",
                    value:
                      "driveway",
                  },
                ]}
              />

              <InputField
                label="Color"
                type="color"
                value={
                  selectedRoad.color ||
                  "#64748B"
                }
                onChange={(
                  value
                ) =>
                  updateRoad?.(
                    "color",
                    value
                  )
                }
              />

              <InputField
                label="Width"
                type="number"
                value={
                  selectedRoad.width ??
                  20
                }
                onChange={(
                  value
                ) =>
                  updateRoad?.(
                    "width",
                    value
                  )
                }
              />
            </div>
          </Section>

          <Section title="Navigation">
            <div className="space-y-3">
              <InputField
                label="Distance"
                type="number"
                value={
                  selectedRoad.distance ??
                  0
                }
                onChange={(
                  value
                ) =>
                  updateRoad?.(
                    "distance",
                    value
                  )
                }
              />

              <InputField
                label="Walking Time"
                type="number"
                value={
                  selectedRoad.walkingTime ??
                  0
                }
                onChange={(
                  value
                ) =>
                  updateRoad?.(
                    "walkingTime",
                    value
                  )
                }
              />
            </div>
          </Section>

          <Section title="Road Points">
            <div className="rounded-lg bg-slate-50 p-3">
              <p className="text-xs text-slate-500">
                Points
              </p>

              <p className="mt-1 text-sm font-semibold text-slate-700">
                {Array.isArray(
                  selectedRoad.points
                )
                  ? selectedRoad
                      .points
                      .length
                  : 0}{" "}
                points
              </p>

              <p className="mt-2 text-[11px] leading-5 text-slate-500">
                Drag the road
                directly on the
                map to move the
                complete route.
              </p>
            </div>
          </Section>

          <button
            type="button"
            onClick={() =>
              deleteRoad?.(
                selectedRoad._id
              )
            }
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-100"
          >
            <Trash2
              size={17}
            />

            Delete Road
          </button>
        </div>
      </aside>
    );
  }

  /* =======================================================
     CAMPUS ELEMENT PANEL
  ======================================================= */

  if (
    selectedCampusElement
  ) {
    const position =
      selectedCampusElement.position ||
      {};

    const dimensions =
      selectedCampusElement.dimensions ||
      {};

    return (
      <aside className="w-80 shrink-0 border-l border-slate-200 bg-white overflow-y-auto">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4">
          <div className="flex items-center gap-2">
            <MapPin
              size={19}
              className="text-purple-600"
            />

            <div>
              <h2 className="font-bold text-slate-800">
                Campus Element
              </h2>

              <p className="text-[11px] text-slate-500">
                Edit element
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              handleDeleteCampusElement?.(
                selectedCampusElement._id
              )
            }
            className="rounded-lg p-2 text-red-500 hover:bg-red-50"
            title="Delete"
          >
            <Trash2
              size={17}
            />
          </button>
        </div>

        <div className="space-y-5 p-5">
          <Section title="Basic Information">
            <div className="space-y-3">
              <InputField
                label="Name"
                value={
                  selectedCampusElement.name
                }
                onChange={(
                  value
                ) =>
                  handleCampusElementPropertyChange?.(
                    "name",
                    value
                  )
                }
              />

              <InputField
                label="Type"
                value={
                  selectedCampusElement.type
                }
                onChange={(
                  value
                ) =>
                  handleCampusElementPropertyChange?.(
                    "type",
                    value
                  )
                }
              />

              <InputField
                label="Description"
                value={
                  selectedCampusElement.description
                }
                onChange={(
                  value
                ) =>
                  handleCampusElementPropertyChange?.(
                    "description",
                    value
                  )
                }
              />

              <InputField
                label="Color"
                type="color"
                value={
                  selectedCampusElement.color ||
                  "#CBD5E1"
                }
                onChange={(
                  value
                ) =>
                  handleCampusElementPropertyChange?.(
                    "color",
                    value
                  )
                }
              />

              <InputField
                label="Stroke Color"
                type="color"
                value={
                  selectedCampusElement.strokeColor ||
                  "#475569"
                }
                onChange={(
                  value
                ) =>
                  handleCampusElementPropertyChange?.(
                    "strokeColor",
                    value
                  )
                }
              />
            </div>
          </Section>

          <Section title="Position">
            <div className="grid grid-cols-2 gap-3">
              <InputField
                label="X"
                type="number"
                value={
                  position.x ??
                  0
                }
                onChange={(
                  value
                ) =>
                  handleCampusElementPositionChange?.(
                    "x",
                    value
                  )
                }
              />

              <InputField
                label="Y"
                type="number"
                value={
                  position.y ??
                  0
                }
                onChange={(
                  value
                ) =>
                  handleCampusElementPositionChange?.(
                    "y",
                    value
                  )
                }
              />
            </div>
          </Section>

          <Section title="Dimensions">
            <div className="grid grid-cols-2 gap-3">
              <InputField
                label="Width"
                type="number"
                value={
                  dimensions.width ??
                  200
                }
                onChange={(
                  value
                ) =>
                  handleCampusElementDimensionChange?.(
                    "width",
                    value
                  )
                }
              />

              <InputField
                label="Height"
                type="number"
                value={
                  dimensions.height ??
                  120
                }
                onChange={(
                  value
                ) =>
                  handleCampusElementDimensionChange?.(
                    "height",
                    value
                  )
                }
              />
            </div>
          </Section>

          <Section title="Rotation">
            <button
              type="button"
              onClick={() =>
                handleCampusElementPropertyChange?.(
                  "rotation",
                  (
                    Number(
                      selectedCampusElement.rotation ||
                        0
                    ) +
                    90
                  ) %
                    360
                )
              }
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              <RotateCw
                size={16}
              />

              Rotate 90°
            </button>
          </Section>

          <button
            type="button"
            onClick={() =>
              handleAddAsLocation?.()
            }
            disabled={
              locationSaving
            }
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
          >
            <Plus
              size={17}
            />

            {locationSaving
              ? "Saving..."
              : "Add as Location"}
          </button>

          <button
            type="button"
            onClick={() =>
              handleDeleteCampusElement?.(
                selectedCampusElement._id
              )
            }
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-100"
          >
            <Trash2
              size={17}
            />

            Delete Element
          </button>
        </div>
      </aside>
    );
  }

  /* =======================================================
     FLOOR ELEMENT PANEL
  ======================================================= */

  if (
    selectedElement
  ) {
    const position =
      selectedElement.position ||
      {};

    const dimensions =
      selectedElement.dimensions ||
      {};

    return (
      <aside className="w-80 shrink-0 border-l border-slate-200 bg-white overflow-y-auto">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4">
          <div className="flex items-center gap-2">
            <MapPin
              size={19}
              className="text-blue-600"
            />

            <div>
              <h2 className="font-bold text-slate-800">
                Floor Element
              </h2>

              <p className="text-[11px] text-slate-500">
                Edit element
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              handleDeleteElement?.(
                selectedElement._id
              )
            }
            className="rounded-lg p-2 text-red-500 hover:bg-red-50"
          >
            <Trash2
              size={17}
            />
          </button>
        </div>

        <div className="space-y-5 p-5">
          <Section title="Basic Information">
            <div className="space-y-3">
              <InputField
                label="Name"
                value={
                  selectedElement.name
                }
                onChange={(
                  value
                ) =>
                  handlePropertyChange?.(
                    "name",
                    value
                  )
                }
              />

              <InputField
                label="Type"
                value={
                  selectedElement.type
                }
                onChange={(
                  value
                ) =>
                  handlePropertyChange?.(
                    "type",
                    value
                  )
                }
              />

              <InputField
                label="Color"
                type="color"
                value={
                  selectedElement.color ||
                  "#CBD5E1"
                }
                onChange={(
                  value
                ) =>
                  handlePropertyChange?.(
                    "color",
                    value
                  )
                }
              />
            </div>
          </Section>

          <Section title="Position">
            <div className="grid grid-cols-2 gap-3">
              <InputField
                label="X"
                type="number"
                value={
                  position.x ??
                  0
                }
                onChange={(
                  value
                ) =>
                  handlePositionChange?.(
                    "x",
                    value
                  )
                }
              />

              <InputField
                label="Y"
                type="number"
                value={
                  position.y ??
                  0
                }
                onChange={(
                  value
                ) =>
                  handlePositionChange?.(
                    "y",
                    value
                  )
                }
              />
            </div>
          </Section>

          <Section title="Dimensions">
            <div className="grid grid-cols-2 gap-3">
              <InputField
                label="Width"
                type="number"
                value={
                  dimensions.width ??
                  150
                }
                onChange={(
                  value
                ) =>
                  handleDimensionChange?.(
                    "width",
                    value
                  )
                }
              />

              <InputField
                label="Height"
                type="number"
                value={
                  dimensions.height ??
                  100
                }
                onChange={(
                  value
                ) =>
                  handleDimensionChange?.(
                    "height",
                    value
                  )
                }
              />
            </div>
          </Section>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() =>
                rotateElement?.(
                  90
                )
              }
              className="flex items-center justify-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              <RotateCw
                size={15}
              />

              Rotate
            </button>

            <button
              type="button"
              onClick={() =>
                saveSelectedElement?.()
              }
              className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              <Save
                size={15}
              />

              Save
            </button>
          </div>

          <button
            type="button"
            onClick={() =>
              handleAddAsLocation?.()
            }
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            <Plus
              size={17}
            />

            Add as Location
          </button>

          <button
            type="button"
            onClick={() =>
              handleDeleteElement?.(
                selectedElement._id
              )
            }
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-100"
          >
            <Trash2
              size={17}
            />

            Delete Element
          </button>
        </div>
      </aside>
    );
  }

  return null;
};

export default PropertiesPanel;