import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Pencil,
  Trash2,
  Search,
  MapPin,
  Eye,
  X,
} from "lucide-react";

import { fetchLocations, removeLocation } from "../../redux/slices/locationSlice";

const ManageLocations = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { locations, loading, error } = useSelector((state) => state.locations);
  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(fetchLocations());
  }, [dispatch]);

  const filteredLocations = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return locations;

    return locations.filter((location) => {
      const haystack = [
        location.name,
        location.category,
        location.building,
        location.description,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(query);
    });
  }, [locations, search]);

  const handleDelete = async (location) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${location.name}"?`
    );

    if (!confirmed) return;

    const result = await dispatch(removeLocation(location._id));

    if (!result.error) {
      alert("Location deleted successfully");
    } else {
      alert(result.payload || "Failed to delete location");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-blue-600">
            Admin
          </p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900">
            Manage Locations
          </h1>
        </div>

        <button
          onClick={() => navigate("/admin/add-location")}
          className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          + Add New Location
        </button>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search location name, category, building..."
            className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-10 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
          Loading locations...
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-4 py-3 font-semibold">Name</th>
                  <th className="px-4 py-3 font-semibold">Category</th>
                  <th className="px-4 py-3 font-semibold">Building</th>
                  <th className="px-4 py-3 font-semibold">Floor</th>
                  <th className="px-4 py-3 font-semibold">Location</th>
                  <th className="px-4 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredLocations.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-4 py-8 text-center text-slate-500">
                      No locations found.
                    </td>
                  </tr>
                ) : (
                  filteredLocations.map((location) => (
                    <tr key={location._id} className="hover:bg-slate-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                            <MapPin size={18} />
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900">{location.name}</p>
                            <p className="text-xs text-slate-500">{location._id}</p>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                          {location.category}
                        </span>
                      </td>

                      <td className="px-4 py-3 text-slate-700">
                        {location.building || "RCIT Building"}
                      </td>

                      <td className="px-4 py-3 text-slate-700">
                        {location.floor ?? 0}
                      </td>

                      <td className="px-4 py-3 text-slate-700">
                        X: {location.x}, Y: {location.y}
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => navigate(`/locations/${location._id}`)}
                            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-xs font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                          >
                            <Eye size={14} />
                            View
                          </button>

                          <button
                            onClick={() => navigate(`/admin/edit-location/${location._id}`)}
                            className="flex items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-2.5 py-2 text-xs font-semibold text-blue-700 transition hover:bg-blue-100"
                          >
                            <Pencil size={14} />
                            Edit
                          </button>

                          <button
                            onClick={() => handleDelete(location)}
                            className="flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-2.5 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-100"
                          >
                            <Trash2 size={14} />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageLocations;
