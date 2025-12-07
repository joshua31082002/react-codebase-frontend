import type { AppTheme } from '@/shared/types/app-theme.types';

export interface AppContextType {
  theme: AppTheme;
  setTheme: React.Dispatch<React.SetStateAction<AppTheme>>
}
