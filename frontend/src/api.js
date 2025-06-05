// src/api.js
import axios from "axios";

const API_URL = "https://backend-production-6917.up.railway.app/api/v1";

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

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const skipRefresh = originalRequest._skipRefresh || originalRequest.headers?._skipRefresh;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !skipRefresh
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");

        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        const response = await axios.post("http://localhost:8000/api/v1/token/refresh/", {
          refresh: refreshToken,
        });

        const newAccessToken = response.data.access;

        localStorage.setItem("token", newAccessToken);
        api.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        console.warn("Refresh token expired or invalid:", refreshError);
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login"; // редирект на логин
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export const getAuctions = async (url = "/auctions/") => {
  try {
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    console.error("Ошибка при получении аукционов:", error);
    throw error;
  }
};

// Функция для поиска аукционов
export const searchAuctions = async (query) => {
  try {
    const url = `/auctions/?search=${encodeURIComponent(query)}`;
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    console.error("Ошибка при поиске аукционов:", error);
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
};

export const login = async (username, password) => {
  try {
    const response = await api.post("/token/", { username, password }, {
      _skipRefresh: true,
    });

    const { access, refresh } = response.data;

    if (!access || !refresh) {
      throw new Error("Не удалось получить токены");
    }

    localStorage.setItem("token", access);
    localStorage.setItem("refreshToken", refresh);
    window.dispatchEvent(new Event("storage"));

    return response.data;
  } catch (error) {
    throw new Error("Неверный логин или пароль");
  }
};


export const register = async (userData) => {
  try {
    const response = await api.post("/users/", userData, {
      _skipRefresh: true,
    });
    if (response.status !== 201) {
      throw new Error("Ошибка регистрации");
    }
    return response.data;
  } catch (error) {
    if (error.response?.data) {
      const data = error.response.data;

      const messages = Object.entries(data)
        .map(([field, messages]) => `${field}: ${messages.join(", ")}`)
        .join("\n");

      throw new Error(messages);
    }
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

// export const refreshAuthToken = async () => {
//   try {
//     const refreshToken = localStorage.getItem("refreshToken");
//     if (!refreshToken) throw new Error("Нет refresh токена");

//     const response = await api.post("/token/refresh/", {
//       refresh: refreshToken,
//     });

//     const data = response.data;
//     if (data.access) {
//       alert(data.access);
//       localStorage.setItem("token", data.access);
//       window.dispatchEvent(new Event("storage")); // Обновляем Header
//     } else {
//       throw new Error("Не удалось обновить токен");
//     }
//   } catch (error) {
//     console.error("Ошибка обновления токена:", error);
//     throw error;
//   }
// };

// // Функция для проверки авторизации
// export const checkAuth = async () => {
//   const token = localStorage.getItem("token");
//   if (!token) return false;

//   try {
//     const response = await api.get("/protected-endpoint/");
//     return response.status === 200;
//   } catch (error) {
//     return false;
//   }
// };


export default api;
