import Input from '@/shared/components/form/Input';
import Button from '@/shared/components/ui/Button';
import styles from './LoginForm.module.scss';
import Form from '@/shared/components/form/Form';
import { yupResolver } from '@hookform/resolvers/yup';
import { loginFormSchema } from '@/modules/auth/components/LoginForm/login-form-schema';
import { useLogin } from '@/modules/auth/hooks/useLogin';
import { App } from 'antd';
import type { LoginFormValues } from '@/modules/auth/types/login-form-values';
import { useForm } from 'react-hook-form';
import { AxiosError } from 'axios';
import { useNavigate } from 'react-router';
import { APP_ROUTES } from '@/shared/constants/app-routes';

const LoginForm = () => {
  const { notification } = App.useApp();
  const { mutateAsync } = useLogin();
  const navigate = useNavigate();

  const formConfig = useForm({
    defaultValues: { username: 'emilys', password: 'emilyspass' },
    resolver: yupResolver(loginFormSchema),
    reValidateMode: 'onChange',
  });

  const {
    formState: { isSubmitting },
    reset,
  } = formConfig;

  const handleReset = () => reset();

  const handleLoginFormSubmit = async (data: LoginFormValues) => {
    try {
      const a = await mutateAsync(data);
      console.log(a);
      navigate(APP_ROUTES.HOME);
    } catch (error) {
      if (error instanceof AxiosError) {
        notification.error({
          message: error.response?.data?.message || 'Something went wrong. Unable to login.',
        });
      }
    }
  };

  return (
    <Form<LoginFormValues> formConfig={formConfig} onSubmit={handleLoginFormSubmit}>
      <div className={styles['form-fields-wrapper']}>
        <Input.FormInput
          label="Username"
          placeholder="Username"
          name="username"
          readOnly={isSubmitting}
        />
        <Input.FormPassword
          label="Password"
          placeholder="Password"
          name="password"
          readOnly={isSubmitting}
        />
      </div>
      <div className={styles['form-fields-wrapper__actions']}>
        <Button type="default" block className={styles['login-btn']} onClick={handleReset}>
          Reset
        </Button>

        <Button
          type="primary"
          block
          className={styles['login-btn']}
          htmlType="submit"
          loading={isSubmitting}>
          Login
        </Button>
      </div>
    </Form>
  );
};

export default LoginForm;
