import { Segmented as AntdSegmented, type SegmentedProps as AntdSegmentedProps } from 'antd';

interface SegmentedProps<T> extends AntdSegmentedProps<T> {}

const Segmented = <T,>({ ...props }: SegmentedProps<T>) => {
  return <AntdSegmented<T> {...props} />;
};

export default Segmented;
