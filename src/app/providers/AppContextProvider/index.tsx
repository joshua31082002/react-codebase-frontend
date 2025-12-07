import { AppContext } from '@/context/AppContext';
import { APP_THEME } from '@/shared/constants/app-theme';
import type { AppTheme } from '@/shared/types/app-theme.types';
import { useEffect, useState, type PropsWithChildren } from 'react';

const AppContextProvider = ({ children }: PropsWithChildren) => {
  const [theme, setTheme] = useState<AppTheme>(APP_THEME.LIGHT);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return <AppContext.Provider value={{ theme, setTheme }}>{children}</AppContext.Provider>;
};

export default AppContextProvider;
