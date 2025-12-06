import ConditionalRender from '@/shared/components/ui/ConditionalRender';
import clsx from 'clsx';
import type { PropsWithChildren } from 'react';
import styles from './FormFieldWrapper.module.scss';
import type { FormFieldStatus } from '@/shared/types/formfield-status.types';

export interface FormFieldWrapperProps {
  label?: string;
  name?: string;
  error?: string;
  status?: FormFieldStatus;
  classNames?: {
    wrapper?: string;
    label?: string;
    error?: string;
  };
}

const FormFieldWrapper = ({
  label,
  name,
  error,
  classNames,
  children,
  status = 'error',
}: PropsWithChildren<FormFieldWrapperProps>) => (
  <div className={clsx(styles['field-wrapper'], classNames?.wrapper)}>
    <ConditionalRender condition={label}>
      <label htmlFor={name} className={clsx(styles['field-wrapper__label'], classNames?.label)}>
        {label}
      </label>
    </ConditionalRender>
    {children}

    <ConditionalRender condition={error}>
      <p
        className={clsx(
          styles['field-wrapper__status-message'],
          classNames?.error,
          status
            ? styles['field-wrapper__status-message--error']
            : styles['field-wrapper__status-message--warn']
        )}>
        {error}
      </p>
    </ConditionalRender>
  </div>
);

export default FormFieldWrapper;
