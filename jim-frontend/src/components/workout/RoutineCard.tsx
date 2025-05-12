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
import type { Routine } from "@/store/slices/RoutineSlice";

interface RoutineCardProps {
  routine: Routine;
}

const RoutineCard: React.FC<RoutineCardProps> = ({ routine }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleViewRoutine = () => {
    // Navigate to the View Routine page and pass routine data
    navigate(`/view-routine/${routine.id}`, { state: { routine } });
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

  // Extract the first exercise name for display
  const primaryExercise = routine.exercises.length > 0 
    ? routine.exercises[0].name 
    : "No exercises";

  return (
    <>
      <Card className="bg-zinc-900 border-gray-800 text-white mb-4 overflow-hidden">
        <div className="p-4">
          <div className="flex justify-between items-start mb-1">
            <h3 className="text-lg font-medium">{routine.title}</h3>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-transparent"
                >
                  <MoreVertical size={18} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-zinc-800 border-gray-700 text-white">
                <DropdownMenuItem 
                  onClick={handleEdit}
                  className="hover:bg-zinc-700 cursor-pointer"
                >
                  <Pencil size={16} className="mr-2" /> Edit
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={handleDelete} 
                  className="text-red-400 hover:bg-zinc-700 hover:text-red-300 cursor-pointer"
                >
                  <Trash2 size={16} className="mr-2" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <p className="text-sm text-gray-400">{primaryExercise}</p>
        </div>
        <Button
          onClick={handleViewRoutine}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-t-none"
        >
          View Routine
        </Button>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-zinc-900 border-gray-800 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl">Delete Routine</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Are you sure you want to delete "{routine.title}"? This action cannot be undone.
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