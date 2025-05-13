import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { routineService, Routine } from "@/services/routineService";
import { useToast } from "@/components/tooltips/use-toast";
import RoutineDetails from "@/components/workout/RoutineDetails";

const RoutineDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [routine, setRoutine] = useState<Routine | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRoutineDetails = async () => {
      if (!id) return;

      try {
        setLoading(true);
        setError(null);

        // Fetch routine details with exercise information
        const routineData = await routineService.getRoutineById(id);
        setRoutine(routineData);

      } catch (err) {
        console.error('Error fetching routine details:', err);
        const errorMessage = err instanceof Error ? err.message : 'Failed to load routine details';
        setError(errorMessage);
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchRoutineDetails();
  }, [id, toast]);

  if (loading) {
    return (
      <div className="p-4 text-center">
        <div className="text-gray-500">Loading routine details...</div>
      </div>
    );
  }

  if (error || !routine) {
    return (
      <div className="p-4 text-center">
        <div className="text-red-500">{error || 'Routine not found'}</div>
      </div>
    );
  }

  return <RoutineDetails routine={routine} />;
};

export default RoutineDetail; 