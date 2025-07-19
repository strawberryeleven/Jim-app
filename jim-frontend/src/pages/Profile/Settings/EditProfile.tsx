import { useState, useEffect, useRef } from "react";
import { ArrowLeft } from "lucide-react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { updateProfileAsync } from "@/store/slices/profileSlice";
import { Button } from "@/components/buttons/button";
import { useToast } from "@/components/tooltips/use-toast";
import { authService } from "@/services/authService";

const EditProfile = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const profile = useSelector((state: RootState) => state.profile.data);
  const updateStatus = useSelector((state: RootState) => state.profile.updateStatus);
  const error = useSelector((state: RootState) => state.profile.error);

  const initialData = {
    username: profile?.username || "",
    bio: profile?.bio || "",
    link: "",
    sex: "" as "male" | "female" | "other" | "",
    DOB: "",
  };

  const [username, setUsername] = useState<string>(initialData.username);
  const [bio, setBio] = useState<string>(initialData.bio);
  const [link, setLink] = useState<string>(initialData.link);
  const [sex, setSex] = useState<"male" | "female" | "other" | "">(initialData.sex);
  const [DOB, setDOB] = useState<string>(initialData.DOB);
  const [isDirty, setIsDirty] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const location = useLocation();
  const from = location.state?.from || 'profile';

  useEffect(() => {
    setIsDirty(
      username !== initialData.username ||
      bio !== initialData.bio ||
      link !== initialData.link ||
      sex !== initialData.sex ||
      DOB !== initialData.DOB
    );
  }, [username, bio, link, sex, DOB]);

  const handleSave = async () => {
    try {
      // Validate username
      if (!username.trim()) {
        toast({
          title: "Error",
          description: "Username is required",
          variant: "destructive",
        });
        return;
      }

      // Validate link if provided
      if (link && !isValidUrl(link)) {
        toast({
          title: "Error",
          description: "Please enter a valid URL",
          variant: "destructive",
        });
        return;
      }

      // Validate DOB if provided
      if (DOB && !isValidDate(DOB)) {
        toast({
          title: "Error",
          description: "Please enter a valid date",
          variant: "destructive",
        });
        return;
      }

      const profileData = {
        username: username.trim(),
        bio: bio.trim(),
        link: link.trim() || undefined,
        sex: sex || undefined,
        DOB: DOB || undefined,
      };

      const response = await authService.updateProfile(profileData);
      
      if (response.success) {
        setShowSuccess(true);
        setIsDirty(false);
        toast({
          title: "Success",
          description: "Profile updated successfully",
        });
        setTimeout(() => {
          setShowSuccess(false);
          navigate(`/${from}`);
        }, 1500);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update profile",
        variant: "destructive",
      });
    }
  };

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const isValidDate = (date: string): boolean => {
    const dateObj = new Date(date);
    return dateObj instanceof Date && !isNaN(dateObj.getTime());
  };

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate(`/${from}`)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-2xl font-bold text-blue-500">Edit Profile</h1>
          <Button
            variant="ghost"
            className={`${isDirty ? "text-blue-500 hover:text-blue-600" : "text-gray-400"} ${updateStatus === 'loading' ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={!isDirty || updateStatus === 'loading'}
            onClick={handleSave}
          >
            {updateStatus === 'loading' ? 'Saving...' : 'Save'}
          </Button>
        </div>

        <div className="max-w-4xl mx-auto w-full space-y-8">
          {showSuccess && (
            <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-green-500 font-medium">
              Profile updated successfully!
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 font-medium">
              {error}
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Username</label>
              <input
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-white placeholder:text-gray-500 focus:border-zinc-700 transition-colors"
                placeholder="Your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Bio</label>
              <textarea
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-white placeholder:text-gray-500 focus:border-zinc-700 transition-colors"
                placeholder="Tell us about yourself"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={4}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Link</label>
              <input
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-white placeholder:text-gray-500 focus:border-zinc-700 transition-colors"
                placeholder="https://example.com"
                value={link}
                onChange={(e) => setLink(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Sex</label>
              <select
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-white focus:border-zinc-700 transition-colors"
                value={sex}
                onChange={(e) => setSex(e.target.value as "male" | "female" | "other" | "")}
              >
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Date of Birth</label>
              <input
                type="date"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-white focus:border-zinc-700 transition-colors"
                value={DOB}
                onChange={(e) => setDOB(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
