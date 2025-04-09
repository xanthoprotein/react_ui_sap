import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import ProtectedRoute from "./protectedRoutes";
import { LoadingPage } from "../components/common/Loader";
import { v4 as uuidv4 } from "uuid";

const ChatPage = lazy(() => import("../pages/Chat"));
const DashboardPage = lazy(() => import("../pages/Dashboard"));
const LoginPage = lazy(() => import("../pages/Login"));
const NotFoundPage = lazy(() => import("../pages/NotFound"));

const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<LoadingPage />}>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route
          path="/chat"
          element={
            <ProtectedRoute requiredRoles={["admin", "developer", "creator"]}>
              <ChatPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat/:chatId"
          element={
            <ProtectedRoute requiredRoles={["admin", "developer", "creator"]}>
              <ChatPage />
            </ProtectedRoute>
          }
        />

        <Route path="/not-found" element={<NotFoundPage />} />

        <Route path="*" element={<Navigate to="/not-found" />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
