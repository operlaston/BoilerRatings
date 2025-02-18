import React, { useState } from "react";
// import { Mail, Lock, Loader2 } from "lucide-react";
function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1500);
  };
  return (
    <div className = "w-full h-screen flex items-center justify-center p-4">
        <div className="relative w-lg p-8 rounded-lg bg-white/80 backdrop-blur-sm shadow-xl">
            <h1 className="text-2xl font-semibold text-gray-900 mb-6 text-center" data-id="element-9"> 
                {isLogin? "Welcome back" : "Create an account"}
            </h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <lable for="email" class></lable>
            </form>

        </div>
        
    </div>
  );
}

export default Login;
