import { loginUser } from '@/modules/auth/api';
import type { LoginRequest } from '@/modules/auth/types/login-request.types';
import type { User } from '@/modules/auth/types/user.types';
import { setAccessToken } from '@/shared/utils/local-storage-utils';
import { useMutation } from '@tanstack/react-query';
import type { AxiosError } from 'axios';

export const useLogin = () => {
  return useMutation<User, AxiosError, LoginRequest>({
    mutationFn: async (data) => {
      const user = await loginUser(data);
      if (user.accessToken) setAccessToken(user.accessToken);
      return user;
    },
  });
};
