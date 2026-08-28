import { configureStore } from "@reduxjs/toolkit";

import locationReducer from "./slices/locationSlice";
import routeReducer from "./slices/routeSlice";
import mapReducer from "./slices/mapSlice";

export const store = configureStore({
  reducer: {
    locations: locationReducer,
    routes: routeReducer,
    map: mapReducer,
  },
});