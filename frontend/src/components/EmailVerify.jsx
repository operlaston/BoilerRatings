import React from "react";
import { MailCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { verify } from "../services/signup"

function EmailVerify(user, setUser) {
  //Somehow an event will be triggered
  const [verificationCode, setVerifcationCode] = useState("")
  const handleVerify = async (e) => {
    setisLoading(true)
    try {
      const newUser = await verify(user.email, verificationCode)
      setUser(newUser)
      navigate('/onboarding')
    } catch (error) {
      console.log("Incorrect or expired code", error);
      setError("Incorrect or expired Code")
    } finally {
      setisLoading(false)
    }
  }
  const navigate = useNavigate()

  return (
    <div className="relative w-lg p-8 rounded-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6 text-center dark:text-white">
        Verify your email
      </h1>
      <div className="text-center dark:text-white h-24 w-24 mx-auto mb-4">
        <MailCheck className="text-gray-600 dark:text-gray-300 h-24 w-24"/>
      </div>
      <p className="text-md text-gray-700 mb-1 text-center dark:text-gray-400">
        Please check your mailbox and click on the verification link. 
      </p>
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
