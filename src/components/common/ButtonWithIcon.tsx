import { Button } from "../ui/button";

interface ButtonWithIconProps {
  icon?: React.ReactNode;
  text: string;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

export function ButtonWithIcon({
  icon,
  text,
  className,
  onClick,
}: ButtonWithIconProps) {
  return (
    <Button
      className={`
        font-[Gotham]
        text-sm
        font-medium
        leading-[19.2px]
        text-left
        bg-transparent
        border-none
        text-[primary]
        no-underline
        hover:bg-transparent
        hover:text-[primary]
        focus:outline-none
        focus:ring-0
        active:text-[primary]
        active:bg-transparent
        ${className}  
      `}
      onClick={onClick}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {text}
    </Button>
  );
}
