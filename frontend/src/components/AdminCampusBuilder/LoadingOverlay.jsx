
import React from "react";

const LoadingOverlay = ({
  show = false,
  message = "Loading...",
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="flex min-w-[220px] flex-col items-center justify-center rounded-2xl bg-white px-8 py-7 shadow-2xl">
        
        {/* Spinner */}
        <div className="mb-4 h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />

        {/* Loading Text */}
        <p className="text-sm font-medium text-gray-700">
          {message}
        </p>
      </div>
    </div>
  );
};

export default LoadingOverlay;
