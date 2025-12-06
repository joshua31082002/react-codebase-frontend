import apiClient from '@/config/api-client';
import type { LoginRequest } from '@/modules/auth/types/login-request.types';
import type { User } from '@/modules/auth/types/user.types';
import { API_ROUTES } from '@/shared/constants/api-routes';

export const loginUser = async (data: LoginRequest) =>
  (await apiClient.post<User>(API_ROUTES.LOGIN, data)).data;

export const getCurrentUser = async () => (await apiClient.get<User>(API_ROUTES.ME)).data;
