import { MoreHorizontal, Pencil, Trash2, FolderPen } from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

const CustomDropdown = ({
  onCopy,
  onRename,
  onDelete,
}: {
  onCopy: () => void;
  onRename: () => void;
  onDelete: () => void;
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-white text-[primary] ">
        <DropdownMenuItem onClick={onCopy} aria-label="Copy">
          <Pencil />
          Copy
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onRename}>
          <FolderPen />
          Rename
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onDelete}>
          <Trash2 />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CustomDropdown;
