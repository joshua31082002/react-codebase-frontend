import type { PasswordProps } from 'antd/es/input';
import { Input } from 'antd';
import type { FormFieldWrapperProps } from '@/shared/components/form/FormFieldWrapper';
import FormFieldWrapper from '@/shared/components/form/FormFieldWrapper';

export type DefaultPasswordProps = PasswordProps &
  Omit<FormFieldWrapperProps, 'classNames'> & {
    wrapperClassNames?: FormFieldWrapperProps['classNames'];
  };

const DefaultPassword = ({ wrapperClassNames, ...props }: DefaultPasswordProps) => (
  <FormFieldWrapper {...props} classNames={wrapperClassNames}>
    <Input.Password {...props} />
  </FormFieldWrapper>
);

export default DefaultPassword;
