import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  zoom: 1,
  center: {
    x: 500,
    y: 350,
  },
  searchQuery: "",
  activeCategory: "All",
};

const mapSlice = createSlice({
  name: "map",
  initialState,

  reducers: {
    setZoom: (state, action) => {
      state.zoom = action.payload;
    },

    setCenter: (state, action) => {
      state.center = action.payload;
    },

    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },

    setActiveCategory: (state, action) => {
      state.activeCategory = action.payload;
    },
  },
});

export const {
  setZoom,
  setCenter,
  setSearchQuery,
  setActiveCategory,
} = mapSlice.actions;

export default mapSlice.reducer;