import React from "react";
import { useNavigate } from "react-router-dom";
import { 
  Dialog, 
  DialogContent, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialogs/dialog";
import { Button } from "@/components/ui/buttons/button";

interface DiscardWorkoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clearExercises: () => void;
}

const DiscardWorkoutDialog: React.FC<DiscardWorkoutDialogProps> = ({
  open,
  onOpenChange,
  clearExercises
}) => {
  const navigate = useNavigate();
  
  const handleDiscard = () => {
    clearExercises();
    onOpenChange(false);
    navigate("/workout");
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-zinc-800 text-white border-zinc-700">
        <DialogHeader>
          <DialogTitle>Discard Workout</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-gray-300">
          Are you sure you want to discard this workout?
        </p>
        <DialogFooter className="flex justify-end gap-2 pt-4">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDiscard}
          >
            Discard
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DiscardWorkoutDialog;