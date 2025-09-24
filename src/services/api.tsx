import axios from "axios";

// baseURL: "http://localhost:3883/"
// baseURL: "https://api-lojas-2025.onrender.com/"
export const api = axios.create({
  baseURL: "https://api-lojas-2025.onrender.com/"
})