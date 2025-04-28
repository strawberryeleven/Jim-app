
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const Dashboard = () => {
  return (
    <div className="p-4 space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-6 bg-black/40 hover:bg-black/50 transition-colors">
          <h3 className="text-xl font-semibold mb-2 text-white">Statistics</h3>
          <p className="text-gray-400">Track your progress</p>
        </Card>
        <Card className="p-6 bg-black/40 hover:bg-black/50 transition-colors">
          <h3 className="text-xl font-semibold mb-2 text-white">Exercises</h3>
          <p className="text-gray-400">Browse exercises</p>
        </Card>
        <Card className="p-6 bg-black/40 hover:bg-black/50 transition-colors">
          <h3 className="text-xl font-semibold mb-2 text-white">Measures</h3>
          <p className="text-gray-400">Body measurements</p>
        </Card>
        <Card className="p-6 bg-black/40 hover:bg-black/50 transition-colors">
          <h3 className="text-xl font-semibold mb-2 text-white">Calendar</h3>
          <p className="text-gray-400">Schedule workouts</p>
        </Card>
      </div>
      <div className="mt-8">
        <h2 className="text-2xl font-bold text-white mb-4">Discover Athletes</h2>
        <Button variant="outline" className="w-full mb-4">
          Discover Athletes
        </Button>
        <Button variant="outline" className="w-full">
          Connect Contacts
        </Button>
      </div>
    </div>
  );
};

export default Dashboard;
