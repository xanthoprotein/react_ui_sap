import { User, MessageSquare } from "lucide-react";

export const sideBarData = [
  {
    menu: [
      { id: 1, title: "Chat", icon: <MessageSquare />, path: "/chat/:chatId" },
      // {
      //   id: 2,
      //   title: "User Management",
      //   icon: <User />,
      //   path: "/admin/:userId",
      // },
    ],
  },
];
