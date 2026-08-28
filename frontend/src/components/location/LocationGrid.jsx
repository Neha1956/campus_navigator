import LocationCard from "./LocationCard";
import EmptyState from "../common/EmptyState";

const LocationGrid = ({ locations }) => {

  if (!locations.length) {
    return <EmptyState />;
  }

  return (
    <div
      className="
        grid
        grid-cols-1
        gap-5
        sm:grid-cols-2
        xl:grid-cols-3
        2xl:grid-cols-4
      "
    >
      {locations.map((location) => (
        <LocationCard
          key={location._id}
          location={location}
        />
      ))}
    </div>
  );
};

export default LocationGrid;