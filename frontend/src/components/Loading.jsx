import React from 'react'
import { Loader2 } from 'lucide-react'

const isLogin = false;
export function LoadingPage({ message }) {
  return (
    <div className="w-full h-screen flex items-center justify-center p-4 dark:bg-gray-900">
      <div className={`absolute top-2/3 w-40 h-40 bg-gray-200 dark:bg-gray-700 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-2xl opacity-70 animate-blob-1 ease-in-out duration-150  translate-x-2/3 -translate-y-1/4`}></div>
      <div className={`absolute top-1/4 w-64 h-64 bg-gray-300 dark:bg-gray-800 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-2xl opacity-70 animate-blob-2 ease-in-out duration-300 translate-x-full -translate-y-1/3`}></div>
      <div className={`absolute top-1/2 w-52 h-52 bg-gray-200 dark:bg-gray-700 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-2xl opacity-70 animate-blob-3 ease-in-out duration-200 -translate-x-2/3`}></div>
      <div className="relative flex flex-col items-center gap-4 p-16 rounded-lg bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        <Loader2 className="h-12 w-12 text-gray-900 dark:text-white animate-spin" />
        <p className="text-lg text-gray-600 dark:text-gray-300 text-center max-w-sm">
          {message ? message : "Loading ..."}
        </p>
      </div>
    </div>
  )
}
