import { openDB, DBSchema, IDBPDatabase } from "idb";

interface ChatDB extends DBSchema {
  chats: {
    key: string;
    value: {
      id: string;
      title: string;
      messages: Array<{
        id: string;
        sender: "user" | "system";
        message: string;
        timestamp: number;
        ledger?: any;
        feedback?: "up" | "down" | null;
        comment?: string;
      }>;
    };
  };
}

const DB_NAME = "chatDB";
const STORE_NAME = "chats";

const initDB = async (): Promise<IDBPDatabase<ChatDB>> => {
  return openDB<ChatDB>(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    },
  });
};

export const saveChatToIndexedDB = async (
  chatData: ChatDB["chats"]["value"]
): Promise<void> => {
  const db = await initDB();
  const tx = db.transaction(STORE_NAME, "readwrite");
  const store = tx.objectStore(STORE_NAME);

  const existingChat = await store.get(chatData.id);
  if (existingChat) {
    const newMessages = chatData.messages.filter((newMessage) => {
      return !existingChat.messages.some(
        (existingMessage) =>
          existingMessage.id === newMessage.id ||
          existingMessage.timestamp === newMessage.timestamp
      );
    });

    if (newMessages.length > 0) {
      existingChat.messages.push(...newMessages);
      await store.put(existingChat);
    }
  } else {
    await store.put(chatData);
  }

  await tx.done;
};

export const updateFeedbackInIndexedDB = async (
  chatId: string,
  messageId: string,
  feedback: "up" | "down" | null
): Promise<void> => {
  const db = await initDB();
  const tx = db.transaction(STORE_NAME, "readwrite");
  const store = tx.objectStore(STORE_NAME);

  const chatData = await store.get(chatId);

  if (chatData) {
    chatData.messages = chatData.messages.map((msg) =>
      msg.id === messageId && msg.sender === "system"
        ? { ...msg, feedback }
        : msg
    );
    await store.put(chatData);
  } else {
    console.warn(`Chat with ID ${chatId} not found in IndexedDB.`);
  }

  await tx.done;
};

export const updateCommentInIndexedDB = async (
  chatId: string,
  messageId: string,
  comment: string
): Promise<void> => {
  const db = await initDB();
  const tx = db.transaction(STORE_NAME, "readwrite");
  const store = tx.objectStore(STORE_NAME);

  const chatData = await store.get(chatId);

  if (chatData) {
    chatData.messages = chatData.messages.map((msg) =>
      msg.id === messageId && msg.sender === "system"
        ? { ...msg, comment }
        : msg
    );
    await store.put(chatData);
  } else {
    console.warn(`Chat with ID ${chatId} not found in IndexedDB.`);
  }

  await tx.done;
};
export const getChatsFromIndexedDB = async (): Promise<
  ChatDB["chats"]["value"][]
> => {
  const db = await initDB();
  const tx = db.transaction(STORE_NAME, "readonly");
  const store = tx.objectStore(STORE_NAME);
  return store.getAll();
};

export const removeChatFromIndexedDB = async (id: string): Promise<void> => {
  const db = await initDB();
  const tx = db.transaction(STORE_NAME, "readwrite");
  const store = tx.objectStore(STORE_NAME);
  await store.delete(id);
  await tx.done;
};

export const clearIndexedDB = async (): Promise<void> => {
  const db = await initDB();
  const tx = db.transaction(STORE_NAME, "readwrite");
  const store = tx.objectStore(STORE_NAME);
  await store.clear();
  await tx.done;
};

export const getChatFromIndexedDB = async (
  id: string
): Promise<ChatDB["chats"]["value"] | undefined> => {
  const db = await initDB();
  const tx = db.transaction(STORE_NAME, "readonly");
  const store = tx.objectStore(STORE_NAME);
  return store.get(id);
};
