import { useState } from "react";
import {
  X,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Compass,
  Building2,
  Navigation,
  ArrowRight,
  ImageOff,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const LocationPreviewModal = ({ location, isOpen, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigate = useNavigate();

  if (!isOpen || !location) return null;

  // Get all unique images: primary image + gallery images
  const allImages = [...new Set([
    ...(location.image ? [location.image] : []),
    ...(location.images || []),
  ])];

  const currentImage = allImages[currentImageIndex] || location.image;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev - 1 < 0 ? allImages.length - 1 : prev - 1
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-h-[90vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl bg-white shadow-2xl sm:max-w-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-slate-700 transition hover:bg-slate-100"
        >
          <X size={20} />
        </button>

        {/* Image Section */}
        <div className="relative flex h-64 items-center justify-center overflow-hidden bg-slate-100 sm:h-80">
          {currentImage ? (
            <>
              <img
                src={currentImage}
                alt={`${location.name} - Image ${currentImageIndex + 1}`}
                className="absolute inset-0 h-full w-full object-cover"
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
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8">
          {/* Category Badge */}
          <div className="mb-3 inline-block">
            <span className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-blue-600">
              {location.category}
            </span>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            {location.name}
          </h2>

          {/* Description */}
          {location.description && (
            <p className="mt-3 text-sm leading-6 text-slate-600">
              {location.description}
            </p>
          )}

          {/* Info Grid */}
          <div className="mt-6 space-y-3">
            {/* Building */}
            <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <Building2 size={18} />
              </div>
              <div className="flex-1">
                <p className="text-xs text-slate-500">Building</p>
                <p className="text-sm font-semibold text-slate-900">
                  {location.building || "Not specified"}
                </p>
              </div>
            </div>

            {/* Position */}
            <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <Compass size={18} />
              </div>
              <div className="flex-1">
                <p className="text-xs text-slate-500">Coordinates</p>
                <p className="text-sm font-semibold text-slate-900">
                  X: {location.x}, Y: {location.y}
                </p>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <MapPin size={18} />
              </div>
              <div className="flex-1">
                <p className="text-xs text-slate-500">Campus Area</p>
                <p className="text-sm font-semibold text-slate-900">Campus</p>
              </div>
            </div>
          </div>

          {/* Image Gallery Thumbnails */}
          {allImages.length > 1 && (
            <div className="mt-6">
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

          {/* Actions */}
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <button
              onClick={() => {
                onClose();
                navigate(`/locations/${location._id}`);
              }}
              className="group flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
            >
              <MapPin size={18} />
              View Details
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </button>

            <button
              onClick={() => {
                onClose();
                navigate(`/directions?to=${location._id}`);
              }}
              className="group flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-100 transition hover:bg-blue-700"
            >
              <Navigation size={18} />
              Get Direction
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationPreviewModal;
