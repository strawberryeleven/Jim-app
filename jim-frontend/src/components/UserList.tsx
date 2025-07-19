import React, { useEffect, useState } from 'react';
import { User, userService } from '@/services/userService';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/Avatar';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { Card } from '@/components/cards/card';
import { Button } from '@/components/buttons/button';
import { Plus, X } from 'lucide-react';

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
    <div className="px-4 pb-6 border-b border-zinc-800">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl text-gray-400">People You May Know</h2>
        <Button variant="ghost" className="text-blue-500 p-0 h-auto flex items-center" onClick={() => navigate('/discover')}>
          <Plus className="h-4 w-4 mr-1" />
          View More
        </Button>
      </div>
      
      <div className="grid grid-cols-3 gap-2">
        {users.map(user => (
          <Card key={user.id} className="bg-zinc-900 border-none p-4 flex flex-col items-center">
            <div className="relative">
              <Avatar className="h-16 w-16 mb-2">
                <AvatarImage src={user.profileImage} />
                <AvatarFallback className="bg-zinc-700">{user.name[0].toUpperCase()}</AvatarFallback>
                </Avatar>
            </div>
            <span className="text-sm mb-1 truncate w-full text-center">{user.name}</span>
            <span className="text-xs text-gray-400 mb-3">@{user.username}</span>
            <Button 
              className={`w-full ${followingStates[user.id] 
                ? 'bg-zinc-700 hover:bg-zinc-600' 
                : 'bg-blue-500 hover:bg-blue-600'}`}
              onClick={() => followingStates[user.id] ? handleUnfollow(user.id) : handleFollow(user.id)}
            >
              {followingStates[user.id] ? 'Following' : 'Follow'}
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}; 