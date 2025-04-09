import React from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "./SideBar";
import RightSidebar from "../layout/RightSideBar";
import AppRoutes from "../routes/appRoutes";

const AppLayout: React.FC = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === "/";
  const isAdminPage = location.pathname.startsWith("/admin");

  return (
    <div className="flex">
      {!isLoginPage && <Sidebar />}
      <div
        className={
          isLoginPage ? "flex-1 overflow-x-hidden" : "flex-1 overflow-x-hidden"
        }
      >
        <AppRoutes />
      </div>
      {!isLoginPage && !isAdminPage && <RightSidebar />}
    </div>
  );
};

export default AppLayout;
