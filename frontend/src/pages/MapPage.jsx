import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Search,
  SlidersHorizontal,
  Navigation,
  X,
} from "lucide-react";

import {
  fetchBuildings,
  setCurrentBuilding,
} from "../redux/slices/buildingSlice";

import { fetchRoads } from "../redux/slices/roadSlice";

import {
  fetchCampusElements,
} from "../redux/slices/campusElementSlice";

import {
  fetchLocations,
  setSelectedLocation,
} from "../redux/slices/locationSlice";

import {
  fetchRoutes,
} from "../redux/slices/routeSlice";

import CampusMap from "../components/AdminCampusBuilder/CampusMap";

const MapPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  /* =========================================================
     REDUX
  ========================================================= */

  const {
    locations,
    loading,
    error,
    selectedLocation,
  } = useSelector((state) => state.locations);

  const {
    buildings = [],
  } = useSelector((state) => state.buildings || {});

  const {
    roads = [],
  } = useSelector((state) => state.roads || {});

  const {
    elements: campusElements = [],
  } = useSelector(
    (state) => state.campusElements || {}
  );

  const {
    routes,
    loading: routesLoading,
    error: routesError,
  } = useSelector((state) => state.routes);

  console.log("ROUTES:", routes);

  /* =========================================================
     STATE
  ========================================================= */

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const mapCanvasRef = useRef(null);

  /* =========================================================
     FETCH LOCATIONS
  ========================================================= */

  useEffect(() => {
    if (!locations.length) {
      dispatch(fetchLocations());
    }
  }, [dispatch, locations.length]);

  /* =========================================================
     FETCH BUILDINGS / ROADS / CAMPUS ELEMENTS
  ========================================================= */

  useEffect(() => {
    if (!buildings.length) {
      dispatch(fetchBuildings());
    }

    if (!roads.length) {
      dispatch(fetchRoads());
    }

    if (!campusElements.length) {
      dispatch(fetchCampusElements());
    }
  }, [
    dispatch,
    buildings.length,
    roads.length,
    campusElements.length,
  ]);

  /* =========================================================
     FETCH ROUTES
  ========================================================= */

  useEffect(() => {
    if (!routes.length) {
      dispatch(fetchRoutes());
    }
  }, [dispatch, routes.length]);

  /* =========================================================
     CATEGORIES
  ========================================================= */

  const categories = useMemo(() => {
    const uniqueCategories = [
      ...new Set(
        locations
          .map((location) => location.category)
          .filter(Boolean)
      ),
    ];

    return ["All", ...uniqueCategories];
  }, [locations]);

  /* =========================================================
     FILTER LOCATIONS
  ========================================================= */

  const filteredLocations = useMemo(() => {
    return locations.filter((location) => {
      const matchesSearch =
        !search ||
        location.name
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        location.description
          ?.toLowerCase()
          .includes(search.toLowerCase());

      const matchesCategory =
        category === "All" ||
        location.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [locations, search, category]);

  /* =========================================================
     LOCATION CLICK
  ========================================================= */

  const handleLocationClick = (location) => {
    dispatch(setSelectedLocation(location));

    const locationBuildingId =
      typeof location.buildingId === "object"
        ? location.buildingId?._id
        : location.buildingId;

    const building = buildings.find(
      (item) =>
        item._id === locationBuildingId ||
        item.name === location.building
    );

    if (building) {
      dispatch(setCurrentBuilding(building));
      navigate("/campus-3d");
    }
  };

  /* =========================================================
     OPEN BUILDING
  ========================================================= */

  const handleOpenBuilding = (building) => {
    dispatch(setCurrentBuilding(building));
    navigate("/campus-3d");
  };

  /* =========================================================
     CLEAR SELECTION
  ========================================================= */

  const clearSelection = () => {
    dispatch(setSelectedLocation(null));
  };

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-64px)] items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

          <p className="text-sm font-medium text-slate-600">
            Loading campus map...
          </p>
        </div>
      </div>
    );
  }

  /* =========================================================
     ERROR
  ========================================================= */

  if (error) {
    return (
      <div className="flex h-[calc(100vh-64px)] items-center justify-center bg-slate-50 p-6">
        <div className="w-full max-w-md rounded-2xl border border-red-200 bg-white p-6 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
            !
          </div>

          <h2 className="text-lg font-semibold text-slate-900">
            Unable to load campus map
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            {error}
          </p>

          <button
            onClick={() => dispatch(fetchLocations())}
            className="mt-5 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  /* =========================================================
     MAIN PAGE
  ========================================================= */

  return (
    <div className="flex h-[calc(100vh-64px)] min-h-0 flex-col overflow-hidden bg-slate-50">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="shrink-0 border-b border-slate-200 bg-white">
        <div className="px-4 py-4 sm:px-6 lg:px-8">

          {/* TOP ROW */}

          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">

            {/* TITLE */}

            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                  <Navigation size={20} />
                </div>

                <div>
                  <h1 className="text-xl font-bold text-slate-900">
                    Campus Map
                  </h1>

                  <p className="text-sm text-slate-500">
                    Explore buildings, roads and campus locations
                  </p>
                </div>
              </div>
            </div>

            {/* SEARCH + FILTER */}

            <div className="flex flex-col gap-3 sm:flex-row">

              {/* SEARCH */}

              <div className="relative w-full sm:w-72">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  placeholder="Search location..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* CATEGORY */}

              <div className="relative">
                <SlidersHorizontal
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <select
                  value={category}
                  onChange={(event) =>
                    setCategory(event.target.value)
                  }
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-9 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100 sm:w-48"
                >
                  {categories.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

            </div>
          </div>

          {/* RESULT COUNT */}

          <div className="mt-3 flex items-center justify-between">
            <p className="text-xs text-slate-500">
              Showing{" "}
              <span className="font-semibold text-slate-700">
                {filteredLocations.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-slate-700">
                {locations.length}
              </span>{" "}
              locations
            </p>

            {(search || category !== "All") && (
              <button
                onClick={() => {
                  setSearch("");
                  setCategory("All");
                }}
                className="flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-700"
              >
                <X size={14} />
                Clear filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* =====================================================
          FULL SCREEN MAP AREA
      ===================================================== */}

      <div className="min-h-0 flex-1 w-full p-3 sm:p-4 lg:p-5">

        <div className="relative h-full min-h-0 w-full">

          <CampusMap
            campusCanvasRef={mapCanvasRef}

            /* Keep your existing campus dimensions */
            campusWidth={1400}
            campusHeight={900}

            showGrid={true}
            mapView="2d"
            activeTool="select"

            buildings={buildings}
            campusRoads={roads}
            campusElements={campusElements}

            locations={filteredLocations}
            selectedLocation={selectedLocation}

            onLocationClick={handleLocationClick}

            handleOpenBuilding={handleOpenBuilding}

            /* User side = read only */
            readOnly={true}

            /*
              IMPORTANT:
              true means map viewport takes
              complete available page area.
            */
            fitToContainer={true}
          />

          {/* =================================================
              LOCATION DETAILS PANEL
          ================================================= */}

          {selectedLocation && (
            <div className="absolute right-4 top-4 z-[3000] w-[320px] max-w-[calc(100%-2rem)] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">

              {/* HEADER */}

              <div className="flex items-start justify-between border-b border-slate-100 p-4">

                <div className="min-w-0 pr-3">
                  <div className="mb-1 inline-flex rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-600">
                    {selectedLocation.category || "Location"}
                  </div>

                  <h2 className="truncate text-lg font-bold text-slate-900">
                    {selectedLocation.name}
                  </h2>
                </div>

                <button
                  onClick={clearSelection}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                >
                  <X size={18} />
                </button>
              </div>

              {/* BODY */}

              <div className="space-y-4 p-4">

                {/* DESCRIPTION */}

                {selectedLocation.description && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Description
                    </p>

                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      {selectedLocation.description}
                    </p>
                  </div>
                )}

                {/* POSITION */}

                <div className="grid grid-cols-2 gap-3">

                  <div className="rounded-xl bg-slate-50 p-3">
                    <p className="text-xs text-slate-400">
                      X Position
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-700">
                      {selectedLocation.x ?? "-"}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-3">
                    <p className="text-xs text-slate-400">
                      Y Position
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-700">
                      {selectedLocation.y ?? "-"}
                    </p>
                  </div>

                </div>

                {/* STATUS */}

                <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-3">
                  <span className="text-sm text-slate-500">
                    Status
                  </span>

                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                      selectedLocation.isActive
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {selectedLocation.isActive
                      ? "Active"
                      : "Inactive"}
                  </span>
                </div>

                {/* ACTIONS */}

                <div className="grid grid-cols-2 gap-3">

                  <a
                    href={`/locations/${selectedLocation._id}`}
                    className="rounded-xl bg-slate-100 px-4 py-2.5 text-center text-sm font-medium text-slate-700 transition hover:bg-slate-200"
                  >
                    View Details
                  </a>

                  <a
                    href={`/directions?to=${selectedLocation._id}`}
                    className="rounded-xl bg-blue-600 px-4 py-2.5 text-center text-sm font-medium text-white transition hover:bg-blue-700"
                  >
                    Direction
                  </a>

                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MapPage;