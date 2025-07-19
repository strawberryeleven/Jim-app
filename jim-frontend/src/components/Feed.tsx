import React, { useEffect, useState } from 'react';
import { workoutLogService } from '@/services/workoutLogService';
import { WorkoutLog } from '@/types/workout';
import WorkoutPost from './WorkoutPost';
import { toast } from 'sonner';

export const Feed: React.FC = () => {
  const [logs, setLogs] = useState<WorkoutLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    console.log('Feed component mounted, fetching logs...');
    const fetchLogs = async () => {
      try {
        console.log('Calling getFollowedWorkoutLogs with page:', page);
        const response = await workoutLogService.getFollowedWorkoutLogs(page);
        console.log('Received response:', response);
        setLogs(prev => page === 1 ? response.logs : [...prev, ...response.logs]);
        setHasMore(response.pagination.page < response.pagination.pages);
      } catch (err) {
        console.error('Error in fetchLogs:', err);
        setError('Failed to fetch workout logs');
        toast.error('Failed to load workout logs');
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [page]);

  const loadMore = () => {
    setPage(prev => prev + 1);
  };

  if (loading && page === 1) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error && page === 1) {
    return (
      <div className="text-center text-red-500 p-4">
        {error}
      </div>
    );
  }

  if (logs.length === 0) {
    return (
      <div className="text-center text-gray-500 p-4">
        No workout logs to show. Follow some users to see their workouts here!
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {logs.map((log) => (
        <WorkoutPost key={log.id} workout={log} />
      ))}

      {hasMore && (
        <div className="text-center">
          <button
            onClick={loadMore}
            disabled={loading}
            className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}
    </div>
  );
}; 