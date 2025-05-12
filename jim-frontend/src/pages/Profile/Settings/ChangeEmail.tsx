import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ChangeEmail = () => {
  const [newEmail, setNewEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  const handleSave = () => {
    if (!newEmail || !confirmEmail) {
      setError("Please fill in both fields.");
      return;
    }

    if (newEmail !== confirmEmail) {
      setError("Emails do not match.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(newEmail)) {
      setError("Invalid email format.");
      return;
    }

    // Simulate update
    console.log("Updated email:", newEmail);
    setError("");
    setSuccess(true);

    setTimeout(() => {
      setSuccess(false);
      navigate("/settings/account"); // back to Account Settings page
    }, 2000);
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Change Email</h2>

      {error && <div className="text-red-600 mb-3">{error}</div>}
      {success && (
        <div className="text-green-600 mb-3">Email updated successfully!</div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">New Email</label>
          <input
            type="email"
            className="w-full border rounded px-3 py-2"
            placeholder="you@example.com"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Confirm New Email
          </label>
          <input
            type="email"
            className="w-full border rounded px-3 py-2"
            placeholder="you@example.com"
            value={confirmEmail}
            onChange={(e) => setConfirmEmail(e.target.value)}
          />
        </div>

        <button
          className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          onClick={handleSave}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default ChangeEmail;
