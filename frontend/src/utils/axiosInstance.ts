import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://task-management-system-w0tv.onrender.com/tasks",
});
