import React, { useState } from "react";
import { ThumbsUp, ThumbsDown, Copy, Check } from "lucide-react";

export default function Feedback({
  message,
  onCopy,
}: {
  message: string;
  onCopy: () => void;
}) {
  const [feedback, setFeedback] = useState<"up" | "down" | null>(null);
  const [comment, setComment] = useState("");
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleThumbsUp = () => {
    setFeedback((prev) => (prev === "up" ? null : "up"));
    setShowCommentBox(false);
    console.log("Feedback submitted: 👍 Thumbs Up");
  };

  const handleThumbsDown = () => {
    setFeedback((prev) => (prev === "down" ? null : "down"));
    setShowCommentBox(feedback !== "down");
  };

  const handleCopy = () => {
    onCopy();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmitFeedback = () => {
    console.log("Submitted Feedback:", {
      feedback: "👎 Thumbs Down",
      comment,
    });
    setShowCommentBox(false);
    setComment("");
  };

  return (
    <div className="flex items-center gap-2 mt-2 ml-10">
      <button
        onClick={handleThumbsUp}
        className={`flex items-center gap-2 px-2 py-1 rounded-full border transition ${
          feedback === "up"
            ? "bg-green-100 text-green-600 border-green-500"
            : "bg-white hover:bg-gray-100 border-gray-300"
        }`}
      >
        <ThumbsUp size={16} />
      </button>
      <button
        onClick={handleThumbsDown}
        className={`flex items-center gap-2 px-2 py-1 rounded-full border transition ${
          feedback === "down"
            ? "bg-red-100 text-red-600 border-red-500"
            : "bg-white hover:bg-gray-100 border-gray-300"
        }`}
      >
        <ThumbsDown size={16} />
      </button>
      <button
        onClick={handleCopy}
        className="flex items-center gap-2 px-2 py-1 rounded-full border bg-white hover:bg-gray-100 border-gray-300 transition"
      >
        {copied ? <Check size={16} /> : <Copy size={16} />}
      </button>

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
              onChange={(e) => setComment(e.target.value)}
            />
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={handleSubmitFeedback}
                disabled={comment === ""}
                className={`px-5 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-700 transition shadow-md ${
                  comment === ""
                    ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                    : "bg-primary text-white hover:bg-primaryHover"
                }`}
              >
                Submit
              </button>
            </div>
            <button
              onClick={() => setShowCommentBox(false)}
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
