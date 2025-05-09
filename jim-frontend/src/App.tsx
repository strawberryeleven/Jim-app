
import { Toaster } from "./components/notifications/toaster";
import { Toaster as Sonner } from "./components/notifications/sonner";
import { TooltipProvider } from "./components/tooltips/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";
import Home from "./pages/Home/Home";
import Workout from "./pages/Workout/Workout";
import Profile from "./pages/Profile/Profile";
import AddExercise from "./pages/Workout/AddExercise";
import BottomNav from "./components/BottomNav";
import ExploreRoutine from "./pages/Workout/ExploreRoutine";
import RoutineDetails from "./pages/Workout/RoutineDetails";
import LogWorkout from "./pages/Workout/LogWorkout";
import SaveWorkout from "./pages/Workout/SaveWorkout";
import CreateRoutine from "./pages/Workout/CreateRoutine";
import AddExercise2 from "./pages/Workout/AddRoutineExercise";
import GettingStarted from "./pages/Workout/GettingStarted";
import EditProfile from "./pages/Profile/EditProfile";
import Dashboard from "./pages/Profile/Dashboard";
import Settings from "./pages/Profile/Settings";
import AccountSettingsPage from "./pages/Profile/AccountSettingsPage";
import ChangeUsername from "./pages/Profile/ChangeUsername"; 
import ChangeEmail from "./pages/Profile/ChangeEmail"; 
import UpdatePassword from "./pages/Profile/UpdatePassword"; 
import Statistics from "./pages/Profile/Statistics";
import MeasurementsPage from "./pages/Profile/MeasurementsPage";
import Calendar from "./pages/Profile/Calendar";
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
            <Route path="/dashboard" element={<Home/>} />
            <Route path="/workout" element={<Workout />} />
            <Route path="/create-routine" element={<CreateRoutine />} />
            <Route path="/getting-started" element={<GettingStarted />} />
            <Route path="/add-exercise2" element={<AddExercise2 />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/log-workout" element={<LogWorkout />} />
            <Route path="/add-exercise" element={<AddExercise />} />
            <Route path="*" element={<NotFound />} />
            <Route path="/routines" element={<ExploreRoutine />} />
            <Route path="/routines/:id" element={<RoutineDetails />} />
            <Route path="/save-workout" element={<SaveWorkout />} />
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
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
          <BottomNav />
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;