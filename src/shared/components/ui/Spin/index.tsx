import { Spin as AntdSpin } from 'antd';
import type { SpinProps as AntdSpinProps } from 'antd';

interface SpinProps extends AntdSpinProps {}

const Spin = ({ ...props }: SpinProps) => <AntdSpin {...props} />;

export default Spin;
