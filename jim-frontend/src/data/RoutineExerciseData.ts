import { Exercise } from "../types/Exercise";
  
  export const equipmentList = [
    "dumbbell",
    "barbell",
    "machine",
    "bodyweight",
    "kettlebell",
  ];
  
  export const muscleList = [
    "chest",
    "back",
    "biceps",
    "triceps",
    "legs",
    "shoulders",
    "abs",
  ];
  
  export const exercises = [
    // Chest
    {
    name: "Push-Ups",
    equipment: "bodyweight",
    muscle: "chest",
    image: "/images/pushup.gif",
  },
  {
    name: "Barbell Bench Press",
    equipment: "barbell",
    muscle: "chest",
    image: "/images/BenchPress.gif",
  },
  {
    name: "Dumbbell Bench Press",
    equipment: "dumbbell",
    muscle: "chest",
    image: "/images/dumbell-bench-press.gif",
  },
  {
    name: "Chest Flys",
    equipment: "dumbbell",
    muscle: "chest",
    image: "/images/chest-press.gif",
  },
  {
    name: "Machine Chest Press",
    equipment: "machine",
    muscle: "chest",
    image: "/images/machine-chest-press.gif",
  },
  {
    name: "Incline Dumbbell Press",
    equipment: "dumbbell",
    muscle: "chest",
    image: "/images/incline-dumbell-press.webp",
  },
  {
    name: "Decline Barbell Press",
    equipment: "barbell",
    muscle: "chest",
    image: "/images/decline-barbell-press.gif",
  },
  {
    name: "Cable Crossovers",
    equipment: "machine",
    muscle: "chest",
    image: "/images/cable-crossovers.webp",
  },
  {
    name: "Pec Deck",
    equipment: "machine",
    muscle: "chest",
    image: "/images/pec-deck.gif",
  },
  {
    name: "Kettlebell Floor Press",
    equipment: "kettlebell",
    muscle: "chest",
    image: "/images/kettlebell-floor-press.webp",
  },

  // Back
  {
    name: "Pull-Ups",
    equipment: "bodyweight",
    muscle: "back",
    image: "/images/pull-up.gif",
  },
  {
    name: "Barbell Deadlift",
    equipment: "barbell",
    muscle: "back",
    image: "/images/deadlift.gif",
  },
  {
    name: "Seated Cable Rows",
    equipment: "machine",
    muscle: "back",
    image: "/images/seated-cable-row.gif",
  },
  {
    name: "Dumbbell Bent-Over Rows",
    equipment: "dumbbell",
    muscle: "back",
    image: "/images/dumbell-bent-over-row.gif",
  },
  {
    name: "Lat Pulldown",
    equipment: "machine",
    muscle: "back",
    image:"/images/lat-pulldown.gif",
  },
  {
    name: "T-Bar Row",
    equipment: "barbell",
    muscle: "back",
    image: "/images/t-bar-row.gif",
  },
  
  {
    name: "Superman",
    equipment: "bodyweight",
    muscle: "back",
    image: "/images/superman.gif",
  },
  {
    name: "Kettlebell Swings",
    equipment: "kettlebell",
    muscle: "back",
    image: "/images/kettlebell-swing.webp",
  },
  {
    name: "One-Arm Dumbbell Row",
    equipment: "dumbbell",
    muscle: "back",
    image: "/images/one-arm-dumbell-row.webp",
  },

  // Biceps
  {
    name: "Barbell Bicep Curl",
    equipment: "barbell",
    muscle: "biceps",
    image: "/images/barbell-bicep-curl.gif",
  },
  {
    name: "Dumbbell Bicep Curl",
    equipment: "dumbbell",
    muscle: "biceps",
    image: "/images/bicep-curls.gif",
  },
  {
    name: "Hammer Curl",
    equipment: "dumbbell",
    muscle: "biceps",
    image: "/images/hammer-curl.gif",
  },
  {
    name: "Concentration Curl",
    equipment: "dumbbell",
    muscle: "biceps",
    image: "/images/concentration-curl.webp",
  },
  {
    name: "Preacher Curl",
    equipment: "barbell",
    muscle: "biceps",
    image: "/images/preacher-curl.webp",
  },
  {
    name: "Cable Curl",
    equipment: "machine",
    muscle: "biceps",
    image: "/images/cable-curl.webp",
  },
  {
    name: "Zottman Curl",
    equipment: "dumbbell",
    muscle: "biceps",
    image: "/images/zottman-curl.gif",
  },
  {
    name: "Chin-Ups",
    equipment: "bodyweight",
    muscle: "biceps",
    image: "/images/chinups.gif",
  },
  {
    name: "Kettlebell Curl",
    equipment: "kettlebell",
    muscle: "biceps",
    image: "/images/kettlebell-curl.webp",
  },
  {
    name: "Incline Dumbbell Curl",
    equipment: "dumbbell",
    muscle: "biceps",
    image: "/images/Incline-Dumbell-Curl.webp",
  },
  
    // Triceps
    {
      name: "Tricep Dips",
      equipment: "bodyweight",
      muscle: "triceps",
      image: "https://wger.de/media/exercise-images/103/Triceps-Dip-1.png",
    },
    {
      name: "Tricep Pushdowns",
      equipment: "machine",
      muscle: "triceps",
      image: "https://wger.de/media/exercise-images/156/Cable-Triceps-Pushdown-1.png",
    },
    {
      name: "Close-Grip Bench Press",
      equipment: "barbell",
      muscle: "triceps",
      image: "https://wger.de/media/exercise-images/104/Close-Grip-Bench-Press-1.png",
    },
    {
      name: "Overhead Dumbbell Extension",
      equipment: "dumbbell",
      muscle: "triceps",
      image: "https://wger.de/media/exercise-images/105/Overhead-Dumbbell-Extension-1.png",
    },
    {
      name: "Skull Crushers",
      equipment: "barbell",
      muscle: "triceps",
      image: "https://wger.de/media/exercise-images/106/Skull-Crusher-1.png",
    },
    {
      name: "Dumbbell Kickbacks",
      equipment: "dumbbell",
      muscle: "triceps",
      image: "https://wger.de/media/exercise-images/107/Dumbbell-Kickback-1.png",
    },
    {
      name: "Cable Overhead Extension",
      equipment: "machine",
      muscle: "triceps",
      image: "https://wger.de/media/exercise-images/108/Cable-Overhead-Extension-1.png",
    },
    {
      name: "Kettlebell Triceps Press",
      equipment: "kettlebell",
      muscle: "triceps",
      image: "https://wger.de/media/exercise-images/109/Kettlebell-Triceps-Press-1.png",
    },
    {
      name: "Diamond Push-Ups",
      equipment: "bodyweight",
      muscle: "triceps",
      image: "https://wger.de/media/exercise-images/110/Diamond-Push-up-1.png",
    },
    {
      name: "Machine Dips",
      equipment: "machine",
      muscle: "triceps",
      image: "https://wger.de/media/exercise-images/111/Machine-Dip-1.png",
    },
  
    {
      name: "Overhead Press",
      equipment: "barbell",
      muscle: "shoulders",
      image: "https://wger.de/media/exercise-images/32/Overhead-Press-1.png",
    },
    {
      name: "Dumbbell Shoulder Press",
      equipment: "dumbbell",
      muscle: "shoulders",
      image: "https://wger.de/media/exercise-images/33/Dumbbell-Shoulder-Press-1.png",
    },
    {
      name: "Lateral Raise",
      equipment: "dumbbell",
      muscle: "shoulders",
      image: "https://wger.de/media/exercise-images/34/Lateral-Raise-1.png",
    },
    {
      name: "Front Raise",
      equipment: "dumbbell",
      muscle: "shoulders",
      image: "https://wger.de/media/exercise-images/35/Front-Raise-1.png",
    },
    {
      name: "Face Pulls",
      equipment: "machine",
      muscle: "shoulders",
      image: "https://wger.de/media/exercise-images/85/Face-Pull-1.png",
    },
    {
      name: "Arnold Press",
      equipment: "dumbbell",
      muscle: "shoulders",
      image: "https://wger.de/media/exercise-images/36/Arnold-Press-1.png",
    },
    {
      name: "Rear Delt Fly",
      equipment: "dumbbell",
      muscle: "shoulders",
      image: "https://wger.de/media/exercise-images/37/Rear-Delt-Fly-1.png",
    },
    {
      name: "Machine Shoulder Press",
      equipment: "machine",
      muscle: "shoulders",
      image: "https://wger.de/media/exercise-images/38/Machine-Shoulder-Press-1.png",
    },
    {
      name: "Kettlebell Press",
      equipment: "kettlebell",
      muscle: "shoulders",
      image: "https://wger.de/media/exercise-images/39/Kettlebell-Press-1.png",
    },
    {
      name: "Handstand Push-Up",
      equipment: "bodyweight",
      muscle: "shoulders",
      image: "https://wger.de/media/exercise-images/40/Handstand-Push-Up-1.png",
    },
  
    {
      name: "Barbell Squats",
      equipment: "barbell",
      muscle: "legs",
      image: "https://wger.de/media/exercise-images/64/Barbell-Squat-1.png",
    },
    {
      name: "Dumbbell Lunges",
      equipment: "dumbbell",
      muscle: "legs",
      image: "https://wger.de/media/exercise-images/112/Dumbbell-Lunge-1.png",
    },
    {
      name: "Leg Press",
      equipment: "machine",
      muscle: "legs",
      image: "https://wger.de/media/exercise-images/113/Leg-Press-1.png",
    },
    {
      name: "Bodyweight Squats",
      equipment: "bodyweight",
      muscle: "legs",
      image: "https://wger.de/media/exercise-images/114/Bodyweight-Squat-1.png",
    },
    {
      name: "Kettlebell Goblet Squat",
      equipment: "kettlebell",
      muscle: "legs",
      image: "https://wger.de/media/exercise-images/115/Kettlebell-Goblet-Squat-1.png",
    },
    {
      name: "Romanian Deadlifts",
      equipment: "barbell",
      muscle: "legs",
      image: "https://wger.de/media/exercise-images/116/Romanian-Deadlift-1.png",
    },
    {
      name: "Leg Extensions",
      equipment: "machine",
      muscle: "legs",
      image: "https://wger.de/media/exercise-images/117/Leg-Extension-1.png",
    },
    {
      name: "Hamstring Curls",
      equipment: "machine",
      muscle: "legs",
      image: "https://wger.de/media/exercise-images/118/Hamstring-Curl-1.png",
    },
    {
      name: "Jump Squats",
      equipment: "bodyweight",
      muscle: "legs",
      image: "https://wger.de/media/exercise-images/119/Jump-Squat-1.png",
    },
    {
      name: "Bulgarian Split Squats",
      equipment: "dumbbell",
      muscle: "legs",
      image: "https://wger.de/media/exercise-images/120/Bulgarian-Split-Squat-1.png",
    },
  
    {
      name: "Crunches",
      equipment: "bodyweight",
      muscle: "abs",
      image: "https://wger.de/media/exercise-images/121/Crunches-1.png",
    },
    {
      name: "Leg Raises",
      equipment: "bodyweight",
      muscle: "abs",
      image: "https://wger.de/media/exercise-images/122/Leg-Raises-1.png",
    },
    {
      name: "Plank",
      equipment: "bodyweight",
      muscle: "abs",
      image: "https://wger.de/media/exercise-images/123/Plank-1.png",
    },
    {
      name: "Russian Twists",
      equipment: "bodyweight",
      muscle: "abs",
      image: "https://wger.de/media/exercise-images/124/Russian-Twist-1.png",
    },
    {
      name: "Cable Crunch",
      equipment: "machine",
      muscle: "abs",
      image: "https://wger.de/media/exercise-images/125/Cable-Crunch-1.png",
    },
    {
      name: "Hanging Leg Raise",
      equipment: "bodyweight",
      muscle: "abs",
      image: "https://wger.de/media/exercise-images/126/Hanging-Leg-Raise-1.png",
    },
    {
      name: "Dumbbell Side Bend",
      equipment: "dumbbell",
      muscle: "abs",
      image: "https://wger.de/media/exercise-images/127/Dumbbell-Side-Bend-1.png",
    },
    {
      name: "V-Ups",
      equipment: "bodyweight",
      muscle: "abs",
      image: "https://wger.de/media/exercise-images/128/V-Up-1.png",
    },
    {
      name: "Mountain Climbers",
      equipment: "bodyweight",
      muscle: "abs",
      image: "https://wger.de/media/exercise-images/129/Mountain-Climbers-1.png",
    },
    {
      name: "Kettlebell Windmill",
      equipment: "kettlebell",
      muscle: "abs",
      image: "https://wger.de/media/exercise-images/130/Kettlebell-Windmill-1.png",
    },
  ];  
    
  