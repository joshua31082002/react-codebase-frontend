import { Layout, type LayoutProps as AntdLayoutProps } from 'antd';

interface HeaderProps extends AntdLayoutProps {}

const Header = ({ ...props }: HeaderProps) => <Layout.Header {...props} />;

export default Header;
