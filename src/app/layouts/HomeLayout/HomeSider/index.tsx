import Sider from '@/shared/components/ui/Layout/Sider';
import styles from './HomeSider.module.scss';
import Menu from '@/shared/components/ui/Menu';
import MaterialIcon from '@/shared/components/MaterialIcon';
import { HOME_SIDER_KEY } from '@/shared/constants/home-sider-key';
import { useMatch } from 'react-router';
import { APP_ROUTES } from '@/shared/constants/app-routes';

interface HomeSiderProps {}

const HomeSider = ({}: HomeSiderProps) => {
  const homeMatch = useMatch(APP_ROUTES.HOME);
  const productsListing = useMatch(APP_ROUTES.PRODUCTS.INDEX);

  const activeMenuItem = productsListing
    ? HOME_SIDER_KEY.PRODUCTS
    : homeMatch
      ? HOME_SIDER_KEY.HOME
      : HOME_SIDER_KEY.HOME;

  return (
    <Sider collapsible className={styles['home-sider']}>
      <Menu
        selectable
        selectedKeys={[activeMenuItem]}
        items={[
          {
            key: HOME_SIDER_KEY.HOME,
            icon: <MaterialIcon className={styles['icon']}>home</MaterialIcon>,
            label: 'Home',
          },
          {
            key: HOME_SIDER_KEY.PRODUCTS,
            icon: <MaterialIcon className={styles['icon']}>storefront</MaterialIcon>,
            label: 'Products',
          }
        ]}
      />
    </Sider>
  );
};

export default HomeSider;
