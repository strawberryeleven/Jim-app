import { IExercise } from '../models/exerciseModel';
import { IRoutine } from '../models/routineModel';
import { IUser } from '../models/userModel';
import { IWorkout } from '../models/workoutModel';
import { IWorkoutLog } from '../models/workoutLogModel';
import { ExerciseResponse, RoutineResponse, UserResponse, WorkoutResponse, WorkoutLogResponse } from '../types';
import { ObjectId } from 'mongodb';

export const mapExerciseToResponse = (exercise: IExercise & { _id: any; __v?: number }): ExerciseResponse['exercise'] => ({
  id: exercise._id.toString(),
  name: exercise.name,
  description: exercise.description,
  category: exercise.category,
  muscleGroup: exercise.muscleGroup,
  equipment: exercise.equipment,
  difficulty: exercise.difficulty,
  instructions: exercise.instructions,
  videoUrl: exercise.videoUrl,
  imageUrl: exercise.imageUrl,
  createdBy: exercise.createdBy ? exercise.createdBy.toString() : '',
});

export const mapRoutineToResponse = (routine: IRoutine & { _id: any; __v?: number }): RoutineResponse['routine'] => {
  if (!routine) {
    throw new Error('Invalid routine data');
  }

  return {
    id: routine._id?.toString() || '',
    name: routine.name || '',
    description: routine.description || '',
    exercises: (routine.exercises || []).map(e => ({
      exerciseId: e.exerciseId?.toString() || '',
      sets: (e.sets || []).map(s => ({
        weight: s.weight || 0,
        reps: s.reps || 0,
        isCompleted: s.isCompleted || false
      })),
      order: e.order || 0
    })),
    createdBy: routine.createdBy?.toString() || '',
    isPublic: routine.isPublic || false,
    likes: (routine.likes || []).map(l => l?.toString() || ''),
    createdAt: routine.createdAt?.toISOString() || new Date().toISOString(),
    updatedAt: routine.updatedAt?.toISOString() || new Date().toISOString()
  };
};

export const mapUserToResponse = (user: any): {
    id: string;
    name: string;
    email: string;
    profileImage?: string;
    bio?: string;
    followers: string[];
    following: string[];
  } => {
    if (!user) {
      throw new Error('Invalid user data');
    }
    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      profileImage: user.profileImage,
      bio: user.bio,
      followers: user.followers.map((f: any) => f.toString()),
      following: user.following.map((f: any) => f.toString()),
    };
  };

export const mapWorkoutToResponse = (workout: IWorkout & { _id: any; __v?: number }): WorkoutResponse['workout'] => {
  if (!workout) {
    throw new Error('Invalid workout data');
  }

  return {
    id: workout._id.toString(),
    name: workout.name,
    description: workout.description,
    exercises: workout.exercises.map(e => ({
      exercise: e.exercise ? e.exercise.toString() : '',
      sets: e.sets,
      reps: e.reps,
      weight: e.weight,
      duration: e.duration,
      restTime: e.restTime,
    })),
    createdBy: workout.createdBy ? workout.createdBy.toString() : '',
    isPublic: workout.isPublic,
    likes: workout.likes ? workout.likes.map(l => l.toString()) : [],
  };
};

export const mapWorkoutLogToResponse = (log: IWorkoutLog & { _id: any; __v?: number }): WorkoutLogResponse['log'] => ({
  id: log._id.toString(),
  user: log.user.toString(),
  workout: log.workout.toString(),
  date: log.date,
  exercises: log.exercises.map(e => ({
    exercise: e.exercise.toString(),
    sets: e.sets.map(s => ({
      reps: s.reps,
      weight: s.weight,
      duration: s.duration,
      completed: s.completed,
    })),
  })),
  notes: log.notes,
  duration: log.duration,
});