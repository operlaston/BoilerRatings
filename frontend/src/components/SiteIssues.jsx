import React from 'react'
import {
  AlertCircle,
  Trash2,
  Ban,
  XCircle,
  Calendar,
  Flag,
  AlertTriangle,
  X
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { deletePageReport, getPageReports } from '../services/pagereport.service'

const MOCK_REPORTS = [
  {
    id: '1',
    page: 'AAE 20000',
    author: 'Jeff',
    reportContent: 'The number of credit hours is incorrect',
    isResolved: false,
    createdAt: '2023-11-01',
  }
]



export function SiteIssues() {
  const [reports, setReports] = useState(MOCK_REPORTS)
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const data = await getPageReports()
        setReports(data)
      } catch (error) {
        console.error('Error fetching reports:', error)
      }
    }

    fetchReports()
  }, [])
  const sortedReports = (() => {
    let unresolvedReports = reports
      .filter((r) => !r.isResolved)
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)); // Oldest first

    let resolvedReports = reports
      .filter((r) => r.isResolved)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Newest first

    return [...unresolvedReports, ...resolvedReports];
  })();


  const handleIgnoreReport = (reportId) => {
    console.log('Ignore report:', reportId)
    setReports((current) =>
      current.map((r) =>
        r.id === reportId ? { ...r, isResolved: true } : r
      )
    );
    deletePageReport(reportId)
    //We should add optimistic updates but rn I want to get everything else working
    // Implement ignore report logic
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
            onResolveReport={handleIgnoreReport}
          />
        ))}
      </div>
    </div>
  )
}




function ReportCard({
  report,
  onResolveReport,
}) {

  return (
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
                {report.page}
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
      </div>
      {/* Review Content */}
      <div className="p-4 space-y-4">
        <div className="rounded-lg bg-gray-50 dark:bg-gray-900/50 p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <div className="h-4 w-4">
                <img
                  src={
                    `https://api.dicebear.com/9.x/identicon/svg?seed=` + report.author
                  }
                  alt="pfp-image"
                  className="rounded-xl"
                />
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {report.author}
              </span>
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-300">
            {report.reportContent}
          </p>
        </div>
        {
          (!report.isResolved) && (
            <div className="flex items-center justify-end space-x-3">
              <button
                onClick={() => onResolveReport(report.id)}
                className="px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center space-x-2 cursor-pointer"
              >
                <XCircle className="h-4 w-4" />
                <span>Resolve Report</span>
              </button>
            </div>
          )
        }
      </div>
    </div>

  )
}
