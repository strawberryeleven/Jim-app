import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { updateUsernameAsync } from "@/store/slices/profileSlice";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/buttons/button";

const ChangeUsername = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const updateStatus = useSelector((state: RootState) => state.profile.updateStatus);
  const error = useSelector((state: RootState) => state.profile.error);

  const [newUsername, setNewUsername] = useState("");
  const [password, setPassword] = useState("");
  const [validationError, setValidationError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    setValidationError("");

    if (!newUsername || !password) {
      setValidationError("Please fill in all fields.");
      return;
    }

    if (newUsername.length < 3) {
      setValidationError("Username must be at least 3 characters long.");
      return;
    }

    try {
      await dispatch(updateUsernameAsync({ newUsername, password })).unwrap();
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        navigate("/settings/account");
      }, 2000);
    } catch (err) {
      // Error is handled by the Redux state
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/settings/account")}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-2xl font-bold text-blue-500">Change Username</h1>
          <div className="w-6" /> {/* Spacer for alignment */}
        </div>

        <div className="max-w-4xl mx-auto w-full space-y-8">
          {validationError && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 font-medium">
              {validationError}
            </div>
          )}
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 font-medium">
              {error}
            </div>
          )}
          {success && (
            <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-green-500 font-medium">
              Username updated successfully!
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">New Username</label>
              <input
                type="text"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-white placeholder:text-gray-500 focus:border-zinc-700 transition-colors"
                placeholder="Enter new username"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                disabled={updateStatus === 'loading'}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Current Password</label>
              <input
                type="password"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-white placeholder:text-gray-500 focus:border-zinc-700 transition-colors"
                placeholder="Enter current password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={updateStatus === 'loading'}
              />
            </div>

            <Button
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-6 text-lg font-medium rounded-xl transition-colors"
              onClick={handleSubmit}
              disabled={updateStatus === 'loading'}
            >
              {updateStatus === 'loading' ? 'Updating...' : 'Update Username'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangeUsername;
