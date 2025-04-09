import React, { useState } from "react";
import { BookOpen, Paperclip, Send } from "lucide-react";
import InputField from "./common/InputField";
import { ButtonWithIcon } from "./common/ButtonWithIcon";

interface PromptFieldProps {
  onSend: (prompt: string) => void;
  placeholder?: string;
  onTogglePromptCard?: () => void;
  isLoading: boolean;
}

const PromptField: React.FC<PromptFieldProps> = ({
  onSend,
  placeholder = "Enter your prompt...",
  onTogglePromptCard,
  isLoading,
}) => {
  const [prompt, setPrompt] = useState<string>("");

  const handleSend = () => {
    if (prompt.trim()) {
      onSend(prompt);
      setPrompt("");
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col w-full mt-0">
      <div className="flex items-end w-full space-x-2">
        <div className="relative flex-grow">
          <InputField
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder={placeholder}
            disabled={isLoading}
            className="pr-10 min-h-[40px] max-h-[250px] overflow-y-auto"
          />

          <div className="absolute right-4 bottom-3 text-[#212121]">
            <Paperclip size={20} strokeWidth={1.5} />
          </div>
        </div>

        <button
          onClick={handleSend}
          disabled={isLoading || !prompt.trim()}
          className={`flex items-center justify-center px-4 py-2 h-[45px] rounded-md transition duration-200 ${
            isLoading || !prompt.trim()
              ? "bg-gray-400 text-gray-200 cursor-not-allowed"
              : "bg-primary text-white hover:bg-primaryHover"
          }`}
        >
          <Send size={20} className="mr-2" />
          Send
        </button>
      </div>

      <div className="flex justify-end items-center w-full mt-2">
        <ButtonWithIcon icon={<BookOpen />} text="Terms and Conditions" />
      </div>
    </div>
  );
};

export default PromptField;
