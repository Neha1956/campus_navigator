import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:5000/api/floors";

// Thunks
export const fetchFloorsByBuilding = createAsyncThunk(
  "floors/fetchFloorsByBuilding",
  async (buildingId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/building/${buildingId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const fetchFloorById = createAsyncThunk(
  "floors/fetchFloorById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const createFloor = createAsyncThunk(
  "floors/createFloor",
  async (floorData, { rejectWithValue }) => {
    try {
      const response = await axios.post(API_URL, floorData);
      return response.data.floor;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const updateFloor = createAsyncThunk(
  "floors/updateFloor",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, data);
      return response.data.floor;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const updateFloorLayout = createAsyncThunk(
  "floors/updateFloorLayout",
  async ({ id, layoutData }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`${API_URL}/${id}/layout`, { layoutData });
      return response.data.floor;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const deleteFloor = createAsyncThunk(
  "floors/deleteFloor",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

const initialState = {
  floors: [],
  currentFloor: null,
  loading: false,
  error: null,
};

const floorSlice = createSlice({
  name: "floors",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentFloor: (state, action) => {
      state.currentFloor = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch floors by building
      .addCase(fetchFloorsByBuilding.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
  fetchFloorsByBuilding.fulfilled,
  (state, action) => {
    state.loading = false;

    const data = action.payload;

    if (Array.isArray(data)) {
      state.floors = data;
    } else if (Array.isArray(data?.floors)) {
      state.floors = data.floors;
    } else if (Array.isArray(data?.data)) {
      state.floors = data.data;
    } else {
      state.floors = [];
    }
  }
)
      .addCase(fetchFloorsByBuilding.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch single floor
      .addCase(fetchFloorById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFloorById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentFloor = action.payload;
      })
      .addCase(fetchFloorById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create floor
     .addCase(createFloor.pending, (state) => {
        state.loading = true;
        state.error = null;
      }) 
      .addCase(createFloor.fulfilled, (state, action) => {
  state.loading = false;

  if (action.payload) {
    state.floors.push(action.payload);
    state.currentFloor = action.payload;
  }
})
      .addCase(createFloor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update floor
      .addCase(updateFloor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateFloor.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.floors.findIndex((f) => f._id === action.payload._id);
        if (index !== -1) {
          state.floors[index] = action.payload;
        }
        if (state.currentFloor?._id === action.payload._id) {
          state.currentFloor = action.payload;
        }
      })
      .addCase(updateFloor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update floor layout
      .addCase(updateFloorLayout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateFloorLayout.fulfilled, (state, action) => {
        state.loading = false;
        if (state.currentFloor?._id === action.payload._id) {
          state.currentFloor = action.payload;
        }
      })
      .addCase(updateFloorLayout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete floor
      .addCase(deleteFloor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteFloor.fulfilled, (state, action) => {
        state.loading = false;
        state.floors = state.floors.filter((f) => f._id !== action.payload);
        if (state.currentFloor?._id === action.payload) {
          state.currentFloor = null;
        }
      })
      .addCase(deleteFloor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, setCurrentFloor } = floorSlice.actions;
export default floorSlice.reducer;
