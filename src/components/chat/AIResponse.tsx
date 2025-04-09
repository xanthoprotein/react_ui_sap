import React from "react";
import { Bot, ThumbsUp, ThumbsDown, Copy, Check } from "lucide-react";
import { formatTimeAgo } from "../../utils/formatTimeAgo";
import { parseMarkdown } from "../../utils/parseMarkdown";
import LedgerGrid from "./LedgerGrid";
import ChatBot from "../../assets/chatbot.png";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

export default function AIResponse({
  id,
  message,
  timestamp,
  ledgerData,
  feedback,
  onThumbsUp,
  onThumbsDown,
  onCopy,
  copied,
  showCommentBox,
  comment,
  onCommentChange,
  onSubmitFeedback,
  onCloseCommentBox,
}: {
  id: string;
  message: string;
  timestamp: number;
  ledgerData?: Record<string, any>[];
  feedback: "up" | "down" | null;
  onThumbsUp: () => void;
  onThumbsDown: () => void;
  onCopy: () => void;
  copied: boolean;
  showCommentBox: boolean;
  comment: string;
  onCommentChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmitFeedback: () => void;
  onCloseCommentBox: () => void;
}) {
  return (
    <div className="mb-4">
      <div className="flex justify-start relative">
        <img
          src={ChatBot}
          alt="Chatbot Icon"
          className="p-1 w-8 h-8 rounded-lg shadow-none mr-2"
        />
        <div className="p-3 rounded-lg bg-gray-200 text-black max-w-[90%] relative">
          <p className="text-sm">{parseMarkdown(message)}</p>
          {ledgerData && <LedgerGrid ledgers={ledgerData} />}
          <p className="text-xs text-gray-400 mt-1">
            {formatTimeAgo(timestamp)}
          </p>
        </div>
      </div>

      {message !== "Network Error" && (
        <div className="flex items-center gap-2 mt-2 ml-10">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={onThumbsUp}
                  aria-label="Thumbs Up"
                  className={`flex items-center gap-2 px-2 py-1 rounded-full border transition ${
                    feedback === "up"
                      ? "bg-green-100 text-green-600 border-green-500"
                      : "bg-white hover:bg-gray-100 border-gray-300"
                  }`}
                >
                  <ThumbsUp size={16} />
                </button>
              </TooltipTrigger>
              <TooltipContent className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-lg">
                <p>I like this one</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={onThumbsDown}
                  aria-label="Thumbs Down"
                  className={`flex items-center gap-2 px-2 py-1 rounded-full border transition ${
                    feedback === "down"
                      ? "bg-red-100 text-red-600 border-red-500"
                      : "bg-white hover:bg-gray-100 border-gray-300"
                  }`}
                >
                  <ThumbsDown size={16} />
                </button>
              </TooltipTrigger>
              <TooltipContent className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-lg">
                <p>I don't like this one</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={onCopy}
                  aria-label="Copy"
                  className="flex items-center gap-2 px-2 py-1 rounded-full border bg-white hover:bg-gray-100 border-gray-300 transition"
                >
                  {copied ? (
                    <Check size={16} data-testid="check-icon" />
                  ) : (
                    <Copy size={16} data-testid="copy-icon" />
                  )}
                </button>
              </TooltipTrigger>
              <TooltipContent className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-lg">
                <p>Copy to clipboard</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )}

      {showCommentBox && (
        <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-md flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-lg relative animate-fade-in">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              We value your feedback
            </h3>
            <textarea
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none min-h-[120px] transition"
              placeholder="Tell us what went wrong..."
              value={comment}
              onChange={onCommentChange}
            />
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={onSubmitFeedback}
                disabled={!comment}
                aria-label="Submit"
                className={`px-5 py-2 rounded-lg transition shadow-md ${
                  !comment
                    ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                    : "bg-blue-500 text-white hover:bg-blue-700"
                }`}
              >
                Submit
              </button>
            </div>
            <button
              onClick={onCloseCommentBox}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
