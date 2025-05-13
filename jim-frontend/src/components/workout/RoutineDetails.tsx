import React, { useState } from "react";
import { Routine } from "@/services/routineService";
import { Card } from "@/components/cards/card";
import { Button } from "@/components/buttons/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
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

interface RoutineDetailsProps {
  routine: Routine;
}

const RoutineDetails: React.FC<RoutineDetailsProps> = ({ routine }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleEdit = () => {
    navigate(`/edit-routine/${routine.id}`);
  };

  const handleDelete = () => {
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    dispatch(deleteRoutine(routine.id));
    setShowDeleteDialog(false);
    navigate("/routines");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => navigate("/routines")}
          className="text-gray-400 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Routines
        </Button>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleEdit}
            className="text-gray-400 hover:text-white"
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
          <Button
            variant="outline"
            onClick={handleDelete}
            className="text-red-400 hover:text-red-500 hover:bg-red-500/10"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      {/* Routine Info */}
      <Card className="p-6 bg-black/40">
        <h1 className="text-2xl font-bold text-white mb-2">{routine.name}</h1>
        <p className="text-gray-400 mb-4">{routine.description}</p>
        <div className="flex items-center gap-4 text-sm text-gray-400">
          <span>{routine.exercises.length} exercises</span>
          <span>•</span>
          <span>{routine.likes.length} likes</span>
          <span>•</span>
          <span>Created {new Date(routine.createdAt).toLocaleDateString()}</span>
        </div>
      </Card>

      {/* Exercises */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-white">Exercises</h2>
        {routine.exercises.map((exercise, index) => (
          <Card key={index} className="p-4 bg-black/40">
            <div className="flex items-start gap-4">
              {exercise.exerciseDetails?.imageUrl ? (
                <div className="w-24 h-24 bg-zinc-800 rounded-lg overflow-hidden">
                  <img
                    src={exercise.exerciseDetails.imageUrl}
                    alt={exercise.exerciseDetails.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-24 h-24 bg-zinc-800 rounded-lg flex items-center justify-center">
                  <span className="text-gray-400">No Image</span>
                </div>
              )}
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white">
                  {exercise.exerciseDetails?.name || "Loading..."}
                </h3>
                <p className="text-sm text-gray-400 mb-2">
                  {exercise.exerciseDetails?.description}
                </p>
                <div className="flex gap-4 text-sm text-gray-400">
                  <span>{exercise.exerciseDetails?.muscleGroup}</span>
                  <span>•</span>
                  <span>{exercise.exerciseDetails?.equipment}</span>
                </div>
              </div>
            </div>

            {/* Sets */}
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-300 mb-2">Sets</h4>
              <div className="space-y-2">
                {exercise.sets.map((set, setIndex) => (
                  <div
                    key={setIndex}
                    className="flex items-center justify-between bg-zinc-800/50 p-2 rounded"
                  >
                    <span className="text-sm text-gray-400">Set {setIndex + 1}</span>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-400">
                        {set.weight} kg × {set.reps} reps
                      </span>
                      {set.isCompleted && (
                        <span className="text-xs text-green-500">Completed</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Delete Dialog */}
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
    </div>
  );
};

export default RoutineDetails; 