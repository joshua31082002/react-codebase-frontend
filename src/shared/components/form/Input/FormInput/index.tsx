import Input, { type DefaultInputProps } from '@/shared/components/form/Input';
import { useController, type UseControllerProps } from 'react-hook-form';

export interface FormInputProps extends Omit<DefaultInputProps, 'name'> {
  name: string;
  rules?: UseControllerProps['rules'];
}

const FormInput = ({ ...props }: FormInputProps) => {
  const { name, defaultValue, disabled, rules } = props;

  const { field, fieldState } = useController({ name, defaultValue, disabled, rules });

  const errorMessage = fieldState.error?.message;

  return (
    <Input.Default
      {...field}
      status={errorMessage ? 'error' : undefined}
      error={errorMessage}
      {...props}
    />
  );
};

export default FormInput;
