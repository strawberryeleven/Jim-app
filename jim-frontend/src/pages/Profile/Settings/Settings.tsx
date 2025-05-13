import {
  ChevronRight,
  User,
  Lock,
  Ruler,
  Mail,
} from "lucide-react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/buttons/button";

export default function SettingsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <Button
            variant="ghost"
            onClick={() => window.history.back()}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-2xl font-bold text-blue-500">Settings</h1>
          <div className="w-6" /> {/* Spacer for alignment */}
        </div>

        <div className="max-w-4xl mx-auto w-full space-y-8">
          <Section title="Account">
            <Link to="/edit-profile" state={{ from: 'settings' }}>
              <SettingItem icon={<User />} label="Edit Profile" />
            </Link>
            <Link to="/settings/account">
              <SettingItem icon={<Lock />} label="Account Settings" />
            </Link>
          </Section>

          <Section title="Fitness">
            <Link to="/settings/measurements">
              <SettingItem icon={<Ruler />} label="Track Measurements" />
            </Link>
          </Section>

          <Section title="Support">
            <Link to="/contact">
              <SettingItem icon={<Mail />} label="Contact Support" />
            </Link>
          </Section>
        </div>
      </div>
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
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <div className="flex items-center justify-between p-4 bg-zinc-900 rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer">
      <div className="flex items-center space-x-3">
        <span className="text-gray-400">{icon}</span>
        <span className="text-white">{label}</span>
      </div>
      <ChevronRight className="text-gray-400" />
    </div>
  );
}
