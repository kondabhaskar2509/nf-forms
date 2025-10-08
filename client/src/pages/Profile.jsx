import React from "react";
import { useContext } from "react";
import { Context } from "./Context";

const Profile = () => {
  const { name , email } = useContext(Context);
  return (
    <div className="h-[90vh] flex items-center justify-center ">
      <div className="bg-white rounded-2xl shadow-xl p-10 w-full max-w-md flex flex-col items-center">
        <h1 className="text-3xl text-[#36a3eb] font-bold text-center mb-8">
          Profile
        </h1>

        <div>
          <label className="block text-gray-600 text-center font-semibold mb-1">Name</label>
          <div className="bg-gray-100 text-black rounded-md px-4 py-2">
            {name}
          </div>
        </div>

        <div>
          <label className="block text-gray-600 text-center font-semibold mb-1">
            Email
          </label>
          <div className="bg-gray-100 text-black rounded-md px-4 py-2">
            {email}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
