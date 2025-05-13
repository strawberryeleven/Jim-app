import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/buttons/button";
import { Card } from "@/components/cards/card";
import { Plus, Search, ChevronDown, ChevronUp } from "lucide-react";
import { useAppSelector } from "@/hooks/redux-hooks";
import RoutineCard from "@/components/workout/RoutineCard";
import { routineService, Routine, PaginationInfo } from "@/services/routineService";
import { useToast } from "@/components/tooltips/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/forms/tabs";

const Workout = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [myRoutines, setMyRoutines] = useState<Routine[]>([]);
  const [publicRoutines, setPublicRoutines] = useState<Routine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("my-routines");
  const [pagination, setPagination] = useState<PaginationInfo>({
    total: 0,
    page: 1,
    pages: 1
  });

  // Function to filter out duplicate routine names
  const filterDuplicateRoutines = (routines: Routine[]): Routine[] => {
    const uniqueRoutines = new Map<string, Routine>();
    
    // Sort routines by createdAt in descending order (newest first)
    const sortedRoutines = [...routines].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    // Keep only the most recent routine for each unique name
    sortedRoutines.forEach(routine => {
      if (!uniqueRoutines.has(routine.name)) {
        uniqueRoutines.set(routine.name, routine);
      }
    });

    return Array.from(uniqueRoutines.values());
  };

  useEffect(() => {
    const fetchRoutines = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch both user routines and public routines
        const [myRoutinesData, publicRoutinesData] = await Promise.all([
          routineService.getUserRoutines(),
          routineService.getAllRoutines(1, 10)
        ]);

        // Filter out duplicate routine names
        const uniqueMyRoutines = filterDuplicateRoutines(myRoutinesData);
        const uniquePublicRoutines = filterDuplicateRoutines(publicRoutinesData.routines);

        setMyRoutines(uniqueMyRoutines);
        setPublicRoutines(uniquePublicRoutines);
        setPagination(publicRoutinesData.pagination);
      } catch (err) {
        console.error('Error fetching routines:', err);
        const errorMessage = err instanceof Error ? err.message : 'Failed to load routines';
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

    fetchRoutines();
  }, [toast]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const handlePageChange = async (newPage: number) => {
    try {
      setLoading(true);
      setError(null);
      const response = await routineService.getAllRoutines(newPage, 10);
      const uniquePublicRoutines = filterDuplicateRoutines(response.routines);
      setPublicRoutines(uniquePublicRoutines);
      setPagination(response.pagination);
    } catch (err) {
      console.error('Error fetching routines:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to load routines';
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

  return (
    <div className="p-4 space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Workout</h1>
        <span className="text-yellow-500 font-semibold">PRO</span>
      </div>

      <section>
        <h2 className="text-xl font-semibold text-white mb-4">Quick Start</h2>
        <Button
          variant="outline"
          className="w-full bg-white text-black hover:bg-gray-200 transition-colors duration-200"
          onClick={() => navigate("/log-workout")}
        >
          + Start Empty Workout
        </Button>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-white mb-4">Routines</h2>
        <div className="grid grid-cols-2 gap-4">
          <Card
            className="p-6 bg-black/40 hover:bg-black/50 transition-colors cursor-pointer"
            onClick={() => navigate("/create-routine")}
          >
            <h3 className="text-lg font-semibold text-white">New Routine</h3>
          </Card>
          <Card
            className="p-6 bg-black/40 hover:bg-black/50 transition-colors cursor-pointer"
            onClick={() => navigate("/routines")}
          >
            <h3 className="text-lg font-semibold text-white">Explore Routines</h3>
          </Card>
        </div>
      </section>

      <Button
        variant="secondary"
        className="w-full"
        onClick={() => navigate("/getting-started")}
      >
        How to get started
      </Button>

      {/* Routines Section */}
      <section className="mt-8">
        <Tabs defaultValue="my-routines" className="w-full" onValueChange={handleTabChange}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="my-routines">My Routines</TabsTrigger>
            <TabsTrigger value="public-routines">Public Routines</TabsTrigger>
          </TabsList>
          
          <TabsContent value="my-routines">
            {loading ? (
              <div className="text-center py-6 text-gray-500">Loading routines...</div>
            ) : error ? (
              <div className="text-center py-6 text-red-500">{error}</div>
            ) : myRoutines.length > 0 ? (
              <div className="space-y-4">
                {myRoutines.map((routine) => (
                  <RoutineCard key={routine.id} routine={routine} />
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500">
                No routines yet. Create your first one!
              </div>
            )}
          </TabsContent>

          <TabsContent value="public-routines">
            {loading ? (
              <div className="text-center py-6 text-gray-500">Loading routines...</div>
            ) : error ? (
              <div className="text-center py-6 text-red-500">{error}</div>
            ) : publicRoutines.length > 0 ? (
              <>
                <div className="space-y-4">
                  {publicRoutines.map((routine) => (
                    <RoutineCard key={routine.id} routine={routine} />
                  ))}
                </div>
                {pagination.pages > 1 && (
                  <div className="flex justify-center gap-2 mt-4">
                    <Button
                      variant="outline"
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page === 1}
                    >
                      Previous
                    </Button>
                    <span className="py-2 px-4">
                      Page {pagination.page} of {pagination.pages}
                    </span>
                    <Button
                      variant="outline"
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page === pagination.pages}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-6 text-gray-500">
                No public routines available.
              </div>
            )}
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
};

export default Workout;
