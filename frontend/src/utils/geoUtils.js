// src/utils/geoUtils.js

export const CAMPUS_BOUNDS = {
 /* topLat: 24.251875,
  bottomLat: 24.245846,
  leftLng: 83.943388 ,
  rightLng:83.944674,*/
  
  topLat: 24.167500,
  bottomLat: 24.156000,
  leftLng: 83.869000,
  rightLng: 83.879500


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

export const convertCampusToGps = (x, y, mapWidth = 1400, mapHeight = 900) => ({
  lat:
    CAMPUS_BOUNDS.topLat -
    (Number(y) / mapHeight) *
      (CAMPUS_BOUNDS.topLat - CAMPUS_BOUNDS.bottomLat),
  lng:
    CAMPUS_BOUNDS.leftLng +
    (Number(x) / mapWidth) *
      (CAMPUS_BOUNDS.rightLng - CAMPUS_BOUNDS.leftLng),
});

const getLocationErrorMessage = (error) => {
  if (error.code === error.PERMISSION_DENIED) {
    return "Location access was denied. Please enable location permissions in your browser settings.";
  }
  if (error.code === error.POSITION_UNAVAILABLE) {
    return "Your current location is unavailable.";
  }
  if (error.code === error.TIMEOUT) {
    return "The request to get your location timed out.";
  }
  return "Unable to retrieve your location.";
};

export const watchDeviceCoordinates = (onSuccess, onError) => {
  if (!navigator.geolocation) {
    throw new Error("Geolocation is not supported by your browser.");
  }

  return navigator.geolocation.watchPosition(
    (position) => {
      onSuccess({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        accuracy: position.coords.accuracy,
      });
    },
    (error) => onError?.(new Error(getLocationErrorMessage(error))),
    {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 1000,
    }
  );
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
        reject(new Error(getLocationErrorMessage(error)));
      },
      {
        enableHighAccuracy: true,
        timeout: 8000,
        maximumAge: 0,
      }
    );
  });
};