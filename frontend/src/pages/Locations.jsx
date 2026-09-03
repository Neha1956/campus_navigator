import { useEffect, useMemo, useState } from "react";

import {
  Search,
  SlidersHorizontal,
  MapPinned,
  Building2,
  Library,
  Utensils,
  DoorOpen,
  GraduationCap,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { useDispatch, useSelector } from "react-redux";

import {
  fetchLocations,
} from "../redux/slices/locationSlice";

import LocationGrid from "../components/location/LocationGrid";
import Loader from "../components/common/Loader";

const ITEMS_PER_PAGE = 8; // Ek page par kitne locations dikhane hain

const Locations = () => {

  const dispatch = useDispatch();

  const {
    locations,
    loading,
    error,
  } = useSelector((state) => state.locations);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(fetchLocations());
  }, [dispatch]);

  // Categories dynamically generated
  const categories = useMemo(() => {
    const uniqueCategories = [
      ...new Set(
        locations.map((location) => location.category)
      ),
    ];
    return ["All", ...uniqueCategories];
  }, [locations]);

  // Filter
  const filteredLocations = useMemo(() => {
    return locations.filter((location) => {
      const searchText = search.toLowerCase().trim();

      const matchesSearch =
        location.name
          ?.toLowerCase()
          .includes(searchText) ||
        location.description
          ?.toLowerCase()
          .includes(searchText) ||
        location.category
          ?.toLowerCase()
          .includes(searchText);

      const matchesCategory =
        category === "All" ||
        location.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [locations, search, category]);

  // Reset to page 1 whenever search or category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search, category]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredLocations.length / ITEMS_PER_PAGE);

  const paginatedLocations = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredLocations.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredLocations, currentPage]);

  const getCategoryIcon = (item) => {
    switch (item.toLowerCase()) {
      case "library":
        return <Library size={15} />;
      case "canteen":
        return <Utensils size={15} />;
      case "gate":
        return <DoorOpen size={15} />;
      case "department":
        return <GraduationCap size={15} />;
      case "admin":
        return <Building2 size={15} />;
      default:
        return <MapPinned size={15} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Header */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-[1600px] px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-2 text-blue-600">
                <MapPinned size={20} />
                <span className="text-sm font-semibold">
                  Campus Directory
                </span>
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Campus Locations
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
                Explore buildings, departments, library,
                canteen, gates and other important places
                around the campus.
              </p>
            </div>

            {/* Total */}
            <div className="flex w-fit items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                <Building2 size={20} />
              </div>

              <div>
                <p className="text-xs text-slate-500">
                  Total Locations
                </p>

                <p className="text-xl font-bold text-slate-900">
                  {locations.length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main */}
      <main className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">

        {/* Search + Filter */}
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-4">

            {/* Search */}
            <div className="relative">
              <Search
                size={19}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search buildings, departments, library..."
                className="
                  h-12
                  w-full
                  rounded-xl
                  border
                  border-slate-200
                  bg-slate-50
                  pl-11
                  pr-11
                  text-sm
                  text-slate-800
                  outline-none
                  transition
                  placeholder:text-slate-400
                  focus:border-blue-400
                  focus:bg-white
                  focus:ring-4
                  focus:ring-blue-50
                "
              />

              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                >
                  <X size={17} />
                </button>
              )}
            </div>

            {/* Category */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <div className="mr-1 hidden shrink-0 items-center gap-2 text-sm font-medium text-slate-500 sm:flex">
                <SlidersHorizontal size={16} />
                Filter:
              </div>

              {categories.map((item) => {
                const active = category === item;

                return (
                  <button
                    key={item}
                    onClick={() => setCategory(item)}
                    className={`
                      flex
                      shrink-0
                      items-center
                      gap-2
                      rounded-xl
                      px-4
                      py-2.5
                      text-sm
                      font-semibold
                      transition
                      ${
                        active
                          ? "bg-blue-600 text-white shadow-md shadow-blue-100"
                          : "bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-600"
                      }
                    `}
                  >
                    {getCategoryIcon(item)}
                    {item}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Result information */}
        {!loading && !error && (
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-slate-500">
              Showing{" "}
              <span className="font-semibold text-slate-800">
                {filteredLocations.length > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0}
              </span>{" "}
              -{" "}
              <span className="font-semibold text-slate-800">
                {Math.min(currentPage * ITEMS_PER_PAGE, filteredLocations.length)}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-slate-800">
                {filteredLocations.length}
              </span>{" "}
              locations

              {category !== "All" && (
                <>
                  {" "}in{" "}
                  <span className="font-semibold text-blue-600">
                    {category}
                  </span>
                </>
              )}
            </p>

            {search && (
              <p className="text-xs text-slate-400">
                Search: "{search}"
              </p>
            )}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <Loader text="Loading campus locations..." />
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
            <p className="font-semibold text-red-700">
              Unable to load locations
            </p>
            <p className="mt-1 text-sm text-red-500">
              {error}
            </p>
            <button
              onClick={() => dispatch(fetchLocations())}
              className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Locations Grid */}
        {!loading && !error && (
          <>
            <LocationGrid
              locations={paginatedLocations}
            />

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-2">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft size={16} />
                  Previous
                </button>

                <div className="flex items-center gap-1 px-3 text-sm font-semibold text-slate-600">
                  Page <span className="text-blue-600 mx-1">{currentPage}</span> of {totalPages}
                </div>

                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </>
        )}

      </main>
    </div>
  );
};

export default Locations;