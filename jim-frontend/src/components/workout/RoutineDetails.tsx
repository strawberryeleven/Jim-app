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
import { useToast } from "@/components/tooltips/use-toast";
import { useAuth } from "@/hooks/useAuth";

interface RoutineDetailsProps {
  routine: Routine;
}

const RoutineDetails: React.FC<RoutineDetailsProps> = ({ routine }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const { user } = useAuth();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isLiked, setIsLiked] = useState(routine.likes.includes(user?.id || ''));

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

  const handleLike = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to like routines.",
        variant: "destructive",
      });
      return;
    }

    try {
      if (isLiked) {
        await routineService.likeRoutine(routine.id); // Toggle like state
        routine.likes = routine.likes.filter(likeId => likeId !== user.id);
      } else {
        await routineService.likeRoutine(routine.id);
        routine.likes = [...routine.likes, user.id];
      }
      setIsLiked(!isLiked);
    } catch (err) {
      console.error('Error updating like:', err);
      toast({
        title: "Error",
        description: "Failed to update like. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copied",
        description: "Routine link has been copied to clipboard.",
      });
    } catch (err) {
      console.error('Error copying link:', err);
      toast({
        title: "Error",
        description: "Failed to copy link. Please try again.",
        variant: "destructive",
      });
    }
  };

  const isOwner = user?.id === routine.createdBy;

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-blue-900 text-white relative overflow-hidden">
      {/* Abstract Background Forms */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-900/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 -left-20 w-60 h-60 bg-zinc-800/30 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 right-1/4 w-72 h-72 bg-blue-800/20 rounded-full blur-3xl"></div>
      </div>
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 relative">
        <div className="flex justify-between items-center mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            <span>Back</span>
          </Button>
          <h1 className="text-2xl font-bold text-blue-400">{routine.name}</h1>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              onClick={handleLike}
              className={`text-gray-400 hover:text-white transition-colors ${isLiked ? 'text-red-500' : ''}`}
            >
              <Heart className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              onClick={handleShare}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Share2 className="w-5 h-5" />
            </Button>
            {isOwner && (
              <>
                <Button
                  variant="ghost"
                  onClick={() => navigate(`/routines/${routine.id}/edit`)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Edit className="w-5 h-5" />
                </Button>
                <Button
                  variant="ghost"
                  onClick={handleDelete}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="max-w-4xl mx-auto w-full">
          <div className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 p-6 mb-8">
            <p className="text-gray-300">{routine.description}</p>
          </div>

          <div className="space-y-6">
            {routine.exercises.map((exercise) => (
              <div
                key={exercise.exerciseId}
                className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 p-6"
              >
                <div className="flex items-start gap-4">
                  <img
                    src={exercise.exerciseDetails.imageUrl}
                    alt={exercise.exerciseDetails.name}
                    className="w-24 h-24 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white">{exercise.exerciseDetails.name}</h3>
                    <p className="text-sm text-gray-400 mt-1">{exercise.exerciseDetails.description}</p>
                    <div className="flex items-center gap-4 mt-4">
                      <div className="text-sm text-gray-400">
                        <span className="font-medium text-white">{exercise.sets.length}</span> sets
                      </div>
                      <div className="text-sm text-gray-400">
                        <span className="font-medium text-white">{exercise.sets[0]?.reps || 0}</span> reps
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
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