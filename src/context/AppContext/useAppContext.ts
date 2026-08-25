import { AppContext } from '@/context/AppContext';
import { useContext } from 'react';

export const useAppContext = () => {
  const { theme, setTheme } = useContext(AppContext);

  return { theme, setTheme };
};
