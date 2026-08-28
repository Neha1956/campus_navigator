import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  ArrowLeft,
  ArrowLeftRight,
  Navigation,
  MapPin,
  Clock,
  Route as RouteIcon,
  Footprints,
  Building2,
  Library,
  Utensils,
  DoorOpen,
  LocateFixed,
} from "lucide-react";

import { fetchLocations } from "../redux/slices/locationSlice";
import { fetchRouteBetweenLocations } from "../redux/slices/routeSlice";

/* =========================
   ICON
========================= */

const getIcon = (category) => {
  switch (category?.toLowerCase()) {
    case "library":
      return Library;

    case "canteen":
      return Utensils;

    case "gate":
      return DoorOpen;

    case "department":
    case "admin":
      return Building2;

    default:
      return MapPin;
  }
};

/* =========================
   COLOR
========================= */

const getLocationColor = (category) => {
  switch (category?.toLowerCase()) {
    case "library":
      return "#7c3aed";

    case "canteen":
      return "#ea580c";

    case "gate":
      return "#16a34a";

    case "department":
      return "#2563eb";

    case "admin":
      return "#0891b2";

    default:
      return "#64748b";
  }
};

/* =========================
   DIRECTIONS MAP
========================= */

const DirectionsMap = ({
  locations = [],
  selectedRoute,
}) => {
  const fromId = selectedRoute?.from?._id;
  const toId = selectedRoute?.to?._id;

  const source = locations.find(
    (location) => location._id === fromId
  );

  const destination = locations.find(
    (location) => location._id === toId
  );

  /*
    Build route points from Dijkstra path.

    Backend path contains:
    from -> to
    and reverse:true when travelling opposite direction.
  */

  const routePoints = useMemo(() => {
    if (!selectedRoute?.path?.length) {
      if (source && destination) {
        return [
          {
            x: source.x,
            y: source.y,
          },
          {
            x: destination.x,
            y: destination.y,
          },
        ];
      }

      return [];
    }

    const points = [];

    selectedRoute.path.forEach((segment, index) => {
      let start = segment.from;
      let end = segment.to;

      if (segment.reverse) {
        start = segment.to;
        end = segment.from;
      }

      if (index === 0) {
        points.push({
          x: start.x,
          y: start.y,
        });
      }

      points.push({
        x: end.x,
        y: end.y,
      });
    });

    return points;
  }, [selectedRoute, source, destination]);

  const polylinePoints = routePoints
    .map((point) => `${point.x},${point.y}`)
    .join(" ");

  return (
    <div className="relative h-full min-h-[520px] overflow-hidden rounded-2xl border border-slate-200 bg-[#f8fafc] shadow-sm">

      {/* Map controls */}

      <div className="absolute left-4 top-4 z-20 flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">

        <button className="flex h-10 w-10 items-center justify-center border-b border-slate-200 text-slate-700 hover:bg-slate-50">
          +
        </button>

        <button className="flex h-10 w-10 items-center justify-center text-slate-700 hover:bg-slate-50">
          −
        </button>

      </div>

      {/* Map title */}

      <div className="absolute left-20 top-4 z-20 rounded-xl border border-slate-200 bg-white/95 px-4 py-3 shadow-lg backdrop-blur">

        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Campus Navigation
        </p>

        <p className="mt-1 text-sm font-bold text-slate-800">
          Ramchandra Chandravanshi University
        </p>

      </div>

      {/* SVG MAP */}

      <div className="h-full w-full overflow-auto">

        <svg
          viewBox="0 0 1200 1200"
          className="h-full min-h-[520px] min-w-[800px] w-full"
          preserveAspectRatio="xMidYMid meet"
        >

          {/* Background */}

          <rect
            width="1200"
            height="1200"
            fill="#f8fafc"
          />

          {/* Campus */}

          <rect
            x="30"
            y="30"
            width="1130"
            height="1130"
            rx="35"
            fill="#ecfdf5"
            stroke="#cbd5e1"
            strokeWidth="3"
          />

          {/* Road network and highlighted route */}
          <g fill="none" stroke="#d1d5db" strokeWidth="46" strokeLinecap="round">
            {selectedRoute?.path?.map((segment) => (
              <line
                key={`road-${segment._id}`}
                x1={segment.from.x}
                y1={segment.from.y}
                x2={segment.to.x}
                y2={segment.to.y}
              />
            ))}
          </g>

          <g fill="none" stroke="#ffffff" strokeWidth="3" strokeDasharray="10 10" strokeLinecap="round">
            {selectedRoute?.path?.map((segment) => (
              <line
                key={`road-center-${segment._id}`}
                x1={segment.from.x}
                y1={segment.from.y}
                x2={segment.to.x}
                y2={segment.to.y}
              />
            ))}
          </g>

          {/* Green areas */}

          <circle
            cx="410"
            cy="445"
            r="95"
            fill="#dcfce7"
          />

          <circle
            cx="410"
            cy="445"
            r="72"
            fill="#d1fae5"
          />

          <text
            x="410"
            y="450"
            textAnchor="middle"
            fontSize="14"
            fontWeight="600"
            fill="#64748b"
          >
            Garden
          </text>

          {/* Trees */}

          {[

            [120, 100],
            [180, 120],
            [245, 95],
            [735, 120],
            [790, 160],
            [120, 350],
            [190, 370],
            [730, 430],
            [790, 470],
            [120, 570],
            [190, 590],
            [750, 570],

          ].map(([x, y], index) => (
            <g key={index}>

              <circle
                cx={x}
                cy={y}
                r="14"
                fill="#bbf7d0"
              />

              <circle
                cx={x - 5}
                cy={y + 4}
                r="9"
                fill="#86efac"
              />

            </g>
          ))}

          {/* Dynamic locations */}

          {locations
            .filter((location) => location.isActive)
            .map((location) => {

              const Icon = getIcon(location.category);

              const color = getLocationColor(
                location.category
              );

              const isSource =
                location._id === fromId;

              const isDestination =
                location._id === toId;

              return (
                <g
                  key={location._id}
                  transform={`translate(${location.x},${location.y})`}
                >

                  {/* Highlight source */}

                  {isSource && (
                    <circle
                      r="38"
                      fill="#2563eb"
                      opacity="0.10"
                    />
                  )}

                  {/* Highlight destination */}

                  {isDestination && (
                    <circle
                      r="38"
                      fill="#ef4444"
                      opacity="0.10"
                    />
                  )}

                  {/* Building */}

                  <rect
                    x="-30"
                    y="-27"
                    width="60"
                    height="54"
                    rx="12"
                    fill="white"
                    stroke={
                      isSource
                        ? "#2563eb"
                        : isDestination
                        ? "#ef4444"
                        : color
                    }
                    strokeWidth={
                      isSource || isDestination
                        ? 3
                        : 2
                    }
                  />

                  {/* Icon */}

                  <foreignObject
                    x="-13"
                    y="-13"
                    width="26"
                    height="26"
                  >
                    <div
                      xmlns="http://www.w3.org/1999/xhtml"
                      className="flex h-6 w-6 items-center justify-center"
                      style={{
                        color:
                          isSource
                            ? "#2563eb"
                            : isDestination
                            ? "#ef4444"
                            : color,
                      }}
                    >
                      <Icon size={22} />
                    </div>
                  </foreignObject>

                  {/* Label */}

                  <rect
                    x="-60"
                    y="34"
                    width="120"
                    height="25"
                    rx="7"
                    fill="white"
                    opacity="0.96"
                  />

                  <text
                    x="0"
                    y="50"
                    textAnchor="middle"
                    fontSize="11"
                    fontWeight="600"
                    fill="#334155"
                  >
                    {location.name.length > 17
                      ? `${location.name.slice(0, 16)}...`
                      : location.name}
                  </text>

                </g>
              );
            })}

          {/* =========================
              ROUTE
          ========================= */}

          {polylinePoints && (
            <>
              {/* White outline */}

              <polyline
                points={polylinePoints}
                fill="none"
                stroke="white"
                strokeWidth="13"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Blue route */}

              <polyline
                points={polylinePoints}
                fill="none"
                stroke="#2563eb"
                strokeWidth="7"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="1 15"
              />

            </>
          )}

          {/* Source marker */}

          {source && (
            <g
              transform={`translate(${source.x},${source.y - 45})`}
            >

              <circle
                r="17"
                fill="#2563eb"
                stroke="white"
                strokeWidth="4"
              />

              <circle
                r="5"
                fill="white"
              />

              <path
                d="M0 18 L-8 5 L8 5 Z"
                fill="#2563eb"
              />

            </g>
          )}

          {/* Destination marker */}

          {destination && (
            <g
              transform={`translate(${destination.x},${destination.y - 45})`}
            >

              <circle
                r="17"
                fill="#ef4444"
                stroke="white"
                strokeWidth="4"
              />

              <circle
                r="5"
                fill="white"
              />

              <path
                d="M0 18 L-8 5 L8 5 Z"
                fill="#ef4444"
              />

            </g>
          )}

          {/* Campus label */}

          <text
            x="450"
            y="1160"
            textAnchor="middle"
            fontSize="15"
            fontWeight="700"
            fill="#94a3b8"
          >
            UNIVERSITY CAMPUS
          </text>

        </svg>

      </div>

      {/* Legend */}

      {selectedRoute && (
        <div className="absolute bottom-4 left-4 z-20 rounded-xl border border-slate-200 bg-white p-3 shadow-lg">

          <div className="flex items-center gap-2 text-xs font-medium text-slate-600">

            <span className="text-blue-600">
              •••
            </span>

            Walking Route

          </div>

          <div className="mt-2 flex items-center gap-2 text-xs font-medium text-slate-600">

            <span className="h-3 w-3 rounded-full bg-blue-600" />

            Starting Location

          </div>

          <div className="mt-2 flex items-center gap-2 text-xs font-medium text-slate-600">

            <span className="h-3 w-3 rounded-full bg-red-500" />

            Destination

          </div>

        </div>
      )}

    </div>
  );
};

