import { APP_ROUTES } from '@/shared/constants/app-routes';
import { setAccessToken } from '@/shared/utils/local-storage-utils';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';

export const useLogout = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const logout = () => {
    queryClient.clear();
    setAccessToken(null);
    navigate(APP_ROUTES.AUTH.LOGIN);
  };

  return { logout };
};
