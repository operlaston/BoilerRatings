const DegreePlanCard = ({name, onClick}) => {
    return (
      <div className="bg-gray-800 text-white py-4 px-5 rounded-lg cursor-pointer
        hover:scale-102 transition-all
      "
      onClick={onClick}
      >
        <div
          className="text-2xl font-bold pb-1"
        >
           {name}

        </div>
      </div>
    )
  }
  
  export default DegreePlanCard;