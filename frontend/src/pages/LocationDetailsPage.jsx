import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CheckCircle2,
  Compass,
  MapPin,
  Navigation,
  ChevronLeft,
  ChevronRight,
  ImageOff,
} from "lucide-react";

import {
  fetchLocationById,
  clearSelectedLocation,
  removeLocation,
} from "../redux/slices/locationSlice";

import Loader from "../components/common/Loader";

const LocationDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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

  if (loading) {
    return <Loader text="Loading location details..." />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-10">
        <div className="mx-auto max-w-2xl rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
          <h2 className="text-xl font-bold text-red-700">
            Unable to load location
          </h2>
          <p className="mt-2 text-sm text-red-500">{error}</p>
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

  // Get all images: primary image + gallery images
const rawImages = [
  selectedLocation.image,
  ...(selectedLocation.images || []),
];

const allImages = [
  ...new Map(
    rawImages
      .filter(Boolean)
      .map((img) => {
        const url = typeof img === "string" ? img : img.url;
        return [url, url];
      })
  ).values(),
];

const currentImage =
  allImages[currentImageIndex] || null;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  const handleDeleteLocation = async () => {
    if (!selectedLocation?._id) return;

    const confirmed = window.confirm(`Are you sure you want to delete "${selectedLocation.name}"?`);
    if (!confirmed) return;

    const result = await dispatch(removeLocation(selectedLocation._id));
    if (!result.error) {
      navigate("/locations");
      return;
    }

    alert(result.payload || "Failed to delete location");
  };

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
          {/* LEFT - Visual / Image Section */}
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="relative flex min-h-[360px] items-center justify-center overflow-hidden bg-slate-100 sm:min-h-[500px]">
              {/* Location Image or Fallback */}
              {currentImage ? (
                <>
                  <img
                    src={currentImage}
                    alt={`${selectedLocation.name} - Image ${currentImageIndex + 1}`}
                    className="absolute inset-0 h-full w-full object-cover"
                    key={currentImage}
                  />
                  {allImages.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-slate-700 transition hover:bg-white"
                      >
                        <ChevronLeft size={20} />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-slate-700 transition hover:bg-white"
                      >
                        <ChevronRight size={20} />
                      </button>
                      <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2 rounded-full bg-black/40 px-3 py-2">
                        {allImages.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`h-2 rounded-full transition ${
                              index === currentImageIndex
                                ? "w-6 bg-white"
                                : "w-2 bg-white/50 hover:bg-white/70"
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center text-slate-400">
                  <ImageOff size={48} className="mb-2" />
                  <p className="text-sm">No image available</p>
                </div>
              )}

              {/* Status Badge */}
              <div className="absolute right-5 top-5 z-10">
                {selectedLocation.isActive ? (
                  <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-600 ring-1 ring-emerald-100 backdrop-blur-md bg-white/90">
                    <CheckCircle2 size={15} />
                    Active Location
                  </div>
                ) : (
                  <div className="rounded-full bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 backdrop-blur-md bg-white/90">
                    Inactive
                  </div>
                )}
              </div>
            </div>

            {/* Visual Footer with Coordinates and Gallery */}
            <div className="space-y-4 border-t border-slate-100 p-5 sm:p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <MapPin size={21} />
                </div>
                <div>
                  <p className="text-xs text-slate-400">Campus Coordinates</p>
                  <p className="mt-0.5 font-semibold text-slate-800">
                    X: {selectedLocation.x} &nbsp;•&nbsp; Y: {selectedLocation.y}
                  </p>
                </div>
              </div>

              {/* Image Gallery Thumbnails */}
              {allImages.length > 1 && (
                <div>
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Gallery ({allImages.length} images)
                  </p>
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {allImages.map((img, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border-2 transition ${
                          index === currentImageIndex
                            ? "border-blue-600 shadow-md"
                            : "border-slate-200 hover:border-blue-300"
                        }`}
                      >
                        <img
                          src={img}
                          alt={`Thumbnail ${index + 1}`}
                          className="h-full w-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT - Details */}
          <div className="flex flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-5 flex items-center gap-2">
              <span className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-blue-600">
                {selectedLocation.category}
              </span>
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              {selectedLocation.name}
            </h1>

            <p className="mt-4 text-sm leading-7 text-slate-500 sm:text-base">
              {selectedLocation.description ||
                "No description available for this location."}
            </p>

            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-4">
                <div className="flex items-center gap-3">
                  <MapPin size={18} className="text-blue-600" />
                  <span className="text-sm font-medium text-slate-600">Location</span>
                </div>
                <span className="text-sm font-semibold text-slate-900">Campus</span>
              </div>

              <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-4">
                <div className="flex items-center gap-3">
                  <Compass size={18} className="text-blue-600" />
                  <span className="text-sm font-medium text-slate-600">Position</span>
                </div>
                <span className="text-sm font-semibold text-slate-900">
                  {selectedLocation.x}, {selectedLocation.y}
                </span>
              </div>

              <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-4">
                <div className="flex items-center gap-3">
                  <Building2 size={18} className="text-blue-600" />
                  <span className="text-sm font-medium text-slate-600">Building</span>
                </div>
                <span className="text-sm font-semibold text-slate-900">
                  {selectedLocation.building || "Not specified"}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-auto pt-6">
              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  onClick={() => navigate(`/map?location=${selectedLocation._id}`)}
                  className="group flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                >
                  <MapPin size={18} />
                  View on Map
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </button>

                <button
                  onClick={() => navigate(`/directions?to=${selectedLocation._id}`)}
                  className="group flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-100 transition hover:bg-blue-700"
                >
                  <Navigation size={18} />
                  Get Direction
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </button>
              </div>

             {/* <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <button
                  onClick={() => navigate(`/admin/edit-location/${selectedLocation._id}`)}
                  className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
                >
                  Edit Location
                </button>

                <button
                  onClick={handleDeleteLocation}
                  className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 transition hover:bg-red-100"
                >
                  Delete Location
                </button>
              </div>*/}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LocationDetailsPage;