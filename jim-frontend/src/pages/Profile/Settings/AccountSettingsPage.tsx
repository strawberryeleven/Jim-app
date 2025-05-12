import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ChevronRight, User, Mail, Lock, Trash2 } from "lucide-react";

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
    <div className="p-4 text-gray-400">
      <div className="flex items-center space-x-3 mb-4">
        <Link to="/settings">
          <ArrowLeft className="w-5 h-5 text-white" />
        </Link>
        <h2 className="text-xl font-bold text-white">Account Settings</h2>
      </div>

      <Section title="Account Management">
        <Link to="/change-username">
          <SettingItem icon={<User />} label="Change Username" />
        </Link>
        <Link to="/change-email">
          <SettingItem icon={<Mail />} label="Change Email" />
        </Link>
        <Link to="/update-password">
          <SettingItem icon={<Lock />} label="Update Password" />
        </Link>
      </Section>

      <Section title="Danger Zone">
        <button
          onClick={() => setShowModal(true)}
          className="w-full"
        >
          <SettingItem 
            icon={<Trash2 className="text-red-500" />} 
            label="Delete Account" 
            className="text-red-500 hover:text-red-600"
          />
        </button>
      </Section>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg shadow-lg p-6 max-w-sm w-full text-white">
            <h3 className="text-lg font-bold mb-4 text-red-500">
              Confirm Account Deletion
            </h3>
            <p className="mb-4 text-gray-300">
              Are you sure you want to delete your account? This action cannot
              be undone.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
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

      {accountDeleted && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg shadow-lg p-6 max-w-sm w-full text-white">
            <p className="text-center text-gray-300">
              Account deleted successfully. Redirecting to login...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-6">
      <h3 className="text-gray-500 uppercase text-md font-semibold mb-2">
        {title}
      </h3>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function SettingItem({
  icon,
  label,
  className = "",
}: {
  icon: React.ReactNode;
  label: string;
  className?: string;
}) {
  return (
    <div className={`flex items-center justify-between p-2 rounded-md hover:bg-gray-700 cursor-pointer ${className}`}>
      <div className="flex items-center space-x-3">
        <span className="text-gray-400">{icon}</span>
        <span>{label}</span>
      </div>
      <ChevronRight className="text-gray-400" />
    </div>
  );
}
