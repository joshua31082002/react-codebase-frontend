import DefaultInput, { type DefaultInputProps } from '@/shared/components/form/Input/DefaultInput';
import DefaultPassword, {
  type DefaultPasswordProps,
} from '@/shared/components/form/Input/DefaultPassword';
import FormInput, { type FormInputProps } from '@/shared/components/form/Input/FormInput';
import FormPassword, { type FormPasswordProps } from '@/shared/components/form/Input/FormPassword';

export default { Default: DefaultInput, Password: DefaultPassword, FormInput, FormPassword };

export type { DefaultInputProps, DefaultPasswordProps, FormInputProps, FormPasswordProps };
