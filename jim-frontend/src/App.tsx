import { Toaster } from "@/components/notifications/toaster";
import { Toaster as Sonner } from "@/components/notifications/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { useAuth } from "./hooks/useAuth";
import PrivateRoute from "./components/PrivateRoute";

import Workout from "./pages/Workout/StartWorkout/Workout";
import EditRoutine from "./pages/Workout/Routine/EditRoutine";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";
import Home from "./pages/Home/Home";
import Profile from "./pages/Profile/Profile";
import AddExercise from "./pages/Workout/StartWorkout/AddExercise";
import BottomNav from "./components/BottomNav";
import ExploreRoutine from "./pages/Workout/Routine/ExploreRoutine";
import RoutineDetails from "./pages/Workout/Routine/RoutineDetails";
import LogWorkout from "./pages/Workout/StartWorkout/LogWorkout";
import SaveWorkout from "./pages/Workout/StartWorkout/SaveWorkout";
import CreateRoutine from "./pages/Workout/Routine/CreateRoutine";
import AddRoutineExercise from "./pages/Workout/Routine/AddRoutineExercise";
import GettingStarted from "./pages/Workout/GettingStarted";
import EditProfile from "./pages/Profile/Settings/EditProfile";
import Dashboard from "./pages/Profile/Dashboard";
import Settings from "./pages/Profile/Settings/Settings";
import AccountSettingsPage from "./pages/Profile/Settings/AccountSettingsPage";
import ChangeUsername from "./pages/Profile/Settings/ChangeUsername"; 
import ChangeEmail from "./pages/Profile/Settings/ChangeEmail"; 
import UpdatePassword from "./pages/Profile/Settings/UpdatePassword"; 
import Statistics from "./pages/Profile/Statistics";
import MeasurementsPage from "./pages/Profile/Settings/MeasurementsPage";
import Calendar from "./pages/Profile/Calendar";
import WorkoutDetailPage from "./pages/WorkoutDetailPage";
import ViewRoutine from "./pages/Workout/Routine/ViewRoutine";
import RoutineDetail from "@/pages/Workout/Routine/RoutineDetail";
import { Discover } from "./pages/Discover";

const queryClient = new QueryClient();

const AppContent = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pb-20">
      <Toaster />
      <Sonner />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Home />} />
          <Route path="/workout" element={<Workout />} />
          <Route path="/create-routine" element={<CreateRoutine />} />
          <Route path="/getting-started" element={<GettingStarted />} />
          <Route path="/add-routine-exercise" element={<AddRoutineExercise />} />
          <Route path="/edit-routine" element={<EditRoutine />} />
          <Route path="/edit-routine/:id" element={<EditRoutine />} />
          <Route path="/view-routine/:id" element={<ViewRoutine />} />
          <Route path="/log-workout" element={<LogWorkout />} />
          <Route path="/add-exercise" element={<AddExercise />} />
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
          <Route path="/routine/:id" element={<RoutineDetail />} />
          <Route path="/discover" element={<Discover />} />
        </Route>

        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      {isAuthenticated && <BottomNav />}
    </div>
  );
};

const App = () => (
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </QueryClientProvider>
  </Provider>
);

export default App;