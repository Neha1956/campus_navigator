import { configureStore } from "@reduxjs/toolkit";

import locationReducer from "./slices/locationSlice";
import routeReducer from "./slices/routeSlice";
import mapReducer from "./slices/mapSlice";
import buildingReducer from "./slices/buildingSlice";
import floorReducer from "./slices/floorSlice";
import mapElementReducer from "./slices/mapElementSlice";
import roadReducer from "./slices/roadSlice"
import campusElementsReducer from "./slices/campusElementSlice";
import authReducer from "./slices/authSlice";
export const store = configureStore({
  reducer: {
    locations: locationReducer,
    routes: routeReducer,
    map: mapReducer,
    buildings: buildingReducer,
    floors: floorReducer,
    mapElements: mapElementReducer,
    roads: roadReducer,
    campusElements:
      campusElementsReducer,
    auth: authReducer,
  },
});