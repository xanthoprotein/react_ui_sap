import React, { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import CustomDropdown from "../components/common/CustomDropdown";
import { useAppSelector, useAppDispatch } from "../redux/hook";
import {
  createChat,
  fetchChats,
  setCurrentChat,
  syncChats,
} from "../redux/slices/chatSlice";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../components/ui/tooltip";

const RightSidebar = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const chats = useAppSelector((state) => state.chat.chats);
  const loading = useAppSelector((state) => state.chat.loading);
  const error = useAppSelector((state) => state.chat.error);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchChats());
  }, [dispatch]);

  const handleNavigateToChat = (chatId: string) => {
    setSelectedChatId(chatId);
    navigate(`/chat/${chatId}`);
  };

  const handleCreateChat = async () => {
    const newChatId = uuidv4();
    const newChat = {
      id: newChatId,
      title: `Chat with User ${newChatId}`,
      messages: [],
    };
    dispatch(syncChats());
    dispatch(setCurrentChat(newChat));
    navigate(`/chat/${newChatId}`);
  };

  const handleCopy = (chatId: string) => {
    const chatToCopy = chats.find((chat) => chat.id === chatId);
    if (chatToCopy) {
      navigator.clipboard.writeText(chatToCopy.title);
      toast.success("Copied to clipboard!");
    }
  };

  const handleRename = (chatId: string) => {
    const newName = prompt("Enter new name:");
    if (newName) {
    }
  };

  const handleDelete = (chatId: string) => {};

  const MAX_TITLE_LENGTH = 32;

  const truncateTitle = (title: string, maxLength: number) => {
    if (title.length <= maxLength) return title;

    const truncateIndex = title.lastIndexOf(" ", maxLength);

    return (
      title.slice(0, truncateIndex === -1 ? maxLength : truncateIndex) + "..."
    );
  };
  return (
    <aside className="w-[197w] md:w-[297px] xl:w-[300px] bg-[#FFFFFF] p-4 md:p-4 flex-shrink-0 relative h-screen">
      <div className="mt-4 mb-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={handleCreateChat}
                className="py-2 px-4 bg-primary text-white w-full hover:bg-blue-700"
              >
                + New Chat
              </Button>
            </TooltipTrigger>
            <TooltipContent className="bg-gray-400 text-white px-4 py-2 rounded-md shadow-lg">
              Start a New Chat
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <hr className="border-t border-gray-300 mt-9 mb-3 w-full" />
      <p className="scroll-m-20 text:base lg:text-base font-semibold tracking-tight mb-2">
        Chat History
      </p>
      <div
        className="overflow-y-auto h-[calc(100vh-200px)]"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "transparent transparent",
        }}
      >
        {chats?.map((chat) => (
          <Card
            key={chat.id}
            className={`px-4 border-none shadow-none py-2 cursor-pointer mb-1 ${
              selectedChatId === chat.id ? "bg-blue-100" : "hover:bg-[#EDF2F4]"
            }`}
            onClick={() => handleNavigateToChat(chat.id)}
          >
            <div className="flex flex-row justify-between items-center">
              <div className="flex flex-row gap-3">
                <MessageCircle />
                <p className="text-sm font-thin hover:font-bold truncate max-w-full">
                  {chat.title.length > MAX_TITLE_LENGTH
                    ? chat.title.slice(0, MAX_TITLE_LENGTH) + "..."
                    : chat.title}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </aside>
  );
};

export default RightSidebar;
