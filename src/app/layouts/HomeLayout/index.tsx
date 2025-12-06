import HomeHeader from '@/app/layouts/HomeLayout/HomeHeader';
import HomeSider from '@/app/layouts/HomeLayout/HomeSider';
import Layout from '@/shared/components/ui/Layout';
import { Outlet } from 'react-router';

const HomeLayout = () => {
  return (
    <Layout className="h-100">
      <HomeHeader />
      <Layout hasSider>
        <HomeSider />
        <div className='w-100'>
          <Outlet />
        </div>
      </Layout>
    </Layout>
  );
};

export default HomeLayout;
