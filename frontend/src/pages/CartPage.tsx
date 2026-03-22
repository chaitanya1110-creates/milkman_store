// src/pages/CartPage.tsx
import { Trash2, Plus, Minus, ArrowRight, ShoppingCart } from "lucide-react";
import { useApp } from "../context/AppContext";

interface Props { onNavigate: (page: string) => void; }

export default function CartPage({ onNavigate }: Props) {
  const { state, dispatch, cartTotal } = useApp();

  const updateQty = (id: string, delta: number) => {
    const item = state.cart.find((c) => c.id === id);
    if (!item) return;
    const next = item.qty + delta;
    if (next <= 0) dispatch({ type: "REMOVE_FROM_CART", payload: id });
    else dispatch({ type: "UPDATE_QTY", payload: { id, qty: next } });
  };

  if (state.cart.length === 0) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--ink)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", paddingTop: "72px", textAlign: "center", padding: "2rem" }}>
        <ShoppingCart size={48} strokeWidth={1} style={{ color: "var(--cream-faint)", marginBottom: "2rem" }} />
        <h2 className="t-heading" style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>Your cart is empty</h2>
        <p className="t-body" style={{ marginBottom: "2.5rem" }}>Add some products or a subscription plan to get started.</p>
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", justifyContent: "center" }}>
          <button className="btn-primary" onClick={() => onNavigate("shop")}>Browse Products</button>
          <button className="btn-ghost" onClick={() => onNavigate("plans")}>View Plans</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--ink)", paddingTop: "72px" }}>
      <div style={{ borderBottom: "1px solid var(--line)", padding: "3.5rem 2.5rem 2.5rem" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <p className="t-label" style={{ marginBottom: "0.75rem" }}>Your Cart</p>
          <h1 className="t-heading" style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}>
            {state.cart.length} item{state.cart.length !== 1 ? "s" : ""}
          </h1>
        </div>
      </div>

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "3rem 2.5rem 6rem", display: "grid", gridTemplateColumns: "1fr 340px", gap: "4rem", alignItems: "start" }}>
        {/* Items list */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1px", background: "var(--line)" }}>
          {state.cart.map((item) => (
            <div key={item.id} style={{ background: "var(--ink)", padding: "1.75rem", display: "flex", gap: "1.5rem", alignItems: "center" }}>
              <div style={{ width: "64px", height: "64px", borderRadius: "4px", background: "var(--ink-3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.8rem", flexShrink: 0 }}>
                {item.type === "subscription" ? "📦" : item.emoji || "🥛"}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <p className="t-label" style={{ marginBottom: "0.2rem" }}>{item.type}</p>
                <h3 style={{ fontFamily: "Fraunces, serif", fontWeight: 200, fontSize: "1.05rem", color: "var(--cream)", letterSpacing: "-0.01em", lineHeight: 1.25, marginBottom: "0.25rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {item.name}
                </h3>
                <p className="t-price" style={{ fontSize: "1.05rem" }}>₹{item.price}</p>
              </div>

              {/* Qty */}
              {item.type === "product" && (
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <button className="btn-icon" style={{ width: "28px", height: "28px" }} onClick={() => updateQty(item.id, -1)}>
                    <Minus size={11} />
                  </button>
                  <span style={{ fontFamily: "DM Sans, sans-serif", fontWeight: 300, fontSize: "0.9rem", color: "var(--cream)", minWidth: "20px", textAlign: "center" }}>
                    {item.qty}
                  </span>
                  <button className="btn-icon" style={{ width: "28px", height: "28px" }} onClick={() => updateQty(item.id, 1)}>
                    <Plus size={11} />
                  </button>
                </div>
              )}

              <button className="btn-icon" onClick={() => dispatch({ type: "REMOVE_FROM_CART", payload: item.id })}>
                <Trash2 size={14} strokeWidth={1.5} />
              </button>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div style={{ background: "var(--ink-2)", border: "1px solid var(--line)", padding: "2rem" }}>
          <h2 style={{ fontFamily: "Fraunces, serif", fontWeight: 200, fontSize: "1.25rem", color: "var(--cream)", marginBottom: "1.5rem", letterSpacing: "-0.01em" }}>
            Order Summary
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1.5rem" }}>
            {state.cart.map((item) => (
              <div key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span className="t-body" style={{ fontSize: "0.78rem" }}>{item.name} {item.qty > 1 ? `× ${item.qty}` : ""}</span>
                <span className="t-body" style={{ fontSize: "0.78rem", color: "var(--cream)" }}>₹{item.price * item.qty}</span>
              </div>
            ))}
          </div>

          <div style={{ borderTop: "1px solid var(--line)", paddingTop: "1.25rem", marginBottom: "2rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontFamily: "Fraunces, serif", fontWeight: 200, fontSize: "1.05rem", color: "var(--cream)" }}>Total</span>
              <span className="t-price" style={{ fontSize: "1.5rem" }}>₹{cartTotal}</span>
            </div>
            <p className="t-label" style={{ marginTop: "0.4rem" }}>Free delivery included</p>
          </div>

          <button className="btn-primary" style={{ width: "100%", justifyContent: "center" }} onClick={() => onNavigate("checkout")}>
            Checkout <ArrowRight size={13} strokeWidth={2} />
          </button>
          <button className="btn-ghost" style={{ width: "100%", justifyContent: "center", marginTop: "0.75rem" }} onClick={() => onNavigate("shop")}>
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}
