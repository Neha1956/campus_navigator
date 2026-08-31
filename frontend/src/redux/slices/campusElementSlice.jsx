import {
  createSlice,
  createAsyncThunk,
} from "@reduxjs/toolkit";

import axios from "axios";

const API_URL =
  "http://localhost:5000/api/campus-elements";

/* =====================================================
   FETCH
===================================================== */

export const fetchCampusElements =
  createAsyncThunk(
    "campusElements/fetchCampusElements",
    async (_, { rejectWithValue }) => {
      try {
        const response =
          await axios.get(API_URL);

        const data = response.data;

        if (Array.isArray(data)) {
          return data;
        }

        if (Array.isArray(data?.data)) {
          return data.data;
        }

        if (Array.isArray(data?.elements)) {
          return data.elements;
        }

        return [];
      } catch (error) {
        return rejectWithValue(
          error.response?.data?.message ||
            "Failed to fetch campus elements"
        );
      }
    }
  );

/* =====================================================
   GET ONE
===================================================== */

export const fetchCampusElementById =
  createAsyncThunk(
    "campusElements/fetchCampusElementById",
    async (id, { rejectWithValue }) => {
      try {
        const response =
          await axios.get(
            `${API_URL}/${id}`
          );

        return (
          response.data?.data ||
          response.data?.element ||
          response.data
        );
      } catch (error) {
        return rejectWithValue(
          error.response?.data?.message ||
            "Failed to fetch campus element"
        );
      }
    }
  );

/* =====================================================
   CREATE
===================================================== */

export const createCampusElement =
  createAsyncThunk(
    "campusElements/createCampusElement",
    async (data, { rejectWithValue }) => {
      try {
        const response =
          await axios.post(
            API_URL,
            data
          );

        return (
          response.data?.data ||
          response.data?.element ||
          response.data
        );
      } catch (error) {
        return rejectWithValue(
          error.response?.data?.message ||
            "Failed to create campus element"
        );
      }
    }
  );

/* =====================================================
   UPDATE
===================================================== */

export const updateCampusElement =
  createAsyncThunk(
    "campusElements/updateCampusElement",
    async (
      { id, data },
      { rejectWithValue }
    ) => {
      try {
        const response =
          await axios.put(
            `${API_URL}/${id}`,
            data
          );

        return (
          response.data?.data ||
          response.data?.element ||
          response.data
        );
      } catch (error) {
        return rejectWithValue(
          error.response?.data?.message ||
            "Failed to update campus element"
        );
      }
    }
  );

/* =====================================================
   DELETE
===================================================== */

export const deleteCampusElement =
  createAsyncThunk(
    "campusElements/deleteCampusElement",
    async (
      id,
      { rejectWithValue }
    ) => {
      try {
        await axios.delete(
          `${API_URL}/${id}`
        );

        return id;
      } catch (error) {
        return rejectWithValue(
          error.response?.data?.message ||
            "Failed to delete campus element"
        );
      }
    }
  );

/* =====================================================
   INITIAL
===================================================== */

const initialState = {
  elements: [],
  currentElement: null,
  loading: false,
  error: null,
};

/* =====================================================
   SLICE
===================================================== */

const campusElementSlice =
  createSlice({
    name: "campusElements",

    initialState,

    reducers: {
      setCurrentCampusElement: (
        state,
        action
      ) => {
        state.currentElement =
          action.payload;
      },

      clearCurrentCampusElement: (
        state
      ) => {
        state.currentElement = null;
      },

      clearCampusElementError: (
        state
      ) => {
        state.error = null;
      },
    },

    extraReducers: (builder) => {
      builder

        /* FETCH */
        .addCase(
          fetchCampusElements.pending,
          (state) => {
            state.loading = true;
            state.error = null;
          }
        )

        .addCase(
          fetchCampusElements.fulfilled,
          (state, action) => {
            state.loading = false;

            state.elements =
              Array.isArray(
                action.payload
              )
                ? action.payload
                : [];
          }
        )

        .addCase(
          fetchCampusElements.rejected,
          (state, action) => {
            state.loading = false;
            state.error =
              action.payload;
          }
        )

        /* GET ONE */
        .addCase(
          fetchCampusElementById.fulfilled,
          (state, action) => {
            state.currentElement =
              action.payload;
          }
        )

        /* CREATE */
        .addCase(
          createCampusElement.pending,
          (state) => {
            state.loading = true;
            state.error = null;
          }
        )

        .addCase(
          createCampusElement.fulfilled,
          (state, action) => {
            state.loading = false;

            if (action.payload) {
              state.elements.push(
                action.payload
              );

              state.currentElement =
                action.payload;
            }
          }
        )

        .addCase(
          createCampusElement.rejected,
          (state, action) => {
            state.loading = false;
            state.error =
              action.payload;
          }
        )

        /* UPDATE */
        .addCase(
          updateCampusElement.pending,
          (state) => {
            state.loading = true;
            state.error = null;
          }
        )

        .addCase(
          updateCampusElement.fulfilled,
          (state, action) => {
            state.loading = false;

            const updated =
              action.payload;

            if (!updated) return;

            const index =
              state.elements.findIndex(
                (item) =>
                  item._id ===
                  updated._id
              );

            if (index !== -1) {
              state.elements[index] =
                updated;
            }

            if (
              state.currentElement?._id ===
              updated._id
            ) {
              state.currentElement =
                updated;
            }
          }
        )

        .addCase(
          updateCampusElement.rejected,
          (state, action) => {
            state.loading = false;
            state.error =
              action.payload;
          }
        )

        /* DELETE */
        .addCase(
          deleteCampusElement.pending,
          (state) => {
            state.loading = true;
          }
        )

        .addCase(
          deleteCampusElement.fulfilled,
          (state, action) => {
            state.loading = false;

            state.elements =
              state.elements.filter(
                (item) =>
                  item._id !==
                  action.payload
              );

            if (
              state.currentElement?._id ===
              action.payload
            ) {
              state.currentElement =
                null;
            }
          }
        )

        .addCase(
          deleteCampusElement.rejected,
          (state, action) => {
            state.loading = false;
            state.error =
              action.payload;
          }
        );
    },
  });

export const {
  setCurrentCampusElement,
  clearCurrentCampusElement,
  clearCampusElementError,
} =
  campusElementSlice.actions;

export default campusElementSlice.reducer;