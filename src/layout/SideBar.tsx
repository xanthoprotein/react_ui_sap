import { Link, useNavigate } from "react-router-dom";
import PayPalLogo from "../assets/paypal2.png";
import { Card } from "../components/ui/card";
import UserProfile from "../components/Userprofile";
import { sideBarData } from "../mocks/SideBarData";
import { useAppDispatch, useAppSelector } from "../redux/hook";
import { userData } from "../mocks/UserData";
import { useEffect, useState } from "react";
import {  logoutUser } from "../redux/slices/authSlice";


function Sidebar() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const userId = useAppSelector((state) => state.auth.userId);
  const [selectedItem, setSelectedItem] = useState<number | null>(null);

  const handleLogout = async () => {
    await dispatch(logoutUser(navigate));
  };

  useEffect(() => {
    if (sideBarData[0]?.menu?.length > 0) {
      setSelectedItem(sideBarData[0].menu[0].id);
    }
  }, []);

  return (
    <div className="w-[197px] md:w-[297px] xl:w-[300px] bg-[#FFFFFF] p-4 md:p-4 flex-shrink-0 relative h-screen overflow-y-clip">
      <div className="flex justify-center mt-4">
        <Link to="/chat">
          <img
            src={PayPalLogo}
            alt="Paypal Logo"
            width={200}
            height={30}
            className="flex items-center p-1 justify-center"
          />
        </Link>
      </div>

      <hr className="border-t border-gray-300 my-5 w-full" />

      {sideBarData?.map((section, index) => (
        <div key={index} className="mt-5 ">
          <div className="overflow-hidden h-[78%]">
            {section.menu.map((data) => {
              const path = data.path.includes(":userId")
                ? data.path.replace(":userId", userId)
                : data.path;

              return (
                <Link
                  to={path}
                  key={data.id}
                  onClick={() => setSelectedItem(data.id)}
                >
                  <Card
                    className={`px-4 border-l-[4px] shadow-none hover:bg-blue-100 py-2 mb-4 ${
                      selectedItem === data.id
                        ? "border-l-primary bg-blue-100"
                        : "border-l-blue-400"
                    }`}
                  >
                    <div className="flex flex-row justify-between items-center">
                      <div className="flex flex-row gap-3">
                        {data.icon}
                        <p className="text-sm font-thin hover:font-bold">
                          {data.title}
                        </p>
                      </div>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      ))}

      <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 w-full p-4">
        <UserProfile
          username={userData.username}
          profileImage={userData.profileImage}
          onLogout={handleLogout}
        />
      </div>
    </div>
  );
}

export default Sidebar;
