import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { axiosInstance } from "@/utils/axiosInstance";


// Initial state
const initialState: TasksState = {
  tasks: [],
  task: null,
  loading: false,
  error: null,
};


// Async thunk to fetch all tasks
export const fetchTasks = createAsyncThunk<
  Task[],
  { page: number; limit: number },
  { rejectValue: string }
>("tasks/fetchTasks", async ({ page, limit }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get<Task[]>(
      `?page=${page}&limit=${limit}`
    );
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(
        error.response.data.message || "Failed to fetch tasks"
      );
    }
    return rejectWithValue("An unknown error occurred");
  }
});

// Async thunk to create a new task
export const createTask = createAsyncThunk<
  Task,
  Omit<Task, "id" | "createdAt" | "updatedAt">,
  { rejectValue: string }
>("tasks/createTask", async (taskData, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post<Task>("/", taskData);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(
        error.response.data.message || "Failed to create task"
      );
    }
    return rejectWithValue("An unknown error occurred");
  }
});

// Async thunk to fetch a single task by ID
export const fetchTaskById = createAsyncThunk<
  Task,
  string,
  { rejectValue: string }
>("tasks/fetchTaskById", async (id, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get<Task>(`/${id}`);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(
        error.response.data.message || "Failed to fetch task"
      );
    }
    return rejectWithValue("An unknown error occurred");
  }
});

// Async thunk to update a task by ID
export const updateTask = createAsyncThunk<
  Task,
  { id: string; taskData: Partial<Task> },
  { rejectValue: string }
>("tasks/updateTask", async ({ id, taskData }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.put<Task>(`/${id}`, taskData);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(
        error.response.data.message || "Failed to update task"
      );
    }
    return rejectWithValue("An unknown error occurred");
  }
});

// Async thunk to delete a task by ID
export const deleteTask = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("tasks/deleteTask", async (id, { rejectWithValue }) => {
  try {
    await axiosInstance.delete(`/${id}`);
    return id;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(
        error.response.data.message || "Failed to delete task"
      );
    }
    return rejectWithValue("An unknown error occurred");
  }
});

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Fetch all tasks
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch tasks";
      });

    // Create a new task
    builder
      .addCase(createTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks.push(action.payload);
      })
      .addCase(createTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to create task";
      });

    // Fetch a single task by ID
    builder
      .addCase(fetchTaskById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTaskById.fulfilled, (state, action) => {
        state.loading = false;
        state.task = action.payload;
      })
      .addCase(fetchTaskById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch task";
      });

    // Update a task by ID
    builder
      .addCase(updateTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.loading = false;
        const updatedTask = action.payload;
        state.tasks = state.tasks.map((task) =>
          task.id === updatedTask.id ? updatedTask : task
        );
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update task";
      });

    // Delete a task by ID
    builder
      .addCase(deleteTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = state.tasks.filter((task) => task.id !== action.payload);
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to delete task";
      });
  },
});

export default tasksSlice.reducer;
