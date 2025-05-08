import { useState, useEffect } from "react";
import { Flame, Moon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";


const daysInMonth = (month: number, year: number): number =>
  new Date(year, month + 1, 0).getDate();
const startDay = (month: number, year: number): number =>
  new Date(year, month, 1).getDay();

export default function CalendarPage(): JSX.Element {
  const [month, setMonth] = useState<number>(new Date().getMonth());
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [workoutDays, setWorkoutDays] = useState<number[]>([]);
  const [streak, setStreak] = useState<number>(0);
  const [restDays, setRestDays] = useState<number>(0);
  const navigate = useNavigate();


  const days: number = daysInMonth(month, year);
  const start: number = startDay(month, year);

  useEffect(() => {
    calculateStreak();
  }, [workoutDays]);

  const toggleWorkoutDay = (day: number): void => {
    setWorkoutDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const calculateStreak = (): void => {
    let count = 0;
    const today = new Date();
    for (let i = 0; i < 31; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      if (
        checkDate.getMonth() === month &&
        checkDate.getFullYear() === year &&
        workoutDays.includes(checkDate.getDate())
      ) {
        count++;
      } else {
        break;
      }
    }
    setStreak(count);
    const sortedDays = [...workoutDays].sort((a, b) => b - a);
    const todayDate = new Date();
    const todayDay = todayDate.getDate();
    let lastWorkout = 0;
    for (const day of sortedDays) {
      if (day <= todayDay) {
        lastWorkout = day;
        break;
      }
    }
    setRestDays(lastWorkout ? todayDay - lastWorkout : lastWorkout);
  };

  const nextMonth = (): void => {
    if (month === 11) {
      setMonth(0);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
    setWorkoutDays([]);
  };

  const prevMonth = (): void => {
    if (month === 0) {
      setMonth(11);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
    setWorkoutDays([]);
  };

  const weekdays: string[] = ["S", "M", "T", "W", "T", "F", "S"];

  return (
    <div className="p-4 space-y-4 text-gray-400">
        <div className="flex items-center mb-4">
        <Link to="/profile">
          <ArrowLeft className="w-5 h-5 mr-3 text-white" />
        </Link>
        <h1 className="text-lg font-semibold text-white">Calendar</h1>
      </div>
      <div className="flex justify-around text-center gap-2">
        <div className="bg-blue-300 text-blue-600 w-full px-4 py-2 rounded-xl shadow flex items-center space-x-2">
          <Flame className="w-4 h-4" />
          <div>
            <div className="text-sm font-semibold">
              {streak} {streak === 1 ? "day" : "days"}
            </div>
            <div className="text-xs">Streak</div>
          </div>
        </div>
        <div className="bg-blue-300 text-blue-600 w-full px-4 py-2 rounded-xl shadow flex items-center space-x-2">
          <Moon className="w-4 h-4" />
          <div>
            <div className="text-sm font-semibold">
              {restDays} {restDays === 1 ? "day" : "days"}
            </div>
            <div className="text-xs">Rest</div>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mb-2">
        <button onClick={prevMonth}>&lt;</button>
        <h2 className="text-xl font-bold">
          {new Date(year, month).toLocaleString("default", { month: "long" })}{" "}
          {year}
        </h2>
        <button onClick={nextMonth}>&gt;</button>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {weekdays.map((day: string) => (
          <div key={day} className="text-center font-semibold">
            {day}
          </div>
        ))}
        {Array.from({ length: start }, (_, i) => (
          <div key={`empty-${i}`} className="" />
        ))}
        {Array.from({ length: days }, (_, i) => {
          const dayNum = i + 1;
          const isWorkout = workoutDays.includes(dayNum);
          return (
            <div
              key={i}
              onClick={() => navigate(`/calendar/${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`)}
              className={`h-12 flex items-center justify-center border rounded cursor-pointer ${
                isWorkout ? "bg-green-300" : "hover:bg-gray-100"
              }`}
            >
              {dayNum}
            </div>
          );
        })}

        
      </div>
    </div>
  );
}
