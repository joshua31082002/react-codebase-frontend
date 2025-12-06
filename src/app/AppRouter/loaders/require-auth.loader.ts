import { getCurrentUser } from '@/modules/auth/api';
import { APP_ROUTES } from '@/shared/constants/app-routes';
import { QUERY_KEYS } from '@/shared/constants/query-keys';
import { getAccessToken, setAccessToken } from '@/shared/utils/local-storage-utils';
import type { QueryClient } from '@tanstack/react-query';
import { redirect, type LoaderFunction } from 'react-router';

export const requireAuthLoader =
  (queryClient: QueryClient): LoaderFunction =>
  async () => {
    const token = getAccessToken();

    if (!token) {
      throw redirect(APP_ROUTES.AUTH.LOGIN);
    }

    try {
      const user = await queryClient.ensureQueryData({
        queryKey: [QUERY_KEYS.ME],
        queryFn: getCurrentUser,
      });
      console.log(`User details:- ${user.username}`);
      return null;
    } catch (error) {
      setAccessToken(null);
      throw redirect(APP_ROUTES.AUTH.LOGIN);
    }
  };
