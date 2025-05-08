import {
  ChevronRight,
  User,
  Lock,
  Bell,
  Dumbbell,
  Shield,
  Ruler,
  Languages,
  Link2,
  Moon,
  FileDown,
  Info,
  HelpCircle,
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
          <SettingItem icon={<User />} label="Profile" />
        </Link>
        <Link to="/settings/account">
          <SettingItem icon={<Lock />} label="Account" />
        </Link>
        <SettingItem
          icon={<span className="text-sm font-bold">PRO</span>}
          label="Manage Subscription"
        />
        <SettingItem icon={<Bell />} label="Notifications" />
      </Section>

      <Section title="Preferences">
        <SettingItem icon={<Dumbbell />} label="Workouts" />
        <SettingItem icon={<Shield />} label="Privacy & Social" />
        <SettingItem icon={<Ruler />} label="Units" />
        <SettingItem icon={<Languages />} label="Language" />
        <SettingItem icon={<Link2 />} label="Integrations" />
        <SettingItem icon={<Moon />} label="Theme" />
        <SettingItem icon={<FileDown />} label="Export & Import Data" />
      </Section>

      <Section title="Guides">
        <SettingItem icon={<Info />} label="Getting Started Guide" />
        <SettingItem icon={<HelpCircle />} label="Routine Help" />
      </Section>

      <Section title="Help">
        <SettingItem icon={<HelpCircle />} label="Frequently Asked Questions" />
        <SettingItem icon={<Mail />} label="Contact Us" />
        <SettingItem icon={<Info />} label="About" />
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