/* =========================
   MAIN DIRECTIONS PAGE
========================= */

const Directions = () => {

  const dispatch = useDispatch();

  const {
    locations,
    loading: locationsLoading,
  } = useSelector(
    (state) => state.locations
  );

  const {
    selectedRoute,
    routeLoading,
    routeError,
  } = useSelector(
    (state) => state.routes
  );

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  /* Fetch locations */

  useEffect(() => {

    if (!locations.length) {
      dispatch(fetchLocations());
    }

  }, [dispatch, locations.length]);

  /* Find route */

  const handleFindRoute = () => {

    if (!from || !to || from === to) {
      return;
    }

    dispatch(
      fetchRouteBetweenLocations({
        from,
        to,
      })
    );
  };

  /* Swap */

  const handleSwap = () => {

    setFrom(to);
    setTo(from);

  };

  /* Selected locations */

  const fromLocation = locations.find(
    (location) => location._id === from
  );

  const toLocation = locations.find(
    (location) => location._id === to
  );

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50">

      {/* ================= HEADER ================= */}

      <div className="border-b border-slate-200 bg-white">

        <div className="mx-auto max-w-[1500px] px-4 py-5 sm:px-6 lg:px-8">

          <div className="flex items-center gap-3">

            <button
              onClick={() => window.history.back()}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-50"
            >
              <ArrowLeft size={19} />
            </button>

            <div>

              <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                Navigation
              </p>

              <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                Directions
              </h1>

            </div>

          </div>

        </div>

      </div>

      {/* ================= CONTENT ================= */}

      <div className="mx-auto max-w-[1500px] px-4 py-5 sm:px-6 lg:px-8 lg:py-7">

        {/* ================= SEARCH ================= */}

        <div className="grid gap-3 lg:grid-cols-[1fr_auto_1fr_auto] lg:items-end">

          {/* FROM */}

          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">

            <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
              From
            </label>

            <div className="relative">

              <MapPin
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-600"
              />

              <select
                value={from}
                onChange={(e) =>
                  setFrom(e.target.value)
                }
                className="w-full appearance-none rounded-lg border border-slate-200 bg-slate-50 py-3 pl-10 pr-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50"
              >

                <option value="">
                  Select starting location
                </option>

                {locations.map((location) => (
                  <option
                    key={location._id}
                    value={location._id}
                  >
                    {location.name}
                  </option>
                ))}

              </select>

            </div>

          </div>

          {/* SWAP */}

          <button
            onClick={handleSwap}
            disabled={!from && !to}
            className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 disabled:opacity-40 lg:mb-1"
          >
            <ArrowLeftRight size={18} />
          </button>

          {/* TO */}

          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">

            <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
              To
            </label>

            <div className="relative">

              <Navigation
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-red-500"
              />

              <select
                value={to}
                onChange={(e) =>
                  setTo(e.target.value)
                }
                className="w-full appearance-none rounded-lg border border-slate-200 bg-slate-50 py-3 pl-10 pr-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50"
              >

                <option value="">
                  Select destination
                </option>

                {locations.map((location) => (
                  <option
                    key={location._id}
                    value={location._id}
                  >
                    {location.name}
                  </option>
                ))}

              </select>

            </div>

          </div>

          {/* BUTTON */}

          <button
            onClick={handleFindRoute}
            disabled={
              !from ||
              !to ||
              from === to ||
              routeLoading
            }
            className="flex h-[52px] items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >

            <Navigation size={18} />

            {routeLoading
              ? "Finding Route..."
              : "Get Directions"}

          </button>

        </div>

        {/* ================= ERROR ================= */}

        {routeError && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-600">
            {routeError}
          </div>
        )}

        {/* ================= RESULT ================= */}

        {selectedRoute && (
          <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1.6fr)_minmax(340px,0.8fr)]">

            {/* ================= MAP ================= */}

            <div className="min-h-[520px]">

              <DirectionsMap
                locations={locations}
                selectedRoute={selectedRoute}
              />

            </div>

            {/* ================= RIGHT PANEL ================= */}

            <div className="space-y-5">

              {/* Summary */}

              <div className="grid grid-cols-2 gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

                <div className="flex items-center gap-3">

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <RouteIcon size={21} />
                  </div>

                  <div>

                    <p className="text-xs text-slate-400">
                      Total Distance
                    </p>

                    <p className="text-lg font-bold text-slate-900">
                      {selectedRoute.distance} m
                    </p>

                  </div>

                </div>

                <div className="flex items-center gap-3 border-l border-slate-100 pl-4">

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-green-600">
                    <Footprints size={21} />
                  </div>

                  <div>

                    <p className="text-xs text-slate-400">
                      Estimated Time
                    </p>

                    <p className="text-lg font-bold text-slate-900">
                      {selectedRoute.walkingTime} min
                    </p>

                  </div>

                </div>

              </div>

              {/* Directions */}

              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                <div className="border-b border-slate-200 px-5 py-4">

                  <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                      <Navigation size={19} />
                    </div>

                    <div>

                      <h2 className="font-bold text-slate-900">
                        Route Directions
                      </h2>

                      <p className="text-xs text-slate-500">
                        Follow the shortest walking route
                      </p>

                    </div>

                  </div>

                </div>

                {/* Steps */}

                <div className="max-h-[530px] overflow-y-auto">

                  {/* Start */}

                  <div className="flex gap-3 border-b border-slate-100 px-5 py-4">

                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                      1
                    </div>

                    <div className="min-w-0 flex-1">

                      <div className="flex justify-between gap-3">

                        <p className="font-semibold text-slate-800">
                          Start from {selectedRoute.from?.name}
                        </p>

                        <span className="text-xs text-slate-400">
                          0 m
                        </span>

                      </div>

                      <p className="mt-1 text-sm text-slate-500">
                        Start walking towards the route
                      </p>

                    </div>

                  </div>

                  {/* Dynamic directions */}

                  {selectedRoute.directions?.map(
                    (direction, index) => (

                      <div
                        key={`${direction.step}-${index}`}
                        className="flex gap-3 border-b border-slate-100 px-5 py-4"
                      >

                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                          {index + 2}
                        </div>

                        <div className="min-w-0 flex-1">

                          <div className="flex justify-between gap-3">

                            <p className="font-semibold text-slate-800">

                              {index ===
                              selectedRoute.directions.length - 1
                                ? `Arrive at ${direction.to}`
                                : `Go towards ${direction.to}`}

                            </p>

                            <span className="shrink-0 text-xs font-medium text-slate-500">
                              {direction.distance} m
                            </span>

                          </div>

                          <p className="mt-1 text-sm text-slate-500">

                            {index ===
                            selectedRoute.directions.length - 1
                              ? "Your destination"
                              : `Walk from ${direction.from}`}

                          </p>

                          <div className="mt-2 flex items-center gap-1 text-xs text-slate-400">

                            <Footprints size={13} />

                            {direction.walkingTime} min

                          </div>

                        </div>

                      </div>

                    )
                  )}

                </div>

              </div>

              {/* Info */}

              <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4">

                <div className="flex gap-3">

                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-blue-600 shadow-sm">
                    <LocateFixed size={18} />
                  </div>

                  <div>

                    <p className="text-sm font-bold text-blue-700">
                      This is the shortest walking route
                    </p>

                    <p className="mt-1 text-xs leading-5 text-blue-600">
                      Please follow the dotted path shown on
                      the map for accurate campus navigation.
                    </p>

                  </div>

                </div>

              </div>

            </div>

          </div>
        )}

        {/* ================= EMPTY STATE ================= */}

        {!selectedRoute && !routeLoading && !routeError && (
          <div className="mt-6 flex min-h-[400px] items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white">

            <div className="max-w-sm px-6 text-center">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                <Navigation size={28} />
              </div>

              <h2 className="mt-4 text-lg font-bold text-slate-800">
                Find Your Campus Route
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Select your starting location and destination
                to see the shortest walking route on the campus map.
              </p>

            </div>

          </div>
        )}

      </div>

    </div>
  );
};

export default Directions;