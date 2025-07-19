import React from "react";
import { Button } from "@/components/buttons/button";
import { DumbbellIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

const EmptyWorkout: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="text-center mt-10 space-y-4">
      <DumbbellIcon className="mx-auto h-8 w-8" />
      <h2 className="text-lg font-semibold">Get started</h2>
      <p className="text-sm text-gray-400">
        Add an exercise to start your workout
      </p>
      <Button
        className="bg-blue-600 text-white hover:bg-blue-700"
        onClick={() => navigate("/add-exercise")}
      >
        + Add Exercise
      </Button>
    </div>
  );
};

export default EmptyWorkout;