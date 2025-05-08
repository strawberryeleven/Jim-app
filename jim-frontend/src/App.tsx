
import { Toaster } from "./components/ui/notifications/toaster";
import { Toaster as Sonner } from "./components/ui/notifications/sonner";
import { TooltipProvider } from "./components/ui/tooltips/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import Workout from "./pages/Workout";
import Profile from "./pages/Profile";
import AddExercise from "./pages/AddExercise";
import BottomNav from "./components/BottomNav";
import EditProfile from "./pages/EditProfile";
import Settings from "./pages/Settings";
import AccountSettingsPage from "./pages/AccountSettingsPage";
import ChangeUsername from "./pages/ChangeUsername"; 
import ChangeEmail from "./pages/ChangeEmail"; 
import UpdatePassword from "./pages/UpdatePassword"; 
import Statistics from "./pages/Statistics";
import MeasurementsPage from "./pages/MeasurementsPage";
import Calendar from "./pages/Calendar";
import WorkoutDetailPage from "./pages/WorkoutDetailPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pb-20">
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/workout" element={<Workout />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/edit-profile" element={<EditProfile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/settings/account" element={<AccountSettingsPage />} />
            <Route path="/change-username" element={<ChangeUsername />} />
            <Route path="/change-email" element={<ChangeEmail />} />
            <Route path="/update-password" element={<UpdatePassword />} />
            <Route path="/statistics" element={<Statistics />} />
            <Route path="/measurements" element={<MeasurementsPage />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/calendar/:date" element={<WorkoutDetailPage />} />
            <Route path="/add-exercise" element={<AddExercise />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <BottomNav />
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
