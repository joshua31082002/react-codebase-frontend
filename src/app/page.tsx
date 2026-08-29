import { deleteAccount } from "@/app/actions";
import { AccountForm } from "@/components/account-form";
import { getCreditDashboard } from "@/lib/credit-service";

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export default async function Home() {
  const { accounts, assessment } = await getCreditDashboard();
  const [priorityAction, ...supportingActions] = assessment.actions;

  return (
    <main className="shell">
      <header className="topbar">
        <a className="brand" href="#overview" aria-label="Credit Health home">
          Credit<span>Health</span>
        </a>
        <nav aria-label="Page navigation">
          <a href="#health-heading">Health factors</a>
          <a href="#accounts-heading">Accounts</a>
          <a className="header-cta" href="#add-account">
            Add account
          </a>
        </nav>
      </header>

      <section className="hero" id="overview" aria-labelledby="page-title">
        <div className="hero-copy">
          <p className="eyebrow">Private credit health plan</p>
          <h1 id="page-title">Know what to work on next.</h1>
          <p className="lede">
            A focused view of the habits shaping your credit health, based only
            on the accounts you record here.
          </p>
        </div>
      </section>

      <section className="summary-strip" aria-label="Plan summary">
        <article className="summary-item summary-score">
          <span>Health rating</span>
          <strong>{assessment.score}</strong>
          <b>{assessment.band}</b>
        </article>
        <article className="summary-item">
          <span>Card utilization</span>
          <strong>
            {assessment.utilizationPercent === null
              ? "—"
              : `${assessment.utilizationPercent}%`}
          </strong>
          <b>
            {assessment.utilizationPercent === null
              ? "Needs a limit"
              : "Current snapshot"}
          </b>
        </article>
        <article className="summary-item">
          <span>Accounts tracked</span>
          <strong>{accounts.length}</strong>
          <b>{accounts.length === 1 ? "Account" : "Accounts"} in this plan</b>
        </article>
      </section>

      <section className="priority-card" aria-labelledby="actions-heading">
        <div className="priority-marker" aria-hidden="true">
          01
        </div>
        <div>
          <p className="eyebrow">Your highest-impact move</p>
          <h2 id="actions-heading">{priorityAction}</h2>
          {supportingActions.length > 0 && (
            <details className="supporting-actions">
              <summary>
                See {supportingActions.length} more recommendation
                {supportingActions.length === 1 ? "" : "s"}
              </summary>
              <ol>
                {supportingActions.map((action) => (
                  <li key={action}>{action}</li>
                ))}
              </ol>
            </details>
          )}
        </div>
      </section>

      <section className="notice" aria-label="Important information">
        <strong>Educational guidance only.</strong> This is not a credit bureau
        score or lending decision.
      </section>

      <section className="dashboard-grid" aria-label="Credit health dashboard">
        <section className="overview-card" aria-labelledby="health-heading">
          <div className="section-heading">
            <p className="eyebrow">Why your rating looks this way</p>
            <h2 id="health-heading">Health factors</h2>
          </div>
          <div className="factors">
            {assessment.factors.map((factor) => (
              <article className="factor" key={factor.label}>
                <div className="factor-title">
                  <h3>{factor.label}</h3>
                  <strong>
                    {factor.score}
                    <span>/{factor.maximum}</span>
                  </strong>
                </div>
                <div
                  className="progress"
                  aria-label={`${factor.label}: ${factor.score} out of ${factor.maximum}`}
                >
                  <span
                    style={{
                      width: `${(factor.score / factor.maximum) * 100}%`,
                    }}
                  />
                </div>
                <p>{factor.summary}</p>
              </article>
            ))}
          </div>
        </section>

        <aside className="side-column">
          <section
            className="metric-card"
            aria-labelledby="utilization-heading"
          >
            <p className="eyebrow">Card utilization</p>
            <h2 id="utilization-heading">
              {assessment.utilizationPercent === null
                ? "—"
                : `${assessment.utilizationPercent}%`}
            </h2>
            <p>
              {assessment.utilizationPercent === null
                ? "Add a credit limit to calculate this factor."
                : "Under 30% is a useful target; lower is generally healthier."}
            </p>
          </section>
          {!assessment.isComplete && (
            <section
              className="incomplete-card"
              aria-label="Incomplete profile"
            >
              <strong>Your snapshot needs one more detail</strong>
              <p>Add the missing credit limit to improve the assessment.</p>
            </section>
          )}
        </aside>
      </section>

      <section className="accounts-section" aria-labelledby="accounts-heading">
        <div className="section-heading accounts-header">
          <div>
            <p className="eyebrow">Information in your plan</p>
            <h2 id="accounts-heading">Recorded accounts</h2>
          </div>
          <span>{accounts.length} total</span>
        </div>
        <div className="account-list">
          {accounts.length === 0 ? (
            <p className="empty-state">
              Add your first account to receive a personalized health view.
            </p>
          ) : (
            accounts.map((account) => (
              <article className="account-row" key={account.id}>
                <div>
                  <p className="account-name">{account.name}</p>
                  <p>
                    {account.type === "revolving"
                      ? "Credit card"
                      : "Installment loan"}{" "}
                    · Opened {account.openedOn}
                  </p>
                </div>
                <div className="account-amounts">
                  <strong>{money.format(account.balanceCents / 100)}</strong>
                  {account.type === "revolving" &&
                    account.limitCents !== null && (
                      <span>
                        of {money.format(account.limitCents / 100)} limit
                      </span>
                    )}
                </div>
                <form action={deleteAccount.bind(null, account.id)}>
                  <button className="text-button" type="submit">
                    Remove
                  </button>
                </form>
              </article>
            ))
          )}
        </div>
      </section>

      <div id="add-account">
        <AccountForm />
      </div>
    </main>
  );
}
