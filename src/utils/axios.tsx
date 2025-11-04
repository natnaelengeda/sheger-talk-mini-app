import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL,
  timeout: 30000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'x-api-key': import.meta.env.VITE_SERVER_API_KEY,
  }
});

export default instance;