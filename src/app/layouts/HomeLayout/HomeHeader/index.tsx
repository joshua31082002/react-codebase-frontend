import Header from '@/shared/components/ui/Layout/Header';
import styles from './HomeHeader.module.scss';

interface HomeHeaderProps {}

const HomeHeader = ({}: HomeHeaderProps) => {
  return <Header className={styles['home-header']}>React</Header>;
};

export default HomeHeader;
