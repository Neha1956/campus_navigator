import { useEffect, useRef, useState } from "react";
import { Loader2, LocateFixed, Satellite } from "lucide-react";
import { watchDeviceCoordinates } from "../../utils/geoUtils";

let mapsPromise;

const loadMaps = (key) => {
  if (window.google?.maps) return Promise.resolve(window.google.maps);
  if (!mapsPromise) {
    mapsPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(key)}&v=weekly`;
      script.async = true;
      script.defer = true;
      script.dataset.googleMapsApi = "true";
      script.onload = () => window.google?.maps
        ? resolve(window.google.maps)
        : reject(new Error("Google Maps did not initialize."));
      script.onerror = () => reject(new Error("Google Maps could not be loaded."));
      document.head.appendChild(script);
    }).catch((error) => {
      mapsPromise = null;
      throw error;
    });
  }
  return mapsPromise;
};

const GoogleMapView = ({
  variant = "browse",
  currentLocation = null,
  initialCenter = { lat: 24.1, lng: 83.83 },
}) => {
  const apiKey = import.meta.env.MAP_API_KEY?.trim();
  const initialLatitude = Number(initialCenter?.lat);
  const initialLongitude = Number(initialCenter?.lng);
  const missingKeyMessage = "Set MAP_API_KEY in frontend/.env, then restart Vite. Use a rotated, referrer-restricted key.";
  const mapElement = useRef(null);
  const mapRef = useRef(null);
  const mapsRef = useRef(null);
  const userMarker = useRef(null);
  const accuracyCircle = useRef(null);
  const locationWatchId = useRef(null);
  const [status, setStatus] = useState(apiKey ? "loading" : "error");
  const [mapType, setMapType] = useState("roadmap");
  const [localLocation, setLocalLocation] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [isTrackingLocation, setIsTrackingLocation] = useState(false);
  const [locationError, setLocationError] = useState("");
  const [loadError, setLoadError] = useState(apiKey ? "" : missingKeyMessage);
  const liveLocation = localLocation || currentLocation;
  const liveLatitude = Number(liveLocation?.lat);
  const liveLongitude = Number(liveLocation?.lng);
  const liveAccuracy = Number(liveLocation?.accuracy);

  useEffect(() => {
    let cancelled = false;
    if (!apiKey) return undefined;
    loadMaps(apiKey).then((maps) => {
      if (cancelled || !mapElement.current) return;
      mapsRef.current = maps;
      const map = new maps.Map(mapElement.current, {
        center: {
          lat: Number.isFinite(initialLatitude) ? initialLatitude : 24.1,
          lng: Number.isFinite(initialLongitude) ? initialLongitude : 83.83,
        },
        zoom: 16,
        mapTypeId: maps.MapTypeId.ROADMAP,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true,
      });
      mapRef.current = map;

      setStatus("ready");
    }).catch((error) => {
      if (cancelled) return;
      setLoadError(`${error.message} Check Maps JavaScript API, Places API, billing, and key restrictions.`);
      setStatus("error");
    });
    return () => { cancelled = true; };
  }, [apiKey, initialLatitude, initialLongitude]);

  useEffect(() => {
    const map = mapRef.current;
    const maps = mapsRef.current;
    if (!map || !maps || !Number.isFinite(liveLatitude) || !Number.isFinite(liveLongitude)) return;
    const point = { lat: liveLatitude, lng: liveLongitude };
    if (!Number.isFinite(point.lat) || !Number.isFinite(point.lng)) return;
    if (!userMarker.current) {
      userMarker.current = new maps.Marker({
        map,
        title: "My live location",
        zIndex: 1000,
        icon: { path: maps.SymbolPath.CIRCLE, scale: 8, fillColor: "#2563EB", fillOpacity: 1, strokeColor: "#FFFFFF", strokeWeight: 3 },
      });
      accuracyCircle.current = new maps.Circle({ map, fillColor: "#2563EB", fillOpacity: 0.12, strokeColor: "#2563EB", strokeOpacity: 0.35, strokeWeight: 1 });
    }
    userMarker.current.setPosition(point);
    accuracyCircle.current.setCenter(point);
    accuracyCircle.current.setRadius(Math.max(0, liveAccuracy || 0));
    map.panTo(point);
  }, [liveLatitude, liveLongitude, liveAccuracy, status]);

  useEffect(() => () => {
    if (locationWatchId.current !== null && navigator.geolocation) {
      navigator.geolocation.clearWatch(locationWatchId.current);
    }
  }, []);

  const toggleMapType = () => {
    const nextType = mapType === "roadmap" ? "satellite" : "roadmap";
    setMapType(nextType);
    mapRef.current?.setMapTypeId(nextType);
  };

  const useCurrentLocation = () => {
    if (locationWatchId.current !== null) {
      navigator.geolocation.clearWatch(locationWatchId.current);
      locationWatchId.current = null;
      setIsTrackingLocation(false);
      setLocationLoading(false);
      return;
    }

    setLocationLoading(true);
    setLocationError("");
    try {
      locationWatchId.current = watchDeviceCoordinates((coordinates) => {
        setLocalLocation(coordinates);
        mapRef.current?.panTo({ lat: coordinates.lat, lng: coordinates.lng });
        mapRef.current?.setZoom(17);
        setLocationLoading(false);
      }, (error) => {
        if (locationWatchId.current !== null) {
          navigator.geolocation.clearWatch(locationWatchId.current);
          locationWatchId.current = null;
        }
        setIsTrackingLocation(false);
        setLocationError(error.message);
        setLocationLoading(false);
      });
      setIsTrackingLocation(true);
    } catch (error) {
      setIsTrackingLocation(false);
      setLocationError(error.message);
      setLocationLoading(false);
    }
  };

  return (
    <div className="relative h-full min-h-[420px] w-full overflow-hidden bg-slate-100">
      <div ref={mapElement} className="absolute inset-0" />
      <div className="absolute right-3 top-3 z-10 flex items-start gap-2 sm:right-4">
        {variant === "directions" && (
          <div className="flex flex-col items-start gap-2">
            <button type="button" onClick={useCurrentLocation} title={isTrackingLocation ? "Stop live location" : "Show current location"} aria-label={isTrackingLocation ? "Stop live location" : "Show current location"} aria-pressed={isTrackingLocation} className={`flex h-10 items-center gap-1.5 rounded-lg border bg-white px-3 text-sm font-semibold shadow-lg ${isTrackingLocation ? "border-blue-200 text-blue-700" : "border-slate-200 text-slate-700"}`}>
              {locationLoading ? <Loader2 size={16} className="animate-spin" /> : <LocateFixed size={16} />}
              {isTrackingLocation ? "Tracking" : "My Location"}
            </button>
            {locationError && <p role="alert" className="max-w-xs rounded-md bg-white/95 p-2 text-xs text-red-700 shadow-lg">{locationError}</p>}
          </div>
        )}
        <button type="button" onClick={toggleMapType} title={mapType === "roadmap" ? "Show satellite view" : "Show road map"} aria-label={mapType === "roadmap" ? "Show satellite view" : "Show road map"} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 shadow-lg"><Satellite size={18} /></button>
      </div>
      {status === "loading" && <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/80 text-sm text-slate-700"><Loader2 className="mr-2 animate-spin" size={18} />Loading real map...</div>}
      {status === "error" && <div className="absolute inset-0 z-20 flex items-center justify-center bg-slate-50/95 p-6"><p className="max-w-lg rounded-lg border border-amber-200 bg-white p-4 text-sm text-slate-700 shadow-sm">{loadError}</p></div>}
    </div>
  );
};

export default GoogleMapView;