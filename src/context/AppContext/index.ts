import { APP_THEME } from '@/shared/constants/app-theme';
import type { AppContextType } from '@/shared/types/app-context.types';
import { createContext } from 'react';

export const AppContext = createContext<AppContextType>({
  theme: APP_THEME.LIGHT,
  setTheme: () => {},
});
