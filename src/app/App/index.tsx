import AppRouter from '@/app/AppRouter';
import AntdConfigProvider from '@/app/providers/AntdConfigProvider';
import AppContextProvider from '@/app/providers/AppContextProvider';
import QueryProvider from '@/app/providers/QueryProvider';

const App = () => {
  return (
    <AppContextProvider>
      <QueryProvider>
        <AntdConfigProvider>
          <AppRouter />
        </AntdConfigProvider>
      </QueryProvider>
    </AppContextProvider>
  );
};

export default App;
