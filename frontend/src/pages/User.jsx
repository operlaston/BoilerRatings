const placeholderReviews = [
  {
    courseTitle: "CS 180",
    date: "3/16/2024",
    semester: "Spring 2024",
    difficulty: 3,
    enjoyment: 4,
    isRecommended: true,
    content: "This is a placeholder review appearing on the user page",
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
  }
]

const User = () => {
  return (
    <div>
      <h1>Username</h1>
      <div>
        {placeholderReviews.map(review => {
          <div>
            <div>
              <div>{review.courseTitle}</div>
              <div>{review.date} • {review.semester}</div>
              <div>
                <div>Difficulty: {review.difficulty}/5</div>
                <div>Enjoyment: {review.enjoyment}/5</div>
                <div>{
                  review.isRecommended ? "Recommends this course" : "Does not recommend this course"}
                </div>
              </div>
              <div>{review.content}</div>
              <div>Likes: {review.likes}</div>
            </div>
          </div>
        })}
      </div>
    </div>
  )
}

export default User