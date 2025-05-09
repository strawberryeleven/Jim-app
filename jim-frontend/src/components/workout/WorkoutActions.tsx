import React from "react";
import { Button } from "@/components/buttons/button";

interface WorkoutActionsProps {
  onOpenDiscardDialog: () => void;
}

const WorkoutActions: React.FC<WorkoutActionsProps> = ({ onOpenDiscardDialog }) => {
  return (
    <div className="flex justify-center mt-6">
      <Button
        size="sm"
        className="bg-red-700 text-white hover:bg-red-800"
        onClick={onOpenDiscardDialog}
      >
        Discard Workout
      </Button>
    </div>
  );
};

export default WorkoutActions;
