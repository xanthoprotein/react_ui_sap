import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  fetchChatsAPI,
  fetchChatUsersAPI,
  saveChatAPI,
  tempPromtSend,
} from "../../utils/api";
import { v4 as uuidv4 } from "uuid";
import {
  clearIndexedDB,
  getChatsFromIndexedDB,
  saveChatToIndexedDB,
  updateCommentInIndexedDB,
  updateFeedbackInIndexedDB,
} from "../../utils/indexdb";

interface ChatMessage {
  id: string;
  sender: "user" | "system";
  message: string;
  timestamp: number;
  ledger?: any;
  feedback?: "up" | "down" | null;
  comment?: string;
}

interface Chat {
  id: string;
  title: string;
  messages: ChatMessage[];
}

interface ChatState {
  chats: Chat[];
  users: any[];
  currentChat: Chat | null;
  loading: boolean;
  error: string | null;
  chatHistory: ChatMessage[];
}

const initialState: ChatState = {
  chats: [],
  users: [],
  currentChat: null,
  chatHistory: [],
  loading: false,
  error: null,
};

export const fetchChats = createAsyncThunk(
  "chat/fetchChats",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchChatsAPI();
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchChatUsers = createAsyncThunk(
  "chat/fetchChatUsers",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchChatUsersAPI();
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const sendPrompt = createAsyncThunk(
  "chat/sendPrompt",
  async (prompt: string, { rejectWithValue }) => {
    try {
      const response = await tempPromtSend(prompt);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const saveChat = createAsyncThunk(
  "chat/saveChat",
  async (chatData: Chat, { rejectWithValue }) => {
    try {
      const response = await saveChatAPI(chatData);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const syncChats = createAsyncThunk(
  "chat/syncChats",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const chats = await getChatsFromIndexedDB();
      await Promise.all(chats.map((chat) => dispatch(saveChat(chat))));
      await clearIndexedDB();
      return chats;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);
export const saveChatToDB = createAsyncThunk(
  "chat/saveChatToDB",
  async (chatData: Chat, { rejectWithValue }) => {
    try {
      await saveChatToIndexedDB(chatData);
      return chatData;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setCurrentChat: (state, action: PayloadAction<Chat>) => {
      state.currentChat = action.payload;
    },
    addChatMessage: (state, action: PayloadAction<ChatMessage>) => {
      state.chatHistory.push(action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    createChat: (state, action: PayloadAction<Chat>) => {
      state.chats.push(action.payload);
    },
    updateChat: (state, action: PayloadAction<Chat>) => {
      const { id, messages } = action.payload;
      const existingChatIndex = state.chats.findIndex((chat) => chat.id === id);

      if (existingChatIndex !== -1) {
        state.chats[existingChatIndex].messages.push(...messages);
      } else {
        state.chats.push(action.payload);
      }
    },
    resetChatHistory: (state) => {
      state.chatHistory = [];
    },
    updateFeedback: (
      state,
      action: PayloadAction<{ id: string; feedback: "up" | "down" | null }>
    ) => {
      const { id, feedback } = action.payload;

      state.chatHistory = state.chatHistory.map((msg) => {
        if (msg.id === id && msg.sender === "system") {
          return {
            ...msg,
            feedback: msg.feedback === feedback ? null : feedback,
          };
        }
        return msg;
      });

      const chatContainingMessage = state.chats.find((chat) =>
        chat.messages.some((msg) => msg.id === id)
      );

      if (chatContainingMessage) {
        chatContainingMessage.messages = chatContainingMessage.messages.map(
          (msg) =>
            msg.id === id && msg.sender === "system"
              ? {
                  ...msg,
                  feedback: msg.feedback === feedback ? null : feedback,
                }
              : msg
        );

        updateFeedbackInIndexedDB(
          chatContainingMessage.id,
          id,
          chatContainingMessage.messages.find((msg) => msg.id === id)
            ?.feedback ?? null
        ).catch((error) => {
          console.error("Error updating feedback in IndexedDB:", error);
        });
      }
    },
    addFeedbackComment: (
      state,
      action: PayloadAction<{ id: string; comment: string }>
    ) => {
      const { id, comment } = action.payload;

      state.chatHistory = state.chatHistory.map((msg) =>
        msg.id === id && msg.sender === "system" ? { ...msg, comment } : msg
      );

      const chatContainingMessage = state.chats.find((chat) =>
        chat.messages.some((msg) => msg.id === id)
      );

      if (chatContainingMessage) {
        chatContainingMessage.messages = chatContainingMessage.messages.map(
          (msg) =>
            msg.id === id && msg.sender === "system" ? { ...msg, comment } : msg
        );

        updateCommentInIndexedDB(chatContainingMessage.id, id, comment).catch(
          (error) => {
            console.error("Error updating comment in IndexedDB:", error);
          }
        );
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchChats.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchChats.fulfilled, (state, action) => {
      state.loading = false;
      state.chats = action.payload;
    });
    builder.addCase(fetchChats.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    builder.addCase(fetchChatUsers.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchChatUsers.fulfilled, (state, action) => {
      state.loading = false;
      state.users = action.payload;
    });
    builder.addCase(fetchChatUsers.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    builder.addCase(sendPrompt.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(sendPrompt.fulfilled, (state, action) => {
      console.log("send prompt fullfilled", action);

      state.loading = false;
    });
    builder.addCase(sendPrompt.rejected, (state, action) => {
      console.log("send prompt rejected", action);

      state.loading = false;
      state.error = action.payload as string;
      const errorMessage = action.payload as string;
    });

    builder.addCase(saveChat.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(saveChat.fulfilled, (state, action) => {
      state.loading = false;
      const { id, messages } = action.payload;
      const existingChatIndex = state.chats.findIndex((chat) => chat.id === id);

      if (existingChatIndex !== -1) {
        state.chats[existingChatIndex].messages.push(...messages);
      } else {
        state.chats.push(action.payload);
      }
    });
    builder.addCase(saveChat.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    builder.addCase(saveChatToDB.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(saveChatToDB.fulfilled, (state, action) => {
      state.loading = false;
      const { id, messages } = action.payload;
      const existingChatIndex = state.chats.findIndex((chat) => chat.id === id);

      if (existingChatIndex !== -1) {
        state.chats[existingChatIndex].messages.push(...messages);
      } else {
        state.chats.push(action.payload);
      }
    });
    builder.addCase(saveChatToDB.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    builder.addCase(syncChats.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(syncChats.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(syncChats.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const {
  setCurrentChat,
  addChatMessage,
  setLoading,
  updateChat,
  createChat,
  resetChatHistory,
  updateFeedback,
  addFeedbackComment,
} = chatSlice.actions;
export default chatSlice.reducer;
