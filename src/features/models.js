import { createSlice } from "@reduxjs/toolkit";

export const modelsSlice = createSlice({
  name: "models",
  initialState: {
    models: [
      {
        modelName: "Unnamed Model 0",
        modelData: {},
      },
    ],
    currentModel: "Unnamed Model 0",
  },
  reducers: {
    updateModels: (state, action) => {
      state.models = action.payload;
    },
    updateCurrentModelName: (state, action) => {
      state.currentModel = action.payload;
    },
  },
});

export const { updateModels, updateCurrentModelName } = modelsSlice.actions;

export const getModelsData = (state) => state.models.models;
export const getCurrentModel = (state) => state.models.currentModel;

export default modelsSlice.reducer;
