import { Avatar as AntdAvatar, type AvatarProps as AntdAvatarProps } from 'antd';

interface AvatarProps extends AntdAvatarProps {}

const Avatar = ({ ...props }: AvatarProps) => {
  return <AntdAvatar {...props} />;
};

export default Avatar;
