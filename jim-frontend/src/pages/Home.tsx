import React from 'react';
import { UserList } from '@/components/UserList';
import { Feed } from '@/components/Feed';

export const Home: React.FC = () => {
  console.log('Home component rendered');
  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">Home</h1>
      <div className="grid gap-8">
        <UserList />
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Your Feed</h2>
          <Feed />
        </div>
      </div>
    </div>
  );
}; 