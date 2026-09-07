import { useMemo, useState } from "react";
import { ArrowRight, MapPin, Route, X } from "lucide-react";
import SearchableSelect from "../common/SearchableSelect";
import {
  getIndoorDirections,
  getIndoorRoutePoints,
  getIndoorRouteStops,
} from "../../utils/indoorRoute";

const NAVIGABLE_TYPES = new Set([
  "room",
  "classroom",
  "lab",
  "office",
  "washroom",
  "other",
]);

const getFloorLabel = (floor) =>
  `${floor.name} (Floor ${floor.floorNumber ?? 0})`;

const IndoorDirectionsPanel = ({ building, floors = [], onClose, onRoute }) => {
  const [sourceId, setSourceId] = useState("");
  const [destinationId, setDestinationId] = useState("");

  const destinations = useMemo(
    () =>
      floors.flatMap((floor) =>
        (Array.isArray(floor.mapElements) ? floor.mapElements : [])
          .filter((element) => NAVIGABLE_TYPES.has(element.type))
          .map((element) => ({
            ...element,
            floorId: floor._id,
            floorName: floor.name,
            floorNumber: floor.floorNumber,
          }))
      ),
    [floors]
  );

  const allElements = useMemo(
    () =>
      floors.flatMap((floor) =>
        (Array.isArray(floor.mapElements) ? floor.mapElements : []).map((element) => ({
          ...element,
          floorId: floor._id,
          floorName: floor.name,
          floorNumber: floor.floorNumber,
        }))
      ),
    [floors]
  );

  const source = destinations.find((element) => element._id === sourceId);
  const destination = destinations.find((element) => element._id === destinationId);
  const sameFloor = source && destination && source.floorId === destination.floorId;

  const options = useMemo(
    () =>
      destinations.map((element) => ({
        value: element._id,
        label: element.name,
        description: `${element.floorName} (Floor ${element.floorNumber ?? 0})`,
        searchText: `${element.name} ${element.floorName} ${element.type} ${element.roomNumber || ""}`,
      })),
    [destinations]
  );

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!source || !destination) return;

    const routeStops = sameFloor
      ? getIndoorRouteStops(
          source,
          destination,
          allElements.filter((element) => element.floorId === source.floorId)
        )
      : [];
    const routePoints = sameFloor
      ? getIndoorRoutePoints(
          source,
          destination,
          allElements.filter((element) => element.floorId === source.floorId)
        )
      : [];
    const directions = sameFloor
      ? getIndoorDirections(routeStops)
      : [
          {
            step: 1,
            from: source,
            to: { _id: `floor-${destination.floorId}`, name: destination.floorName },
            floorName: source.floorName,
          },
          {
            step: 2,
            from: { name: destination.floorName },
            to: destination,
            floorName: destination.floorName,
          },
        ];

    onRoute({
      source,
      destination,
      floorId: destination.floorId,
      routePoints,
      directions,
    });
  };

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-slate-950/80 p-4">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
              <Route size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Indoor directions</h3>
              <p className="text-xs text-slate-500">{building?.name}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-200 hover:text-slate-700"
            aria-label="Close indoor directions"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <SearchableSelect label="Source" icon={MapPin} value={sourceId} options={options} placeholder="Type a room or class..." onChange={setSourceId} />
            <SearchableSelect label="Destination" icon={MapPin} value={destinationId} options={options} placeholder="Type a room or class..." onChange={setDestinationId} accent="red" />
          </div>

          {!destinations.length && (
            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-500">
              No classrooms or rooms are mapped in this building yet.
            </div>
          )}

          {source && destination && !sameFloor && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
              The destination is on <strong>{getFloorLabel(destination)}</strong>. Select that floor to see the destination location.
            </div>
          )}

          <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
            <button type="button" onClick={onClose} className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100">
              Cancel
            </button>
            <button
              type="submit"
              disabled={!source || !destination}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              Show direction <ArrowRight size={16} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default IndoorDirectionsPanel;