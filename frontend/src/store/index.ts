import { configureStore } from "@reduxjs/toolkit";

import tasksReducer from "@/slices/tasks";

export const store = configureStore({
  reducer: {
    tasksReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
