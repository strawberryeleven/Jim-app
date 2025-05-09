import { Settings } from "lucide-react";
import { Button } from "@/components/ui/buttons/button";
import { Link } from "react-router-dom";
import WorkoutChart from "./WorkoutSummaryCard";
import Dashboard from "./Dashboard";
import WorkoutCard from "@/components/WorkoutCard";


const workouts = [
  {
    title: 'Push Day',
    time: '45 min',
    volume: '2 kg',
    exercises: [
      { name: 'Bench Press', sets: 4, image: '...' },
      { name: 'Shoulder Press', sets: 3, image: '...' },
    ],
  },
];
const Profile = () => {
  const stats = [
    { label: "Workouts", value: "0" },
    { label: "Followers", value: "0" },
    { label: "Following", value: "0" },
  ];

  return (
    <div className="min-h-screen ">
      <div className="p-4">
        <div className="flex justify-between items-center mb-6">
          <Link to="/edit-profile" state={{ from: 'profile' }}>
            <h1 className="text-2xl font-bold text-blue-500">Edit Profile</h1>
          </Link>
          <Link to="/settings">
            <Settings className="w-6 h-6 text-white" />
          </Link>
        </div>

        <div className="flex flex-col items-center mb-8">
          <div className="w-24 h-24 rounded-full bg-gray-700 mb-4" />
          <h2 className="text-xl font-bold text-white mb-4">ahmad13424</h2>

          <div className="flex justify-around w-full mb-6">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-bold text-white">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>

          <WorkoutChart />
          <Dashboard />


          <div className="space-y-6 w-full pt-3">
          <h2 className="text-lg pt-4 font-medium text-gray-400">Workouts</h2>
          <WorkoutCard workouts={workouts} />
          </div>

        </div>

        
      </div>
    </div>
  );
};

export default Profile;
