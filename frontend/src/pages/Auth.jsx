import React, { useState } from "react";
import { Mail, Lock, Loader2, RotateCcw} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { login } from '../services/login'
import { signup } from '../services/signup'

function Auth({user, setUser}) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [retype, setRetype] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate()

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!email) {
      setError("Please fill in your email.");
      return;
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@purdue\.edu$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid Purdue email.")
      return;
    }
    if (!password) {
      setError("Please fill in your password.");
      return;
    }
    //TODO: Verify password is strong enough and display according error message
    if (password.length < 8) {
      setError(`Password not secure enough. Password must include:
        At least 8 characters
        An uppercase letter, lowercase letter, and number
        Can only include alphanumberic symbols and these characters \"#$+%@^*-_/!,.;\"`);
    }
    const hasUpper = /[A-Z]/.test(password)
    const hasLower = /[a-z]/.test(password)
    const hasNumber = /[0-9]/.test(password)
    if (!(hasUpper && hasLower && hasNumber)) {
      setError(`Password not secure enough. Password must include:
        At least 8 characters
        An uppercase letter, lowercase letter, and number
        Can only include alphanumberic symbols and these characters \"#$+%@^*-_/!,.;\"`);
    }
    const badChar = /[^a-zA-Z0-9#$+%@^*\-_\/!,.;]/.test(password);
    if (badChar) {
      setError(`Password not secure enough. Password must include:
        At least 8 characters
        An uppercase letter, lowercase letter, and number
        Can only include alphanumberic symbols and these characters \"#$+%@^*-_/!,.;\"`);
    }

    if (!isLogin && (retype != password)) {
      setError("Passwords do not match.");
      return;
    }
    setError("");
    setIsLoading(true);
    try {
      const newUser = await signup(email, password)
      console.log("Signed up user: ", newUser);
      setUser(newUser)
      navigate('/onboarding')
    } catch (error) {
      console.error("Signup error", error);
      setError("Signup failed");
    } finally {
      setIsLoading(false)
    }
  };

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const loggedInUser = await login(email, password)
      setUser(loggedInUser)
      navigate('/')
    }
    catch (e) {
      setError(e.response.data.error)
      console.log("error occurred while logging in", e)
    }
  }

  return (
    <div className="w-full h-screen flex items-center justify-center p-4 dark:bg-gray-900">
      <div className={`absolute top-2/3 w-40 h-40 bg-gray-200 dark:bg-gray-700 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-2xl opacity-70 animate-blob-1 ease-in-out duration-150  ${isLogin?"-translate-x-full":"translate-x-2/3 -translate-y-1/4"}`}></div>
      <div className={`absolute top-1/4 w-64 h-64 bg-gray-300 dark:bg-gray-800 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-2xl opacity-70 animate-blob-2 ease-in-out duration-300 ${isLogin?"-translate-x-2/3":"translate-x-full -translate-y-1/3"}`}></div>
      <div className={`absolute top-1/2 w-52 h-52 bg-gray-200 dark:bg-gray-700 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-2xl opacity-70 animate-blob-3 ease-in-out duration-200 ${isLogin?"translate-x-full":"-translate-x-2/3"}`}></div>
      <div className="relative w-lg p-8 rounded-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6 text-center dark:text-white">
          {isLogin ? "Welcome back" : "Create an account"}
        </h1>
        <form onSubmit={isLogin ? handleLogin : handleSignUp}>
          <label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Email
          </label>
          <div className="mb-4 relative">
            <Mail className="absolute left-3 top-1/4 text-gray-400 dark:text-gray-500 h-5 w-5" />
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 w-full p-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400 focus:border-transparent transition-all outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder="bob@purdue.edu"
            />
          </div>

          <label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Password
          </label>
          <div className=" relative">
            <Lock className={(!isLogin? `top-3/16`:`top-1/4`) + ` absolute left-3  text-gray-400 dark:text-gray-500 h-5 w-5`} />
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={(!isLogin ? `mb-4 `: ``) + `mb-1/2 pl-10 w-full p-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400 focus:border-transparent transition-all outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white`}
              placeholder="Enter your password"
            />
          </div>
          {
            !isLogin && (
              <label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Retype Password
              </label>
            )
          }
          {
            !isLogin && (
              <div className=" relative">
                <RotateCcw className="absolute left-3 top-3/16 text-gray-400 dark:text-gray-500 h-5 w-5" />
                <input
                  id="password"
                  type="password"
                  value={retype}
                  onChange={(e) => setRetype(e.target.value)}
                  className="mb-6 pl-10 w-full p-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400 focus:border-transparent transition-all outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="Re-enter your password"
                />
              </div>
            )
          }
          {isLogin && <button className="mb-4 justify-end text-sm text-gray-900 dark:text-white cursor-pointer hover:text-gray-600 dark:hover:text-gray-300">
            Forgot password?
          </button>}
          {error && <p className="text-red-500 dark:text-red-300 text-md text-center mt-1 pb-6">{error}</p>}
          <button type="Submit" className="cursor-pointer w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 p-2 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors disabled:bg-gray-300 dark:disabled:bg-gray-600 flex items-center justify-center">
            {isLoading ? (
              <Loader2 className="animate-spin h-6 w-6" />
            ) : isLogin ? (
              "Sign In"
            ) : (
              "Sign Up"
            )}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={() => {
                setIsLogin(!isLogin);
                setError("");
                setPassword("");
                setRetype("");
              }
          }
            className="text-gray-900 dark:text-white cursor-pointer hover:text-gray-600 dark:hover:text-gray-300 font-medium"
          >
            {isLogin ? "Sign up" : "Sign in"}
          </button>
        </p>
      </div>
    </div>
  );
}

export default Auth;
