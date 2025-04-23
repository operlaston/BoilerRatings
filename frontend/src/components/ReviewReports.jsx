import React from 'react'
import {
  AlertCircle,
  Trash2,
  Ban,
  XCircle,
  Calendar,
  User,
  Flag,
  AlertTriangle, 
  X
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { banUser } from '../services/user.service'
import { deleteReview, resolveReport, getReports } from '../services/review.service'

const MOCK_REPORTS = [
  {
    id: '1',
    reason: 'Inappropriate Content',
    content: 'oh my god this guy said a bad word',
    review: {
      content:
        "This class was absolutely terrible. The professor clearly doesn't give a shit about students.",
      date: '2023-10-15',
      author: 'anonymous_user123',
    },
    isResolved: false,
    createdAt: '2023-11-01',
  }
]



export function ReviewReports() {
  const [reports, setReports] = useState(MOCK_REPORTS)
    useEffect(() => {
      const fetchReports = async () => {
        try {
          const data = await getReports()
          setReports(data)
        } catch (error) {
          console.error('Error fetching reports:', error)
        }
      }
  
      fetchReports()
    }, [])
    console.log("reports", reports)
  const sortedReports = (() => {
    let unresolvedReports = reports
      .filter((r) => !r.isResolved)
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)); // Oldest first

    let resolvedReports = reports
      .filter((r) => r.isResolved)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Newest first

    return [...unresolvedReports, ...resolvedReports];
  })();


  const handleBanUser = (userId) => {
    console.log('Ban user:', userId.id)
    //This ban isn't working properly gavin 
    banUser(userId.id)
    // Implement ban user logic
  }

  const handleFlagUser = (userId) => {
    console.log('Flag user:', userId.id)
    // Implement flag user logic
  }

  const handleDeleteReview = ( review ) => {
    console.log('Delete review from author:', review)
    deleteReview(review.id)
    // Implement delete review logic
  }
  const handleIgnoreReport = (reportId) => {
    console.log('Ignore report:', reportId)
    //resolveReport(reportId)
    // Implement ignore report logic
  }
  if (reports == MOCK_REPORTS) {
    return <div>Loading</div>
  }
  return (
    <div className="space-y-6">
      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Total Reports
            </h4>
            <Flag className="h-5 w-5 text-gray-400" />
          </div>
          <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
            {reports.length}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Pending Review
            </h4>
            <AlertCircle className="h-5 w-5 text-yellow-500" />
          </div>
          <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
            {reports.filter((r) => !r.isResolved).length}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Resolved
            </h4>
            <XCircle className="h-5 w-5 text-green-500" />
          </div>
          <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
            {reports.filter((r) => r.isResolved).length}
          </p>
        </div>
      </div>
      {/* Reports List */}
      <div className="space-y-4">
        {sortedReports.map((report) => (
          <ReportCard
            key={report.id}
            report={report}
            onBanUser={handleBanUser}
            onFlagUser={handleFlagUser}
            onDeleteReview={handleDeleteReview}
            onIgnoreReport={handleIgnoreReport}
          />
        ))}
      </div>
    </div>
  )
}


function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  variant = 'delete',
}) {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
    }
    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-gray-500/75 dark:bg-gray-900/75 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-white dark:bg-gray-800 rounded-lg max-w-md w-full shadow-xl">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </button>
          <div className="p-6">
            <div
              className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center ${variant === 'delete' ? 'bg-red-100 dark:bg-red-900/20' : 'bg-yellow-100 dark:bg-yellow-900/20'}`}
            >
              <AlertTriangle
                className={`h-6 w-6 ${variant === 'delete' ? 'text-red-600 dark:text-red-400' : 'text-yellow-600 dark:text-yellow-400'}`}
              />
            </div>
            <div className="mt-4 text-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {title}
              </h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                {message}
              </p>
            </div>
            <div className="mt-6 flex gap-3 justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onConfirm()
                  onClose()
                }}
                className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors ${variant === 'delete' ? 'bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600' : 'bg-yellow-600 hover:bg-yellow-700 dark:bg-yellow-500 dark:hover:bg-yellow-600'}`}
              >
                {confirmText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


function ReportCard({
  report,
  onBanUser,
  onDeleteReview,
  onIgnoreReport,
  onFlagUser,
}) {
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showBanModal, setShowBanModal] = useState(false)
  const [showFlagModal, setShowFlagModal] = useState(false)


  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Report Header */}
        <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
                <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {report.reason}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Reported on {report.createdAt}
                </p>
              </div>
            </div>
            {(!report.isResolved) ?
              (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">
                  Pending Review
                </span>
              ) :
              (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-600/20 dark:text-gray-400">
                  Resolved
                </span>
              )
            }


          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300 ml-12 mt-2">
            {`\"` + report.content + `\"`}
          </p>
        </div>
        {/* Review Content */}
        <div className="p-4 space-y-4">
          <div className="rounded-lg bg-gray-50 dark:bg-gray-900/50 p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <div className="h-4 w-4">
                  <img
                    src={
                      `https://api.dicebear.com/9.x/identicon/svg?seed=` + report.review.user
                    }
                    alt="pfp-image"
                    className="rounded-xl"
                  />
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {report.review.user.username}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date(report.review.date).toLocaleDateString()}
                </span>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-300">
              {report.review.reviewContent}
            </p>
          </div>
          {
            (!report.isResolved) && (
              <div className="flex items-center justify-end space-x-3">
                <button
                  onClick={() => onIgnoreReport(report.id)}
                  className="px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center space-x-2 cursor-pointer"
                >
                  <XCircle className="h-4 w-4" />
                  <span>Ignore Report</span>
                </button>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="px-3 py-2 text-sm rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors flex items-center space-x-2 cursor-pointer"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Delete Review</span>
                </button>
                <button
                  onClick={() => onFlagUser(report.review.user)}
                  className="px-3 py-2 text-sm rounded-lg bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-100 dark:hover:bg-yellow-900/40 transition-colors flex items-center space-x-2 cursor-pointer"
                >
                  <Flag className="h-4 w-4" />
                  <span>Flag User</span>
                </button>
                <button
                  onClick={() => setShowBanModal(true)}
                  className="px-3 py-2 text-sm rounded-lg bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors flex items-center space-x-2 cursor-pointer"
                >
                  <Ban className="h-4 w-4" />
                  <span>Ban User</span>
                </button>
              </div>
            )
          }

        </div>
      </div>
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={() => onDeleteReview(report.review)}
        title="Delete Review"
        message="Are you sure you want to delete this review? This action cannot be undone."
        confirmText="Delete Review"
        variant="delete"
      />
      {/* Ban User Confirmation Modal */}
      <ConfirmationModal
        isOpen={showBanModal}
        onClose={() => setShowBanModal(false)}
        onConfirm={() => onBanUser(report.review.user)}
        title="Ban User"
        message={`Are you sure you want to ban ${report.review.user.username}? This will prevent them from submitting new reviews.`}
        confirmText="Ban User"
        variant="ban"
      />
    </>
  )
}
