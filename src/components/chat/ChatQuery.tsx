import { formatTimeAgo } from "../../utils/formatTimeAgo";

export default function ChatQuery({
  id,
  message,
  timestamp,
}: {
  id: string;
  message: string;
  timestamp: number;
}) {
  return (
    <div className="flex justify-end mb-2 ">
      <div className="p-3 rounded-lg bg-custom2 text-white  max-w-[90%] break-words whitespace-pre-wrap">
        <p className="text-sm">{message}</p>
        <p className="text-xs text-gray-300 mt-1">{formatTimeAgo(timestamp)}</p>
      </div>
    </div>
  );
}
