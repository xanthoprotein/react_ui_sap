import axios from "axios";
import api from "./axiosConfig";

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
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
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("authToken");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const fetchUsers = async () => {
  const response = await api.get("/users");
  return response.data;
};

export const deleteUser = async (userId: string) => {
  await api.delete(`/users/${userId}`);
};

export const login = async (email: string) => {
  const response = await api.post("/auth", { email });
  const hardcodedResponse = {
    token: "hardcoded_token",
    role: "developer",
    userId: "fdhjhj4h434",
  };
  console.log("response", hardcodedResponse);
  return hardcodedResponse;
};

export const fetchChatsAPI = async () => {
  const response = await api.get("/chats");
  return response.data;
};

export const fetchChatUsersAPI = async () => {
  const response = await api.get("/users");
  return response.data;
};

export const saveChatAPI = async (chatData: any) => {
  try {
    const response = await api.get("/chats");
    const existingChats = response.data;

    const existingChatIndex = existingChats.findIndex(
      (chat: any) => chat.id === chatData.id
    );

    if (existingChatIndex !== -1) {
      const updatedChat = {
        ...existingChats[existingChatIndex],
        messages: [
          ...existingChats[existingChatIndex].messages,
          ...chatData.messages,
        ],
      };

      const updateResponse = await api.put(
        `/chats/${chatData.id}`,
        updatedChat
      );
      return updateResponse.data;
    } else {
      const createResponse = await api.post("/chats", chatData);
      return createResponse.data;
    }
  } catch (error) {
    console.error("Failed to save chat:", error);
    throw error;
  }
};

export const tempPromtSend = async (prompt: string) => {
  try {
    const response = await axios.post("http://localhost:8000/message", [
      {
        role: "user",
        content: prompt,
      },
    ]);
    return response.data;
  } catch (error) {
    console.error("Failed to send prompt:", error);
    throw error;
  }
};

export default api;
