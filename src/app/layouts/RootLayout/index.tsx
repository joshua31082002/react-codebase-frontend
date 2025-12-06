import { Suspense } from 'react';
import { Outlet } from 'react-router';
import styles from './RootLayout.module.scss';
import Spin from '@/shared/components/ui/Spin';

const RootLayout = () => (
  <Suspense
    fallback={
      <div className={styles['loader']}>
        <Spin size="large" />
      </div>
    }>
    <Outlet />
  </Suspense>
);

export default RootLayout;
