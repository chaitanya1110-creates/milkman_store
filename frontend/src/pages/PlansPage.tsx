// src/pages/PlansPage.tsx
import { Check, ArrowRight } from "lucide-react";
import { useApp } from "../context/AppContext";
import { SUBSCRIPTION_PLANS } from "../data/mockData";

interface Props { onNavigate: (page: string) => void; }

export default function PlansPage({ onNavigate }: Props) {
  const { dispatch, state } = useApp();

  const selectPlan = (plan: typeof SUBSCRIPTION_PLANS[0]) => {
    if (!state.customer) {
      dispatch({ type: "OPEN_AUTH_MODAL", payload: "login" });
      return;
    }
    const end = new Date();
    end.setMonth(end.getMonth() + 1);
    dispatch({
      type: "ADD_TO_CART",
      payload: {
        id: `sub-${plan.id}`,
        type: "subscription",
        name: plan.name,
        price: plan.price,
        qty: 1,
        subDetails: plan,
      },
    });
    dispatch({ type: "SET_NOTIFICATION", payload: { message: `${plan.name} added to cart`, type: "success" } });
    onNavigate("cart");
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--ink)", paddingTop: "72px" }}>
      {/* Header */}
      <div style={{ borderBottom: "1px solid var(--line)", padding: "4rem 2.5rem 3rem" }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
          <p className="t-label" style={{ marginBottom: "0.75rem" }}>Subscriptions</p>
          <h1 className="t-heading" style={{ fontSize: "clamp(2.5rem, 5vw, 4.5rem)", marginBottom: "1rem" }}>
            Daily dairy, on your terms.
          </h1>
          <p className="t-body" style={{ maxWidth: "480px" }}>
            Every plan covers one calendar month of daily doorstep delivery. Cancel before renewal — no questions asked.
          </p>
        </div>
      </div>

      {/* Plans — full-width grid */}
      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "4rem 2.5rem 6rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1px", background: "var(--line)" }}>
          {SUBSCRIPTION_PLANS.map((plan) => (
            <div
              key={plan.id}
              style={{ background: plan.popular ? "var(--ink-3)" : "var(--ink)", padding: "3rem 2.5rem", display: "flex", flexDirection: "column", position: "relative" }}
            >
              {/* Popular label */}
              {plan.popular && (
                <div style={{ position: "absolute", top: "0", left: "0", right: "0", height: "2px", background: "var(--amber)" }} />
              )}

              {plan.badge && (
                <span style={{ display: "inline-block", marginBottom: "1.25rem", color: plan.popular ? "var(--amber)" : "var(--cream-faint)", fontFamily: "DM Sans, sans-serif", fontWeight: 300, fontSize: "0.62rem", letterSpacing: "0.2em", textTransform: "uppercase" }}>
                  {plan.popular ? "✦ " : ""}{plan.badge}
                </span>
              )}

              <h2 className="t-heading" style={{ fontSize: "1.8rem", marginBottom: "0.5rem" }}>{plan.name}</h2>
              <p className="t-body" style={{ fontSize: "0.82rem", marginBottom: "2rem" }}>{plan.description}</p>

              <div style={{ display: "flex", alignItems: "baseline", gap: "0.4rem", marginBottom: "0.5rem" }}>
                <span className="t-price" style={{ fontSize: "3rem" }}>₹{plan.price.toLocaleString()}</span>
                <span className="t-label">/month</span>
              </div>
              <p className="t-label" style={{ marginBottom: "2.5rem", color: "var(--cream-faint)" }}>
                ≈ ₹{Math.round(plan.price / 30)}/day
              </p>

              <div style={{ borderTop: "1px solid var(--line)", paddingTop: "2rem", flex: 1 }}>
                <p className="t-label" style={{ marginBottom: "1.25rem" }}>What's included</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  {plan.features.map((f) => (
                    <div key={f} style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
                      <Check size={13} style={{ color: "var(--amber)", marginTop: "3px", flexShrink: 0 }} strokeWidth={2.5} />
                      <span className="t-body" style={{ fontSize: "0.8rem" }}>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                className={plan.popular ? "btn-amber" : "btn-ghost"}
                style={{ marginTop: "2.5rem", width: "100%", justifyContent: "center" }}
                onClick={() => selectPlan(plan)}
              >
                Select Plan <ArrowRight size={13} strokeWidth={2} />
              </button>
            </div>
          ))}
        </div>

        {/* Guarantee note */}
        <div style={{ marginTop: "4rem", padding: "2rem", border: "1px solid var(--line)", display: "flex", gap: "2rem", flexWrap: "wrap", alignItems: "flex-start" }}>
          {[
            { head: "No lock-in", body: "Cancel anytime before your renewal date. No penalties." },
            { head: "Freshness guarantee", body: "If it doesn't arrive fresh, we'll replace it the same day — free." },
            { head: "Pause anytime", body: "Going on holiday? Pause deliveries with 24 hours notice." },
          ].map((item) => (
            <div key={item.head} style={{ flex: 1, minWidth: "200px" }}>
              <p style={{ fontFamily: "Fraunces, serif", fontWeight: 200, fontSize: "1rem", color: "var(--cream)", marginBottom: "0.4rem" }}>{item.head}</p>
              <p className="t-body" style={{ fontSize: "0.78rem" }}>{item.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
