import { prettifyDates } from "./format";

// Common settings for talking to the backend
export const API_BASE = `${import.meta.env.VITE_API_BASE_URL || "http://localhost:8080"}/api`;

// Turns an error from axios into a message we can show on screen
export const getErrorMessage = (err) => {
  const data = err.response?.data;
  if (!data) return "Unable to connect to the server.";
  if (typeof data === "string") return prettifyDates(data);
  return prettifyDates(data.message || data.error || "Something went wrong.");
};
