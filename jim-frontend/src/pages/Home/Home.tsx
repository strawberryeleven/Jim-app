import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/buttons/button";
import { Card } from "@/components/cards/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/Avatar";
import { Bell, Home as HomeIcon, Plus, Search, X } from "lucide-react";
import { Athlete } from "@/types/Athlete";

const Home = () => {
  const navigate = useNavigate();
  const [suggestedAthletes, setSuggestedAthletes] = useState<Athlete[]>([
    {
      id: "1",
      username: "jasonbjarnson",
      isFeatured: true,
      profileImage: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=150&auto=format&fit=crop",
      isFollowing: false
    },
    {
      id: "2",
      username: "sonnyb4u",
      isFeatured: true,
      profileImage: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?q=80&w=150&auto=format&fit=crop",
      isFollowing: false
    },
    {
      id: "3",
      username: "fitnessguy",
      isFeatured: true,
      profileImage: "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?q=80&w=150&auto=format&fit=crop",
      isFollowing: false
    }
  ]);

  const toggleFollow = (athleteId: string) => {
    setSuggestedAthletes(athletes => 
      athletes.map(athlete => 
        athlete.id === athleteId 
          ? { ...athlete, isFollowing: !athlete.isFollowing } 
          : athlete
      )
    );
  };

  const dismissAthlete = (athleteId: string) => {
    setSuggestedAthletes(athletes => athletes.filter(athlete => athlete.id !== athleteId));
  };

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      {/* Status Bar */}
      <div className="flex justify-between items-center p-2 bg-black">
        <div className="text-xl font-bold">8:26</div>
        <div className="flex space-x-2">
          <span>••••</span>
          <span>📶</span>
          <span className="bg-red-500 text-white px-1 rounded-sm">16%</span>
        </div>
      </div>

      {/* Header */}
      <div className="flex justify-between items-center p-4">
        <Button variant="outline" className="text-white border-gray-700 bg-zinc-800">
          <HomeIcon className="mr-2 h-4 w-4" />
          Home
        </Button>
        <div className="flex space-x-4">
          <Search className="h-6 w-6" />
          <Bell className="h-6 w-6" />
        </div>
      </div>

      {/* Suggested Athletes */}
      <div className="px-4 pb-6 border-b border-zinc-800">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl text-gray-400">Suggested Athletes</h2>
          <Button variant="ghost" className="text-blue-500 p-0 h-auto flex items-center">
            <Plus className="h-4 w-4 mr-1" />
            Invite a friend
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {suggestedAthletes.map(athlete => (
            <Card key={athlete.id} className="bg-zinc-900 border-none p-4 flex flex-col items-center">
              <div className="relative">
                <Avatar className="h-16 w-16 mb-2">
                  <AvatarImage src={athlete.profileImage} />
                  <AvatarFallback className="bg-zinc-700">{athlete.username[0].toUpperCase()}</AvatarFallback>
                </Avatar>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 bg-zinc-800"
                  onClick={() => dismissAthlete(athlete.id)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
              <span className="text-sm mb-1 truncate w-full text-center">{athlete.username}</span>
              <span className="text-xs text-gray-400 mb-3">Featured</span>
              <Button 
                className={`w-full ${athlete.isFollowing 
                  ? 'bg-zinc-700 hover:bg-zinc-600' 
                  : 'bg-blue-500 hover:bg-blue-600'}`}
                onClick={() => toggleFollow(athlete.id)}
              >
                {athlete.isFollowing ? 'Following' : 'Follow'}
              </Button>
            </Card>
          ))}
        </div>
      </div>

      {/* Loading Content Placeholder */}
      <div className="p-4">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 bg-zinc-800 rounded-full"></div>
          <div className="space-y-2">
            <div className="h-4 w-60 bg-zinc-800 rounded"></div>
            <div className="h-3 w-40 bg-zinc-800 rounded"></div>
          </div>
        </div>
        <div className="h-32 w-full bg-zinc-800 rounded-lg"></div>
      </div>

      {/* Call to Action */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <p className="text-gray-400 text-lg mb-4">
          Follow people to see their workouts in your feed.
        </p>
        <Button className="w-full bg-zinc-800 hover:bg-zinc-700 mb-4">
          Discover Athletes
        </Button>
      </div>
    </div>
  );
};

export default Home;
