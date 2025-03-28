import { useState } from "react"
import AccountDeletionPopup from "../components/AccountDeletionPopup"

const placeholderReviews = [
  {
    courseTitle: "CS 180",
    date: "3/16/2024",
    semester: "Spring 2024",
    difficulty: 3,
    enjoyment: 4,
    isRecommended: true,
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis suscipit sagittis dolor, eget maximus dolor consequat id. \
     Suspendisse interdum aliquam est eget bibendum. Integer vehicula velit ut urna malesuada, sed cursus urna cursus. Etiam varius \
     condimentum orci, eu hendrerit libero pretium eu. Aliquam ut nunc vel arcu aliquet dapibus. Interdum et malesuada fames ac ante \
     ipsum primis in faucibus. Donec quis euismod quam. Ut quam augue, venenatis consectetur scelerisque id, pellentesque in nisi.",
    likes: 9
  },
  {
    courseTitle: "CS 240",
    date: "4/28/2025",
    semester: "Spring 2025",
    difficulty: 4,
    enjoyment: 4,
    isRecommended: true,
    content: "This is a placeholder review appearing on the user page",
    likes: 12
  },
  {
    courseTitle: "CS 307",
    date: "9/16/2024",
    semester: "Fall 2024",
    difficulty: 4,
    enjoyment: 3,
    isRecommended: false,
    content: "This is a placeholder review appearing on the user page",
    likes: -3
  },
  {
    courseTitle: "CS 252",
    date: "2/22/2023",
    semester: "Spring 2023",
    difficulty: 4,
    enjoyment: 5,
    isRecommended: true,
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis suscipit sagittis dolor, eget maximus dolor consequat id. \
     Suspendisse interdum aliquam est eget bibendum. Integer vehicula velit ut urna malesuada, sed cursus urna cursus. Etiam varius \
     condimentum orci, eu hendrerit libero pretium eu. Aliquam ut nunc vel arcu aliquet dapibus. Interdum et malesuada fames ac ante \
     ipsum primis in faucibus. Donec quis euismod quam. Ut quam augue, venenatis consectetur scelerisque id, pellentesque in nisi.",
    likes: 10
  }
]

const User = () => {

  const [deletePopupOpen, setDeletePopupOpen] = useState(false)

  return (
    <div className="
      bg-gray-900 text-gray-300 min-h-screen p-8 flex justify-center flex-row
      gap-x-24    
    ">
      {deletePopupOpen ? 
      <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50">
        <AccountDeletionPopup setDeletePopupOpen={setDeletePopupOpen} />
      </div> 
      : ''}
      <div className="flex flex-col">
        <div className="flex pt-16 gap-x-6 items-center">
          <div className="max-w-40">
            <img
              src="https://assets.leetcode.com/users/default_avatar.jpg" alt="pfp-image"
              className="rounded-xl"
            />
          </div>
          <div>
            <h1 className="text-4xl font-bold">lee4607</h1>
            <h2 className="text-2xl font-medium">Major: Computer Science</h2>
            <div className="text-lg">Number of Reviews: {placeholderReviews.length}</div>
            <div className="pt-3 flex flex-row gap-x-2">
              <button className="px-3 py-2 bg-gray-200/10 cursor-pointer
              rounded-lg text-green-600 border-1 border-green-600">
                Edit Account
              </button>
              <button className="px-3 py-2 bg-gray-200/10 cursor-pointer
              rounded-lg text-red-600 border-1 border-red-600"
                onClick={() => setDeletePopupOpen(true)}
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
        <div></div>
      </div>
      <div className="flex flex-col gap-y-4">
        <h2 className="text-2xl font-bold">Reviews</h2>
        {placeholderReviews.map(review => 
          <Review review={review} />
        )}
      </div>
    </div>
  )
}

const Review = ({review}) => {
  return (
    <div className="bg-white/10 px-4 py-3 rounded-lg flex flex-col gap-y-1">
      <h2 className="text-xl font-semibold ">{review.courseTitle}</h2>
      <div className="flex gap-x-3">
        <div>{review.date}</div>
        <div>•</div>
        <div>{review.semester}</div>
        <div>•</div>
        <div>Likes: {review.likes}</div>
      </div>
      <div className="flex gap-x-3 items-center">
        <div className="bg-white/15 px-2 py-1 rounded-md">Difficulty: {review.difficulty}/5</div>
        <div className="bg-white/15 px-2 py-1 rounded-md">Enjoyment: {review.enjoyment}/5</div>
        <div className={` px-2 py-1 rounded-md ${review.isRecommended ? "bg-green-700/50" : "bg-red-700/50"}`}>{
          review.isRecommended ? "Recommends this course" : "Does not recommend this course"}
        </div>
      </div>
      <div className="max-w-lg">
        <div className="break-words whitespace-normal">{review.content}</div>
      </div>
    </div>
  )
}

export default User