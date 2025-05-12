import { useState, useEffect, useRef } from "react";
import { ArrowLeft } from "lucide-react";
import { useLocation, Link } from "react-router-dom";

const EditProfile = () => {
  const initialData = {
    name: "",
    bio: "",
    link: "",
    sex: "",
    birthday: "",
    image: null,
  };

  const [name, setName] = useState<string>("");
  const [bio, setBio] = useState<string>("");
  const [link, setLink] = useState<string>("");
  const [sex, setSex] = useState<string>("");
  const [birthday, setBirthday] = useState<string>("");
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

  const handleSave = () => {
    console.log("Saved:", { name, bio, link, sex, birthday });
    setShowSuccess(true);
    setIsDirty(false);
    setTimeout(() => setShowSuccess(false), 2500);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
      console.log("Selected image:", e.target.files[0]);
    }
  };

  //current pfp delete then enable save btn to save no pfp

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <Link to={`/${from}`}>
          <ArrowLeft className="w-5 h-5 mr-3 text-white" />
        </Link>
        <h1 className="text-xl font-bold text-white">Edit Profile</h1>

        <button
          className={isDirty ? "text-blue-500" : "text-gray-400"}
          disabled={!isDirty}
          onClick={handleSave}
        >
          Save
        </button>
      </div>

      {showSuccess && (
        <div className="mb-4 text-green-600 font-medium">
          Profile updated successfully!
        </div>
      )}

      <div className="flex flex-col items-center mb-4">
        <div className="w-20 h-20 rounded-full overflow-hidden flex items-center justify-center text-white text-2xl mb-2 bg-pink-500">
          {image ? (
            <img
              src={URL.createObjectURL(image)}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            name.trim().charAt(0).toUpperCase() || "?"
          )}
        </div>
        <button
          className="text-blue-500 text-sm"
          onClick={() => setShowImageOptions((prev) => !prev)}
        >
          Change Picture
        </button>
        {showImageOptions && (
          <div className="mt-2 border rounded bg-white shadow-md text-sm w-40 z-10 absolute">
            <button
              onClick={() => {
                fileInputRef.current?.click();
                setShowImageOptions(false);
              }}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              Choose from Library
            </button>
            {image && (
              <button
                onClick={() => {
                  setImage(null);
                  setShowImageOptions(false);
                }}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500"
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
        />{" "}
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-md font-semibold text-white">Name</label>
          <input
            className="block w-full border rounded px-2 py-1 mt-1"
            placeholder="Your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <label className="text-md font-semibold text-white">Bio</label>
          <input
            className="block w-full border rounded px-2 py-1 mt-1"
            placeholder="Describe yourself"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
        </div>

        <div>
          <label className="text-md font-semibold text-white">Link</label>
          <input
            className="block w-full border rounded px-2 py-1 mt-1"
            placeholder="https://example.com"
            value={link}
            onChange={(e) => setLink(e.target.value)}
          />
        </div>

        <div>
          <label className="text-md font-semibold text-white">Sex</label>
          <select
            className="block w-full border rounded px-2 py-1 mt-1"
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
          <label className="text-md font-semibold text-white">Birthday</label>
          <input
            type="date"
            className="block w-full border rounded px-2 py-1 mt-1"
            value={birthday}
            onChange={(e) => setBirthday(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
