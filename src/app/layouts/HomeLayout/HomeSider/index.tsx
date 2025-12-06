import Sider from '@/shared/components/ui/Layout/Sider';
import styles from './HomeSider.module.scss';

interface HomeSiderProps {}

const HomeSider = ({}: HomeSiderProps) => {
  return (
    <Sider collapsible className={styles['home-sider']}>
      hi
    </Sider>
  );
};

export default HomeSider;
