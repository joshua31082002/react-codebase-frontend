import HomeHeader from '@/modules/home/components/HomeHeader';
import HomeSider from '@/modules/home/components/HomeSider';
import Layout from '@/shared/components/ui/Layout';
import { useState } from 'react';
import { Outlet } from 'react-router';
import styles from './HomeLayout.module.scss';
import clsx from 'clsx';

const HomeLayout = () => {
  const [siderCollapsed, setSiderCollapsed] = useState(true);

  return (
    <Layout>
      <HomeHeader />
      <Layout hasSider>
        <HomeSider collapsed={siderCollapsed} onCollapse={setSiderCollapsed} />
        <div className={clsx(styles['home-content'], siderCollapsed && styles['home-content--expanded'])}>
          <Outlet />
        </div>
      </Layout>
    </Layout>
  );
};

export default HomeLayout;
