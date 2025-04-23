import React from 'react';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-purple-200 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          🚀 Tailwind + Vite + TypeScript
        </h1>
        <p className="text-gray-600 mb-6">
          You're now running a modern React setup with Tailwind CSS!
        </p>
        <button className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition">
          Click Me
        </button>
      </div>
    </div>
  );
}

export default App;
