import React, { useEffect, useState } from 'react';
import { User, userService } from '@/services/userService';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/Avatar';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export const Discover: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [followingStates, setFollowingStates] = useState<Record<string, boolean>>({});
  const { user: currentUser } = useAuth();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await userService.getAllUsers(page, 10, searchQuery);
        setUsers(prev => page === 1 ? response.users : [...prev, ...response.users]);
        setHasMore(response.users.length === 10);
        
        // Initialize following states based on current user's followers
        const followingMap: Record<string, boolean> = {};
        response.users.forEach(user => {
          followingMap[user.id] = user.followers.includes(currentUser?.id || '');
        });
        setFollowingStates(prev => ({ ...prev, ...followingMap }));
      } catch (err) {
        setError('Failed to fetch users');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [page, searchQuery, currentUser?.id]);

  const handleFollow = async (userId: string) => {
    try {
      const response = await userService.followUser(userId);
      if (response.success) {
        setFollowingStates(prev => ({ ...prev, [userId]: true }));
        toast.success('Successfully followed user');
      } else {
        toast.error(response.message || 'Failed to follow user');
      }
    } catch (err) {
      console.error('Error following user:', err);
      toast.error('Failed to follow user');
    }
  };

  const handleUnfollow = async (userId: string) => {
    try {
      const response = await userService.unfollowUser(userId);
      if (response.success) {
        setFollowingStates(prev => ({ ...prev, [userId]: false }));
        toast.success('Successfully unfollowed user');
      } else {
        toast.error(response.message || 'Failed to unfollow user');
      }
    } catch (err) {
      console.error('Error unfollowing user:', err);
      toast.error('Failed to unfollow user');
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    setUsers([]);
  };

  const loadMore = () => {
    setPage(prev => prev + 1);
  };

  if (loading && page === 1) {
    return <div>Loading users...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Discover People</h1>
      
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search users..."
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Search
          </button>
        </div>
      </form>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      <div className="grid gap-4">
        {users.map((user) => (
          <div key={user.id} className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={user.profileImage} alt={user.name} />
                  <AvatarFallback>{user.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">{user.name}</h3>
                  <p className="text-sm text-gray-500">@{user.username}</p>
                </div>
              </div>
              <button
                className={`px-4 py-2 rounded ${
                  followingStates[user.id]
                    ? 'border border-gray-300 hover:bg-gray-100'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
                onClick={() => 
                  followingStates[user.id]
                    ? handleUnfollow(user.id)
                    : handleFollow(user.id)
                }
              >
                {followingStates[user.id] ? 'Unfollow' : 'Follow'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {hasMore && (
        <div className="mt-6 text-center">
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