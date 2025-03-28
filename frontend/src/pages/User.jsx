import { useState, useEffect } from "react"
import AccountDeletionPopup from "../components/AccountDeletionPopup"
import { useParams } from "react-router-dom"
import { getUserByUsername } from '../services/user.service.js'
import { useNavigate } from "react-router-dom"

const User = ({user, setUser}) => {

  const [deletePopupOpen, setDeletePopupOpen] = useState(false)
  const {username} = useParams()
  const [pageUser, setPageUser] = useState(null)

  const navigate = useNavigate()

  useEffect(() => {
    if (username === "[deleted]") {
      setPageUser({
        notfound: "notfound"
      })
    }
    else {
      getUserByUsername(username)
        .then((returnedUser) => {
          setPageUser(returnedUser)
        })
        .catch(err => {
          if (err.response.status === 404) {
            setPageUser({
              notfound: "notfound"
            })
          }
          console.log('error occurred while grabbing user')
        })
    }
  }, [])

  if (pageUser === null) {
    return
  }

  if (pageUser.notfound != null) {
    return (
      <div className= "flex items-center flex-col">
        <h1><b>404 - User Not Found.</b></h1>
        <h1>You tried to search for a user that does not exist. Where you looking for something else?</h1>
        <div className="underline cursor-pointer" onClick={() => navigate('/')}>Return to Home Page</div>
      </div>
    )
  }

  return (
    <div className="
      bg-gray-900 text-gray-300 min-h-screen p-8 flex justify-center flex-row
      gap-x-24    
    ">
      {deletePopupOpen ? 
      <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50">
        <AccountDeletionPopup setDeletePopupOpen={setDeletePopupOpen} userId={user.id} setUser={setUser}/>
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
            <h1 className="text-4xl font-bold">{pageUser.username}</h1>
            <h2 className="text-2xl font-medium">Major: {pageUser.major.length === 0 ? 'none' : pageUser.major[0].name}</h2>
            <div className="text-lg">Number of Reviews: {pageUser.reviews.length}</div>
            {
              user == null || user.username !== pageUser.username ?
              '' :
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
            }
          </div>
        </div>
        <div></div>
      </div>
      <div className="flex flex-col gap-y-4">
        <h2 className="text-2xl font-bold min-w-lg">Reviews</h2>
        {pageUser.reviews.map(review => {
          if (review.hidden === undefined || review.hidden === false) {
            return (<Review key={review.id} review={review} />)
          }
          return
        })}
      </div>
    </div>
  )
}

const Review = ({review}) => {
  return (
    <div className="bg-white/10 px-4 py-3 rounded-lg flex flex-col gap-y-1">
      <h2 className="text-xl font-semibold ">course name goes here</h2>
      <div className="flex gap-x-3">
        <div>{(new Date(review.date)).toLocaleDateString('en-US')}</div>
        <div>•</div>
        <div>{review.semesterTaken}</div>
        <div>•</div>
        <div>Likes: {review.likes}</div>
      </div>
      <div className="flex gap-x-3 items-center">
        <div className="bg-white/15 px-2 py-1 rounded-md">Difficulty: {review.difficulty}/5</div>
        <div className="bg-white/15 px-2 py-1 rounded-md">Enjoyment: {review.enjoyment}/5</div>
        <div className={` px-2 py-1 rounded-md ${review.recommended ? "bg-green-700/50" : "bg-red-700/50"}`}>{
          review.isRecommended ? "Recommends this course" : "Does not recommend this course"}
        </div>
      </div>
      <div className="max-w-lg">
        <div className="break-words whitespace-normal">{review.reviewContent}</div>
      </div>
    </div>
  )
}

export default User