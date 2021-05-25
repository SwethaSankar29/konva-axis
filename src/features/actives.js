import { createSlice } from "@reduxjs/toolkit";

export const activesSlice = createSlice({
    name: "actives",
    initialState: {
        cursorPoint: { x: 0, y: 0 },
        currentTool: "selection",
        selectedNodes: [],
        selectedLines: [],
        isSingleEscapePressed: false,
        draggableNode: null,
        disableDrawing: false,
        disableEvents: false,
        cursorDownPoint: { x: 0, y: 0 },
        needlePoint: [0, 0],
        zoomFactor: { x: 1, y: 1 },
        offsetFactor: { x: 0, y: 0 },
    },
    reducers: {
        updateCursorPoint: (state, action) => {
            state.cursorPoint = action.payload;
        },
        updateCurrentTool: (state, action) => {
            state.currentTool = action.payload;
        },
        updateSelectedNodes: (state, action) => {
            state.selectedNodes = action.payload;
        },
        updateSelectedLines: (state, action) => {
            state.selectedLines = action.payload;
        },
        updateSingleEscapePress: (state, action) => {
            state.isSingleEscapePressed = action.payload;
        },
        updateDraggableNode: (state, action) => {
            state.draggableNode = action.payload;
        },
        updateDisableDrawing: (state, action) => {
            state.disableDrawing = action.payload;
        },
        updateDisableEvents: (state, action) => {
            state.disableEvents = action.payload;
        },
        updateCursorDownPoint: (state, action) => {
            state.cursorDownPoint = action.payload;
        },
        updateNeedlePoint: (state, action) => {
            state.needlePoint = action.payload;
        },
        updateZoomFactor: (state, action) => {
            state.zoomFactor = action.payload;
        },
        updateOffsetFactor: (state, action) => {
            state.offsetFactor = action.payload;
        },
    },
});

export const {
    updateCursorPoint,
    updateCurrentTool,
    updateSelectedNodes,
    updateSelectedLines,
    updateSingleEscapePress,
    updateDraggableNode,
    updateDisableDrawing,
    updateDisableEvents,
    updateCursorDownPoint,
    updateNeedlePoint,
    updateZoomFactor,
    updateOffsetFactor,
} = activesSlice.actions;

export const getCursorPoint = (state) => state.actives.cursorPoint;
export const getCurrentTool = (state) => state.actives.currentTool;
export const getSelectedNodes = (state) => state.actives.selectedNodes;
export const getSelectedLines = (state) => state.actives.selectedLines;
export const getSingleEscapePressed = (state) =>
    state.actives.isSingleEscapePressed;
export const getDraggableNode = (state) => state.actives.draggableNode;
export const getDisableDrawing = (state) => state.actives.disableDrawing;
export const getDisableEvents = (state) => state.actives.disableEvents;
export const getCursorDownPoint = (state) => state.actives.cursorDownPoint;
export const getNeedlePoint = (state) => state.actives.needlePoint;
export const getZoomFactor = (state) => state.actives.zoomFactor;
export const getOffsetFactor = (state) => state.actives.offsetFactor;
export const getActives = (state) => state.actives;

export default activesSlice.reducer;