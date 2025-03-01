const Course = ({name, number, credits, enjoyment, difficulty, recommended, numReviews, requirements}) => {
  return (
    <div className="bg-gray-800 text-white py-4 px-5 rounded-lg cursor-pointer
      hover:scale-102 transition-all
    ">
      <div
        className="text-2xl font-bold pb-1"
      >
        {number}: {name}
      </div>
      <div>Credits: {credits}</div>
      <div>Enjoyment: {enjoyment} | Difficulty: {difficulty}</div>
      <div>Recommended: {recommended*100}%</div>
      <div>Number of Reviews: {numReviews}</div>
      <div className="flex gap-x-2 flex-wrap pt-2">
        {
          requirements.map(req =>
            <div className="rounded-full bg-gray-700 shadow-lg py-1 px-3">
              {req}
            </div>
          )
        }
      </div>
    </div>
  )
}

export default Course