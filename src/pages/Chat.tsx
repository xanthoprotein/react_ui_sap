import React, { useEffect, useRef, useState } from "react";
import PromptField from "../components/PromtField";
import PromptBar from "../components/PromtBar";
import AIResponse from "../components/chat/AIResponse";
import { useNavigate, useParams } from "react-router-dom";
import ChatQuery from "../components/chat/ChatQuery";
import { useAppDispatch, useAppSelector } from "../redux/hook";
import {
  addChatMessage,
  resetChatHistory,
  saveChatToDB,
  sendPrompt,
  setCurrentChat,
  setLoading,
  syncChats,
  fetchChats,
  addFeedbackComment,
  updateFeedback,
} from "../redux/slices/chatSlice";
import { SwitchDemo } from "../components/common/CustomSwitch";
import ReponseBuffer from "../components/chat/ResponseBuffer";
import InformationIcon from "../assets/information.png";
import { v4 as uuidv4 } from "uuid";
import { LedgerRetriever } from "../utils/LedgerRetriever";

export default function ChatPage() {
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const [isPromptCardVisible, setIsPromptCardVisible] = useState(false);
  const dispatch = useAppDispatch();
  const chatHistory = useAppSelector((state) => state.chat.chatHistory);
  const isLoading = useAppSelector((state) => state.chat.loading);
  const error = useAppSelector((state) => state.chat.error);
  const [isToggled, setToggled] = useState(false);

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showCommentBoxId, setShowCommentBoxId] = useState<string | null>(null);
  const [comment, setComment] = useState("");

  const { chatId } = useParams();
  const chats = useAppSelector((state) => state.chat.chats);
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const [syncProgress, setSyncProgress] = useState("Saving your chat...");

  const togglePromptCard = () => {
    setIsPromptCardVisible((prev) => !prev);
  };

  useEffect(() => {
    if (!chatId) {
      const currentChatId = uuidv4();
      const newChat = {
        id: currentChatId,
        title: `Chat ${currentChatId}`,
        messages: [],
      };
      dispatch(setCurrentChat(newChat));
      navigate(`/chat/${currentChatId}`, { replace: true });
    }
  }, [chatId]);

  useEffect(() => {
    dispatch(fetchChats());
  }, [dispatch]);

  const handleThumbsUp = (id: string) => {
    dispatch(updateFeedback({ id, feedback: "up" }));
    setShowCommentBoxId(null);
  };

  const handleThumbsDown = (id: string) => {
    const chatMessage = chatHistory.find((msg) => msg.id === id);
    const isCurrentlyDown = chatMessage?.feedback === "down";

    dispatch(updateFeedback({ id, feedback: isCurrentlyDown ? null : "down" }));

    setShowCommentBoxId(isCurrentlyDown ? null : id);
  };

  const handleCopy = async (
    id: string,
    message: string,
    ledgerData?: Record<string, any>[]
  ) => {
    let textToCopy = message;

    if (ledgerData && ledgerData.length > 0) {
      const headers = Object.keys(ledgerData[0]);
      const colWidths = headers.map((header) =>
        Math.max(
          header.length,
          ...ledgerData.map((row) => String(row[header]).length)
        )
      );

      const formatRow = (row: string[]) =>
        row.map((cell, i) => cell.padEnd(colWidths[i], " ")).join(" | ");

      let plainTextTable = "\n\nLedger Data:\n";
      plainTextTable += formatRow(headers) + "\n";
      plainTextTable += colWidths.map((w) => "-".repeat(w)).join("-|-") + "\n";
      ledgerData.forEach((entry) => {
        const row = headers.map((header) => String(entry[header]));
        plainTextTable += formatRow(row) + "\n";
      });

      textToCopy += plainTextTable;

      let htmlTable = `<p>${message}</p><br/><table border="1" style="border-collapse: collapse;">`;
      htmlTable += `<tr>${headers
        .map((header) => `<th style="padding:5px;">${header}</th>`)
        .join("")}</tr>`;
      ledgerData.forEach((entry) => {
        htmlTable += `<tr>${headers
          .map((header) => `<td style="padding:5px;">${entry[header]}</td>`)
          .join("")}</tr>`;
      });
      htmlTable += `</table>`;

      try {
        if (typeof ClipboardItem !== "undefined") {
          const blobHTML = new Blob([htmlTable], { type: "text/html" });
          const blobText = new Blob([textToCopy], { type: "text/plain" });

          await navigator.clipboard.write([
            new ClipboardItem({
              "text/html": blobHTML,
              "text/plain": blobText,
            }),
          ]);
        } else {
          await navigator.clipboard.writeText(textToCopy);
        }

        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
      } catch (err) {
        console.error("Failed to copy:", err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(textToCopy);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
      } catch (err) {
        console.error("Failed to copy:", err);
      }
    }
  };

  const handleSubmitFeedback = (id: string) => {
    dispatch(addFeedbackComment({ id, comment }));
    setShowCommentBoxId(null);
    setComment("");
  };

  const handlePromptSend = async (prompt: string) => {
    if (!prompt.trim()) return;

    dispatch(setLoading(true));

    const newMessage = {
      id: uuidv4(),
      sender: "user" as const,
      message: prompt,
      timestamp: Date.now(),
    };

    const chatData = {
      id: chatId || uuidv4(),
      title: `${prompt}`,
      messages: [newMessage],
    };
    await dispatch(saveChatToDB(chatData));

    dispatch(addChatMessage(newMessage));

    const simulatedResponse = `AI Response to: "${prompt}"`;
    const ledgerData = LedgerRetriever(prompt);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const systemMessage = {
      id: uuidv4(),
      sender: "system" as const,
      message: simulatedResponse,
      ledger: ledgerData && ledgerData,
      timestamp: Date.now(),
    };

    const updatedChatData = {
      ...chatData,
      messages: [...chatData.messages, systemMessage],
    };
    await dispatch(saveChatToDB(updatedChatData));

    dispatch(addChatMessage(systemMessage));
    dispatch(setLoading(false));
  };

  const handlePromptSendFromSlice = async (prompt: string) => {
    if (!prompt.trim()) return;

    const newMessage = {
      id: uuidv4(),
      sender: "user" as const,
      message: prompt,
      timestamp: Date.now(),
    };

    const chatData = {
      id: chatId || uuidv4(),
      title: `${prompt}`,
      messages: [newMessage],
    };
    await dispatch(saveChatToDB(chatData));

    dispatch(addChatMessage(newMessage));

    const response = await dispatch(sendPrompt(prompt));

    const systemMessage = {
      id: uuidv4(),
      sender: "system" as const,
      message: response.payload,
      timestamp: Date.now(),
    };

    const updatedChatData = {
      ...chatData,
      messages: [...chatData.messages, systemMessage],
    };
    await dispatch(saveChatToDB(updatedChatData));

    dispatch(addChatMessage(systemMessage));
  };

  useEffect(() => {
    if (chatId) {
      dispatch(resetChatHistory());

      const selectedChat = chats.find((chat) => chat.id === chatId);
      if (selectedChat) {
        dispatch(setCurrentChat(selectedChat));

        const addedTimestamps = new Set<number>();
        selectedChat.messages.forEach((message) => {
          if (!addedTimestamps.has(message.timestamp)) {
            dispatch(
              addChatMessage({
                id: message.id || uuidv4(),
                sender: message.sender as "user" | "system",
                message: message.message,
                ledger: message.ledger,
                timestamp: message.timestamp,
                feedback: message.feedback || null,
                comment: message.comment || "",
              })
            );
            addedTimestamps.add(message.timestamp);
          }
        });
      }
    }
  }, [chatId]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
      setTimeout(() => {
        chatContainerRef.current!.scrollTop =
          chatContainerRef.current!.scrollHeight;
      }, 100);
    }
  }, [chatHistory, isLoading]);

  useEffect(() => {
    const handleSync = () => {
      setIsSyncing(true);
      setSyncProgress("Saving your chat...");
      dispatch(syncChats())
        .then(() => {
          setSyncProgress("Chat saved successfully.");
          setTimeout(() => {
            setIsSyncing(false);
          }, 1500);
        })
        .catch(() => {
          setSyncProgress("Failed to save chat. Try again.");
        });
    };

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      handleSync();

      const message =
        "Your chat is being saved. Are you sure you want to leave?";
      e.returnValue = message;
      return message;
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [dispatch]);

  {
    isSyncing && (
      <>
        <div className="progress-bar">
          <p>Saving your chat...</p>
          <div className="spinner"></div>
        </div>
      </>
    );
  }

  return (
    <div className="flex flex-col px-5 h-screen bg-gray-100">
      <div className="flex flex-col items-start px-0">
        <div className="flex items-center justify-between w-full">
          <div
            className={`text-2xl font-medium leading-none tracking-tight ${
              isToggled ? "mb-4 mt-12" : "mb-4 mt-12"
            }`}
          >
            Welcome to the PayPal AI Assistant
          </div>

          <SwitchDemo
            isToggled={isToggled}
            setToggled={setToggled}
            className="mt-8"
          />
        </div>
        {isToggled && (
          <div className="text-xs text-gray-500 m-0 flex flex-center">
            <img
              src={InformationIcon}
              alt="Chatbot Icon"
              className="p-0 w-4 h-4 shadow-none mr-1"
            />
            Disclaimer: The following view illustrates simulated queries with
            sample outputs. The datapoints listed here are just used for demo
            purposes and do not represent actual PayPal data in any form.
          </div>
        )}
      </div>

      <hr
        className={`border-t border-gray-300 w-full ${
          isToggled ? "mt-1 mb-5" : "my-5"
        }`}
      />

      <div
        className="flex-1 overflow-auto p-5 mb-5 pb-5"
        ref={chatContainerRef}
      >
        {chatHistory.map((chat, index) =>
          chat.sender === "user" ? (
            <ChatQuery
              key={index}
              id={chat.id}
              message={chat.message}
              timestamp={chat.timestamp}
            />
          ) : (
            <AIResponse
              key={index}
              id={chat.id}
              message={chat.message}
              timestamp={chat.timestamp}
              ledgerData={chat.ledger}
              feedback={chat.feedback || null}
              onThumbsUp={() => handleThumbsUp(chat.id)}
              onThumbsDown={() => handleThumbsDown(chat.id)}
              onCopy={() => handleCopy(chat.id, chat.message, chat.ledger)}
              copied={copiedId === chat.id}
              showCommentBox={showCommentBoxId === chat.id}
              comment={comment}
              onCommentChange={(e) => setComment(e.target.value)}
              onSubmitFeedback={() => handleSubmitFeedback(chat.id)}
              onCloseCommentBox={() => setShowCommentBoxId(null)}
            />
          )
        )}
        {isLoading && <ReponseBuffer />}
      </div>
      <PromptBar isVisible={isPromptCardVisible} onClose={togglePromptCard} />
      <PromptField
        onSend={!isToggled ? handlePromptSendFromSlice : handlePromptSend}
        onTogglePromptCard={togglePromptCard}
        isLoading={isLoading}
      />
    </div>
  );
}
