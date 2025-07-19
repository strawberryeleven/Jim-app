import fetch from 'node-fetch';
import { exercises } from '../data/ExerciseData.js';

const API_URL = 'http://localhost:5000/api/exercises';
const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODIwYmExMTQ4YjRmNDUwMmU2NGQ0ZDAiLCJlbWFpbCI6ImlicmFoaW1ndWxidXR0MjQyQGdtYWlsLmNvbSIsImlhdCI6MTc0NzA0OTIyOCwiZXhwIjoxNzQ3MDUwMTI4fQ.eYYCBggeGUPiC67tacd4SRPO4luNwmLfUO7eiFln1GU';

const transformExercise = (exercise) => {
  return {
    name: exercise.name,
    description: `${exercise.name} exercise for ${exercise.muscle} using ${exercise.equipment}`,
    muscleGroup: exercise.muscle.charAt(0).toUpperCase() + exercise.muscle.slice(1),
    equipment: exercise.equipment.charAt(0).toUpperCase() + exercise.equipment.slice(1),
    difficulty: "intermediate", // Default value
    instructions: [
      "Setup the equipment properly",
      "Maintain proper form throughout the exercise",
      "Control your breathing",
      "Complete the full range of motion"
    ],
    videoUrl: exercise.image.startsWith('http') ? exercise.image : `https://example.com${exercise.image}`,
    imageUrl: exercise.image.startsWith('http') ? exercise.image : `https://example.com${exercise.image}`
  };
};

const uploadExercises = async () => {
  const transformedExercises = exercises.map(transformExercise);
  
  for (const exercise of transformedExercises) {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(exercise)
      });

      if (!response.ok) {
        throw new Error(`Failed to upload exercise: ${exercise.name}`);
      }

      console.log(`Successfully uploaded: ${exercise.name}`);
    } catch (error) {
      console.error(`Error uploading ${exercise.name}:`, error);
    }
  }
};

// Run the upload
uploadExercises().then(() => {
  console.log('Upload process completed');
}).catch(error => {
  console.error('Upload process failed:', error);
}); 