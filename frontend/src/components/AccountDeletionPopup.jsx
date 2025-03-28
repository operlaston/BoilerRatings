import { IoMdClose } from "react-icons/io";

const AccountDeletionPopup = ({setDeletePopupOpen}) => {

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
        <h3>Would you really like to delete your account?</h3>
        <h4 className="text-red-600">Warning: This action cannot be undone</h4>
      </div>
      <div className="flex justify-center gap-x-6">
        <button className="text-red-600 border-red-600 border-1 border-solid py-2 px-6 cursor-pointer rounded-lg bg-gray-200/10">
          Yes
        </button>
        <button className="text-white border-white border-1 border-solid py-2 px-6 cursor-pointer rounded-lg bg-gray-200/10">
          No
        </button>
      </div>
    </div>
  )
}

export default AccountDeletionPopup