import React from "react";
import profilePic from "../assets/user.jpg";

interface UserProfileProps {
  username: string;
  profileImage?: string;
  onLogout?: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({
  username,
  profileImage,
  onLogout,
}) => {
  return (
    <div className="flex items-center justify-between gap-3 px-4 py-3 bg-blue-100 rounded-lg mt-5 hover:bg-[#E1E5EB] cursor-pointer transition">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full overflow-hidden">
          <img
            src={profileImage || profilePic}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex flex-col">
          <p className="text-sm font-semibold">{username}</p>
          <p className="text-xs text-gray-500">View Profile</p>
        </div>
      </div>
      <button
        onClick={onLogout}
        className="text-red-500 text-sm hover:underline"
      >
        Logout
      </button>
    </div>
  );
};

export default UserProfile;
