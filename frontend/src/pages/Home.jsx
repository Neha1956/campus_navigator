import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  MapPinned,
  Navigation,
  Building2,
  ArrowRight,
  Search,
} from "lucide-react";

import { fetchLocations } from "../redux/slices/locationSlice";

const Home = () => {

  const dispatch = useDispatch();

  const {
    locations,
    loading,
    error,
  } = useSelector((state) => state.locations);

  useEffect(() => {
    dispatch(fetchLocations());
  }, [dispatch]);

  return (
    <div>

      {/* HERO */}
      <section className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-br from-blue-50 via-white to-slate-50">

        {/* Decorative circles */}
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-blue-100/60 blur-3xl" />

        <div className="relative mx-auto grid max-w-[1600px] items-center gap-10 px-5 py-16 sm:px-8 lg:grid-cols-2 lg:px-12 lg:py-24">

          {/* Left */}
          <div>

            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-3 py-1.5 text-xs font-semibold text-blue-600 shadow-sm">

              <span className="h-2 w-2 rounded-full bg-blue-600" />

              Smart Campus Navigation

            </div>

            <h1 className="max-w-3xl text-4xl font-bold leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">

              Explore Your Campus

              <span className="block text-blue-600">
                With Ease
              </span>

            </h1>

            <p className="mt-6 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">

              Find buildings, departments, libraries, canteens and
              other important campus locations with our interactive
              campus navigation system.

            </p>

            {/* Buttons */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">

              <a
                href="/map"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
              >
                <MapPinned size={18} />
                Explore Campus Map
                <ArrowRight size={17} />
              </a>

              <a
                href="/directions"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:text-blue-600"
              >
                <Navigation size={18} />
                Get Directions
              </a>

            </div>

          </div>

          {/* Right Preview */}
          <div className="relative">

            <div className="rounded-3xl border border-slate-200 bg-white p-3 shadow-2xl shadow-slate-200/60">

              <div className="flex h-[300px] items-center justify-center rounded-2xl bg-slate-100 sm:h-[380px]">

                <div className="text-center">

                  <MapPinned
                    size={58}
                    className="mx-auto text-blue-600"
                  />

                  <h3 className="mt-4 text-lg font-bold text-slate-800">
                    Interactive Campus Map
                  </h3>

                  <p className="mt-2 text-sm text-slate-500">
                    Find your destination easily
                  </p>

                  <a
                    href="/map"
                    className="mt-5 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white"
                  >
                    Open Map
                    <ArrowRight size={16} />
                  </a>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* LOCATIONS */}
      <section className="mx-auto max-w-[1600px] px-5 py-12 sm:px-8 lg:px-12">

        <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">

          <div>

            <p className="text-sm font-semibold text-blue-600">
              CAMPUS DIRECTORY
            </p>

            <h2 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
              Popular Locations
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Quickly find important places around campus.
            </p>

          </div>

          <a
            href="/locations"
            className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            View all
            <ArrowRight size={16} />
          </a>

        </div>

        {/* Loading */}
        {loading && (
          <div className="py-12 text-center text-sm text-slate-500">
            Loading campus locations...
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

{/* Cards */}
{!loading && !error && (
  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">

    {locations.map((location) => {

      // Primary uploaded image
      // Agar image nahi hai to fallback icon dikhega
      const imageUrl =
        typeof location.image === "string"
          ? location.image
          : location.image?.url;

      return (
        <a
          href={`/locations/${location._id}`}
          key={location._id}
          className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-slate-200/50"
        >

          {/* Location Image */}
          <div className="relative h-48 overflow-hidden bg-gradient-to-br from-blue-50 via-white to-slate-100">

            {imageUrl ? (
              <img
                src={imageUrl}
                alt={location.name}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
                  <Building2 size={28} />
                </div>
              </div>
            )}

            {/* Arrow */}
            <div className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-slate-500 shadow-sm backdrop-blur-sm transition group-hover:bg-blue-600 group-hover:text-white">
              <ArrowRight
                size={18}
                className="transition group-hover:translate-x-1"
              />
            </div>

          </div>

          {/* Content */}
          <div className="p-5">

            <h3 className="text-base font-bold text-slate-900">
              {location.name}
            </h3>

            <span className="mt-2 inline-block rounded-md bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-600">
              {location.category}
            </span>

            <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-500">
              {location.description || "No description available."}
            </p>

          </div>

        </a>
      );
    })}

  </div>
)}



      </section>

    </div>
  );
};

export default Home;