import Input, { type DefaultPasswordProps } from '@/shared/components/form/Input';
import { useController, type UseControllerProps } from 'react-hook-form';

export interface FormPasswordProps extends Omit<DefaultPasswordProps, 'name'> {
  name: string;
  rules?: UseControllerProps['rules'];
}

const FormPassword = ({ ...props }: FormPasswordProps) => {
  const { name, defaultValue, disabled, rules } = props;

  const { field, fieldState } = useController({ name, defaultValue, disabled, rules });

  const errorMessage = fieldState.error?.message;

  return (
    <Input.Password
      {...field}
      status={errorMessage ? 'error' : undefined}
      error={errorMessage}
      {...props}
    />
  );
};

export default FormPassword;
