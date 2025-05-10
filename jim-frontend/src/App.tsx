import { Toaster } from "@/components/notifications/toaster";
import { Toaster as Sonner } from "@/components/notifications/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route,Navigate } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store/store";

import Workout from "./pages/Workout/Workout";
import EditRoutine from "./pages/Workout/EditRoutine";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";
import Home from "./pages/Home/Home";
import Profile from "./pages/Profile/Profile";
import AddExercise from "./pages/Workout/AddExercise";
import BottomNav from "./components/BottomNav";
import ExploreRoutine from "./pages/Workout/ExploreRoutine";
import RoutineDetails from "./pages/Workout/RoutineDetails";
import LogWorkout from "./pages/Workout/LogWorkout";
import SaveWorkout from "./pages/Workout/SaveWorkout";
import CreateRoutine from "./pages/Workout/CreateRoutine";
import AddRoutineExercise from "./pages/Workout/AddRoutineExercise";
import GettingStarted from "./pages/Workout/GettingStarted";


const queryClient = new QueryClient();

// The issue is with TooltipProvider being used incorrectly
const App = () => (
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pb-20">

        <Toaster />
        <Sonner />
      <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
               <Route path="/signup" element={<Signup />} />
               <Route path="/dashboard" element={<Home/>} />
               <Route path="/workout" element={<Workout />} />
               <Route path="/create-routine" element={<CreateRoutine />} />
               <Route path="/getting-started" element={<GettingStarted />} />
               <Route path="/add-exercise2" element={<AddRoutineExercise />} />
               <Route path="/edit-routine" element={<EditRoutine />} />
               <Route path="/edit-routine/:id" element={<EditRoutine />} />

               <Route path="/log-workout" element={<LogWorkout />} />
               <Route path="/add-exercise" element={<AddExercise />} />
                <Route path="*" element={<NotFound />} />
            <Route path="/routines" element={<ExploreRoutine />} />
            <Route path="/routines/:id" element={<RoutineDetails />} />
            <Route path="/save-workout" element={<SaveWorkout />} />


            
            </Routes>
            <BottomNav />
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  </Provider>
);

export default App;