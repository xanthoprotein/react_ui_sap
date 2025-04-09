import * as React from "react";
import { Edit, Lightbulb, MessageCircle } from "lucide-react";
import { Button } from "./ui/button";

interface PromptBarProps {
  isVisible: boolean;
  onClose: () => void;
  className?: string;
}

const PromptBar: React.FC<PromptBarProps> = ({
  isVisible,
  onClose,
  className,
}) => {
  const promptBarRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        promptBarRef.current &&
        !promptBarRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  if (!isVisible) return null;

  return (
    <div
      ref={promptBarRef}
      className=" absolute top-[58vh] w-[200px] lg:w-[400px] h-auto p-[8px_0] gap-2 border rounded-xl bg-white shadow-lg opacity-100 transition-all ${className} "
    >
      <div className="text-sm xl:text-base font-semibold px-4 py-2">
        Prompts
      </div>

      <div className="flex flex-col gap-1 px-2">
        <Button className="flex items-center justify-between w-full h-[42px] px-4 gap-2 bg-transparent border border-[#ECE7DF] rounded-xl text-[#34373F] hover:bg-[primary] hover:text-white hover:font-semibold">
          <span className="flex items-center gap-3 ">
            <Edit /> Create
          </span>
          <span className="text-lg">{">"}</span>
        </Button>
        <Button className="flex items-center justify-between w-full h-[42px] px-4 gap-2 bg-transparent border border-[#ECE7DF] rounded-xl text-[#34373F] hover:bg-[primary] hover:text-white  hover:font-semibold">
          <span className="flex items-center gap-3">
            <Lightbulb /> Understand
          </span>
          <span className="text-lg">{">"}</span>
        </Button>
        <Button className="flex items-center justify-between w-full h-[42px] px-4 gap-2 bg-transparent border border-[#ECE7DF] rounded-xl text-[#34373F] hover:bg-[primary] hover:text-white  hover:font-semibold ">
          <span className="flex items-center gap-3">
            <MessageCircle /> Ask
          </span>
          <span className="text-lg">{">"}</span>
        </Button>
      </div>
    </div>
  );
};

export default PromptBar;
