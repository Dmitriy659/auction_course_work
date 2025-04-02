// src/api.js
import axios from "axios";

const API_URL = "http://localhost:8000/api/v1";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

export const getUserAuctions = async () => {
    try {
        const response = await api.get("/auctions/my-auctions/");
        return response.data;
    }
    catch (error) {
        console.error('Error fetching user auctions:', error);
    }
};

export const createAuction = async (auctionData) => {
    try {
        const formData = new FormData();
        for (const key in auctionData) {
            formData.append(key, auctionData[key]);
        }
        const response = await api.post("/auctions/", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
        });
        return response;
    }
    catch(error) {
        console.error("Ошибка при создании аукциона:", error);
    }
};

export default api;
