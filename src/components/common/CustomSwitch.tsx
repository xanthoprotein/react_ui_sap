import clsx from "clsx";
import { Label } from "../ui/Label";
import { Switch } from "../ui/Switch";

export function SwitchDemo({
  isToggled,
  setToggled,
  className = "",
}: {
  isToggled: boolean;
  setToggled: (value: boolean) => void;
  className?: string;
}) {
  return (
    <div className={clsx("flex items-center space-x-2", className)}>
      <Switch
        id="toggle-switch"
        checked={isToggled}
        onCheckedChange={setToggled}
        className={clsx(
          "transition-colors",
          isToggled ? "bg-yellow-400" : "bg-gray-300"
        )}
      />
      <Label htmlFor="toggle-switch" className="text-sm">
        Demo Server
      </Label>
    </div>
  );
}
