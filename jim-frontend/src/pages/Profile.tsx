
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

const Profile = () => {
  const stats = [
    { label: "Workouts", value: "0" },
    { label: "Followers", value: "0" },
    { label: "Following", value: "0" },
  ];

  return (
    <div className="min-h-screen bg-black">
      <div className="p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-blue-500">Edit Profile</h1>
          <Settings className="w-6 h-6 text-white" />
        </div>

        <div className="flex flex-col items-center mb-8">
          <div className="w-24 h-24 rounded-full bg-gray-700 mb-4" />
          <h2 className="text-xl font-bold text-white mb-4">ahmad13424</h2>
          
          <div className="flex justify-around w-full mb-6">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>

          <Button variant="secondary" className="w-full mb-4">
            Your profile is 80% finished
          </Button>
        </div>

        <div className="space-y-4">
          <div className="flex space-x-4">
            <Button variant="outline" className="flex-1">
              Duration
            </Button>
            <Button variant="outline" className="flex-1">
              Volume
            </Button>
            <Button variant="outline" className="flex-1">
              Reps
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
