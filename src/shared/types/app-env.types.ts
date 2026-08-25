import { APP_ENV } from '@/shared/constants/app-env';

export type AppEnv = (typeof APP_ENV)[keyof typeof APP_ENV];
