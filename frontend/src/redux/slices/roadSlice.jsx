
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/axios";

/*const API_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:5000/api";*/

/* =========================================================
   FETCH ROADS
========================================================= */

export const fetchRoads = createAsyncThunk(
  "roads/fetchRoads",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(`/roads`);

      return response.data.roads;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch roads"
      );
    }
  }
);

/* =========================================================
   CREATE ROAD
========================================================= */

export const createRoad = createAsyncThunk(
  "roads/createRoad",
  async (roadData, { rejectWithValue }) => {
    try {
      const response = await api.post(
        `/roads`,
        roadData
      );

      return response.data.road;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to create road"
      );
    }
  }
);

/* =========================================================
   UPDATE ROAD
========================================================= */

export const updateRoad = createAsyncThunk(
  "roads/updateRoad",
  async (
    { id, data },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.put(
        `/roads/${id}`,
        data
      );

      return response.data.road;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to update road"
      );
    }
  }
);

/* =========================================================
   DELETE ROAD
========================================================= */

export const deleteRoad = createAsyncThunk(
  "roads/deleteRoad",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(
        `/roads/${id}`
      );

      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to delete road"
      );
    }
  }
);

/* =========================================================
   SLICE
========================================================= */

const roadSlice = createSlice({
  name: "roads",

  initialState: {
    roads: [],
    loading: false,
    error: null,
  },

  reducers: {
    clearRoadError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    /* FETCH */

    builder
      .addCase(
        fetchRoads.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        fetchRoads.fulfilled,
        (state, action) => {
          state.loading = false;
          state.roads = action.payload || [];
        }
      )

      .addCase(
        fetchRoads.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      );

    /* CREATE */

    builder
      .addCase(
        createRoad.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        createRoad.fulfilled,
        (state, action) => {
          state.loading = false;

          state.roads.push(
            action.payload
          );
        }
      )

      .addCase(
        createRoad.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      );

    /* UPDATE */

    builder
      .addCase(
        updateRoad.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        updateRoad.fulfilled,
        (state, action) => {
          state.loading = false;

          const index =
            state.roads.findIndex(
              (road) =>
                road._id ===
                action.payload._id
            );

          if (index !== -1) {
            state.roads[index] =
              action.payload;
          }
        }
      )

      .addCase(
        updateRoad.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      );

    /* DELETE */

    builder
      .addCase(
        deleteRoad.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        deleteRoad.fulfilled,
        (state, action) => {
          state.loading = false;

          state.roads =
            state.roads.filter(
              (road) =>
                road._id !==
                action.payload
            );
        }
      )

      .addCase(
        deleteRoad.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      );
  },
});

export const {
  clearRoadError,
} = roadSlice.actions;

export default roadSlice.reducer;

