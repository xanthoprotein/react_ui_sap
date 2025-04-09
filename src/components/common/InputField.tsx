import React, { useEffect, useRef } from "react";
import { Textarea } from "../ui/Textarea";

interface InputFieldProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  className?: string;
  onKeyDown?: (event: React.KeyboardEvent) => void;
  placeholder?: string;
  disabled?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
  value,
  onChange,
  className = "",
  onKeyDown,
  placeholder = "Type here...",
  disabled = false,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const urlRegex = /^(https?:\/\/[^\s$.?#].[^\s]*)$/;
  const isUrl = urlRegex.test(value);

  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "3rem";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  useEffect(() => {
    adjustHeight();
  }, [value]);

  return (
    <Textarea
      ref={textareaRef}
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
      placeholder={placeholder}
      disabled={disabled}
      aria-label="Input field"
      className={`w-full min-h-[40px] max-h-[250px] overflow-y-auto resize-none p-3 prounded-lg border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:ring-offset-2 ${
        isUrl ? "underline text-blue-600" : ""
      } ${className}`}
      onInput={adjustHeight}
    />
  );
};

export default InputField;
