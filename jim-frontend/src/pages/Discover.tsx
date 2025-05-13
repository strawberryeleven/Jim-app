import React, { useEffect, useState } from 'react';
import { User, userService } from '@/services/userService';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/Avatar';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { Card } from '@/components/cards/card';
import { Button } from '@/components/buttons/button';
import { Search } from 'lucide-react';

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
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-blue-900">
        <div className="max-w-4xl mx-auto p-4">
          <div className="flex justify-center items-center min-h-[200px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-blue-900">
      {/* Abstract Background Forms */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-20 w-60 h-60 bg-purple-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 right-1/3 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl" />
      </div>

      <div className="max-w-4xl mx-auto p-4 relative">
        <h1 className="text-2xl font-bold text-blue-400 mb-6">Discover People</h1>
        
        <form onSubmit={handleSearch} className="mb-6">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search users..."
                className="w-full pl-10 pr-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <Button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              Search
            </Button>
          </div>
        </form>

        {error && (
          <div className="text-red-400 mb-4 p-4 bg-red-500/10 backdrop-blur-sm rounded-lg border border-red-500/20">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {users.map((user) => (
            <Card key={user.id} className="bg-white/5 backdrop-blur-sm border-white/10 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={user.profileImage} alt={user.name} />
                    <AvatarFallback className="bg-zinc-700">{user.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-white">{user.name}</h3>
                    <p className="text-sm text-gray-400">@{user.username}</p>
                  </div>
                </div>
                <Button
                  className={`${
                    followingStates[user.id]
                      ? 'bg-zinc-700 hover:bg-zinc-600'
                      : 'bg-blue-500 hover:bg-blue-600'
                  }`}
                  onClick={() => 
                    followingStates[user.id]
                      ? handleUnfollow(user.id)
                      : handleFollow(user.id)
                  }
                >
                  {followingStates[user.id] ? 'Following' : 'Follow'}
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {hasMore && (
          <div className="mt-6 text-center">
            <Button
              onClick={loadMore}
              disabled={loading}
              className="bg-white/5 backdrop-blur-sm text-white hover:bg-white/10 border border-white/10"
            >
              {loading ? 'Loading...' : 'Load More'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}; 