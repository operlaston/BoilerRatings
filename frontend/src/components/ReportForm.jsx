import { useState } from "react";


const ReportForm = ({ handleReportFormSubmit, closePopup }) => {
  const [reportContent, setReportContent] = useState(""); // Degree plan name state

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md"
      onClick={closePopup}
    >
      <div
        className="bg-white dark:bg-gray-800/50 p-8 rounded-lg shadow-lg p-8 w-1/4"
        onClick={(e) => e.stopPropagation()}
      >
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6 text-center dark:text-white">
        New report
      </h1>
      <textarea
        placeholder="Is something wrong with this page? Tell us here!"
        value={reportContent}
        onChange={(e) => setReportContent(e.target.value)}
        className="resize-none mt-6 w-full p-3 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400 focus:border-transparent transition-all outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
      />
      <button
        onClick={() => handleReportFormSubmit(reportContent)}
        className="mt-4 w-full py-2 px-4 bg-blue-500 text-white rounded-lg focus:ring-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 p-2 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100"
      >
        Make report
      </button>
    </div>
    </div>
    </div>
  );
}

export default ReportForm;