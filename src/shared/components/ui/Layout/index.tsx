import { Layout as AntdLayout, type LayoutProps as AntdLayoutProps } from 'antd';

interface LayoutProps extends AntdLayoutProps {}

const Layout = ({ ...props }: LayoutProps) => <AntdLayout {...props} />;

export default Layout;
