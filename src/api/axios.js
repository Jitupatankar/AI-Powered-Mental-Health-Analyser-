import axios from "axios";

// Use same-origin in production, localhost in development
const api = axios.create({
  baseURL:
    process.env.NODE_ENV === "production"
      ? "" // same domain on Render
      : "http://localhost:5000", // local backend
});

export default api;
