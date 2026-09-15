import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from '../../api/axios'

//const API_URL = import.meta.env.VITE_API_URL || "https://campus-navigator-cebf.onrender.com";

// Submit Feedback Thunk
export const submitFeedback = createAsyncThunk(
  "feedback/submit",
  async (feedbackData, thunkAPI) => {
    try {
      const response = await api.post(`/feedback`, feedbackData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to submit feedback");
    }
  }
);

// Fetch All Feedbacks Thunk
export const fetchFeedbacks = createAsyncThunk(
  "feedback/fetchAll",
  async (_, thunkAPI) => {
    try {
      const response = await api.get(`/feedback`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to fetch feedbacks");
    }
  }
);

// Delete Feedback Thunk
export const deleteFeedback = createAsyncThunk(
  "feedback/delete",
  async (id, thunkAPI) => {
    try {
      await api.delete(`/feedback/${id}`);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to delete feedback");
    }
  }
);

const feedbackSlice = createSlice({
  name: "feedback",
  initialState: {
    feedbacks: [],
    averageRating: 0,
    loading: false,
    successMessage: "",
    error: null,
  },
  reducers: {
    clearFeedbackStatus: (state) => {
      state.successMessage = "";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Submit
      .addCase(submitFeedback.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitFeedback.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
      })
      .addCase(submitFeedback.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch All
      .addCase(fetchFeedbacks.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFeedbacks.fulfilled, (state, action) => {
        state.loading = false;
        state.feedbacks = action.payload.data;
        state.averageRating = action.payload.averageRating;
      })
      .addCase(fetchFeedbacks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete
      .addCase(deleteFeedback.fulfilled, (state, action) => {
        state.feedbacks = state.feedbacks.filter((item) => item._id !== action.payload);
        const totalReviews = state.feedbacks.length;
        state.averageRating = totalReviews > 0 
          ? (state.feedbacks.reduce((acc, item) => acc + item.rating, 0) / totalReviews).toFixed(1) 
          : 0;
      });
  },
});

export const { clearFeedbackStatus } = feedbackSlice.actions;
export default feedbackSlice.reducer;