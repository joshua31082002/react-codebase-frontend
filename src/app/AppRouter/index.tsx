import { createRouter } from '@/app/AppRouter/router';
import { useQueryClient } from '@tanstack/react-query';
import { RouterProvider } from 'react-router';

const AppRouter = () => {
  const queryClient = useQueryClient();

  const router = createRouter(queryClient);

  return <RouterProvider router={router} />;
};

export default AppRouter;
