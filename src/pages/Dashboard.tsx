import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { useParams, Link } from "react-router-dom";
import UserForm from "../components/admin/UserForm";
import UserTable from "../components/admin/UserTable";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "../components/ui/breadcrumb";

const DashboardPage: React.FC = () => {
  const { role } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    console.log(`Rendering dashboard for role: ${role}`);
  }, [role]);

  return (
    <div className="flex flex-col px-5 h-screen bg-gray-100  ">
      <div className="flex flex-col items-start px-0">
        <div className="text-2xl font-medium leading-none tracking-tight mb-4 mt-7">
          Identity & Access Management
        </div>
        <div className="flex flex-row text-base sm:text-base lg:text-xl font-light text-muted-foreground">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <Link to="/chat">Home</Link>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>User Management</BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>
      <hr className="border-t border-gray-300 my-5 w-full" />
    </div>
  );
};

export default DashboardPage;
