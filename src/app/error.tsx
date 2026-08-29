"use client";

export default function Error({ reset }: { reset: () => void }) {
  return (
    <main className="shell error-page">
      <section aria-labelledby="error-heading">
        <p className="eyebrow">WE HIT A PAUSE</p>
        <h1 id="error-heading">Your plan could not load right now.</h1>
        <p>
          Nothing has been changed. Please try loading your private plan again.
        </p>
        <button className="primary-button" type="button" onClick={reset}>
          Try again
        </button>
      </section>
    </main>
  );
}
