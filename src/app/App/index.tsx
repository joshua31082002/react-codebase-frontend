import AppRouter from '@/app/AppRouter';
import AntdConfigProvider from '@/app/providers/AntdConfigProvider';
import QueryProvider from '@/app/providers/QueryProvider';

const App = () => {
  return (
    <QueryProvider>
      <AntdConfigProvider>
        <AppRouter />
      </AntdConfigProvider>
    </QueryProvider>
  );
};

export default App;
