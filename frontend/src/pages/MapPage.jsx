import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Search,
  SlidersHorizontal,
  Navigation,
  X,
} from "lucide-react";

import { fetchBuildings, setCurrentBuilding } from "../redux/slices/buildingSlice";
import { fetchRoads } from "../redux/slices/roadSlice";
import { fetchCampusElements } from "../redux/slices/campusElementSlice";
import { fetchLocations } from "../redux/slices/locationSlice";
import {
  setSelectedLocation,
} from "../redux/slices/locationSlice";
import { fetchRoutes } from "../redux/slices/routeSlice";
import CampusMap from "../components/AdminCampusBuilder/CampusMap";

const MapPage = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    locations,
    loading,
    error,
    selectedLocation,
  } = useSelector((state) => state.locations);
  const { buildings = [] } = useSelector((state) => state.buildings || {});
  const { roads = [] } = useSelector((state) => state.roads || {});
  const { elements: campusElements = [] } = useSelector((state) => state.campusElements || {});
const {
  routes,
  loading: routesLoading,
  error: routesError,
} = useSelector((state) => state.routes);
console.log("ROUTES:", routes);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const mapCanvasRef = useRef(null);

  useEffect(() => {
    if (!locations.length) {
      dispatch(fetchLocations());
    }
  }, [dispatch, locations.length]);

  useEffect(() => {
    if (!buildings.length) dispatch(fetchBuildings());
    if (!roads.length) dispatch(fetchRoads());
    if (!campusElements.length) dispatch(fetchCampusElements());
  }, [dispatch, buildings.length, roads.length, campusElements.length]);

  const categories = useMemo(() => {

    const uniqueCategories = [
      ...new Set(
        locations.map((location) => location.category)
      ),
    ];

    return ["All", ...uniqueCategories];

  }, [locations]);
  useEffect(() => {
  if (!routes.length) {
    dispatch(fetchRoutes());
  }
}, [dispatch, routes.length]);

  const filteredLocations = useMemo(() => {

    return locations.filter((location) => {

      const matchesSearch =
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

  const handleOpenBuilding = (building) => {
    dispatch(setCurrentBuilding(building));
    navigate("/campus-3d");
  };

  const clearSelection = () => {
    dispatch(setSelectedLocation(null));
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50">

      {/* Page Header */}
      <div className="border-b border-slate-200 bg-white">

        <div className="mx-auto max-w-[1600px] px-4 py-5 sm:px-6 lg:px-8">

          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

            <div>

              <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                Navigation
              </p>

              <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
                Campus Map
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Explore buildings and important locations.
              </p>

            </div>

            {/* Search */}
            <div className="relative w-full lg:max-w-md">

              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search campus location..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50"
              />

            </div>

          </div>

          {/* Categories */}
          <div className="mt-5 flex gap-2 overflow-x-auto pb-1">

            <SlidersHorizontal
              size={18}
              className="mt-2 shrink-0 text-slate-400"
            />

            {categories.map((item) => (

              <button
                key={item}
                onClick={() => setCategory(item)}
                className={`whitespace-nowrap rounded-lg px-4 py-2 text-xs font-semibold transition ${
                  category === item
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {item}
              </button>

            ))}

          </div>

        </div>

      </div>

      {/* Map Area */}
      <div className="mx-auto max-w-[1600px] p-4 sm:p-6 lg:p-8">

        <div className="relative h-[calc(100vh-230px)] min-h-[550px]">

          {loading ? (

            <div className="flex h-full items-center justify-center rounded-2xl border border-slate-200 bg-white">
              <div className="text-center">

                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600" />

                <p className="mt-3 text-sm text-slate-500">
                  Loading campus map...
                </p>

              </div>
            </div>

          ) : error ? (

            <div className="flex h-full items-center justify-center rounded-2xl border border-red-100 bg-red-50">
              <p className="text-sm text-red-600">
                {error}
              </p>
            </div>

          ) : (

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
              locations={filteredLocations}
              selectedLocation={selectedLocation}
              onLocationClick={handleLocationClick}
              handleOpenBuilding={handleOpenBuilding}
              readOnly={true}
              fitToContainer={true}
            />

          )}

          {/* Location Details Panel */}
          {selectedLocation && (

            <div className="absolute bottom-4 right-4 z-30 w-[calc(100%-32px)] max-w-sm overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl sm:bottom-6 sm:right-6">

              {/* Header */}
              <div className="flex items-start justify-between border-b border-slate-100 p-5">

                <div>

                  <span className="rounded-md bg-blue-50 px-2 py-1 text-[10px] font-bold uppercase text-blue-600">
                    {selectedLocation.category}
                  </span>

                  <h2 className="mt-2 text-lg font-bold text-slate-900">
                    {selectedLocation.name}
                  </h2>

                </div>

                <button
                  onClick={clearSelection}
                  className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                >
                  <X size={18} />
                </button>

              </div>

              {/* Content */}
              <div className="p-5">

                <p className="text-sm leading-6 text-slate-500">
                  {selectedLocation.description}
                </p>

                <div className="mt-4 grid grid-cols-2 gap-3">

                  <div className="rounded-xl bg-slate-50 p-3">
                    <p className="text-[10px] font-semibold uppercase text-slate-400">
                      Position
                    </p>

                    <p className="mt-1 text-xs font-semibold text-slate-700">
                      X: {selectedLocation.x}
                    </p>

                    <p className="text-xs font-semibold text-slate-700">
                      Y: {selectedLocation.y}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-3">
                    <p className="text-[10px] font-semibold uppercase text-slate-400">
                      Status
                    </p>

                    <p className="mt-1 text-xs font-semibold text-green-600">
                      Active
                    </p>
                  </div>

                </div>

                {/* Actions */}
                <div className="mt-4 flex gap-2">

                  <a
                    href={`/locations/${selectedLocation._id}`}
                    className="flex flex-1 items-center justify-center rounded-xl bg-slate-100 px-4 py-3 text-xs font-semibold text-slate-700 transition hover:bg-slate-200"
                  >
                    View Details
                  </a>

                  <a
                    href={`/directions?to=${selectedLocation._id}`}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-xs font-semibold text-white transition hover:bg-blue-700"
                  >
                    <Navigation size={15} />
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