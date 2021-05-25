import { createSlice } from "@reduxjs/toolkit";

export const nonEditableShapesSlice = createSlice({
  name: "nonEditableShapes",
  initialState: {
    shapes: [],
  },
  reducers: {
    updateShapes: (state, action) => {
      state.shapes = action.payload;
    },
  },
});

export const { updateShapes } = nonEditableShapesSlice.actions;

export const getShapes = (state) => state.nonEditableShapes.shapes;
export const getNonEditableShapes = (state) => state.nonEditableShapes;

export default nonEditableShapesSlice.reducer;
