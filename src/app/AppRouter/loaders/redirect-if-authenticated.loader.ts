import { APP_ROUTES } from '@/shared/constants/app-routes';
import { getAccessToken } from '@/shared/utils/local-storage-utils';
import { redirect, type LoaderFunction } from 'react-router';

export const redirectIfAuthenticatedLoader: LoaderFunction = () => {
  const token = getAccessToken();

  if (token) {
    throw redirect(APP_ROUTES.HOME);
  }

  return null;
};
