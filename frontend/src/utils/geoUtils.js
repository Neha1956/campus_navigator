// src/utils/geoUtils.js

export const CAMPUS_BOUNDS = {
  topLat: 24.251875,
  bottomLat: 24.245846,
  leftLng: 83.943388 ,
  rightLng:83.944674,
};

export const isInsideCampus = (lat, lng) => {
  return (
    lat <= CAMPUS_BOUNDS.topLat &&
    lat >= CAMPUS_BOUNDS.bottomLat &&
    lng >= CAMPUS_BOUNDS.leftLng &&
    lng <= CAMPUS_BOUNDS.rightLng
  );
};

export const convertGpsToCampus = (lat, lng, mapWidth = 1400, mapHeight = 900) => {
  const x =
    ((lng - CAMPUS_BOUNDS.leftLng) /
      (CAMPUS_BOUNDS.rightLng - CAMPUS_BOUNDS.leftLng)) *
    mapWidth;

  const y =
    ((CAMPUS_BOUNDS.topLat - lat) /
      (CAMPUS_BOUNDS.topLat - CAMPUS_BOUNDS.bottomLat)) *
    mapHeight;

  return {
    x: Math.max(20, Math.min(mapWidth - 20, Math.round(x))),
    y: Math.max(20, Math.min(mapHeight - 20, Math.round(y))),
  };
};

export const getDeviceCoordinates = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by your browser."));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
      },
      (error) => {
        let errorMsg = "Unable to retrieve your location.";
        if (error.code === error.PERMISSION_DENIED) {
          errorMsg = "Location access was denied. Please enable location permissions in your browser settings.";
        }
        reject(new Error(errorMsg));
      },
      {
        enableHighAccuracy: true,
        timeout: 8000,
        maximumAge: 0,
      }
    );
  });
};