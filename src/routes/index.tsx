import { createBrowserRouter } from 'react-router';
import { lazy, Suspense } from 'react';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

const Welcome = lazy(() => import('@/pages/welcome'));
const Auth = lazy(() => import('@/pages/auth'));
const Dashboard = lazy(() => import('@/pages/dashboard'));
const Profile = lazy(() => import('@/pages/dashboard/profile'));

//routes
export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <Welcome />
      </Suspense>
    ),
  },
  {
    path: '/auth',
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <Auth />
      </Suspense>
    ),
  },
  {
    path: '/dashboard',
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <ProtectedRoute requireAuth={true}>
          <Dashboard />
        </ProtectedRoute>
      </Suspense>
    ),
  },
  {
    path: '/profile',
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <ProtectedRoute requireAuth={true}>
          <Profile />
        </ProtectedRoute>
      </Suspense>
    ),
  },
  {
    path: '*',
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <Welcome />
      </Suspense>
    ),
  },
]);
