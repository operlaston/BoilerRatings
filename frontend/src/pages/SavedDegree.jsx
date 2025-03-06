import React, { useEffect, useState } from "react";
import DegreePlanCard from "../components/DegreePlanCard";
import { useNavigate } from "react-router-dom"; 
import { getAllPlans } from "../services/degreePlan";


const SavedDegreePlans = ({user}) => {
  
  console.log(user)
  const navigate = useNavigate()
  const [degreePlans, setDegreePlans] = useState(null)
  const getDegreePlans = async () => {
    try {
      console.log("Into the try")
      const response = await getAllPlans(user)
      console.log("Got a response", response)
      setDegreePlans(response)
    } catch (error) {
      console.log("Error")
    }
  }
  useEffect(() => {
    if (!user) {
      alert("Please log in to save");
      console.log("Plz login")
      return;
    }else {
      getDegreePlans()
    }
  },[user])
  
  const onClick = async () => {
    console.log("Test")
  }
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-6 px-20">
      <h1 className="text-4xl font-bold text-center text-gray-900 dark:text-white">
        Saved Degree Plans
      </h1>
      <div className="mt-6">
          
        {degreePlans && degreePlans.length > 0 ? (
            degreePlans.map((plan) => (
              <DegreePlanCard
                key={plan._id} 
                name={plan.planName} 
                onClick={() => onClick(plan.id)} 
              />
            ))
          ) : (
            <p>No degree plans found.</p>
          )}

      </div>
    </div>
  );
};

export default SavedDegreePlans;

