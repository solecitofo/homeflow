import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { hasCompletedOnboarding } from '../../db/database';

interface ProtectedRouteProps {
  children: React.ReactElement;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [hasOnboarded, setHasOnboarded] = useState(false);

  useEffect(() => {
    const checkOnboarding = async () => {
      const completed = await hasCompletedOnboarding('default_user');
      setHasOnboarded(completed);
      setLoading(false);
    };

    checkOnboarding();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-sage-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!hasOnboarded) {
    return <Navigate to="/onboarding" replace />;
  }

  return children;
};
