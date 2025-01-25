import axios from "axios";

// Create an Axios instance with a base URL
export const axiosInstance = axios.create({
  baseURL: "http://localhost:8000/tasks", // Replace with your base URL
});
