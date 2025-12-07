import { Popover as AntdPopover, type PopoverProps as AntdPopoverProps } from 'antd';

interface PopoverProps extends AntdPopoverProps {}

const Popover = ({ ...props }: PopoverProps) => {
  return <AntdPopover {...props} />;
};

export default Popover;
