import { Menu as AntdMenu, type MenuProps as AntdMenuProps } from 'antd';

interface MenuProps extends AntdMenuProps {}

const Menu = ({ ...props }: MenuProps) => {
  return <AntdMenu {...props} />;
};

export default Menu;
