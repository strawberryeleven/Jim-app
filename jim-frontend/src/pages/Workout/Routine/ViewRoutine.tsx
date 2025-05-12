import { useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Button } from "@/components/buttons/button";
import { ArrowLeft, MoreVertical, Pencil, Trash2, Play } from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/hooks/redux-hooks";
import { deleteRoutine } from "@/store/slices/RoutineSlice";
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

const ViewRoutine = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const routines = useAppSelector((state) => state.routines.routines);
  const routine = routines.find((r) => r.id === id);

  const handleBack = () => {
    navigate("/workout");
  };

  const handleEdit = () => {
    navigate(`/edit-routine/${id}`);
  };

  const handleDelete = () => {
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    dispatch(deleteRoutine(id || ""));
    setShowDeleteDialog(false);
    navigate("/workout");
  };

  if (!routine) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold mb-4">Routine Not Found</h2>
        <p className="text-gray-400 mb-6">The routine you're trying to view doesn't exist.</p>
        <Button 
          onClick={() => navigate("/workout")}
          className="bg-blue-500 hover:bg-blue-600"
        >
          Back to Workouts
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        <Button
          variant="ghost"
          className="p-1"
          onClick={handleBack}
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-xl font-semibold">Routine Details</h1>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="p-1"
            >
              <MoreVertical className="h-6 w-6" />
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

      {/* Routine Info */}
      <div className="p-4">
        <h2 className="text-2xl font-bold">{routine.title}</h2>
        {routine.comment && (
          <p className="text-gray-400 mt-2">{routine.comment}</p>
        )}
      </div>

      {/* Exercises */}
      <div className="p-4 space-y-4">
        <h3 className="text-xl font-semibold">Exercises</h3>
        {routine.exercises.map((exercise, index) => (
          <div key={index} className="bg-zinc-900 rounded-lg p-4 border border-zinc-800">
            <div className="flex items-center mb-3">
              <div className="w-12 h-12 bg-zinc-800 rounded-lg overflow-hidden mr-4">
                {exercise.image && (
                  <img
                    src={exercise.image}
                    alt={exercise.name}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div>
                <h4 className="font-semibold">{exercise.name}</h4>
                {exercise.muscle && exercise.equipment && (
                  <p className="text-sm text-gray-400">
                    {exercise.muscle} • {exercise.equipment}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-2">
              <div className="grid grid-cols-12 gap-2 text-sm text-gray-400 mb-1">
                <div className="col-span-2">Set</div>
                <div className="col-span-5">Weight</div>
                <div className="col-span-5">Reps</div>
              </div>
              {exercise.sets.map((set, setIndex) => (
                <div key={setIndex} className="grid grid-cols-12 gap-2 items-center py-1">
                  <div className="col-span-2 text-gray-400">{setIndex + 1}</div>
                  <div className="col-span-5">{set.weight || '-'} kg</div>
                  <div className="col-span-5">{set.reps || '-'}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

     

      {/* Delete Confirmation */}
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
    </div>
  );
};

export default ViewRoutine;