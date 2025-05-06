import { useParams } from "react-router-dom";
import { Card } from "@/components/ui/cards/card";

const routineData = {
    1: {
      name: "Full Body Blast",
      workouts: [
        {
          name: "Squats",
          sets: "4 sets x 12 reps",
          image: "/images/squats.gif",
        },
        {
          name: "Push-ups",
          sets: "4 sets x 15 reps",
          image: "/images/pushup.gif"   },
        {
          name: "Deadlifts",
          sets: "3 sets x 10 reps",
          image: "/images/deadlift.gif",
        },
        {
          name: "Burpees",
          sets: "3 sets x 15 reps",
          image: "/images/burpees.gif",
        },
      ],
      diet: [
        "🥣 Breakfast: Oatmeal + Banana + Protein Shake",
        "🥗 Lunch: Grilled Chicken + Brown Rice + Broccoli",
        "🍎 Snack: Greek Yogurt + Mixed Nuts",
        "🍽️ Dinner: Salmon + Quinoa + Green Beans",
      ],
    },
  
    2: {
      name: "Leg Day Strength",
      workouts: [
        {
          name: "Barbell Squats",
          sets: "4 sets x 8 reps",
          image: "/images/barbell-squats.webp",
        },
        {
          name: "Lunges",
          sets: "3 sets x 12 reps (each leg)",
          image: "/images/lunges.gif",
        },
        {
          name: "Leg Press",
          sets: "4 sets x 10 reps",
          image: "/images/legpress.gif",
        },
        {
          name: "Standing Calf Raises",
          sets: "4 sets x 15 reps",
          image: "/images/standing-calf-raise.gif",
        },
      ],
      diet: [
        "🥣 Breakfast: Eggs + Toast + Avocado",
        "🥗 Lunch: Turkey Wrap + Sweet Potato",
        "🍎 Snack: Protein Bar",
        "🍽️ Dinner: Steak + Mashed Potatoes + Spinach",
      ],
    },
  
    3: {
      name: "Push Pull Split",
      workouts: [
        {
          name: "Bench Press",
          sets: "4 sets x 8 reps",
          image: "/images/BenchPress.gif",
        },
        {
          name: "Pull-ups",
          sets: "3 sets x 10 reps",
          image: "/images/pull-up.gif",
        },
        {
          name: "Overhead Press",
          sets: "3 sets x 10 reps",
          image: "/images/Overhead-press.gif",
        },
        {
          name: "Barbell Rows",
          sets: "4 sets x 10 reps",
          image: "/images/barbellrow.gif",
        },
      ],
      diet: [
        "🥣 Breakfast: Smoothie with Berries + Protein",
        "🥗 Lunch: Chicken Breast + Couscous + Salad",
        "🍎 Snack: Apple + Peanut Butter",
        "🍽️ Dinner: Tuna + Brown Rice + Steamed Veggies",
      ],
    },
  
    4: {
      name: "HIIT Burn",
      workouts: [
        {
          name: "Jumping Jacks",
          sets: "3 sets x 30 seconds",
          image: "/images/jumpingjacks.gif",
        },
        {
          name: "Mountain Climbers",
          sets: "3 sets x 30 seconds",
          image: "/images/mountain-climber.gif",
        },
        {
          name: "High Knees",
          sets: "3 sets x 30 seconds",
          image: "/images/high-knees.gif",
        },
        {
          name: "Jump Squats",
          sets: "3 sets x 15 reps",
          image: "/images/jump-squats.gif",
        },
      ],
      diet: [
        "🥣 Breakfast: Greek Yogurt + Granola",
        "🥗 Lunch: Quinoa Bowl + Chickpeas",
        "🍎 Snack: Fruit Salad",
        "🍽️ Dinner: Grilled Fish + Asparagus + Brown Rice",
      ],
    },
  
    5: {
      name: "Upper Body Sculpt",
      workouts: [
        {
          name: "Bicep Curls",
          sets: "4 sets x 12 reps",
          image: "/images/bicep-curls.gif",
        },
        {
          name: "Tricep Dips",
          sets: "3 sets x 15 reps",
          image: "/images/tricep-dips.webp",
        },
        {
          name: "Chest Press",
          sets: "3 sets x 10 reps",
          image: "/images/Overhead-press.gif",
        },
        {
          name: "Lateral Raises",
          sets: "3 sets x 12 reps",
          image: "/images/lateral-raises.gif",
        },
      ],
      diet: [
        "🥣 Breakfast: Egg White Omelette + Toast",
        "🥗 Lunch: Tuna Salad + Crackers",
        "🍎 Snack: Cottage Cheese + Berries",
        "🍽️ Dinner: Chicken + Green Beans + Rice",
      ],
    },
  
    6: {
      name: "Core Crusher",
      workouts: [
        {
          name: "Planks",
          sets: "3 sets x 60 seconds",
          image: "/images/planks.gif",
        },
        {
          name: "Crunches",
          sets: "3 sets x 20 reps",
          image: "/images/crunches.gif",
        },
        {
          name: "Russian Twists",
          sets: "3 sets x 20 reps",
          image: "/images/russian-twist.gif",
        },
        {
          name: "Leg Raises",
          sets: "3 sets x 15 reps",
          image: "/images/leg-raises.gif",
        },
      ],
      diet: [
        "🥣 Breakfast: Smoothie Bowl + Chia Seeds",
        "🥗 Lunch: Grilled Tofu + Stir Fry Veggies",
        "🍎 Snack: Hummus + Carrots",
        "🍽️ Dinner: Brown Rice + Lentils + Kale",
      ],
    },
  };
  

const RoutineDetails = () => {
  const { id } = useParams();
  const routine = routineData[id];

  if (!routine) {
    return (
      <div className="p-4 text-center text-red-500 text-xl">
        Routine not found.
      </div>
    );
  }

  return (
    <div className="p-4 text-white">
      <h1 className="text-3xl font-bold mb-6 text-center">{routine.name}</h1>

      <h2 className="text-2xl font-semibold mb-3">Workout Plan</h2>
      <div className="grid md:grid-cols-2 gap-4">
        {routine.workouts.map((exercise, index) => (
          <Card key={index} className="bg-slate-800 p-4 rounded-xl shadow-md">
            <img
              src={exercise.image}
              alt={exercise.name}
              className="w-full h-48 object-contain mb-3 rounded"
            />
            <h3 className="text-lg font-bold">{exercise.name}</h3>
            <p className="text-slate-300">{exercise.sets}</p>
          </Card>
        ))}
      </div>

      <h2 className="text-2xl font-semibold mt-8 mb-3">Diet Plan</h2>
      <ul className="list-disc list-inside space-y-2 text-slate-200">
        {routine.diet.map((meal, index) => (
          <li key={index}>{meal}</li>
        ))}
      </ul>
    </div>
  );
};

export default RoutineDetails;
