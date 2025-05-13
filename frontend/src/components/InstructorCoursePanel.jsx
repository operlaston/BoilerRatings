import { useEffect, useState } from "react";
import { Brain } from "lucide-react";
import { calculateDifficulty } from "../services/instructor.service";

function InstructorCoursePanel({ course, refreshCourses }) {
    const [instructors, setInstructors] = useState([])
    const [scores, setScores] = useState([])
    const [hasReviews, setHasReviews] = useState([])

    useEffect(() => {
        if (!course) return;

        const fetchData = async () => {
            try {
                setInstructors(course.instructors)
                const results = await Promise.all(
                    course.instructors.map(async (prof) => {
                        const score = await calculateDifficulty(prof.id, course.id)
                        return {
                            score,
                            hasReview: score >= 0
                        }
                    }
                ))
                setScores(results.map(r => r.score));
                setHasReviews(results.map(r => r.hasReview));
            } catch (err) {
                console.log(`Failed to fetch: ${err}`)
            }
        }
        fetchData()
    }, [refreshCourses])

    const renderScore = (score) => {
        // Score is set to -1 if instructor has no reviews
        if (score === null || score === undefined || score < 0) return "No reviews"
        return `Difficulty: ${score.toFixed(1)}`
    }

    const renderScoreWithStar = (score, hasReview) => {
        if (score === null || score === undefined || score < 0) {
            return <div className="text-center">No reviews</div>;
        }
        return (
            <div className="flex justify-center items-center gap-1">
                <span>Difficulty: {score.toFixed(1)}</span>
                {hasReview && (
                    <>
                        <Brain className="w-3 h-3" />
                    </>
                )}
            </div>
        )
    }

    return (
        <div className="w-fit bg-gray-50 dark:bg-gray-700/50 rounded-lg p-2 h-fit">
            <h1 className="text-lg text-center font-semibold text-gray-900 dark:text-white mb-2 p-2">Instructors:</h1>
            <div className="text-center grid grid-cols-1 md:grid-cols-2 gap-4">
                {instructors.map((prof, index) => (
                    <div key={prof.id || index} className="bg-gray-100 dark:bg-gray-600 p-3 rounded-lg">
                        <div>
                            <h2 className="text-white font-sm py-1">
                                {prof.name}
                            </h2>
                            <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                                {renderScoreWithStar(scores[index], hasReviews[index])}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
export default InstructorCoursePanel;