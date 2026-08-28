import { LoaderCircle } from "lucide-react";

const Loader = ({ text = "Loading..." }) => {
  return (
    <div className="flex min-h-[300px] items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <LoaderCircle
          size={32}
          className="animate-spin text-blue-600"
        />

        <p className="text-sm font-medium text-slate-500">
          {text}
        </p>
      </div>
    </div>
  );
};

export default Loader;