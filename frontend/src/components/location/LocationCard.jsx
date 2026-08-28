import {
  ArrowRight,
  Building2,
  MapPin,
  Library,
  Utensils,
  DoorOpen,
  GraduationCap,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

const LocationCard = ({ location }) => {

  const navigate = useNavigate();

  const getIcon = () => {

    switch (location.icon) {

      case "library":
        return <Library size={24} />;

      case "utensils":
        return <Utensils size={24} />;

      case "gate":
        return <DoorOpen size={24} />;

      case "building":
        return <Building2 size={24} />;

      default:
        return <GraduationCap size={24} />;
    }
  };


  return (
    <div
      className="
        group
        overflow-hidden
        rounded-2xl
        border border-slate-200
        bg-white
        shadow-sm
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-blue-200
        hover:shadow-xl
      "
    >

      {/* Image / Icon Area */}
      <div className="relative flex h-44 items-center justify-center bg-gradient-to-br from-blue-50 via-white to-slate-100">

        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white text-blue-600 shadow-lg ring-1 ring-slate-100 transition-transform duration-300 group-hover:scale-110">
          {getIcon()}
        </div>

        {/* Active badge */}
        <div className="absolute right-4 top-4">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Active
          </span>
        </div>

      </div>


      {/* Content */}
      <div className="p-5">

        <div className="mb-2 flex items-start justify-between gap-3">

          <div>
            <h3 className="line-clamp-1 text-lg font-bold text-slate-900">
              {location.name}
            </h3>

            <span className="mt-1 inline-block rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-600">
              {location.category}
            </span>
          </div>

        </div>


        <p className="mt-3 line-clamp-2 min-h-[40px] text-sm leading-5 text-slate-500">
          {location.description || "No description available."}
        </p>


        {/* Coordinates */}
        <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
          <MapPin size={14} />

          <span>
            Position: {location.x}, {location.y}
          </span>
        </div>


        {/* Button */}
        <button
          onClick={() =>
            navigate(`/locations/${location._id}`)
          }
          className="
            mt-5
            flex
            w-full
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-slate-900
            px-4
            py-3
            text-sm
            font-semibold
            text-white
            transition
            hover:bg-blue-600
          "
        >
          View Details

          <ArrowRight
            size={16}
            className="transition-transform group-hover:translate-x-1"
          />
        </button>

      </div>

    </div>
  );
};

export default LocationCard;