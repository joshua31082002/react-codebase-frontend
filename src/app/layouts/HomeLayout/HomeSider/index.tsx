import Sider from '@/shared/components/ui/Layout/Sider';
import styles from './HomeSider.module.scss';
import Menu from '@/shared/components/ui/Menu';
import MaterialIcon from '@/shared/components/MaterialIcon';
import { Link, useMatch } from 'react-router';
import { APP_ROUTES } from '@/shared/constants/app-routes';

interface HomeSiderProps {}

const HomeSider = ({}: HomeSiderProps) => {
  const homeMatch = useMatch(APP_ROUTES.HOME);
  const productsListing = useMatch(APP_ROUTES.PRODUCTS.INDEX);

  const activeMenuItem = productsListing
    ? APP_ROUTES.PRODUCTS.INDEX
    : homeMatch
      ? APP_ROUTES.HOME
      : APP_ROUTES.HOME;

  return (
    <Sider collapsible className={styles['home-sider']}>
      <Menu
        selectable
        selectedKeys={[activeMenuItem]}
        items={[
          {
            key: APP_ROUTES.HOME,
            icon: (
              <Link to={APP_ROUTES.HOME}>
                <MaterialIcon className={styles['icon']}>home</MaterialIcon>
              </Link>
            ),
            label: 'Home',
          },
          {
            key: APP_ROUTES.PRODUCTS.INDEX,
            icon: (
              <Link to={APP_ROUTES.PRODUCTS.INDEX}>
                <MaterialIcon className={styles['icon']}>storefront</MaterialIcon>
              </Link>
            ),
            label: 'Products',
          },
        ]}
      />
    </Sider>
  );
};

export default HomeSider;
