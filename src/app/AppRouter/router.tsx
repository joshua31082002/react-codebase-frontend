import { redirectIfAuthenticatedLoader } from '@/app/AppRouter/loaders/redirect-if-authenticated.loader';
import { requireAuthLoader } from '@/app/AppRouter/loaders/require-auth.loader';
import HomeLayout from '@/app/layouts/HomeLayout';
import RootLayout from '@/app/layouts/RootLayout';
import type { QueryClient } from '@tanstack/react-query';
import { lazy } from 'react';
import { createBrowserRouter } from 'react-router';

const HomePage = lazy(() => import('@/pages/HomePage'));
const LoginPage = lazy(() => import('@/pages/LoginPage'));

export const createRouter = (queryClient: QueryClient) =>
  createBrowserRouter([
    {
      path: '/',
      element: <RootLayout />,
      children: [
        {
          path: '/',
          loader: requireAuthLoader(queryClient),
          element: <HomeLayout />,
          children: [{ index: true, element: <HomePage /> }],
        },
        {
          path: 'auth',
          children: [
            { path: 'login', loader: redirectIfAuthenticatedLoader, element: <LoginPage /> },
          ],
        },
      ],
    },
  ]);
