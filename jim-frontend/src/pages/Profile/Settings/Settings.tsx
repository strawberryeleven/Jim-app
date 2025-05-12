import {
  ChevronRight,
  User,
  Lock,
  Ruler,
  Mail,
} from "lucide-react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="p-4 text-gray-400">
      <div className="flex items-center space-x-3 mb-4">
        <Link to="/profile">
          <ArrowLeft className="w-5 h-5 text-white" />
        </Link>
        <h2 className="text-xl font-bold text-white">Settings</h2>
      </div>

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
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <div className="flex items-center justify-between p-2 rounded-md hover:bg-gray-100 cursor-pointer">
      <div className="flex items-center space-x-3">
        <span className="text-gray-400">{icon}</span>
        <span>{label}</span>
      </div>
      <ChevronRight className="text-gray-400" />
    </div>
  );
}
