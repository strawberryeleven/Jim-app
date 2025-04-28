
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
