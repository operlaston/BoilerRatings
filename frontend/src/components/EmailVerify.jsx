import React, { useState } from "react";
import { MailCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { verify } from "../services/signup"

function EmailVerify({user, setUser}) {
  //Somehow an event will be triggered
  const [verificationCode, setVerifcationCode] = useState("")
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault()
    //Handle form submit here
    try {
      console.log(verificationCode)
      console.log("Test")
      console.log(user.email)
      const newUser = await verify(user.email, verificationCode)
      console.log(newUser)
      setUser(newUser)
      //navigate('/onboarding')
    } catch (error) {
      console.log("Incorrect or expired code", error);
    } 
  }

  return (
    <div className="relative w-lg p-8 rounded-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6 text-center dark:text-white">
        Verify your email
      </h1>
      <div className="text-center dark:text-white h-24 w-24 mx-auto mb-4">
        <MailCheck className="text-gray-600 dark:text-gray-300 h-24 w-24"/>
      </div>
      <form onSubmit={handleSubmit}>
      <label htmlFor="code" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Your 6-digit verification code
          </label>
          <div className="mb-4 relative">
            <input
              id="code"
              value={verificationCode}
              onChange={(e) => setVerifcationCode(e.target.value)}
              className="w-full p-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400 focus:border-transparent transition-all outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder="123456"
            />
          </div>
          <button type="Submit" className="cursor-pointer w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 p-2 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors disabled:bg-gray-300 dark:disabled:bg-gray-600 flex items-center justify-center">
            Verify
          </button>
      </form>
      <p className="text-md text-gray-700 mb-6 text-center dark:text-gray-400">
        Didnt get it? {" "}
        <button
          className="text-gray-900 dark:text-white cursor-pointer hover:text-gray-600 dark:hover:text-gray-300 font-medium"
        >
          Send again
        </button>
      </p>
    </div>
  );
}

export default EmailVerify;
