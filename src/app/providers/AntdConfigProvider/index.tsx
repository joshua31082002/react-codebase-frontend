import { App, ConfigProvider } from 'antd';
import type { PropsWithChildren } from 'react';

const AntdConfigProvider = ({ children }: PropsWithChildren) => (
  <ConfigProvider>
    <App>{children}</App>
  </ConfigProvider>
);

export default AntdConfigProvider;
