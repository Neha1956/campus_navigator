import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CheckCircle2,
  Compass,
  DoorOpen,
  Library,
  MapPin,
  Navigation,
  Utensils,
} from "lucide-react";

import {
  fetchLocationById,
  clearSelectedLocation,
} from "../redux/slices/locationSlice";

import Loader from "../components/common/Loader";


const LocationDetailsPage = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const {
    selectedLocation,
    loading,
    error,
  } = useSelector((state) => state.locations);


  useEffect(() => {
    dispatch(fetchLocationById(id));

    return () => {
      dispatch(clearSelectedLocation());
    };
  }, [dispatch, id]);


  const getIcon = () => {
    if (!selectedLocation) return <Building2 size={36} />;

    switch (selectedLocation.icon) {
      case "library":
        return <Library size={36} />;

      case "utensils":
        return <Utensils size={36} />;

      case "gate":
        return <DoorOpen size={36} />;

      case "building":
        return <Building2 size={36} />;

      default:
        return <Building2 size={36} />;
    }
  };


  if (loading) {
    return (
      <Loader text="Loading location details..." />
    );
  }


  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-10">
        <div className="mx-auto max-w-2xl rounded-2xl border border-red-200 bg-red-50 p-8 text-center">

          <h2 className="text-xl font-bold text-red-700">
            Unable to load location
          </h2>

          <p className="mt-2 text-sm text-red-500">
            {error}
          </p>

          <button
            onClick={() => navigate("/locations")}
            className="mt-6 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-600"
          >
            Back to Locations
          </button>

        </div>
      </div>
    );
  }


  if (!selectedLocation) {
    return null;
  }


  return (
    <div className="min-h-screen bg-slate-50">

      {/* Header */}
      <div className="border-b border-slate-200 bg-white">

        <div className="mx-auto max-w-[1400px] px-4 py-5 sm:px-6 lg:px-8">

          <button
            onClick={() => navigate("/locations")}
            className="group flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-blue-600"
          >
            <ArrowLeft
              size={18}
              className="transition-transform group-hover:-translate-x-1"
            />

            Back to Locations
          </button>

        </div>

      </div>


      {/* Main */}
      <main className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8 lg:py-10">

        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">


          {/* LEFT - Visual */}
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

            <div className="relative flex min-h-[360px] items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-slate-100 sm:min-h-[500px]">

              {/* Decorative circles */}
              <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-blue-100/60 blur-3xl" />

              <div className="absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-slate-200/70 blur-3xl" />


              {/* Icon */}
              <div className="relative flex h-32 w-32 items-center justify-center rounded-[2rem] bg-white text-blue-600 shadow-xl ring-1 ring-slate-100">

                {getIcon()}

              </div>


              {/* Status */}
              <div className="absolute right-5 top-5">

                {selectedLocation.isActive ? (
                  <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-600 ring-1 ring-emerald-100">

                    <CheckCircle2 size={15} />

                    Active Location

                  </div>
                ) : (
                  <div className="rounded-full bg-red-50 px-3 py-2 text-xs font-semibold text-red-600">
                    Inactive
                  </div>
                )}

              </div>

            </div>


            {/* Visual Footer */}
            <div className="border-t border-slate-100 p-5 sm:p-6">

              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <MapPin size={21} />
                </div>

                <div>

                  <p className="text-xs text-slate-400">
                    Campus Coordinates
                  </p>

                  <p className="mt-0.5 font-semibold text-slate-800">
                    X: {selectedLocation.x} &nbsp;•&nbsp;
                    Y: {selectedLocation.y}
                  </p>

                </div>

              </div>

            </div>

          </div>


          {/* RIGHT - Details */}
          <div className="flex flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

            {/* Category */}
            <div className="mb-5 flex items-center gap-2">

              <span className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-blue-600">
                {selectedLocation.category}
              </span>

            </div>


            {/* Title */}
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              {selectedLocation.name}
            </h1>


            {/* Description */}
            <p className="mt-4 text-sm leading-7 text-slate-500 sm:text-base">
              {selectedLocation.description ||
                "No description available for this location."}
            </p>


            {/* Information */}
            <div className="mt-8 space-y-3">

              <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-4">

                <div className="flex items-center gap-3">

                  <MapPin
                    size={18}
                    className="text-blue-600"
                  />

                  <span className="text-sm font-medium text-slate-600">
                    Location
                  </span>

                </div>

                <span className="text-sm font-semibold text-slate-900">
                  Campus
                </span>

              </div>


              <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-4">

                <div className="flex items-center gap-3">

                  <Compass
                    size={18}
                    className="text-blue-600"
                  />

                  <span className="text-sm font-medium text-slate-600">
                    Position
                  </span>

                </div>

                <span className="text-sm font-semibold text-slate-900">
                  {selectedLocation.x}, {selectedLocation.y}
                </span>

              </div>


              <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-4">

                <div className="flex items-center gap-3">

                  <CheckCircle2
                    size={18}
                    className={
                      selectedLocation.isActive
                        ? "text-emerald-500"
                        : "text-red-500"
                    }
                  />

                  <span className="text-sm font-medium text-slate-600">
                    Status
                  </span>

                </div>

                <span
                  className={`text-sm font-semibold ${
                    selectedLocation.isActive
                      ? "text-emerald-600"
                      : "text-red-600"
                  }`}
                >
                  {selectedLocation.isActive
                    ? "Available"
                    : "Unavailable"}
                </span>

              </div>

            </div>


            {/* Actions */}
            <div className="mt-auto pt-8">

              <div className="grid gap-3 sm:grid-cols-2">

                {/* View Map */}
                <button
                  onClick={() =>
                    navigate(`/map?location=${selectedLocation._id}`)
                  }
                  className="group flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                >

                  <MapPin size={18} />

                  View on Map

                  <ArrowRight
                    size={16}
                    className="transition-transform group-hover:translate-x-1"
                  />

                </button>


                {/* Directions */}
                <button
                  onClick={() =>
                    navigate(
                      `/directions?to=${selectedLocation._id}`
                    )
                  }
                  className="group flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-100 transition hover:bg-blue-700"
                >

                  <Navigation size={18} />

                  Get Direction

                  <ArrowRight
                    size={16}
                    className="transition-transform group-hover:translate-x-1"
                  />

                </button>

              </div>

            </div>

          </div>

        </div>

      </main>

    </div>
  );
};

export default LocationDetailsPage;