// src/pages/ConfirmationPage.tsx
import { CheckCircle, ArrowRight, Package } from "lucide-react";

interface OrderDetails {
  orderId: string;
  items: { id: string; name: string; price: number; qty: number; emoji?: string; type: "product" | "subscription" }[];
  total: number;
  paymentMethod: string;
  customerName: string;
  date: string;
}

interface Props {
  onNavigate: (page: string) => void;
  orderDetails: OrderDetails | null;
}

export default function ConfirmationPage({ onNavigate, orderDetails }: Props) {
  if (!orderDetails) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--ink)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
        <p className="t-body">No order found.</p>
        <button className="btn-primary" style={{ marginTop: "1.5rem" }} onClick={() => onNavigate("home")}>Go Home</button>
      </div>
    );
  }

  const hasSub = orderDetails.items.some((i) => i.type === "subscription");
  const startDate = new Date();
  const endDate   = new Date();
  endDate.setMonth(endDate.getMonth() + 1);
  const fmt = (d: Date) => d.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

  return (
    <div style={{ minHeight: "100vh", background: "var(--ink)", paddingTop: "72px" }}>
      {/* Hero confirmation banner */}
      <div style={{ borderBottom: "1px solid var(--line)", padding: "5rem 2.5rem 4rem", textAlign: "center" }}>
        <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "64px", height: "64px", borderRadius: "50%", border: "1px solid var(--line-med)", marginBottom: "2rem" }}>
          <CheckCircle size={28} strokeWidth={1} style={{ color: "var(--amber)" }} />
        </div>
        <p className="t-label" style={{ marginBottom: "0.75rem" }}>Order Confirmed</p>
        <h1 className="t-display" style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)", marginBottom: "1rem" }}>
          Thank you,<br />
          <em className="t-display-italic">{orderDetails.customerName.split(" ")[0]}.</em>
        </h1>
        <p className="t-body" style={{ maxWidth: "420px", margin: "0 auto" }}>
          Your order <strong style={{ color: "var(--cream)", fontWeight: 400 }}>{orderDetails.orderId}</strong> is confirmed. {hasSub ? "Daily deliveries start tomorrow morning." : "Your products will be dispatched within 24 hours."}
        </p>
      </div>

      {/* Order details */}
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "4rem 2.5rem 6rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1px", background: "var(--line)", marginBottom: "4rem" }}>
          {[
            { label: "Order ID",        value: orderDetails.orderId },
            { label: "Payment Method",  value: orderDetails.paymentMethod },
            { label: "Order Date",      value: orderDetails.date },
            { label: "Total Paid",      value: `₹${orderDetails.total}` },
          ].map((d) => (
            <div key={d.label} style={{ background: "var(--ink)", padding: "1.5rem" }}>
              <p className="t-label" style={{ marginBottom: "0.4rem" }}>{d.label}</p>
              <p style={{ fontFamily: "Fraunces, serif", fontWeight: 200, fontSize: "1.05rem", color: "var(--cream)", letterSpacing: "-0.01em" }}>{d.value}</p>
            </div>
          ))}
        </div>

        {/* Items */}
        <p className="t-label" style={{ marginBottom: "1rem" }}>Items ordered</p>
        <div style={{ display: "flex", flexDirection: "column", gap: "1px", background: "var(--line)", marginBottom: "3rem" }}>
          {orderDetails.items.map((item) => (
            <div key={item.id} style={{ background: "var(--ink)", padding: "1.25rem 1.5rem", display: "flex", alignItems: "center", gap: "1.25rem", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <span style={{ fontSize: "1.5rem" }}>{item.emoji || "📦"}</span>
                <div>
                  <p style={{ fontFamily: "Fraunces, serif", fontWeight: 200, fontSize: "0.95rem", color: "var(--cream)", letterSpacing: "-0.01em" }}>{item.name}</p>
                  <p className="t-label" style={{ marginTop: "0.2rem" }}>{item.type}</p>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <p className="t-price" style={{ fontSize: "1.05rem" }}>₹{item.price * item.qty}</p>
                {item.qty > 1 && <p className="t-label" style={{ marginTop: "0.15rem" }}>×{item.qty}</p>}
              </div>
            </div>
          ))}
        </div>

        {/* Subscription window */}
        {hasSub && (
          <div style={{ background: "var(--ink-2)", border: "1px solid var(--line)", padding: "2rem", marginBottom: "3rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem" }}>
              <Package size={16} strokeWidth={1.5} style={{ color: "var(--amber)" }} />
              <h3 style={{ fontFamily: "Fraunces, serif", fontWeight: 200, fontSize: "1.05rem", color: "var(--cream)", letterSpacing: "-0.01em" }}>
                Subscription Period
              </h3>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div>
                <p className="t-label" style={{ marginBottom: "0.3rem" }}>Starts</p>
                <p style={{ fontFamily: "DM Sans, sans-serif", fontWeight: 300, fontSize: "0.88rem", color: "var(--cream)" }}>{fmt(startDate)}</p>
              </div>
              <div>
                <p className="t-label" style={{ marginBottom: "0.3rem" }}>Renews / Ends</p>
                <p style={{ fontFamily: "DM Sans, sans-serif", fontWeight: 300, fontSize: "0.88rem", color: "var(--cream)" }}>{fmt(endDate)}</p>
              </div>
            </div>
            <p className="t-body" style={{ fontSize: "0.76rem", marginTop: "1.25rem" }}>
              Deliveries arrive between 4–7 AM daily. You'll receive an SMS confirmation each morning.
            </p>
          </div>
        )}

        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          <button className="btn-primary" onClick={() => onNavigate("home")}>
            Back to Home <ArrowRight size={13} strokeWidth={2} />
          </button>
          <button className="btn-ghost" onClick={() => onNavigate("shop")}>
            Shop More
          </button>
        </div>
      </div>
    </div>
  );
}
