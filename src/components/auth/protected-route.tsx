import React from 'react';
import { Navigate, useLocation } from 'react-router';
import { Spinner, Center } from '@chakra-ui/react';
import { useGetCurrentUser } from '@/api/auth/use-auth';
import { useDispatch } from 'react-redux';
import { updateUser } from '@/store/auth-slice';
import type { User } from '@/api/auth/types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireAuth = true }) => {
  const { data: currentUser, isLoading } = useGetCurrentUser();
  const location = useLocation();
  const dispatch = useDispatch();

  const isAuthenticated = !!currentUser;

  if (currentUser) {
    dispatch(updateUser(currentUser.data?.user as User));
  }

  if (isLoading) {
    return (
      <Center h='100vh'>
        <Spinner size='xl' color='blue.500' />
      </Center>
    );
  }

  if (requireAuth && !isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to='/auth' state={{ from: location }} replace />;
  }

  if (!requireAuth && isAuthenticated) {
    // Redirect to dashboard if already authenticated
    return <Navigate to='/dashboard' replace />;
  }

  return <>{children}</>;
};
