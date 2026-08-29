import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import {
  addLocation,
  editLocation,
  fetchLocationById,
  clearSelectedLocation,
} from "../../redux/slices/locationSlice";

const campusBlocks = [
  { name: "Girls Hostel", x: 30, y: 26, width: 28, height: 22 },
  { name: "R C T Building", x: 38, y: 4, width: 25, height: 18 },
  { name: "Account Dept", x: 70, y: 12, width: 22, height: 18 },
  { name: "Boys Hostel", x: 73, y: 52, width: 20, height: 18 },
  { name: "Temple", x: 55, y: 70, width: 20, height: 16 },
  { name: "Main Gate", x: 8, y: 82, width: 20, height: 12 },
  { name: "Store", x: 30, y: 82, width: 14, height: 12 },
  { name: "Mini Ground", x: 10, y: 58, width: 18, height: 16 },
  { name: "Big Ground", x: 28, y: 36, width: 42, height: 30 },
  { name: "Parking", x: 74, y: 34, width: 17, height: 12 },
];

const AddLocationMap = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const svgRef = useRef(null);
  const isEditMode = Boolean(id);
  const { selectedLocation } = useSelector((state) => state.locations);

  const [form, setForm] = useState({
    name: "",
    category: "Building",
    building: "RCIT Building",
    floor: 0,
    description: "",
    icon: "Building2",
  });
  const [coords, setCoords] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);

  useEffect(() => {
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
      setForm({
        name: selectedLocation.name || "",
        category: selectedLocation.category || "Building",
        building: selectedLocation.building || "RCIT Building",
        floor: selectedLocation.floor ?? 0,
        description: selectedLocation.description || "",
        icon: selectedLocation.icon || "Building2",
      });
      setCoords({
        x: selectedLocation.x ?? 50,
        y: selectedLocation.y ?? 50,
      });
    }
  }, [isEditMode, selectedLocation]);

  useEffect(() => {
    const urls = selectedFiles.map((file) => URL.createObjectURL(file));
    setPreviewUrls(urls);

    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [selectedFiles]);

  const handleMapClick = (event) => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    setCoords({ x, y });
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

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("category", form.category);
    formData.append("building", form.building);
    formData.append("floor", String(form.floor));
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

    const result = isEditMode
      ? await dispatch(editLocation({ id, data: formData }))
      : await dispatch(addLocation(formData));

    if (!result.error) {
      setForm({
        name: "",
        category: "Building",
        building: "RCIT Building",
        floor: 0,
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
  };

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <div>
        <h3 className="mb-2 text-md font-semibold text-slate-700">1. Select map position</h3>
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <svg
            ref={svgRef}
            viewBox="0 0 100 100"
            className="h-[540px] w-full cursor-crosshair bg-[#dff4d8]"
            onClick={handleMapClick}
            role="img"
            aria-label="Campus map selector"
          >
            <rect x="0" y="0" width="100" height="100" fill="#dff4d8" />
            <rect x="4" y="4" width="92" height="92" rx="2.5" fill="#dff4d8" stroke="#6b7280" strokeWidth="0.8" />

            <rect x="8" y="18" width="18" height="16" fill="#d2b48c" stroke="#4b5563" strokeWidth="0.4" />
            <rect x="10" y="20" width="14" height="12" fill="#f6d7b0" stroke="#4b5563" strokeWidth="0.3" />
            <rect x="8" y="58" width="18" height="16" fill="#d2b48c" stroke="#4b5563" strokeWidth="0.4" />
            <rect x="10" y="60" width="14" height="12" fill="#f6d7b0" stroke="#4b5563" strokeWidth="0.3" />
            <rect x="73" y="52" width="18" height="16" fill="#d2b48c" stroke="#4b5563" strokeWidth="0.4" />
            <rect x="75" y="54" width="14" height="12" fill="#f6d7b0" stroke="#4b5563" strokeWidth="0.3" />
            <rect x="52" y="72" width="20" height="15" fill="#d2b48c" stroke="#4b5563" strokeWidth="0.4" />
            <rect x="55" y="74" width="14" height="11" fill="#f6d7b0" stroke="#4b5563" strokeWidth="0.3" />
            <rect x="42" y="48" width="18" height="15" fill="#b7d98a" stroke="#4b5563" strokeWidth="0.4" />
            <rect x="45" y="50" width="12" height="11" fill="#bfe58d" stroke="#4b5563" strokeWidth="0.2" />
            <rect x="30" y="20" width="37" height="20" fill="#c7e5ff" stroke="#4b5563" strokeWidth="0.4" />
            <rect x="74" y="10" width="18" height="16" fill="#f7e6a3" stroke="#4b5563" strokeWidth="0.4" />
            <rect x="36" y="4" width="28" height="14" fill="#b8daf9" stroke="#4b5563" strokeWidth="0.3" />

            <rect x="29" y="35" width="42" height="30" fill="#a8d26f" stroke="#4b5563" strokeWidth="0.4" />
            <rect x="6" y="45" width="18" height="12" fill="#b0dd83" stroke="#4b5563" strokeWidth="0.4" />
            <rect x="30" y="82" width="16" height="12" fill="#d6d3d1" stroke="#4b5563" strokeWidth="0.4" />
            <rect x="75" y="30" width="17" height="12" fill="#dfe7f3" stroke="#4b5563" strokeWidth="0.4" />

            <path d="M 0 50 H 100" stroke="#8aa0a7" strokeWidth="2.8" strokeLinecap="round" />
            <path d="M 50 0 V 100" stroke="#8aa0a7" strokeWidth="2.8" strokeLinecap="round" />
            <path d="M 0 82 H 100" stroke="#8aa0a7" strokeWidth="2.4" strokeLinecap="round" />
            <path d="M 0 18 H 100" stroke="#8aa0a7" strokeWidth="2.4" strokeLinecap="round" />

            <g fontSize="3.3" fontWeight="700" fill="#0f172a">
              <text x="12" y="12">Girls Hostel</text>
              <text x="39" y="12">R C T Building</text>
              <text x="74" y="8">Account Dept</text>
              <text x="73" y="71">Boys Hostel</text>
              <text x="55" y="89">Temple</text>
              <text x="14" y="93">Main Gate</text>
              <text x="30" y="96">Store</text>
              <text x="28" y="43">Big Ground</text>
              <text x="10" y="52">Mini Ground</text>
              <text x="75" y="42">Parking</text>
            </g>

            {campusBlocks.map((block) => (
              <g key={block.name}>
                <text
                  x={block.x + block.width / 2}
                  y={block.y + block.height / 2}
                  textAnchor="middle"
                  fill="#1f2937"
                  fontSize="2.2"
                  fontWeight="700"
                >
                  {block.name}
                </text>
              </g>
            ))}

            {coords && (
              <g>
                <circle
                  cx={coords.x}
                  cy={coords.y}
                  r="2.3"
                  fill="#dc2626"
                  stroke="#fff"
                  strokeWidth="0.8"
                />
                <circle
                  cx={coords.x}
                  cy={coords.y}
                  r="4"
                  fill="none"
                  stroke="#dc2626"
                  strokeWidth="0.5"
                  opacity="0.7"
                />
              </g>
            )}
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
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-50"
              placeholder="e.g. Computer Lab 1"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-50"
              >
                <option value="Building">Building</option>
                <option value="Library">Library</option>
                <option value="Canteen">Canteen</option>
                <option value="Gate">Gate</option>
                <option value="Classroom">Classroom</option>
                <option value="Lab">Lab</option>
                <option value="Office">Office</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Floor</label>
              <input
                type="number"
                value={form.floor}
                onChange={(e) => setForm({ ...form, floor: e.target.value })}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-50"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-50"
              rows="3"
              placeholder="Describe this place, purpose, or timing..."
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Multiple photos</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="w-full rounded-lg border border-dashed border-slate-300 bg-slate-50 px-3 py-3 text-sm text-slate-500 file:mr-3 file:rounded-lg file:border-0 file:bg-blue-50 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-blue-600 hover:file:bg-blue-100"
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
            className="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Save Location
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddLocationMap;