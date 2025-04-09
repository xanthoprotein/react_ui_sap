import React from "react";
import { Link } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "../components/ui/breadcrumb";

const NotFoundPage: React.FC = () => {
  return (
    <div className="flex flex-col px-5 h-screen bg-gray-100  ">
      <div className="flex flex-col items-start px-0">
        <div className="text-2xl font-medium leading-none tracking-tight mb-4 mt-7">
          404 - Page Not Found
        </div>
        <div className="flex flex-row text-base sm:text-base lg:text-xl font-light text-muted-foreground">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <Link to="/chat">Home</Link>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>404 - Page Not Found</BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>
      <hr className="border-t border-gray-300 my-5 w-full" />

      <h1>404 - Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <Link to="/">Go back to Home</Link>
    </div>
  );
};

export default NotFoundPage;
