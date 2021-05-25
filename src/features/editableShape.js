import { createSlice } from "@reduxjs/toolkit";

export const editableShapeSlice = createSlice({
  name: "editableShape",
  initialState: {
    nodes: [],
    lines: [],
    hangingLine: {},
    prefixIndex: 0,
    bBox: [],
    snappedNodeIndex: 0,
  },
  reducers: {
    updateNodes: (state, action) => {
      state.nodes = action.payload;
    },
    updateLines: (state, action) => {
      state.lines = action.payload;
    },
    updateHangingLine: (state, action) => {
      state.hangingLine = action.payload;
    },
    updatePrefixIndex: (state, action) => {
      state.prefixIndex = action.payload;
    },
    updateBBox: (state, action) => {
      state.bBox = action.payload;
    },
    updateSnappedNodeIndex: (state, action) => {
      state.snappedNodeIndex = action.payload;
    },
  },
});

export const {
  updateNodes,
  updateLines,
  updateHangingLine,
  updatePrefixIndex,
  updateBBox,
  updateSnappedNodeIndex,
} = editableShapeSlice.actions;

export const getNodes = (state) => state.editableShape.nodes;
export const getLines = (state) => state.editableShape.lines;
export const getHangingLine = (state) => state.editableShape.hangingLine;
export const getPrefixIndex = (state) => state.editableShape.prefixIndex;
export const getBBox = (state) => state.editableShape.bBox;
export const getSnappedNodeIndex = (state) =>
  state.editableShape.snappedNodeIndex;
export const getEditableShape = (state) => state.editableShape;

export default editableShapeSlice.reducer;
