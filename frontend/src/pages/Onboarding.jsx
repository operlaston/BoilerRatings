import React, { useEffect, useState } from "react";
import EmailVerify from "../components/EmailVerify";
import OnboardingForm from "../components/OnboardingForm";

function Onboarding({user, setUser}) {  
  const [isVerified, setIsVerified] = useState(!user.isVerified);
  useEffect(() => {
    setIsVerified(!user.isVerified)
  }, [user])
  // const [isVerified, setIsVerified] = useState(false)

  //const [isVerify, setIsVerify] = useState(true); //this variable controls whether the page is on the verify step or the onboarding form
  return (
    <div className="w-full h-screen flex items-center justify-center p-4 dark:bg-gray-900">
        <div className={`absolute top-2/3 w-40 h-40 bg-gray-200 dark:bg-gray-700 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-2xl opacity-70 animate-blob-1 ease-in-out duration-150 -translate-x-full`}></div>
        <div className={`absolute top-1/4 w-64 h-64 bg-gray-300 dark:bg-gray-800 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-2xl opacity-70 animate-blob-2 ease-in-out duration-300 -translate-x-2/3`}></div>
        <div className={`absolute top-1/2 w-52 h-52 bg-gray-200 dark:bg-gray-700 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-2xl opacity-70 animate-blob-3 ease-in-out duration-200 translate-x-full`}></div>
        {isVerified && <EmailVerify user={user} setUser={setUser}/>}
        {!isVerified && <OnboardingForm user={user} setUser={setUser}/>}
    </div>
  );
}

export default Onboarding;
