import { IoMdClose } from "react-icons/io";
import { useState } from "react";
import { banUser } from "../services/user.service";

const AccountBanPopup = ({pageUser, setBanPopupOpen}) => {

  const handleBan = async () => {
    try {
      await banUser(pageUser.id);
      setBanPopupOpen(false);
      window.location.reload();
    }
    catch(e) {
      console.error(e);
      setMessage('failed to delete user');
    }
  }



  return (
    <div className="
      bg-gray-900 text-gray-300 p-8 border-red-600 border-1 border-solid relative rounded-xl flex flex-col gap-y-4"
      >
        <div className="absolute top-3 right-3 cursor-pointer"
          onClick={() => setBanPopupOpen(false)} 
        >
          <IoMdClose />
        </div>
        <div>
          <div className="text-lg font-bold">
            {"Ban @" + pageUser.username + "?"}
          </div>
          <h4 className="text-red-600">Warning: This action cannot be undone</h4>
        </div>
        <div className="flex justify-center gap-x-6">
          <button className="text-red-600 border-red-600 border-1 border-solid py-2 px-6 cursor-pointer rounded-lg bg-gray-200/10"
            onClick={handleBan}
          >
            Yes
          </button>
          <button className="text-white border-white border-1 border-solid py-2 px-6 cursor-pointer rounded-lg bg-gray-200/10"
            onClick={() => setBanPopupOpen(false)}
          >
            No
          </button>
        </div>
      </div>
  )
}

export default AccountBanPopup