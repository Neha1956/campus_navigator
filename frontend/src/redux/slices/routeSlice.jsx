import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
  getRoutes,
  createRoute,
  updateRoute,
  deleteRoute,

   getRouteBetweenLocations,
} from "../../api/routeApi";


// GET ROUTES
export const fetchRoutes = createAsyncThunk(
  "routes/fetchRoutes",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getRoutes();

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch routes"
      );
    }
  }
);

export const fetchRouteBetweenLocations = createAsyncThunk(
  "routes/fetchRouteBetweenLocations",
  async ({ from, to }, { rejectWithValue }) => {
    try {
      const response = await getRouteBetweenLocations(from, to);

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to find route"
      );
    }
  }
);
// CREATE ROUTE
export const addRoute = createAsyncThunk(
  "routes/addRoute",
  async (data, { rejectWithValue }) => {
    try {
      const response = await createRoute(data);

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to create route"
      );
    }
  }
);


// UPDATE ROUTE
export const editRoute = createAsyncThunk(
  "routes/editRoute",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await updateRoute(id, data);

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to update route"
      );
    }
  }
);


// DELETE ROUTE
export const removeRoute = createAsyncThunk(
  "routes/removeRoute",
  async (id, { rejectWithValue }) => {
    try {
      await deleteRoute(id);

      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to delete route"
      );
    }
  }
);


const initialState = {
  routes: [],
  loading: false,
  error: null,

  selectedRoute: null,
  routeLoading: false,
  routeError: null,
};


const routeSlice = createSlice({
  name: "routes",

  initialState,

  reducers: {},

  extraReducers: (builder) => {
    builder

      // FETCH
      .addCase(fetchRoutes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchRoutes.fulfilled, (state, action) => {
        state.loading = false;
        state.routes = action.payload;
      })

      .addCase(fetchRoutes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })


      // CREATE
      .addCase(addRoute.fulfilled, (state, action) => {
        state.routes.unshift(action.payload);
      })


      // UPDATE
      .addCase(editRoute.fulfilled, (state, action) => {
        const index = state.routes.findIndex(
          (route) => route._id === action.payload._id
        );

        if (index !== -1) {
          state.routes[index] = action.payload;
        }
      })


      // DELETE
      .addCase(removeRoute.fulfilled, (state, action) => {
        state.routes = state.routes.filter(
          (route) => route._id !== action.payload
        );
      })
      .addCase(fetchRouteBetweenLocations.pending, (state) => {
  state.routeLoading = true;
  state.routeError = null;
  state.selectedRoute = null;
})

.addCase(
  fetchRouteBetweenLocations.fulfilled,
  (state, action) => {
    state.routeLoading = false;
    state.selectedRoute = action.payload;
  }
)

.addCase(
  fetchRouteBetweenLocations.rejected,
  (state, action) => {
    state.routeLoading = false;
    state.routeError = action.payload;
  }
)
  },
});


export default routeSlice.reducer;