import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

export function WelcomeSection() {
  const { user } = useAuth();

  const getUserDisplayName = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return user?.email?.split('@')[0] || 'User';
  };

  return (
    <div className="bg-white text-black rounded-xl p-6 mb-8 border border-gray-200 shadow-md">
      <h2 className="text-2xl font-bold mb-2">
        Welcome, {getUserDisplayName()}!
      </h2>
      <p className="text-gray-700">
        Manage your notes and stay organized. Your notes are automatically saved as you type.
      </p>
      <div className="mt-4 text-sm text-gray-600">
        <p>Email: {user?.email}</p>
        <p>
          Member since:{' '}
          {user?.createdAt
            ? new Date(user.createdAt).toLocaleDateString()
            : 'Recently'}
        </p>
      </div>
    </div>
  );
}
