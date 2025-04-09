import { Button } from "../ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

interface ButtonWithTooltipProps {
  icon: React.ReactNode;
  tooltipText: string;
  onClick?: () => void;
  variant?: "outline" | "solid";
}

const ButtonWithTooltip: React.FC<ButtonWithTooltipProps> = ({
  icon,
  tooltipText,
  onClick,
  variant = "outline",
}) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant={"outline"} size="icon" onClick={onClick}>
            {icon}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltipText}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ButtonWithTooltip;
