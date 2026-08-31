import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:5000/api/map-elements";

// Thunks
export const fetchMapElementsByFloor = createAsyncThunk(
  "mapElements/fetchMapElementsByFloor",
  async (floorId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/floor/${floorId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const fetchMapElementById = createAsyncThunk(
  "mapElements/fetchMapElementById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const createMapElement = createAsyncThunk(
  "mapElements/createMapElement",
  async (elementData, { rejectWithValue }) => {
    try {
      const response = await axios.post(API_URL, elementData);
      return response.data.element;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const updateMapElement = createAsyncThunk(
  "mapElements/updateMapElement",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, data);
      return response.data.element;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const updateElementPosition = createAsyncThunk(
  "mapElements/updateElementPosition",
  async ({ id, position }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`${API_URL}/${id}/position`, { position });
      return response.data.element;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const updateElementDimensions = createAsyncThunk(
  "mapElements/updateElementDimensions",
  async ({ id, dimensions }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`${API_URL}/${id}/dimensions`, { dimensions });
      return response.data.element;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const deleteMapElement = createAsyncThunk(
  "mapElements/deleteMapElement",
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
  elements: [],
  selectedElements: [],
  loading: false,
  error: null,
};

const mapElementSlice = createSlice({
  name: "mapElements",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    selectElement: (state, action) => {
      if (!state.selectedElements.includes(action.payload)) {
        state.selectedElements.push(action.payload);
      }
    },
    deselectElement: (state, action) => {
      state.selectedElements = state.selectedElements.filter(
        (id) => id !== action.payload
      );
    },
    clearSelection: (state) => {
      state.selectedElements = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch map elements by floor
      .addCase(fetchMapElementsByFloor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
     .addCase(
  fetchMapElementsByFloor.fulfilled,
  (state, action) => {
    state.loading = false;

    const data = action.payload;

    if (Array.isArray(data)) {
      state.elements = data;
    } else if (Array.isArray(data?.elements)) {
      state.elements = data.elements;
    } else if (Array.isArray(data?.data)) {
      state.elements = data.data;
    } else {
      state.elements = [];
    }
  }
)
      .addCase(fetchMapElementsByFloor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create map element
      .addCase(createMapElement.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
  createMapElement.fulfilled,
  (state, action) => {
    state.loading = false;

    if (action.payload) {
      state.elements.push(action.payload);
    }
  }
)
      .addCase(createMapElement.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update map element
      .addCase(updateMapElement.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMapElement.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.elements.findIndex(
          (e) => e._id === action.payload._id
        );
        if (index !== -1) {
          state.elements[index] = action.payload;
        }
      })
      .addCase(updateMapElement.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update element position
      .addCase(updateElementPosition.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateElementPosition.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.elements.findIndex(
          (e) => e._id === action.payload._id
        );
        if (index !== -1) {
          state.elements[index] = action.payload;
        }
      })
      .addCase(updateElementPosition.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update element dimensions
      .addCase(updateElementDimensions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateElementDimensions.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.elements.findIndex(
          (e) => e._id === action.payload._id
        );
        if (index !== -1) {
          state.elements[index] = action.payload;
        }
      })
      .addCase(updateElementDimensions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete map element
      .addCase(deleteMapElement.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteMapElement.fulfilled, (state, action) => {
        state.loading = false;
        state.elements = state.elements.filter(
          (e) => e._id !== action.payload
        );
        state.selectedElements = state.selectedElements.filter(
          (id) => id !== action.payload
        );
      })
      .addCase(deleteMapElement.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearError,
  selectElement,
  deselectElement,
  clearSelection,
} = mapElementSlice.actions;
export default mapElementSlice.reducer;
