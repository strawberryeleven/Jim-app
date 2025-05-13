import React from 'react';
import { UserList } from '@/components/UserList';
import { Feed } from '@/components/Feed';

const Home: React.FC = () => {
  console.log('Home component rendered');
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
          <h1 className="text-2xl font-bold text-blue-400">Home</h1>
        </div>

        <div className="max-w-4xl mx-auto w-full space-y-8">
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
            <UserList />
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
            <h2 className="text-xl font-semibold text-white mb-6">Your Feed</h2>
            <Feed />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;