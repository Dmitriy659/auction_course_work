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

export const login = async (username, password) => {
  try {
    const response = await api.post("/token/", {username, password});
    localStorage.setItem("token", response.data.access);
    localStorage.setItem("refreshToken", response.data.refresh);
    window.dispatchEvent(new Event("storage"));
    return response.data;
  }
  catch (error) {
    console.error("Ошибка входа:", error);
  }
};

export const register = async (userData) => {
  try {
    const response = await api.post("/users/", userData);
    return response.data;
  } catch (error) {
    console.error("Ошибка регистрации:", error);
  }
};

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

export const deleteAuction = async (auctionId) => {
  try {
    const resposne = await api.delete(`/auctions/${auctionId}/`);
    return resposne;
  }
  catch (error) {
    console.error("Ошибка при удалении аукциона:", error);
  }
};

export const updateAuction = async (auctionId, auctionData) => {
  try {
      const formData = new FormData();
      
      for (const key in auctionData) {
          if (auctionData[key] !== null) {
              formData.append(key, auctionData[key]);
          }
      }

      const response = await api.patch(`/auctions/${auctionId}/`, formData, {
          headers: {
              "Content-Type": "multipart/form-data",
          },
      });

      return response.data;
  } catch (error) {
      console.error("Ошибка при обновлении аукциона:", error);
      throw error;
  }
};

export const updateUser = async (userData) => {
  try{
    const response = await api.patch(`/users/update_me/`, userData, {
      headers: {
          "Content-Type": "application/json",
      },
    });
    return response.data;
  }
  catch (error) {
    console.error("Ошибка при обновлении пользователя:", error);
  }
};

export const getUserData = async () => {
  try {
      const response = await api.get("/users/get_me/");
      return response.data;
  } catch (error) {
    console.error("Ошибка при получении данных пользователя:", error);
  }
};

export const getAuctionDetails = async (auctionId) => {
  try {
    const response = await api.get(`/auctions/${auctionId}/`);
    return response.data;
  } catch (error) {
    console.error("Ошибка при получении данных аукциона:", error);
  }
};

export const createBid = async (auctionId, amount) => {
  const response = await api.post("/bids/", {
    amount: amount,
    auction_post: auctionId,
  });
  
  return response.data;
};

export const getMyBids = async () => {
  try {
    const response = await api.get("/bids/my-bids/");
    return response.data;
  } catch (error) {
    console.error("Ошибка при получении ваших заявок:", error);
    return [];
  }
};

export const deleteBid = async(bidId) => {
  try {
    const response = await api.delete(`/bids/${bidId}/`);
    return response;
  }
  catch (error) {
    console.log("Ошибка при удалении заявки");
  }
};

export const getAuctionBids = async (auctionId) => {
  try {
      const response = await api.get(`/bids/auction-bids/${auctionId}/`);
      return response.data;
  } catch (error) {
      console.error("Ошибка при получении заявок аукциона:", error);
  }
};


export default api;
