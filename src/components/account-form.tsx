"use client";

import { useActionState, useEffect, useRef } from "react";
import { saveAccount, type FormState } from "@/app/actions";

const initialState: FormState = { message: "" };

export function AccountForm() {
  const [state, formAction, pending] = useActionState(
    saveAccount,
    initialState,
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.message.startsWith("Account saved")) formRef.current?.reset();
  }, [state.message]);

  return (
    <details className="account-entry">
      <summary>
        <span>
          <small>Update your plan</small>
          Add another account
        </span>
        <span aria-hidden="true">+</span>
      </summary>
      <section className="account-form" aria-labelledby="add-account-heading">
        <div className="section-heading">
          <p className="eyebrow">Account details</p>
          <h2 id="add-account-heading">Add an account</h2>
          <p>
            Use your latest statement. This stays in your private local plan.
          </p>
        </div>
        <form ref={formRef} action={formAction} noValidate>
          <label>
            Account name
            <input
              name="name"
              placeholder="e.g. Harbor Rewards Card"
              aria-invalid={Boolean(state.errors?.name)}
            />
            {state.errors?.name && (
              <span className="field-error">{state.errors.name[0]}</span>
            )}
          </label>
          <div className="form-grid">
            <label>
              Account type
              <select name="type" defaultValue="revolving">
                <option value="revolving">Credit card / revolving</option>
                <option value="installment">Loan / installment</option>
              </select>
            </label>
            <label>
              Current balance
              <input
                name="balance"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                aria-invalid={Boolean(state.errors?.balance)}
              />
              {state.errors?.balance && (
                <span className="field-error">{state.errors.balance[0]}</span>
              )}
            </label>
            <label>
              Credit limit
              <input
                name="limit"
                type="number"
                min="0"
                step="0.01"
                placeholder="Required for cards"
                aria-invalid={Boolean(state.errors?.limit)}
              />
              {state.errors?.limit && (
                <span className="field-error">{state.errors.limit[0]}</span>
              )}
            </label>
            <label>
              Opened on
              <input
                name="openedOn"
                type="date"
                aria-invalid={Boolean(state.errors?.openedOn)}
              />
              {state.errors?.openedOn && (
                <span className="field-error">{state.errors.openedOn[0]}</span>
              )}
            </label>
            <label>
              Payment status
              <select name="paymentStatus" defaultValue="on_time">
                <option value="on_time">Currently on time</option>
                <option value="late">Currently late</option>
              </select>
            </label>
            <label>
              Late payments
              <input
                name="latePayments"
                type="number"
                min="0"
                step="1"
                defaultValue="0"
                aria-invalid={Boolean(state.errors?.latePayments)}
              />
              {state.errors?.latePayments && (
                <span className="field-error">
                  {state.errors.latePayments[0]}
                </span>
              )}
            </label>
          </div>
          <label className="checkbox-label">
            <input name="isActive" type="checkbox" defaultChecked />
            Include this active account in my health view
          </label>
          {state.message && (
            <p
              className={state.errors ? "form-message error" : "form-message"}
              role="status"
            >
              {state.message}
            </p>
          )}
          <button className="primary-button" type="submit" disabled={pending}>
            {pending ? "Saving account…" : "Save account"}
          </button>
        </form>
      </section>
    </details>
  );
}
