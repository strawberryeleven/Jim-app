import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { updatePasswordAsync } from "@/store/slices/profileSlice";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const UpdatePassword = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const updateStatus = useSelector((state: RootState) => state.profile.updateStatus);
  const error = useSelector((state: RootState) => state.profile.error);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validationError, setValidationError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleUpdate = async () => {
    // Clear previous errors
    setValidationError("");

    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      setValidationError("Please fill in all fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setValidationError("New passwords do not match.");
      return;
    }

    if (newPassword.length < 6) {
      setValidationError("Password must be at least 6 characters.");
      return;
    }

    try {
      await dispatch(updatePasswordAsync({ currentPassword, newPassword })).unwrap();
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
    <div className="p-4 text-gray-400">
      <div className="flex items-center space-x-3 mb-4">
        <Link to="/settings/account">
          <ArrowLeft className="w-5 h-5 text-white" />
        </Link>
        <h2 className="text-xl font-bold text-white">Update Password</h2>
      </div>

      <div className="space-y-4">
        {validationError && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded text-red-500">
            {validationError}
          </div>
        )}
        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded text-red-500">
            {error}
          </div>
        )}
        {success && (
          <div className="p-3 bg-green-500/10 border border-green-500/20 rounded text-green-500">
            Password updated successfully!
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-1 text-gray-300">Current Password</label>
          <input
            type="password"
            className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
            placeholder="Enter current password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            disabled={updateStatus === 'loading'}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-gray-300">New Password</label>
          <input
            type="password"
            className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            disabled={updateStatus === 'loading'}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-gray-300">Confirm New Password</label>
          <input
            type="password"
            className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={updateStatus === 'loading'}
          />
        </div>

        <button
          className={`w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors ${
            updateStatus === 'loading' ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          onClick={handleUpdate}
          disabled={updateStatus === 'loading'}
        >
          {updateStatus === 'loading' ? 'Updating...' : 'Update Password'}
        </button>
      </div>
    </div>
  );
};

export default UpdatePassword;
