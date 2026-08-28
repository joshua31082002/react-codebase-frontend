import styles from './HomePage.module.scss';

const HomePage = () => (
  <main className={styles['home-page']}>
    <section className={styles['hello-card']} aria-labelledby="hello-title">
      <p className={styles['eyebrow']}>A small beginning</p>
      <h1 id="hello-title">Hello, world.</h1>
      <p className={styles['message']}>A calm place to start something meaningful.</p>
      <div className={styles['accent']} aria-hidden="true" />
    </section>
  </main>
);

export default HomePage;
