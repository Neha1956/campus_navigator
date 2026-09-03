import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import CampusMap from "../../components/AdminCampusBuilder/CampusMap";
import { fetchBuildings } from "../../redux/slices/buildingSlice";
import { fetchRoads } from "../../redux/slices/roadSlice";
import { fetchFloorsByBuilding } from "../../redux/slices/floorSlice";
import { fetchCampusElements } from "../../redux/slices/campusElementSlice";

import {
  addLocation,
  editLocation,
  fetchLocationById,
  clearSelectedLocation,
} from "../../redux/slices/locationSlice";

const AddLocationMap = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const mapCanvasRef = useRef(null);
  const isEditMode = Boolean(id);
  const { selectedLocation } = useSelector((state) => state.locations);
  const { buildings = [] } = useSelector((state) => state.buildings || {});
  const { roads = [] } = useSelector((state) => state.roads || {});
  const { floors = [] } = useSelector((state) => state.floors || {});
  const { elements: campusElements = [] } = useSelector((state) => state.campusElements || {});

  const [form, setForm] = useState({
    name: "",
    category: "Building",
    building: "", // Default empty rakha hai taaki bina select kiye blank rahe
    buildingId: "",
    floor: 0,
    floorId: "",
    description: "",
    icon: "Building2",
  });

  const [customCategory, setCustomCategory] = useState("");
  const [isCustomCategory, setIsCustomCategory] = useState(false);

  const [coords, setCoords] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const availableCategories = React.useMemo(() => {
    const defaults = ["Building", "Library", "Canteen", "Gate", "Classroom", "Lab", "Office", "Parking", "Park", "Ground", "Pond", "Temple", "Hostel"];
    const dynamicTypes = campusElements.map((el) => el.type).filter(Boolean);
    const combined = [...new Set([...defaults, ...dynamicTypes])];
    return combined.map(cat => cat.charAt(0).toUpperCase() + cat.slice(1).toLowerCase());
  }, [campusElements]);

  useEffect(() => {
    dispatch(fetchBuildings());
    dispatch(fetchRoads());
    dispatch(fetchCampusElements());

    if (isEditMode && id) {
      dispatch(fetchLocationById(id));
    }

    return () => {
      if (isEditMode) {
        dispatch(clearSelectedLocation());
      }
    };
  }, [dispatch, id, isEditMode]);

  useEffect(() => {
    if (isEditMode && selectedLocation) {
      const cat = selectedLocation.category || "Building";
      const isStandard = availableCategories.includes(cat);
      
      setForm({
        name: selectedLocation.name || "",
        category: isStandard ? cat : "Custom",
        building: selectedLocation.building || "",
        buildingId: selectedLocation.buildingId || "",
        floor: selectedLocation.floor ?? 0,
        floorId: selectedLocation.floorId || "",
        description: selectedLocation.description || "",
        icon: selectedLocation.icon || "Building2",
      });

      if (!isStandard) {
        setIsCustomCategory(true);
        setCustomCategory(cat);
      }

      setCoords({
        x: selectedLocation.x ?? 50,
        y: selectedLocation.y ?? 50,
      });
    }
  }, [isEditMode, selectedLocation, availableCategories]);

  useEffect(() => {
    if (form.buildingId) {
      dispatch(fetchFloorsByBuilding(form.buildingId));
    }
  }, [dispatch, form.buildingId]);

  useEffect(() => {
    const urls = selectedFiles.map((file) => URL.createObjectURL(file));
    setPreviewUrls(urls);

    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [selectedFiles]);

  const handleMapPointSelected = (_, point) => {
    if (!point) return;
    setCoords({ x: Number(point.x), y: Number(point.y) });
  };

  const handleFileChange = (event) => {
    const incomingFiles = Array.from(event.target.files || []);

    setSelectedFiles((prevFiles) => {
      const merged = [...prevFiles, ...incomingFiles];
      const uniqueFiles = merged.filter(
        (file, index, currentFiles) =>
          currentFiles.findIndex(
            (candidate) =>
              candidate.name === file.name &&
              candidate.size === file.size &&
              candidate.lastModified === file.lastModified
          ) === index
      );
      return uniqueFiles;
    });

    event.target.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!coords) {
      alert("Please click on the map to set the location coordinates.");
      return;
    }

    setSubmitting(true);

    const finalCategory = isCustomCategory ? customCategory.trim() : form.category;

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("category", finalCategory || "Building");
    if (form.building) formData.append("building", form.building);
    if (form.buildingId) formData.append("buildingId", form.buildingId);
    formData.append("floor", String(form.floor));
    if (form.floorId) formData.append("floorId", form.floorId);
    formData.append("description", form.description);
    formData.append("icon", form.icon);
    formData.append("x", String(coords.x));
    formData.append("y", String(coords.y));

    if (selectedFiles.length) {
      formData.append("image", selectedFiles[0]);
      selectedFiles.slice(1).forEach((file) => {
        formData.append("images", file);
      });
    }

    try {
      const result = isEditMode
        ? await dispatch(editLocation({ id, data: formData }))
        : await dispatch(addLocation(formData));

      if (!result.error) {
        setForm({
          name: "",
          category: "Building",
          building: "",
          buildingId: "",
          floor: 0,
          floorId: "",
          description: "",
          icon: "Building2",
        });
        setCoords(null);
        setSelectedFiles([]);
        setPreviewUrls([]);

        alert(isEditMode ? "Location updated successfully!" : "Location added successfully!");
        navigate(isEditMode ? "/admin/manage-locations" : "/locations");
      } else {
        alert(result.payload || "Failed to save location");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred while saving.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="w-full min-w-0">
        <h3 className="mb-2 text-md font-semibold text-slate-700">1. Select map position</h3>
        <div className="w-full min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="h-[650px] w-full min-w-0">
            <CampusMap
              campusCanvasRef={mapCanvasRef}
              campusWidth={1400}
              campusHeight={900}
              showGrid={true}
              mapView="2d"
              activeTool="select"
              buildings={buildings}
              campusRoads={roads}
              campusElements={campusElements}
              locations={coords ? [{ _id: "draft-location", ...coords, name: "Selected location" }] : []}
              selectedLocation={coords ? { _id: "draft-location" } : null}
              onMapPointSelected={handleMapPointSelected}
              fitToContainer={true}
            />
          </div>
          <svg viewBox="0 0 100 100" className="hidden" role="img" aria-label="Campus map selector">
            <rect x="0" y="0" width="100" height="100" fill="#dff4d8" />
          </svg>
        </div>
        {coords && (
          <p className="mt-2 text-xs text-slate-500">
            Selected coordinates: X {coords.x.toFixed(2)}% , Y {coords.y.toFixed(2)}%
          </p>
        )}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-md font-semibold text-slate-700">2. Add location details</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Location name</label>
            <input
              type="text"
              required
              disabled={submitting}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-50 disabled:bg-slate-100"
              placeholder="e.g. Library, Canteen, Main Gate, etc."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Category</label>
              <select
                value={isCustomCategory ? "Custom" : form.category}
                disabled={submitting}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === "Custom") {
                    setIsCustomCategory(true);
                  } else {
                    setIsCustomCategory(false);
                    setForm({ ...form, category: val });
                  }
                }}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-50 disabled:bg-slate-100"
              >
                {availableCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
                <option value="Custom">+ Type custom category...</option>
              </select>

              {isCustomCategory && (
                <input
                  type="text"
                  required
                  disabled={submitting}
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  placeholder="Enter category name..."
                  className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-50"
                />
              )}
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Building (Optional)</label>
              <select
                value={form.buildingId}
                disabled={submitting}
                onChange={(e) => {
                  const buildingId = e.target.value;
                  const building = buildings.find((item) => item._id === buildingId);
                  setForm({
                    ...form,
                    buildingId: buildingId,
                    building: building ? building.name : "",
                    floor: 0,
                    floorId: "",
                  });
                }}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-50 disabled:bg-slate-100"
              >
                <option value="">None / Not inside a building</option>
                {buildings.map((building) => (
                  <option key={building._id} value={building._id}>
                    {building.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Description</label>
            <textarea
              value={form.description}
              disabled={submitting}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-50 disabled:bg-slate-100"
              rows="3"
              placeholder="Describe this place, purpose, or timing..."
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Multiple photos</label>
            <input
              type="file"
              multiple
              disabled={submitting}
              accept="image/*"
              onChange={handleFileChange}
              className="w-full rounded-lg border border-dashed border-slate-300 bg-slate-50 px-3 py-3 text-sm text-slate-500 file:mr-3 file:rounded-lg file:border-0 file:bg-blue-50 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-blue-600 hover:file:bg-blue-100 disabled:opacity-50"
            />
          </div>

          {selectedFiles.length > 0 && (
            <div className="grid grid-cols-3 gap-3">
              {selectedFiles.slice(0, 6).map((file, index) => (
                <div key={`${file.name}-${file.size}-${index}`} className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                  <img
                    src={previewUrls[index]}
                    alt={file.name}
                    className="h-20 w-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {submitting && (
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            {submitting ? "Adding location..." : "Save Location"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddLocationMap;