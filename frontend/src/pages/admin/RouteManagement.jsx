import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
  Route as RouteIcon,
  Clock,
  MapPin,
  CheckCircle2,
  XCircle,
} from "lucide-react";

import { fetchLocations } from "../../redux/slices/locationSlice";

import {
  fetchRoutes,
  addRoute,
  editRoute,
  removeRoute,
} from "../../redux/slices/routeSlice";

const RouteManagement = () => {
  const dispatch = useDispatch();

  // =========================
  // REDUX STATE
  // =========================

  const { locations = [] } = useSelector(
    (state) => state.locations
  );

  const {
    routes = [],
    loading,
    error,
  } = useSelector((state) => state.routes);

  // =========================
  // LOCAL STATE
  // =========================

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [showModal, setShowModal] = useState(false);
  const [editingRoute, setEditingRoute] = useState(null);

  const [formData, setFormData] = useState({
    from: "",
    to: "",
    distance: "",
    walkingTime: "",
    isActive: true,
  });

  const [submitLoading, setSubmitLoading] = useState(false);

  // =========================
  // FETCH DATA
  // =========================

  useEffect(() => {
    dispatch(fetchRoutes());

    if (!locations.length) {
      dispatch(fetchLocations());
    }
  }, [dispatch, locations.length]);

  // =========================
  // FILTER ROUTES
  // =========================

  const filteredRoutes = useMemo(() => {
    return routes.filter((route) => {
      const fromName =
        route.from?.name ||
        route.fromLocation?.name ||
        "";

      const toName =
        route.to?.name ||
        route.toLocation?.name ||
        "";

      const searchText =
        `${fromName} ${toName}`.toLowerCase();

      const matchesSearch = searchText.includes(
        search.toLowerCase()
      );

      // Backend uses isActive
      // Old routes without isActive are treated as active
      const routeStatus =
        route.isActive === false
          ? "inactive"
          : "active";

      const matchesStatus =
        statusFilter === "all" ||
        routeStatus === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [routes, search, statusFilter]);

  // =========================
  // OPEN ADD MODAL
  // =========================

  const handleAddRoute = () => {
    setEditingRoute(null);

    setFormData({
      from: "",
      to: "",
      distance: "",
      walkingTime: "",
      isActive: true,
    });

    setShowModal(true);
  };

  // =========================
  // OPEN EDIT MODAL
  // =========================

  const handleEditRoute = (route) => {
    setEditingRoute(route);

    setFormData({
      from:
        route.from?._id ||
        route.from ||
        "",

      to:
        route.to?._id ||
        route.to ||
        "",

      distance:
        route.distance ?? "",

      walkingTime:
        route.walkingTime ?? "",

      // If old route doesn't have isActive,
      // consider it active
      isActive:
        route.isActive !== false,
    });

    setShowModal(true);
  };

  // =========================
  // FORM CHANGE
  // =========================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================
  // STATUS CHANGE
  // =========================

  const handleStatusChange = (e) => {
    const value = e.target.value;

    setFormData((prev) => ({
      ...prev,
      isActive: value === "active",
    }));
  };

  // =========================
  // SUBMIT
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (
      !formData.from ||
      !formData.to ||
      !formData.distance ||
      !formData.walkingTime
    ) {
      alert("Please fill all required fields.");
      return;
    }

    // Same location check
    if (formData.from === formData.to) {
      alert(
        "Starting location and destination cannot be same."
      );
      return;
    }

    const payload = {
      from: formData.from,
      to: formData.to,
      distance: Number(formData.distance),
      walkingTime: Number(formData.walkingTime),
      isActive: Boolean(formData.isActive),
    };

    try {
      setSubmitLoading(true);

      if (editingRoute) {
        await dispatch(
          editRoute({
            id: editingRoute._id,
            data: payload,
          })
        ).unwrap();
      } else {
        await dispatch(
          addRoute(payload)
        ).unwrap();
      }

      // Close modal
      setShowModal(false);

      // Reset form
      setEditingRoute(null);

      setFormData({
        from: "",
        to: "",
        distance: "",
        walkingTime: "",
        isActive: true,
      });

      // Refresh routes from backend
      dispatch(fetchRoutes());
    } catch (err) {
      console.error("Route submit error:", err);

      alert(
        typeof err === "string"
          ? err
          : "Failed to save route."
      );
    } finally {
      setSubmitLoading(false);
    }
  };

  // =========================
  // DELETE
  // =========================

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this route?"
    );

    if (!confirmed) return;

    try {
      await dispatch(
        removeRoute(id)
      ).unwrap();
    } catch (err) {
      console.error("Delete route error:", err);

      alert(
        typeof err === "string"
          ? err
          : "Failed to delete route."
      );
    }
  };

  // =========================
  // CLOSE MODAL
  // =========================

  const handleCloseModal = () => {
    if (submitLoading) return;

    setShowModal(false);
    setEditingRoute(null);

    setFormData({
      from: "",
      to: "",
      distance: "",
      walkingTime: "",
      isActive: true,
    });
  };

  // =========================
  // LOCATION NAME
  // =========================

  const getLocationName = (location) => {
    if (!location) {
      return "Unknown";
    }

    // Populated object
    if (typeof location === "object") {
      return location.name || "Unknown";
    }

    // ObjectId string
    const found = locations.find(
      (item) => item._id === location
    );

    return found?.name || "Unknown";
  };

  // =========================
  // STATS
  // =========================

  const totalRoutes = routes.length;

  const activeRoutes = routes.filter(
    (route) => route.isActive !== false
  ).length;

  const inactiveRoutes = routes.filter(
    (route) => route.isActive === false
  ).length;

  // =========================
  // UI
  // =========================

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ================= HEADER ================= */}

      <div className="border-b border-slate-200 bg-white">

        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            {/* TITLE */}

            <div>

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <RouteIcon size={20} />
                </div>

                <div>

                  <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                    Administration
                  </p>

                  <h1 className="text-2xl font-bold text-slate-900">
                    Route Management
                  </h1>

                </div>

              </div>

              <p className="mt-2 text-sm text-slate-500">
                Manage campus walking routes and navigation paths.
              </p>

            </div>

            {/* ADD BUTTON */}

            <button
              type="button"
              onClick={handleAddRoute}
              className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
            >
              <Plus size={18} />
              Add Route
            </button>

          </div>

        </div>

      </div>

      {/* ================= CONTENT ================= */}

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

        {/* ================= STATS ================= */}

        <div className="mb-6 grid gap-4 sm:grid-cols-3">

          {/* TOTAL */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm text-slate-500">
                  Total Routes
                </p>

                <p className="mt-1 text-2xl font-bold text-slate-900">
                  {totalRoutes}
                </p>

              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <RouteIcon size={21} />
              </div>

            </div>

          </div>

          {/* ACTIVE */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm text-slate-500">
                  Active Routes
                </p>

                <p className="mt-1 text-2xl font-bold text-slate-900">
                  {activeRoutes}
                </p>

              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-green-600">
                <CheckCircle2 size={21} />
              </div>

            </div>

          </div>

          {/* INACTIVE */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm text-slate-500">
                  Inactive Routes
                </p>

                <p className="mt-1 text-2xl font-bold text-slate-900">
                  {inactiveRoutes}
                </p>

              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600">
                <XCircle size={21} />
              </div>

            </div>

          </div>

        </div>

        {/* ================= TABLE CARD ================= */}

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          {/* TOOLBAR */}

          <div className="flex flex-col gap-3 border-b border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between">

            {/* SEARCH */}

            <div className="relative w-full sm:max-w-sm">

              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                placeholder="Search routes..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-4 text-sm outline-none focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50"
              />

            </div>

            {/* STATUS FILTER */}

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 outline-none focus:border-blue-400"
            >

              <option value="all">
                All Status
              </option>

              <option value="active">
                Active
              </option>

              <option value="inactive">
                Inactive
              </option>

            </select>

          </div>

          {/* ERROR */}

          {error && (
            <div className="m-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* LOADING */}

          {loading ? (

            <div className="flex min-h-[250px] items-center justify-center">

              <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

            </div>

          ) : filteredRoutes.length === 0 ? (

            /* EMPTY */

            <div className="flex min-h-[300px] flex-col items-center justify-center px-6 text-center">

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                <RouteIcon size={25} />
              </div>

              <h3 className="mt-4 font-semibold text-slate-800">
                No routes found
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                {search || statusFilter !== "all"
                  ? "Try changing your search or filter."
                  : "Create your first campus route to get started."}
              </p>

            </div>

          ) : (

            /* TABLE */

            <div className="overflow-x-auto">

              <table className="w-full min-w-[850px]">

                <thead className="bg-slate-50">

                  <tr>

                    <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                      From
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                      To
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                      Distance
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                      Walking Time
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                      Status
                    </th>

                    <th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-wide text-slate-500">
                      Actions
                    </th>

                  </tr>

                </thead>

                <tbody className="divide-y divide-slate-100">

                  {filteredRoutes.map((route) => {

                    // IMPORTANT:
                    // Backend field = isActive
                    const isActive =
                      route.isActive !== false;

                    return (

                      <tr
                        key={route._id}
                        className="transition hover:bg-slate-50"
                      >

                        {/* FROM */}

                        <td className="px-5 py-4">

                          <div className="flex items-center gap-3">

                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                              <MapPin size={17} />
                            </div>

                            <span className="text-sm font-semibold text-slate-800">
                              {getLocationName(route.from)}
                            </span>

                          </div>

                        </td>

                        {/* TO */}

                        <td className="px-5 py-4">

                          <div className="flex items-center gap-3">

                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-500">

                              <NavigationIcon />

                            </div>

                            <span className="text-sm font-semibold text-slate-800">
                              {getLocationName(route.to)}
                            </span>

                          </div>

                        </td>

                        {/* DISTANCE */}

                        <td className="px-5 py-4">

                          <span className="text-sm font-semibold text-slate-700">
                            {route.distance} m
                          </span>

                        </td>

                        {/* WALKING TIME */}

                        <td className="px-5 py-4">

                          <div className="flex items-center gap-1.5 text-sm text-slate-600">

                            <Clock size={15} />

                            {route.walkingTime} min

                          </div>

                        </td>

                        {/* STATUS */}

                        <td className="px-5 py-4">

                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                              isActive
                                ? "bg-green-50 text-green-600"
                                : "bg-red-50 text-red-600"
                            }`}
                          >

                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                isActive
                                  ? "bg-green-500"
                                  : "bg-red-500"
                              }`}
                            />

                            {isActive
                              ? "Active"
                              : "Inactive"}

                          </span>

                        </td>

                        {/* ACTIONS */}

                        <td className="px-5 py-4">

                          <div className="flex justify-end gap-2">

                            {/* EDIT */}

                            <button
                              type="button"
                              onClick={() =>
                                handleEditRoute(route)
                              }
                              title="Edit Route"
                              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                            >

                              <Pencil size={16} />

                            </button>

                            {/* DELETE */}

                            <button
                              type="button"
                              onClick={() =>
                                handleDelete(route._id)
                              }
                              title="Delete Route"
                              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                            >

                              <Trash2 size={16} />

                            </button>

                          </div>

                        </td>

                      </tr>

                    );

                  })}

                </tbody>

              </table>

            </div>

          )}

        </div>

      </div>

      {/* ================= MODAL ================= */}

      {showModal && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">

          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">

            {/* MODAL HEADER */}

            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">

              <div>

                <h2 className="font-bold text-slate-900">

                  {editingRoute
                    ? "Edit Route"
                    : "Add New Route"}

                </h2>

                <p className="mt-0.5 text-xs text-slate-500">
                  Configure campus walking route
                </p>

              </div>

              <button
                type="button"
                onClick={handleCloseModal}
                disabled={submitLoading}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
              >

                <X size={18} />

              </button>

            </div>

            {/* FORM */}

            <form
              onSubmit={handleSubmit}
              className="space-y-5 p-5"
            >

              {/* FROM */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Starting Location
                </label>

                <select
                  name="from"
                  value={formData.from}
                  onChange={handleChange}
                  required
                  disabled={submitLoading}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50 disabled:cursor-not-allowed disabled:opacity-60"
                >

                  <option value="">
                    Select starting location
                  </option>

                  {locations.map((location) => (

                    <option
                      key={location._id}
                      value={location._id}
                    >
                      {location.name}
                    </option>

                  ))}

                </select>

              </div>

              {/* TO */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Destination
                </label>

                <select
                  name="to"
                  value={formData.to}
                  onChange={handleChange}
                  required
                  disabled={submitLoading}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50 disabled:cursor-not-allowed disabled:opacity-60"
                >

                  <option value="">
                    Select destination
                  </option>

                  {locations.map((location) => (

                    <option
                      key={location._id}
                      value={location._id}
                    >
                      {location.name}
                    </option>

                  ))}

                </select>

              </div>

              {/* DISTANCE + TIME */}

              <div className="grid gap-4 sm:grid-cols-2">

                {/* DISTANCE */}

                <div>

                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Distance (meters)
                  </label>

                  <input
                    type="number"
                    name="distance"
                    min="1"
                    value={formData.distance}
                    onChange={handleChange}
                    placeholder="e.g. 150"
                    required
                    disabled={submitLoading}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50 disabled:cursor-not-allowed disabled:opacity-60"
                  />

                </div>

                {/* WALKING TIME */}

                <div>

                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Walking Time (min)
                  </label>

                  <input
                    type="number"
                    name="walkingTime"
                    min="1"
                    value={formData.walkingTime}
                    onChange={handleChange}
                    placeholder="e.g. 2"
                    required
                    disabled={submitLoading}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50 disabled:cursor-not-allowed disabled:opacity-60"
                  />

                </div>

              </div>

              {/* STATUS */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Status
                </label>

                <select
                  name="isActive"
                  value={
                    formData.isActive
                      ? "active"
                      : "inactive"
                  }
                  onChange={handleStatusChange}
                  disabled={submitLoading}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50 disabled:cursor-not-allowed disabled:opacity-60"
                >

                  <option value="active">
                    Active
                  </option>

                  <option value="inactive">
                    Inactive
                  </option>

                </select>

              </div>

              {/* BUTTONS */}

              <div className="flex gap-3 pt-2">

                <button
                  type="button"
                  onClick={handleCloseModal}
                  disabled={submitLoading}
                  className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitLoading}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
                >

                  {submitLoading && (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  )}

                  {submitLoading
                    ? "Saving..."
                    : editingRoute
                      ? "Update Route"
                      : "Create Route"}

                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
};

/* =========================
   DESTINATION ICON
========================= */

const NavigationIcon = () => (
  <svg
    width="17"
    height="17"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="3 11 22 2 13 21 11 13 3 11" />
  </svg>
);

export default RouteManagement;