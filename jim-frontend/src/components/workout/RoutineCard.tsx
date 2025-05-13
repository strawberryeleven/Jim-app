import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/buttons/button";
import { Card } from "@/components/cards/card";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/forms/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/dialogs/alert-dialog";
import { useAppDispatch } from "@/hooks/redux-hooks";
import { deleteRoutine } from "@/store/slices/RoutineSlice";
import type { Routine } from "@/services/routineService";

interface RoutineCardProps {
  routine: Routine;
}

const RoutineCard = ({ routine }: RoutineCardProps) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleClick = () => {
    navigate(`/routine/${routine.id}`);
  };

  const handleEdit = () => {
    navigate(`/edit-routine/${routine.id}`);
  };

  const handleDelete = () => {
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    dispatch(deleteRoutine(routine.id));
    setShowDeleteDialog(false);
  };

  // Get the first exercise name for display
  const primaryExercise = routine.exercises.length > 0 
    ? routine.exercises[0].exerciseDetails?.name || "Loading..."
    : "No exercises";

  return (
    <>
      <Card
        className="p-4 bg-black/40 hover:bg-black/50 transition-colors cursor-pointer"
        onClick={handleClick}
      >
        <h3 className="text-lg font-semibold text-white">{routine.name}</h3>
        <p className="text-sm text-gray-400 mt-1">{routine.description}</p>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-sm text-gray-400">
            {routine.exercises.length} exercises
          </span>
          <span className="text-sm text-gray-400">•</span>
          <span className="text-sm text-gray-400">
            {routine.likes.length} likes
          </span>
        </div>
        {routine.exercises.length > 0 && (
          <div className="mt-2">
            <p className="text-sm text-gray-400">Primary exercise: {primaryExercise}</p>
          </div>
        )}
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-zinc-900 border-gray-800 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl">Delete Routine</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Are you sure you want to delete "{routine.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4">
            <AlertDialogCancel className="bg-transparent text-white border-gray-700 hover:bg-zinc-800">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-500 hover:bg-red-600 text-white border-none"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default RoutineCard;