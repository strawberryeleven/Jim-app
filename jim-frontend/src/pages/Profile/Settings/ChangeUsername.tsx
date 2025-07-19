import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/buttons/button";
import { useToast } from "@/components/tooltips/use-toast";
import { authService } from "@/services/authService";

export default function ChangeUsername() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim()) {
      toast({
        title: "Error",
        description: "Username is required",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      const response = await authService.updateUsername({ name: username.trim() });
      
      if (response.success) {
        toast({
          title: "Success",
          description: "Username updated successfully",
        });
        navigate("/settings");
      }
    } catch (error) {
      console.error('Error updating username:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update username",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/settings")}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-2xl font-bold text-blue-500">Change Username</h1>
          <div className="w-6" /> {/* Spacer for alignment */}
        </div>

        <div className="max-w-md mx-auto w-full">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                New Username
              </label>
              <input
                type="text"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-white placeholder:text-gray-500 focus:border-zinc-700 transition-colors"
                placeholder="Enter new username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white transition-colors"
              disabled={isLoading}
            >
              {isLoading ? "Updating..." : "Update Username"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
