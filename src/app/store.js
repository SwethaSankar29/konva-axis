import { configureStore } from "@reduxjs/toolkit";
import models from "../features/models";
import actives from "../features/actives";
import history from "../features/history";
import editableShape from "../features/editableShape";
import nonEditableShapes from "../features/nonEditableShapes";

export const store = configureStore({
  reducer: {
    models,
    actives,
    editableShape,
    nonEditableShapes,
    history,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
