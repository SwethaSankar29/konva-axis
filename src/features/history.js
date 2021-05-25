import { createSlice } from "@reduxjs/toolkit";

export const historySlice = createSlice({
  name: "history",
  initialState: {
    past: [],
    future: [],
  },
  reducers: {
    updatePast: (state, action) => {
      state.past = action.payload;
    },
    updateFuture: (state, action) => {
      state.future = action.payload;
    },
  },
});

export const { updatePast, updateFuture } = historySlice.actions;

export const getPast = (state) => state.history.past;
export const getFuture = (state) => state.history.future;

export default historySlice.reducer;
