// src/App.tsx — Milkman Root Application
import { useState, useEffect } from "react";
import { AppProvider } from "./context/AppContext";
import Navbar from "./components/Navbar";
import AuthModal from "./components/AuthModal";
import Notification from "./components/Notification";
import HomePage from "./pages/HomePage";
import ShopPage from "./pages/ShopPage";
import PlansPage from "./pages/PlansPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import ConfirmationPage from "./pages/ConfirmationPage";
import AboutPage from "./pages/AboutPage";

type Page = "home" | "shop" | "plans" | "cart" | "checkout" | "confirmation" | "about";

interface OrderDetails {
  orderId: string;
  items: { id: string; name: string; price: number; qty: number; emoji?: string; type: "product" | "subscription" }[];
  total: number;
  paymentMethod: string;
  customerName: string;
  date: string;
}

/* ── Footer ─────────────────────────────────────────────────── */
function Footer({ onNavigate }: { onNavigate: (p: string) => void }) {
  return (
    <footer style={{ background: "var(--ink-2)", borderTop: "1px solid var(--line)" }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "5rem 2.5rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: "4rem", marginBottom: "4rem" }}>
          {/* Brand */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1.25rem" }}>
              <svg width="20" height="24" viewBox="0 0 24 28" fill="none">
                <path d="M12 2C12 2 4 10 4 17a8 8 0 0016 0C20 10 12 2 12 2z" fill="var(--cream)" fillOpacity="0.8"/>
              </svg>
              <span style={{ fontFamily: "Fraunces, serif", fontWeight: 200, fontSize: "1.25rem", color: "var(--cream)", letterSpacing: "-0.02em" }}>Milkman</span>
            </div>
            <p className="t-body" style={{ fontSize: "0.78rem", maxWidth: "240px", marginBottom: "1.5rem" }}>
              Premium organic dairy delivered to your doorstep every morning. Farm-fresh. Honest. Always.
            </p>
            <p className="t-label">FSSAI Lic. No. 10019022000123</p>
          </div>

          {/* Explore */}
          <div>
            <p className="t-label" style={{ marginBottom: "1.25rem" }}>Explore</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {["home", "shop", "plans", "about"].map((p) => (
                <button key={p} onClick={() => onNavigate(p)}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "var(--cream-dim)", fontFamily: "DM Sans, sans-serif", fontWeight: 300, fontSize: "0.8rem", letterSpacing: "0.04em", textTransform: "capitalize", textAlign: "left", transition: "color 0.2s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "var(--cream)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "var(--cream-dim)")}
                >
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <p className="t-label" style={{ marginBottom: "1.25rem" }}>Contact</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {["hello@milkman.in", "1800-MILKMAN", "Mon–Sat, 6am–6pm"].map((c) => (
                <span key={c} className="t-body" style={{ fontSize: "0.78rem" }}>{c}</span>
              ))}
            </div>
          </div>

          {/* Social */}
          <div>
            <p className="t-label" style={{ marginBottom: "1.25rem" }}>Follow</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {["Instagram", "Twitter / X", "LinkedIn"].map((s) => (
                <span key={s} className="t-body" style={{ fontSize: "0.78rem", cursor: "pointer" }}>{s}</span>
              ))}
            </div>
          </div>
        </div>

        <div style={{ borderTop: "1px solid var(--line)", paddingTop: "2rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          <p className="t-label">© 2025 Milkman Dairy Pvt. Ltd. All rights reserved.</p>
          <p className="t-label">Certified Organic · Cold Chain Assured</p>
        </div>
      </div>
    </footer>
  );
}

/* ── App Inner ──────────────────────────────────────────────── */
function AppInner() {
  const [currentPage, setCurrentPage]   = useState<Page>("home");
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  const navigate = (page: string) => setCurrentPage(page as Page);

  const handleOrderComplete = (details: OrderDetails) => {
    setOrderDetails(details);
    setCurrentPage("confirmation");
  };

  const renderPage = () => {
    switch (currentPage) {
      case "home":         return <HomePage onNavigate={navigate} />;
      case "shop":         return <ShopPage onNavigate={navigate} />;
      case "plans":        return <PlansPage onNavigate={navigate} />;
      case "cart":         return <CartPage onNavigate={navigate} />;
      case "checkout":     return <CheckoutPage onNavigate={navigate} onOrderComplete={handleOrderComplete} />;
      case "confirmation": return <ConfirmationPage orderDetails={orderDetails} onNavigate={navigate} />;
      case "about":        return <AboutPage onNavigate={navigate} />;
      default:             return <HomePage onNavigate={navigate} />;
    }
  };

  const showFooter = !["checkout", "confirmation"].includes(currentPage);

  return (
    <div style={{ background: "var(--ink)", minHeight: "100vh" }}>
      <Navbar currentPage={currentPage} onNavigate={navigate} />
      <AuthModal />
      <Notification />
      <div key={currentPage} className="anim-fade-in">{renderPage()}</div>
      {showFooter && <Footer onNavigate={navigate} />}
    </div>
  );
}

/* ── Root ───────────────────────────────────────────────────── */
export default function App() {
  return (
    <AppProvider>
      <AppInner />
    </AppProvider>
  );
}
