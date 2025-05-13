import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ChevronRight, User, Mail, Lock, Trash2 } from "lucide-react";
import { Button } from "@/components/buttons/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/dialogs/alert-dialog";

export default function AccountSettingsPage() {
  const navigate = useNavigate();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [accountDeleted, setAccountDeleted] = useState(false);

  const handleDeleteAccount = () => {
    setShowDeleteDialog(false);
    setAccountDeleted(true);

    setTimeout(() => {
      navigate("/login");
    }, 3000);
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
          <h1 className="text-2xl font-bold text-blue-500">Account Settings</h1>
          <div className="w-6" /> {/* Spacer for alignment */}
        </div>

        <div className="max-w-4xl mx-auto w-full space-y-8">
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
              onClick={() => setShowDeleteDialog(true)}
              className="w-full"
            >
              <SettingItem 
                icon={<Trash2 className="text-red-500" />} 
                label="Delete Account" 
                className="text-red-500 hover:text-red-600"
              />
            </button>
          </Section>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-zinc-900 border-zinc-800 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl text-red-500">Delete Account</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Are you sure you want to delete your account? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4">
            <AlertDialogCancel className="bg-transparent border-2 border-zinc-700 text-white hover:bg-zinc-800 transition-colors">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700 text-white transition-colors"
              onClick={handleDeleteAccount}
            >
              Delete Account
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Account Deleted Dialog */}
      {accountDeleted && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg shadow-lg p-6 max-w-sm w-full text-white">
            <p className="text-center text-gray-400">
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
    <div>
      <h3 className="text-blue-400 uppercase text-sm font-semibold mb-4">
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
    <div className={`flex items-center justify-between p-4 bg-zinc-900 rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer ${className}`}>
      <div className="flex items-center space-x-3">
        <span className="text-gray-400">{icon}</span>
        <span className="text-white">{label}</span>
      </div>
      <ChevronRight className="text-gray-400" />
    </div>
  );
}
