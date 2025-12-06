import type { APP_THEME } from '@/shared/constants/app-theme';

export type AppTheme = (typeof APP_THEME)[keyof typeof APP_THEME];
