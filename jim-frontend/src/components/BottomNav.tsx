import { Home, Dumbbell, User, Search } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const BottomNav = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path ? "text-blue-500" : "text-gray-400";
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black/90 border-t border-white/10 px-6 py-2">
      <div className="flex justify-between items-center max-w-md mx-auto">
        <Link
          to="/dashboard"
          className={`flex flex-col items-center ${isActive("/dashboard")}`}
        >
          <Home className="w-6 h-6" />
          <span className="text-xs mt-1">Home</span>
        </Link>
        <Link
          to="/discover"
          className={`flex flex-col items-center ${isActive("/discover")}`}
        >
          <Search className="w-6 h-6" />
          <span className="text-xs mt-1">Discover</span>
        </Link>
        <Link
          to="/workout"
          className={`flex flex-col items-center ${isActive("/workout")}`}
        >
          <Dumbbell className="w-6 h-6" />
          <span className="text-xs mt-1">Workout</span>
        </Link>
        <Link
          to="/profile"
          className={`flex flex-col items-center ${isActive("/profile")}`}
        >
          <User className="w-6 h-6" />
          <span className="text-xs mt-1">Profile</span>
        </Link>
      </div>
    </div>
  );
};

export default BottomNav;
