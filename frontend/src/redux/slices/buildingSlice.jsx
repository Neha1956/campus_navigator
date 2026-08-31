import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:5000/api/buildings";

// ==========================================
// FETCH ALL BUILDINGS
// ==========================================
export const fetchBuildings = createAsyncThunk(
  "buildings/fetchBuildings",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(API_URL);

      console.log("FETCH BUILDINGS:", response.data);

      const data = response.data;

      if (Array.isArray(data)) {
        return data;
      }

      if (Array.isArray(data?.buildings)) {
        return data.buildings;
      }

      if (Array.isArray(data?.data)) {
        return data.data;
      }

      return [];
    } catch (error) {
      console.error(
        "FETCH BUILDINGS ERROR:",
        error.response?.data || error.message
      );

      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch buildings"
      );
    }
  }
);

// ==========================================
// FETCH BUILDING BY ID
// ==========================================
export const fetchBuildingById = createAsyncThunk(
  "buildings/fetchBuildingById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);

      return (
        response.data?.building ||
        response.data?.data ||
        response.data
      );
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch building"
      );
    }
  }
);

// ==========================================
// CREATE BUILDING
// ==========================================
export const createBuilding = createAsyncThunk(
  "buildings/createBuilding",
  async (buildingData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        API_URL,
        buildingData
      );

      console.log("CREATE BUILDING:", response.data);

      return (
        response.data?.building ||
        response.data?.data ||
        response.data
      );
    } catch (error) {
      console.error(
        "CREATE BUILDING ERROR:",
        error.response?.data || error.message
      );

      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to create building"
      );
    }
  }
);

// ==========================================
// UPDATE BUILDING
// ==========================================
export const updateBuilding = createAsyncThunk(
  "buildings/updateBuilding",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${API_URL}/${id}`,
        data
      );

      return (
        response.data?.building ||
        response.data?.data ||
        response.data
      );
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to update building"
      );
    }
  }
);

// ==========================================
// DELETE BUILDING
// ==========================================
export const deleteBuilding = createAsyncThunk(
  "buildings/deleteBuilding",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/${id}`);

      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to delete building"
      );
    }
  }
);

// ==========================================
// INITIAL STATE
// ==========================================
const initialState = {
  buildings: [],
  currentBuilding: null,
  loading: false,
  error: null,
};

// ==========================================
// SLICE
// ==========================================
const buildingSlice = createSlice({
  name: "buildings",

  initialState,

  reducers: {
    clearError: (state) => {
      state.error = null;
    },

    setCurrentBuilding: (state, action) => {
      state.currentBuilding = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder

      // ======================================
      // FETCH BUILDINGS
      // ======================================
      .addCase(fetchBuildings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchBuildings.fulfilled, (state, action) => {
        state.loading = false;

        state.buildings = Array.isArray(action.payload)
          ? action.payload
          : [];
      })

      .addCase(fetchBuildings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.buildings = [];
      })

      // ======================================
      // FETCH SINGLE BUILDING
      // ======================================
      .addCase(fetchBuildingById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchBuildingById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBuilding = action.payload || null;
      })

      .addCase(fetchBuildingById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ======================================
      // CREATE BUILDING
      // ======================================
      .addCase(createBuilding.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(createBuilding.fulfilled, (state, action) => {
        state.loading = false;

        if (action.payload) {
          state.buildings.push(action.payload);

          // Automatically select newly created building
          state.currentBuilding = action.payload;
        }
      })

      .addCase(createBuilding.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ======================================
      // UPDATE BUILDING
      // ======================================
      .addCase(updateBuilding.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(updateBuilding.fulfilled, (state, action) => {
        state.loading = false;

        if (!action.payload) return;

        const index = state.buildings.findIndex(
          (building) =>
            building._id === action.payload._id
        );

        if (index !== -1) {
          state.buildings[index] = action.payload;
        }

        if (
          state.currentBuilding?._id ===
          action.payload._id
        ) {
          state.currentBuilding = action.payload;
        }
      })

      .addCase(updateBuilding.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ======================================
      // DELETE BUILDING
      // ======================================
      .addCase(deleteBuilding.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(deleteBuilding.fulfilled, (state, action) => {
        state.loading = false;

        state.buildings = state.buildings.filter(
          (building) =>
            building._id !== action.payload
        );

        if (
          state.currentBuilding?._id ===
          action.payload
        ) {
          state.currentBuilding = null;
        }
      })

      .addCase(deleteBuilding.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearError,
  setCurrentBuilding,
} = buildingSlice.actions;

export default buildingSlice.reducer;