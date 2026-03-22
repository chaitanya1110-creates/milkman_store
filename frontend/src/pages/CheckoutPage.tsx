// src/pages/CheckoutPage.tsx
import { useState } from "react";
import { CreditCard, Smartphone, Lock, ArrowRight } from "lucide-react";
import { useApp } from "../context/AppContext";

interface Props {
  onNavigate: (page: string) => void;
  onOrderComplete: (details: {
    orderId: string; items: { id: string; name: string; price: number; qty: number; emoji?: string; type: "product" | "subscription"; }[];
    total: number; paymentMethod: string; customerName: string; date: string;
  }) => void;
}

type PayMethod = "upi" | "card";

export default function CheckoutPage({ onNavigate, onOrderComplete }: Props) {
  const { state, dispatch, cartTotal } = useApp();
  const [method, setMethod]  = useState<PayMethod>("upi");
  const [upiId, setUpiId]    = useState("");
  const [cardNum, setCardNum] = useState("");
  const [cardExp, setCardExp] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [cardName, setCardName] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePay = () => {
    setLoading(true);
    setTimeout(() => {
      const orderId = `MK-${Date.now().toString().slice(-6)}`;
      onOrderComplete({
        orderId,
        items: state.cart.map((c) => ({ id: c.id, name: c.name, price: c.price, qty: c.qty, emoji: c.emoji, type: c.type })),
        total: cartTotal,
        paymentMethod: method === "upi" ? "UPI" : "Debit Card",
        customerName: state.customer?.name || "Guest",
        date: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }),
      });
      dispatch({ type: "CLEAR_CART" });
      onNavigate("confirmation");
      setLoading(false);
    }, 1800);
  };

  const methodOptions: { id: PayMethod; label: string; icon: React.ReactNode; desc: string }[] = [
    { id: "upi",  label: "Pay via UPI",        icon: <Smartphone size={18} strokeWidth={1.5} />, desc: "PhonePe, Google Pay, Paytm, BHIM" },
    { id: "card", label: "Debit / Credit Card", icon: <CreditCard size={18} strokeWidth={1.5} />, desc: "Visa, Mastercard, Rupay" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "var(--ink)", paddingTop: "72px" }}>
      <div style={{ borderBottom: "1px solid var(--line)", padding: "3.5rem 2.5rem 2.5rem" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <p className="t-label" style={{ marginBottom: "0.75rem" }}>Secure Checkout</p>
          <h1 className="t-heading" style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}>Payment</h1>
        </div>
      </div>

      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "3.5rem 2.5rem 6rem", display: "grid", gridTemplateColumns: "1fr 320px", gap: "4rem" }}>
        {/* Left — payment form */}
        <div>
          {/* Method selectors */}
          <p className="t-label" style={{ marginBottom: "1rem" }}>Choose payment method</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "1px", background: "var(--line)", marginBottom: "2.5rem" }}>
            {methodOptions.map((m) => (
              <button
                key={m.id}
                onClick={() => setMethod(m.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  padding: "1.25rem 1.5rem",
                  background: method === m.id ? "var(--ink-3)" : "var(--ink)",
                  border: "none",
                  borderLeft: method === m.id ? "2px solid var(--cream)" : "2px solid transparent",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 0.2s ease",
                }}
              >
                <div style={{ color: method === m.id ? "var(--cream)" : "var(--cream-faint)" }}>{m.icon}</div>
                <div>
                  <p style={{ fontFamily: "DM Sans, sans-serif", fontWeight: 400, fontSize: "0.85rem", color: method === m.id ? "var(--cream)" : "var(--cream-dim)", marginBottom: "0.2rem" }}>{m.label}</p>
                  <p className="t-label" style={{ fontSize: "0.62rem" }}>{m.desc}</p>
                </div>
              </button>
            ))}
          </div>

          {/* UPI form */}
          {method === "upi" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label className="t-label" style={{ display: "block", marginBottom: "0.5rem" }}>UPI ID</label>
                <input className="input-field" placeholder="yourname@upi" value={upiId} onChange={(e) => setUpiId(e.target.value)} />
              </div>
              <p className="t-body" style={{ fontSize: "0.76rem" }}>
                Enter your UPI ID (e.g. 9876543210@paytm). You'll receive a payment request on your UPI app.
              </p>
            </div>
          )}

          {/* Card form */}
          {method === "card" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label className="t-label" style={{ display: "block", marginBottom: "0.5rem" }}>Name on card</label>
                <input className="input-field" placeholder="Full name" value={cardName} onChange={(e) => setCardName(e.target.value)} />
              </div>
              <div>
                <label className="t-label" style={{ display: "block", marginBottom: "0.5rem" }}>Card number</label>
                <input className="input-field" placeholder="•••• •••• •••• ••••" value={cardNum}
                  onChange={(e) => setCardNum(e.target.value.replace(/\D/g, "").slice(0, 16))} maxLength={16} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label className="t-label" style={{ display: "block", marginBottom: "0.5rem" }}>Expiry</label>
                  <input className="input-field" placeholder="MM / YY" value={cardExp} onChange={(e) => setCardExp(e.target.value)} />
                </div>
                <div>
                  <label className="t-label" style={{ display: "block", marginBottom: "0.5rem" }}>CVV</label>
                  <input className="input-field" placeholder="•••" type="password" value={cardCvv} onChange={(e) => setCardCvv(e.target.value.slice(0, 4))} maxLength={4} />
                </div>
              </div>
            </div>
          )}

          {/* Security note */}
          <div style={{ marginTop: "2rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Lock size={12} style={{ color: "var(--cream-faint)" }} />
            <span className="t-label">256-bit SSL secured · Mock demo only</span>
          </div>
        </div>

        {/* Right — order summary */}
        <div style={{ background: "var(--ink-2)", border: "1px solid var(--line)", padding: "2rem", alignSelf: "start" }}>
          <h3 style={{ fontFamily: "Fraunces, serif", fontWeight: 200, fontSize: "1.1rem", color: "var(--cream)", marginBottom: "1.5rem", letterSpacing: "-0.01em" }}>
            Order Summary
          </h3>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1.5rem" }}>
            {state.cart.map((item) => (
              <div key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span style={{ fontSize: "1rem" }}>{item.emoji || "📦"}</span>
                  <span className="t-body" style={{ fontSize: "0.76rem" }}>{item.name}</span>
                </div>
                <span className="t-body" style={{ fontSize: "0.76rem", color: "var(--cream)", flexShrink: 0 }}>₹{item.price * item.qty}</span>
              </div>
            ))}
          </div>

          <div style={{ borderTop: "1px solid var(--line)", paddingTop: "1.25rem", marginBottom: "1.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
              <span className="t-body" style={{ fontSize: "0.78rem" }}>Subtotal</span>
              <span className="t-body" style={{ fontSize: "0.78rem", color: "var(--cream)" }}>₹{cartTotal}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span className="t-body" style={{ fontSize: "0.78rem" }}>Delivery</span>
              <span style={{ color: "var(--amber)", fontFamily: "DM Sans, sans-serif", fontWeight: 300, fontSize: "0.78rem" }}>Free</span>
            </div>
          </div>

          <div style={{ borderTop: "1px solid var(--line)", paddingTop: "1.25rem", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
            <span style={{ fontFamily: "Fraunces, serif", fontWeight: 200, fontSize: "1.05rem", color: "var(--cream)" }}>Total</span>
            <span className="t-price" style={{ fontSize: "1.5rem" }}>₹{cartTotal}</span>
          </div>

          <button
            className="btn-primary"
            style={{ width: "100%", justifyContent: "center", opacity: loading ? 0.7 : 1 }}
            onClick={handlePay}
            disabled={loading}
          >
            {loading ? "Processing…" : <>Pay ₹{cartTotal} <ArrowRight size={13} strokeWidth={2} /></>}
          </button>
        </div>
      </div>
    </div>
  );
}
