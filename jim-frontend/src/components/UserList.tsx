import React, { useEffect, useState } from 'react';
import { User, userService } from '@/services/userService';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/Avatar';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [followingStates, setFollowingStates] = useState<Record<string, boolean>>({});
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await userService.getAllUsers(1, 3); // Get first 3 users
        setUsers(response.users);
        // Initialize following states based on current user's followers
        const followingMap: Record<string, boolean> = {};
        response.users.forEach(user => {
          followingMap[user.id] = user.followers.includes(currentUser?.id || '');
        });
        setFollowingStates(followingMap);
      } catch (err) {
        setError('Failed to fetch users');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [currentUser?.id]);

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

  if (loading) {
    return <div>Loading users...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">People You May Know</h2>
        <button 
          className="text-blue-500 hover:text-blue-600"
          onClick={() => navigate('/discover')}
        >
          View More
        </button>
      </div>
      
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
    </div>
  );
}; 