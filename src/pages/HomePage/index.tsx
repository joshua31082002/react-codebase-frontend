import { useState } from 'react';
import reactLogo from '@/assets/react.svg';
import viteLogo from '/logo/vite.svg';
import styles from './HomePage.module.scss';
import { env } from '@/config/env';
import clsx from 'clsx';
import Button from '@/shared/components/ui/Button';
import MaterialIcon from '@/shared/components/MaterialIcon';
import { useLogout } from '@/modules/auth/hooks/useLogout';

const HomePage = () => {
  const [count, setCount] = useState(0);

  const { logout } = useLogout();

  return (
    <div className={styles['home-page']}>
      <div>
        <a href="https://vite.dev" target="_blank" className={styles['link']}>
          <img src={viteLogo} className={styles['logo']} alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank" className={styles['link']}>
          <img src={reactLogo} className={clsx(styles['logo'], styles['react'])} alt="React logo" />
        </a>
      </div>
      <h1 className={styles['title']}>Vite + React</h1>
      <h3>Environment: {env?.APP_ENV}</h3>
      <p>Version: {env?.APP_VERSION}</p>
      <div className={styles['card']}>
        <Button color="primary" variant="solid" onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </Button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className={styles['read-the-docs']}>Click on the Vite and React logos to learn more</p>

      <Button
        icon={<MaterialIcon>logout</MaterialIcon>}
        shape="circle"
        size="large"
        className={styles['logout-btn']}
        onClick={logout}
      />
    </div>
  );
};

export default HomePage;
