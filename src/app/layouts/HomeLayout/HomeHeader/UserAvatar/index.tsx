import { useCurrentUser } from '@/modules/auth/hooks/useCurrentUser';
import MaterialIcon from '@/shared/components/MaterialIcon';
import Avatar from '@/shared/components/ui/Avatar';
import Popover from '@/shared/components/ui/Popover';
import styles from './UserAvatar.module.scss';
import { useLogout } from '@/modules/auth/hooks/useLogout';
import Segmented from '@/shared/components/ui/Segmented';
import type { AppTheme } from '@/shared/types/app-theme.types';
import { useAppContext } from '@/context/AppContext/useAppContext';

const UserAvatar = () => {
  const { data: user } = useCurrentUser();

  const { theme, setTheme } = useAppContext();

  const { logout } = useLogout();

  return (
    <Popover
      arrow={false}
      placement="bottomLeft"
      classNames={{ body: styles['user-popover-body'] }}
      content={
        <menu className={styles['user-menu']}>
          <li className={styles['user-menu-item']}>
            <Segmented<AppTheme>
              value={theme}
              onChange={setTheme}
              options={[
                { label: 'Light', value: 'light' },
                { label: 'Dark', value: 'dark' },
              ]}
            />
          </li>
          <li className={styles['user-menu-item']} onClick={logout}>
            <MaterialIcon>logout</MaterialIcon>
            <span>Logout</span>
          </li>
        </menu>
      }>
      <Avatar>{user?.username?.at(0)}</Avatar>
    </Popover>
  );
};

export default UserAvatar;
