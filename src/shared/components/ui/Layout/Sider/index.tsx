import { Layout, type SiderProps as AntdSiderProps } from 'antd';

interface SiderProps extends AntdSiderProps {}

const Sider = ({ ...props }: SiderProps) => <Layout.Sider {...props} />;

export default Sider;
