import type { ButtonProps } from 'antd';

export type ButtonColor = Extract<
  Exclude<ButtonProps['color'], undefined>,
  'primary' | 'default' | 'error'
>;
