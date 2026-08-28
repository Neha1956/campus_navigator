import { MapPinOff } from "lucide-react";

const EmptyState = ({
  title = "No locations found",
  description = "Try changing your search or category filter.",
}) => {
  return (
    <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 text-center">
      
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
        <MapPinOff className="text-slate-400" size={26} />
      </div>

      <h3 className="text-lg font-semibold text-slate-800">
        {title}
      </h3>

      <p className="mt-1 max-w-md text-sm text-slate-500">
        {description}
      </p>

    </div>
  );
};

export default EmptyState;