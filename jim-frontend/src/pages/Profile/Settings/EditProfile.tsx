import { useState, useEffect, useRef } from "react";
import { ArrowLeft } from "lucide-react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { updateProfileAsync } from "@/store/slices/profileSlice";
import { Button } from "@/components/buttons/button";

const EditProfile = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const profile = useSelector((state: RootState) => state.profile.data);
  const updateStatus = useSelector((state: RootState) => state.profile.updateStatus);
  const error = useSelector((state: RootState) => state.profile.error);

  const initialData = {
    name: profile?.username || "",
    bio: profile?.bio || "",
    link: "",
    sex: "",
    birthday: "",
    image: null,
  };

  const [name, setName] = useState<string>(initialData.name);
  const [bio, setBio] = useState<string>(initialData.bio);
  const [link, setLink] = useState<string>(initialData.link);
  const [sex, setSex] = useState<string>(initialData.sex);
  const [birthday, setBirthday] = useState<string>(initialData.birthday);
  const [image, setImage] = useState<File | null>(null);
  const [showImageOptions, setShowImageOptions] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const initialImageRef = useRef<File | null>(null);

  const [isDirty, setIsDirty] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const location = useLocation();
  const from = location.state?.from || 'profile';

  useEffect(() => {
    setIsDirty(
      name !== initialData.name ||
        bio !== initialData.bio ||
        link !== initialData.link ||
        sex !== initialData.sex ||
        birthday !== initialData.birthday ||
        image !== initialImageRef.current
    );
  }, [name, bio, link, sex, birthday, image]);

  useEffect(() => {
    if (updateStatus === 'succeeded') {
      setShowSuccess(true);
      setIsDirty(false);
      setTimeout(() => {
        setShowSuccess(false);
        navigate(`/${from}`);
      }, 1500);
    }
  }, [updateStatus, from, navigate]);

  const handleSave = async () => {
    const formData = new FormData();
    if (image) {
      formData.append('profilePicture', image);
    }

    const profileData = {
      username: name,
      bio,
      // Add other fields as needed
    };

    await dispatch(updateProfileAsync(profileData));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
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

          <div className="flex flex-col items-center">
            <div className="w-32 h-32 rounded-full overflow-hidden flex items-center justify-center text-white text-4xl mb-4 bg-zinc-900 ring-4 ring-zinc-800">
              {image ? (
                <img
                  src={URL.createObjectURL(image)}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : profile?.profilePicture ? (
                <img
                  src={profile.profilePicture}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                name.trim().charAt(0).toUpperCase() || "?"
              )}
            </div>
            <Button
              variant="ghost"
              className="text-blue-500 hover:text-blue-600 transition-colors"
              onClick={() => setShowImageOptions((prev) => !prev)}
            >
              Change Picture
            </Button>
            {showImageOptions && (
              <div className="mt-2 bg-zinc-900 border border-zinc-800 rounded-lg shadow-lg text-sm w-48 z-10 absolute">
                <button
                  onClick={() => {
                    fileInputRef.current?.click();
                    setShowImageOptions(false);
                  }}
                  className="block w-full text-left px-4 py-3 text-white hover:bg-zinc-800 transition-colors"
                >
                  Choose from Library
                </button>
                {image && (
                  <button
                    onClick={() => {
                      setImage(null);
                      setShowImageOptions(false);
                    }}
                    className="block w-full text-left px-4 py-3 text-red-500 hover:bg-zinc-800 transition-colors"
                  >
                    Delete Picture
                  </button>
                )}
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className="hidden"
              onChange={handleImageChange}
            />
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Name</label>
              <input
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-white placeholder:text-gray-500 focus:border-zinc-700 transition-colors"
                placeholder="Your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Bio</label>
              <input
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-white placeholder:text-gray-500 focus:border-zinc-700 transition-colors"
                placeholder="Describe yourself"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
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
                onChange={(e) => setSex(e.target.value)}
              >
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Birthday</label>
              <input
                type="date"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-white focus:border-zinc-700 transition-colors"
                value={birthday}
                onChange={(e) => setBirthday(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
