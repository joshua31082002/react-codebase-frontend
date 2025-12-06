import { getCurrentUser } from '@/modules/auth/api';
import type { User } from '@/modules/auth/types/user.types';
import { QUERY_KEYS } from '@/shared/constants/query-keys';
import { useQuery } from '@tanstack/react-query';
import type { AxiosError } from 'axios';

export const useCurrentUser = () => {
  return useQuery<User, AxiosError>({
    queryKey: [QUERY_KEYS.ME],
    queryFn: () => getCurrentUser(),
  });
};
