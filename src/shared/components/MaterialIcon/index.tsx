import clsx from 'clsx';
import type { HTMLAttributes } from 'react';

interface MaterialIconProps extends HTMLAttributes<HTMLSpanElement> {
  filled?: boolean;
  children: string;
}

const MaterialIcon = ({ className, children, ...props }: MaterialIconProps) => (
  <span className={clsx('material-symbols-rounded', className)} {...props}>
    {children}
  </span>
);

export default MaterialIcon;
