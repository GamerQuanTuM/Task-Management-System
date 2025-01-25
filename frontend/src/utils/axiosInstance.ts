import axios from "axios";

// Create an Axios instance with a base URL
export const axiosInstance = axios.create({
  baseURL: "https://task-management-system-w0tv.onrender.com/tasks", // Replace with your base URL
});
