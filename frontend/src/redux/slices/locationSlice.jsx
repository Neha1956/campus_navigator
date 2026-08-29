import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
  getLocations,
  getLocationById,
  createLocation,
  updateLocation,
  deleteLocation,
} from "../../api/locationApi";


// GET ALL LOCATIONS
export const fetchLocations = createAsyncThunk(
  "locations/fetchLocations",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getLocations();
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch locations"
      );
    }
  }
);


// GET SINGLE LOCATION
export const fetchLocationById = createAsyncThunk(
  "locations/fetchLocationById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await getLocationById(id);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch location"
      );
    }
  }
);


// CREATE LOCATION
export const addLocation = createAsyncThunk(
  "locations/addLocation",
  async (data, { rejectWithValue }) => {
    try {
      const response = await createLocation(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to create location"
      );
    }
  }
);


// UPDATE LOCATION
export const editLocation = createAsyncThunk(
  "locations/editLocation",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await updateLocation(id, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to update location"
      );
    }
  }
);


// DELETE LOCATION
export const removeLocation = createAsyncThunk(
  "locations/removeLocation",
  async (id, { rejectWithValue }) => {
    try {
      await deleteLocation(id);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to delete location"
      );
    }
  }
);


const initialState = {
  locations: [],
  selectedLocation: null,
  loading: false,
  error: null,
};


const locationSlice = createSlice({
  name: "locations",

  initialState,

  reducers: {
    setSelectedLocation: (state, action) => {
      state.selectedLocation = action.payload;
    },

    clearSelectedLocation: (state) => {
      state.selectedLocation = null;
    },
  },

  extraReducers: (builder) => {

    builder

      // FETCH ALL
      .addCase(fetchLocations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchLocations.fulfilled, (state, action) => {
        state.loading = false;
        state.locations = Array.isArray(action.payload?.data)
          ? action.payload.data
          : Array.isArray(action.payload)
            ? action.payload
            : [];
      })

      .addCase(fetchLocations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })


      // FETCH SINGLE
      .addCase(fetchLocationById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchLocationById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedLocation = action.payload?.data || action.payload || null;
      })

      .addCase(fetchLocationById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })


      // CREATE
      .addCase(addLocation.fulfilled, (state, action) => {
        const createdLocation = action.payload?.data || action.payload;
        if (createdLocation) {
          state.locations.unshift(createdLocation);
        }
      })


      // UPDATE
      .addCase(editLocation.fulfilled, (state, action) => {
        const index = state.locations.findIndex(
          (location) => location._id === action.payload._id
        );

        if (index !== -1) {
          state.locations[index] = action.payload;
        }
      })


      // DELETE
      .addCase(removeLocation.fulfilled, (state, action) => {
        state.locations = state.locations.filter(
          (location) => location._id !== action.payload
        );
      });

  },
});


export const {
  setSelectedLocation,
  clearSelectedLocation,
} = locationSlice.actions;


export default locationSlice.reducer;