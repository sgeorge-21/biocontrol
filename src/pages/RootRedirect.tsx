import React from 'react';
import { Navigate } from 'react-router-dom';
import { Loader } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const RootRedirect: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Redirect to login if not authenticated, otherwise to home
  return <Navigate to={isAuthenticated ? '/home' : '/login'} replace />;
};

export default RootRedirect;
