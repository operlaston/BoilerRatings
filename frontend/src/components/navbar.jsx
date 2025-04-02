import React, { useEffect, useState, useRef } from 'react'
import { User, ChevronDown, LogOut, Settings } from 'lucide-react'
import { Link, useNavigate } from "react-router-dom";

export function Navbar({user, onLogout}) {
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const dropdownRef = useRef(null)
  const navigate = useNavigate()
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])
  const tabs = [
    {
      name: 'Home',
      href: '/',
    },
    {
      name: 'Degree',
      href: '/degree',
    },
    {
      name: 'Saved Degrees',
      href: '/saved-degree',
    },
    {
      name: 'Compare Classes',
      href: '/compare'
    },
  ]
  return (
    <nav className="bg-white/80 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-full mx-14">
        <div className="flex justify-between h-12">
          {/* Left side - Navigation */}
          <div className="flex">
            {/* Navigation Links */}
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {tabs.map((tab) => (                
                <Link
                  to={tab.href}
                  key={tab.name}
                  className="inline-flex items-center px-1 pt-1 text-md font-medium text-gray-900 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 border-b-2 border-transparent hover:border-gray-300 dark:hover:border-gray-700 transition-colors"
                >
                  {tab.name}
                </Link>
              ))}
            </div>
          </div>
          {/* Right side - Profile section */}
          <div className="flex items-center pr-8">
            {(user !== null) ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2 focus:outline-none cursor-pointer"
                >
                  <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                      <img
                        src={`https://api.dicebear.com/9.x/identicon/svg?seed=` + user.username}
                        alt="Profile"
                        className="h-full w-full object-cover"
                      />
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                </button>
                {/* Dropdown Menu */}
                {isProfileOpen && (
                  <div className="z-20 absolute right-0 mt-2 w-48 py-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                    <button
                      href="#"
                      className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center cursor-pointer"
                      onClick={() => navigate(`/user/${user.username}`)}
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Profile Information
                    </button>
                    <button
                      onClick={onLogout}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center cursor-pointer"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gray-900 hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100 transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
