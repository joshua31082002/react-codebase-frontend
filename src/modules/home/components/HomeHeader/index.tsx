import Header from '@/shared/components/ui/Layout/Header';
import styles from './HomeHeader.module.scss';
import ReactLogo from '@/assets/react.svg?react';
import UserAvatar from '@/modules/home/components/UserAvatar';

interface HomeHeaderProps {}

const HomeHeader = ({}: HomeHeaderProps) => {
  return (
    <Header className={styles['home-header']}>
      <ReactLogo />
      <UserAvatar />
    </Header>
  );
};

export default HomeHeader;
