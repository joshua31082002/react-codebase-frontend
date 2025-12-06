import LoginForm from '@/modules/auth/components/LoginForm';
import styles from './LoginPage.module.scss';

const LoginPage = () => (
  <div className={styles['login-page']}>
    <div className={styles['login-page__inner']}>
      <header>
        <h1>Login</h1>
      </header>
      <main>
        <LoginForm />
      </main>
    </div>
  </div>
);

export default LoginPage;
