import { Bot } from "lucide-react";
import ChatBot from "../../assets/chatbot.png";

const ReponseBuffer = () => {
  return (
    <div className="flex justify-start mb-2 ">
      <img
        src={ChatBot}
        alt="Chatbot Icon"
        className="p-1 w-8 h-8  rounded-lg shadow-none mr-2"
      />
      <div className="p-3 rounded-lg bg-gray-200 text-black">
        <div className="typing-animation">
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
        </div>
      </div>
    </div>
  );
};

export default ReponseBuffer;
