import { IoMdClose } from "react-icons/io";
import { deleteUser } from "../services/user.service";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from 'react-hot-toast';

const AccountDeletionPopup = ({setDeletePopupOpen, userId, setUser}) => {
  const [message, setMessage] = useState(null)
  const navigate = useNavigate()

  const handleDelete = async () => {
    try {
      await deleteUser(userId)
      navigate('/')
      setUser(null)
    }
    catch(e) {
      console.error(e)
      setMessage('failed to delete user')
    }
  }

  if (message === null) {
    return (
      <div className="
      bg-gray-900 text-gray-300 p-8 border-red-600 border-1 border-solid relative rounded-xl flex flex-col gap-y-4"
      >
        <div className="absolute top-3 right-3 cursor-pointer"
          onClick={() => setDeletePopupOpen(false)}
        >
          <IoMdClose />
        </div>
        <div>
          <h3 className="text-lg font-bold">Delete your account?</h3>
          <h4 className="text-red-600">Warning: This action cannot be undone</h4>
        </div>
        <div className="flex justify-center gap-x-6">
          <button className="text-red-600 border-red-600 border-1 border-solid py-2 px-6 cursor-pointer rounded-lg bg-gray-200/10"
            onClick={handleDelete}
          >
            Yes
          </button>
          <button className="text-white border-white border-1 border-solid py-2 px-6 cursor-pointer rounded-lg bg-gray-200/10"
            onClick={() => setDeletePopupOpen(false)}
          >
            No
          </button>
        </div>
      </div>
    )
  }
  return (
    <div className="
    bg-gray-900 text-gray-300 p-8 border-red-600 border-1 border-solid relative rounded-xl flex flex-col gap-y-4"
    >
      <div className="absolute top-3 right-3 cursor-pointer"
        onClick={() => setDeletePopupOpen(false)}
      >
        <IoMdClose />
      </div>
      <h3>{message}</h3>
    </div>
  )
}

export default AccountDeletionPopup