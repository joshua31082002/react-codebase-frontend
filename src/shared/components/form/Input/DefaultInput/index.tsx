import FormFieldWrapper, {
  type FormFieldWrapperProps,
} from '@/shared/components/form/FormFieldWrapper';
import { Input } from 'antd';
import type { InputProps } from 'antd';

export type DefaultInputProps = InputProps &
  Omit<FormFieldWrapperProps, 'classNames'> & {
    wrapperClassNames?: FormFieldWrapperProps['classNames'];
  };

const DefaultInput = ({ wrapperClassNames, ...props }: DefaultInputProps) => (
  <FormFieldWrapper {...props} classNames={wrapperClassNames}>
    <Input {...props} />
  </FormFieldWrapper>
);

export default DefaultInput;
