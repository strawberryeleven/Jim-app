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
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-blue-900 text-white relative overflow-hidden">
      {/* Abstract Background Forms */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-900/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 -left-20 w-60 h-60 bg-zinc-800/30 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 right-1/4 w-72 h-72 bg-blue-800/20 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 relative">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-blue-400">Workout</h1>
          <span className="text-yellow-500 font-semibold">PRO</span>
        </div>

        <div className="max-w-4xl mx-auto w-full space-y-8">
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">Quick Start</h2>
            <Button
              variant="outline"
              className="w-full bg-white/5 backdrop-blur-sm text-white hover:bg-white/10 transition-colors duration-200 border-white/10"
              onClick={() => navigate("/log-workout")}
            >
              <Plus className="w-5 h-5 mr-2" />
              Start Empty Workout
            </Button>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">Routines</h2>
            <div className="grid grid-cols-2 gap-4">
              <Card
                className="p-6 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors cursor-pointer border-white/10"
                onClick={() => navigate("/create-routine")}
              >
                <div className="flex items-center space-x-3">
                  <Plus className="w-5 h-5 text-blue-400" />
                  <h3 className="text-lg font-semibold text-white">New Routine</h3>
                </div>
              </Card>
              <Card
                className="p-6 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors cursor-pointer border-white/10"
                onClick={() => navigate("/routines")}
              >
                <div className="flex items-center space-x-3">
                  <Search className="w-5 h-5 text-blue-400" />
                  <h3 className="text-lg font-semibold text-white">Explore Routines</h3>
                </div>
              </Card>
            </div>
          </section>

          <Button
            variant="secondary"
            className="w-full bg-white/5 backdrop-blur-sm text-white hover:bg-white/10 transition-colors border-white/10"
            onClick={() => navigate("/getting-started")}
          >
            How to get started
          </Button>

          {/* Routines Section */}
          <section className="mt-8">
            <Tabs defaultValue="my-routines" className="w-full" onValueChange={handleTabChange}>
              <TabsList className="grid w-full grid-cols-2 bg-white/5 backdrop-blur-sm border-white/10">
                <TabsTrigger value="my-routines" className="data-[state=active]:bg-white/10">My Routines</TabsTrigger>
                <TabsTrigger value="public-routines" className="data-[state=active]:bg-white/10">Public Routines</TabsTrigger>
              </TabsList>
              
              <TabsContent value="my-routines" className="mt-4">
                {loading ? (
                  <div className="text-center py-6 text-gray-400">Loading routines...</div>
                ) : error ? (
                  <div className="text-center py-6 text-red-400">{error}</div>
                ) : myRoutines.length > 0 ? (
                  <div className="space-y-4">
                    {myRoutines.map((routine) => (
                      <RoutineCard key={routine.id} routine={routine} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-gray-400">
                    No routines yet. Create your first one!
                  </div>
                )}
              </TabsContent>

              <TabsContent value="public-routines" className="mt-4">
                {loading ? (
                  <div className="text-center py-6 text-gray-400">Loading routines...</div>
                ) : error ? (
                  <div className="text-center py-6 text-red-400">{error}</div>
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
                          className="bg-white/5 backdrop-blur-sm text-white hover:bg-white/10 transition-colors border-white/10"
                        >
                          Previous
                        </Button>
                        <span className="py-2 px-4 text-gray-400">
                          Page {pagination.page} of {pagination.pages}
                        </span>
                        <Button
                          variant="outline"
                          onClick={() => handlePageChange(pagination.page + 1)}
                          disabled={pagination.page === pagination.pages}
                          className="bg-white/5 backdrop-blur-sm text-white hover:bg-white/10 transition-colors border-white/10"
                        >
                          Next
                        </Button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-6 text-gray-400">
                    No public routines available.
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Workout;
