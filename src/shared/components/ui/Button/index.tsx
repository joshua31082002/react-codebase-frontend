import { Button as AntdButton, type ButtonProps as AntdButtonProps } from 'antd';

interface ButtonProps extends AntdButtonProps {}

const Button = ({ ...props }: ButtonProps) => <AntdButton {...props} />;

export default Button;
