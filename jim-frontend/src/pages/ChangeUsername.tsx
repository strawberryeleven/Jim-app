import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ChangeUsername: React.FC = () => {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      // Simulate API request to update username
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Simulate success
      setMessage('Username updated successfully!');
      setTimeout(() => navigate('/settings/account'), 2000); // Go back after 2 sec
    } catch (error) {
      setMessage('Failed to update username.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Change Username</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="username" className="block text-sm font-medium mb-1">
            New Username
          </label>
          <input
            id="username"
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            minLength={3}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
        >
          {loading ? 'Updating...' : 'Update Username'}
        </button>
      </form>

      {message && (
        <p className="mt-4 text-center text-green-600 font-medium">{message}</p>
      )}
    </div>
  );
};

export default ChangeUsername;
