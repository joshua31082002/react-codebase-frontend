import { LOCAL_STORAGE_KEYS } from '@/shared/constants/local-storage-keys';

export const getAccessToken = () => localStorage.getItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN);

export const setAccessToken = (token: string | null) =>
  token
    ? localStorage.setItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN, token)
    : localStorage.removeItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN);
