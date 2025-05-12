import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function AccountSettingsPage() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [accountDeleted, setAccountDeleted] = useState(false);

  const handleDeleteAccount = () => {
    // Simulate delete logic here
    setShowModal(false);
    setAccountDeleted(true);

    // Optionally redirect after delay
    setTimeout(() => {
      navigate("/login"); // Or navigate to home/login
    }, 3000);
  };

  //no alert for delete
  //do modal instead

  return (
    <div className="p-4">
      <div className="flex items-center mb-4">
        <Link to="/settings">
          <ArrowLeft className="w-5 h-5 mr-3 text-white" />
        </Link>
        <h1 className="text-lg font-semibold text-white ">
          Account Settings
        </h1>
      </div>
      <div className="space-y-4">
        <button
          onClick={() => navigate("/change-username")}
          className="w-full text-left p-3 rounded-md bg-gray-100 hover:bg-gray-200"
        >
          Change Username
        </button>

        <button
          onClick={() => navigate("/change-email")}
          className="w-full text-left p-3 rounded-md bg-gray-100 hover:bg-gray-200"
        >
          Change Email
        </button>
        <button
          onClick={() => navigate("/update-password")}
          className="w-full text-left p-3 rounded-md bg-gray-100 hover:bg-gray-200"
        >
          Update Password
        </button>

        <button
          onClick={() => setShowModal(true)} // open the modal
          className="w-full text-left p-3 rounded-md bg-red-100 hover:bg-red-200 text-red-600 font-semibold"
        >
          Delete Account
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-bold mb-4 text-red-600">
              Confirm Account Deletion
            </h3>
            <p className="mb-4">
              Are you sure you want to delete your account? This action cannot
              be undone.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
