// src/pages/HomePage.tsx
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { useApp } from "../context/AppContext";
import { PRODUCTS, SUBSCRIPTION_PLANS } from "../data/mockData";

interface Props { onNavigate: (page: string) => void; }

/* ── Marquee ticker ────────────────────────────────────────── */
function Ticker() {
  const items = ["Farm Fresh", "A2 Milk", "Daily Delivery", "Zero Preservatives", "Grass Fed", "Organic Certified", "Cold Chain", "No Additives"];
  const repeated = [...items, ...items];
  return (
    <div style={{ background: "var(--cream)", overflow: "hidden", padding: "0.9rem 0", borderTop: "1px solid var(--line-med)", borderBottom: "1px solid var(--line-med)" }}>
      <div className="marquee-track">
        {repeated.map((item, i) => (
          <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: "2.5rem", padding: "0 2.5rem", color: "var(--ink)", fontFamily: "DM Sans, sans-serif", fontWeight: 300, fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", whiteSpace: "nowrap" }}>
            {item}
            <span style={{ fontSize: "0.35rem", opacity: 0.4 }}>●</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ── Hero ──────────────────────────────────────────────────── */
function Hero({ onNavigate }: Props) {
  return (
    <section style={{ minHeight: "100svh", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "0", position: "relative", overflow: "hidden" }}>
      {/* Full-bleed background image */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
        <img
          src="https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=1800&q=85&fit=crop"
          alt="Fresh dairy farm"
          style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.45) saturate(0.7)" }}
        />
        {/* Gradient overlay bottom */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, var(--ink) 0%, var(--ink) 8%, rgba(13,12,10,0.4) 55%, transparent 100%)" }} />
      </div>

      {/* Top badge */}
      <div style={{ position: "absolute", top: "88px", left: "2.5rem", zIndex: 10 }}>
        <span className="t-label" style={{ color: "var(--cream-dim)" }}>Est. 2019 · Pune, India</span>
      </div>

      {/* Content */}
      <div style={{ position: "relative", zIndex: 10, maxWidth: "1400px", margin: "0 auto", width: "100%", padding: "0 2.5rem 5rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto", alignItems: "flex-end", gap: "2rem" }}>
          <div>
            <p className="t-label anim-fade-up" style={{ marginBottom: "1.5rem", color: "var(--cream-dim)" }}>
              Pure Dairy · Daily Delivery
            </p>
            <h1 className="t-display anim-fade-up anim-delay-1" style={{ fontSize: "clamp(3.5rem, 9vw, 8.5rem)", marginBottom: "0" }}>
              Farm Fresh
              <br />
              <em className="t-display-italic" style={{ color: "var(--cream-dim)" }}>to your door.</em>
            </h1>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem", alignItems: "flex-end", paddingBottom: "0.5rem" }} className="anim-fade-up anim-delay-2">
            <p className="t-body" style={{ maxWidth: "260px", textAlign: "right", fontSize: "0.82rem" }}>
              Organic dairy from certified farms. Delivered before sunrise, six days a week.
            </p>
            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", justifyContent: "flex-end" }}>
              <button className="btn-primary" onClick={() => onNavigate("plans")}>
                Start Subscription <ArrowRight size={13} strokeWidth={2} />
              </button>
              <button className="btn-ghost" onClick={() => onNavigate("shop")}>
                Browse Products
              </button>
            </div>
          </div>
        </div>

        {/* Bottom strip */}
        <div style={{ marginTop: "3.5rem", borderTop: "1px solid var(--line)", paddingTop: "1.5rem", display: "flex", gap: "3rem", flexWrap: "wrap" }}>
          {[
            { num: "6,200+", label: "Happy Families" },
            { num: "100%", label: "Organic Certified" },
            { num: "4 AM", label: "Daily Delivery" },
            { num: "48hrs", label: "Farm to Door" },
          ].map((s) => (
            <div key={s.label}>
              <p className="t-display" style={{ fontSize: "1.8rem", lineHeight: 1 }}>{s.num}</p>
              <p className="t-label" style={{ marginTop: "0.35rem" }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── About strip ───────────────────────────────────────────── */
function AboutStrip({ onNavigate }: Props) {
  return (
    <section style={{ padding: "8rem 2.5rem", maxWidth: "1400px", margin: "0 auto" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6rem", alignItems: "center" }}>
        {/* Left */}
        <div>
          <p className="t-label" style={{ marginBottom: "1.5rem" }}>Our Story</p>
          <h2 className="t-heading" style={{ fontSize: "clamp(2.2rem, 4vw, 3.8rem)", marginBottom: "2rem" }}>
            We believe dairy should taste like it came from a farm.
            <em style={{ fontStyle: "italic", color: "var(--cream-dim)" }}> Because it does.</em>
          </h2>
          <p className="t-body" style={{ marginBottom: "1.5rem" }}>
            Milkman was born from one simple frustration — store milk that tasted of nothing. We drove 4 hours to a farm in Nashik, tasted real milk, and never looked back.
          </p>
          <p className="t-body" style={{ marginBottom: "2.5rem" }}>
            Today we partner with 14 certified organic farms across Maharashtra and Rajasthan, maintaining an unbroken cold chain from milking to your doorstep.
          </p>
          <button className="btn-ghost" onClick={() => onNavigate("about")}>
            Our full story <ArrowUpRight size={13} />
          </button>
        </div>

        {/* Right — photo collage */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gridTemplateRows: "220px 220px", gap: "1rem" }}>
          {[
            { src: "https://images.unsplash.com/photo-1516912481808-3406841bd33c?w=600&q=80&fit=crop" },
            { src: "https://images.unsplash.com/photo-1595781556765-c0e9d8b7e61e?w=600&q=80&fit=crop" },
            { src: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&q=80&fit=crop" },
          ].map((p, idx) => (
            <div key={idx} style={{ borderRadius: "4px", overflow: "hidden", gridColumn: idx === 2 ? "2/3" : "auto", gridRow: idx === 2 ? "1/3" : "auto" }}>
              <img src={p.src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.75) saturate(0.8)", transition: "transform 0.5s ease", display: "block" }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Products grid ─────────────────────────────────────────── */
function ProductsSection({ onNavigate }: Props) {
  const { dispatch, state } = useApp();
  const featured = PRODUCTS.slice(0, 4);

  const addToCart = (product: typeof PRODUCTS[0]) => {
    if (!state.customer) {
      dispatch({ type: "OPEN_AUTH_MODAL", payload: "login" });
      return;
    }
    dispatch({
      type: "ADD_TO_CART",
      payload: { id: `product-${product.id}`, type: "product", name: product.name, price: product.price, qty: 1, emoji: product.emoji, productDetails: product },
    });
    dispatch({ type: "SET_NOTIFICATION", payload: { message: `${product.name} added to cart`, type: "success" } });
  };

  return (
    <section style={{ borderTop: "1px solid var(--line)", padding: "6rem 2.5rem" }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        {/* Header row */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "3.5rem" }}>
          <div>
            <p className="t-label" style={{ marginBottom: "0.75rem" }}>Products</p>
            <h2 className="t-heading" style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)" }}>
              This week's freshest
            </h2>
          </div>
          <button className="btn-ghost" onClick={() => onNavigate("shop")} style={{ marginBottom: "0.5rem" }}>
            All products <ArrowRight size={13} />
          </button>
        </div>

        {/* Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.5px", background: "var(--line)" }}>
          {featured.map((product) => (
            <div key={product.id} style={{ background: "var(--ink)", padding: "0" }}>
              {/* Image */}
              <div style={{ height: "240px", overflow: "hidden", position: "relative" }}>
                <img
                  src={product.image_url}
                  alt={product.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.7) saturate(0.75)", transition: "transform 0.6s ease, filter 0.6s ease", display: "block" }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.06)"; e.currentTarget.style.filter = "brightness(0.85) saturate(0.9)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.filter = "brightness(0.7) saturate(0.75)"; }}
                />
                {product.badge && (
                  <span style={{ position: "absolute", top: "1rem", left: "1rem", background: "var(--cream)", color: "var(--ink)", padding: "0.25rem 0.75rem", borderRadius: "999px", fontSize: "0.6rem", fontFamily: "DM Sans, sans-serif", fontWeight: 400, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                    {product.badge}
                  </span>
                )}
              </div>

              {/* Info */}
              <div style={{ padding: "1.5rem" }}>
                <p className="t-label" style={{ marginBottom: "0.4rem" }}>{product.category}</p>
                <h3 style={{ fontFamily: "Fraunces, serif", fontWeight: 200, fontSize: "1.2rem", color: "var(--cream)", letterSpacing: "-0.01em", marginBottom: "0.6rem", lineHeight: 1.2 }}>
                  {product.name}
                </h3>
                <p className="t-body" style={{ fontSize: "0.78rem", lineHeight: 1.6, marginBottom: "1.25rem", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                  {product.description}
                </p>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span className="t-price" style={{ fontSize: "1.4rem" }}>₹{product.price}</span>
                  <button className="btn-ghost" style={{ padding: "0.5rem 1.2rem", fontSize: "0.68rem" }} onClick={() => addToCart(product)}>
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Plans teaser ──────────────────────────────────────────── */
function PlansTeaser({ onNavigate }: Props) {
  return (
    <section style={{ padding: "6rem 2.5rem", background: "var(--ink-2)", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1px", background: "var(--line)" }}>
          {SUBSCRIPTION_PLANS.map((plan) => (
            <div key={plan.id} style={{ background: "var(--ink-2)", padding: "2.5rem 2rem", position: "relative", transition: "background 0.3s ease" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "var(--ink-3)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "var(--ink-2)")}
            >
              {plan.badge && (
                <span style={{ display: "inline-block", marginBottom: "1rem", color: "var(--amber)", fontFamily: "DM Sans, sans-serif", fontWeight: 300, fontSize: "0.62rem", letterSpacing: "0.18em", textTransform: "uppercase" }}>
                  ✦ {plan.badge}
                </span>
              )}
              <h3 className="t-heading" style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>{plan.name}</h3>
              <p className="t-body" style={{ fontSize: "0.8rem", marginBottom: "1.5rem" }}>{plan.description}</p>
              <div style={{ display: "flex", alignItems: "baseline", gap: "0.4rem", marginBottom: "1.5rem" }}>
                <span className="t-price" style={{ fontSize: "2.5rem" }}>₹{plan.price.toLocaleString()}</span>
                <span className="t-label">/month</span>
              </div>
              <div style={{ borderTop: "1px solid var(--line)", paddingTop: "1.5rem", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                {plan.features.slice(0, 4).map((f) => (
                  <div key={f} style={{ display: "flex", alignItems: "flex-start", gap: "0.6rem" }}>
                    <span style={{ color: "var(--cream-faint)", lineHeight: 1.5 }}>—</span>
                    <span className="t-body" style={{ fontSize: "0.78rem" }}>{f}</span>
                  </div>
                ))}
              </div>
              <button className="btn-primary" style={{ marginTop: "2rem", width: "100%" }} onClick={() => onNavigate("plans")}>
                Choose Plan
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Testimonials ──────────────────────────────────────────── */
function Testimonials() {
  const reviews = [
    { name: "Priya M.", location: "Mumbai", text: "The milk actually tastes like milk. My daughter asks for it every morning now. We've cancelled our supermarket subscription." },
    { name: "Arjun S.", location: "Pune", text: "Six months in. Never missed a delivery. The ghee alone is worth every rupee — absolutely authentic Bilona quality." },
    { name: "Kavita R.", location: "Bangalore", text: "I was sceptical about paying premium. After the first week, I was converted. The paneer is extraordinary fresh." },
  ];

  return (
    <section style={{ padding: "7rem 2.5rem", borderTop: "1px solid var(--line)" }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: "4rem" }}>
          <div>
            <p className="t-label" style={{ marginBottom: "0.75rem" }}>Reviews</p>
            <h2 className="t-heading" style={{ fontSize: "clamp(2rem, 3.5vw, 3rem)" }}>What our customers say</h2>
          </div>
          <p className="t-label">4.9 / 5 · 2,400+ reviews</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1px", background: "var(--line)" }}>
          {reviews.map((r, i) => (
            <div key={i} style={{ background: "var(--ink)", padding: "2.5rem 2rem" }}>
              <div style={{ display: "flex", gap: "2px", marginBottom: "1.5rem" }}>
                {Array(5).fill(0).map((_, j) => (
                  <span key={j} style={{ color: "var(--amber)", fontSize: "0.75rem" }}>★</span>
                ))}
              </div>
              <p style={{ fontFamily: "Fraunces, serif", fontWeight: 100, fontStyle: "italic", fontSize: "1.1rem", lineHeight: 1.6, color: "var(--cream)", letterSpacing: "-0.01em", marginBottom: "2rem" }}>
                "{r.text}"
              </p>
              <div style={{ borderTop: "1px solid var(--line)", paddingTop: "1.25rem" }}>
                <p style={{ fontFamily: "DM Sans, sans-serif", fontWeight: 400, fontSize: "0.82rem", color: "var(--cream)" }}>{r.name}</p>
                <p className="t-label" style={{ marginTop: "0.2rem" }}>{r.location}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Full-bleed CTA banner ─────────────────────────────────── */
function CTABanner({ onNavigate }: Props) {
  return (
    <section style={{ position: "relative", height: "520px", overflow: "hidden" }}>
      <img
        src="https://images.unsplash.com/photo-1569880153113-76e33fc52d5f?w=1800&q=80&fit=crop"
        alt="Farm cows"
        style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.35) saturate(0.6)" }}
      />
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "2.5rem" }}>
        <p className="t-label" style={{ marginBottom: "1.5rem" }}>Ready to start?</p>
        <h2 className="t-display" style={{ fontSize: "clamp(2.5rem, 6vw, 5.5rem)", marginBottom: "2.5rem", maxWidth: "700px" }}>
          Your first delivery,<br />
          <em className="t-display-italic">tomorrow morning.</em>
        </h2>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center" }}>
          <button className="btn-primary" onClick={() => onNavigate("plans")}>
            Subscribe Now <ArrowRight size={13} strokeWidth={2} />
          </button>
          <button className="btn-ghost" onClick={() => onNavigate("shop")}>
            Shop à la carte
          </button>
        </div>
      </div>
    </section>
  );
}

/* ── Page ──────────────────────────────────────────────────── */
export default function HomePage({ onNavigate }: Props) {
  return (
    <div style={{ background: "var(--ink)" }}>
      <Hero onNavigate={onNavigate} />
      <Ticker />
      <AboutStrip onNavigate={onNavigate} />
      <ProductsSection onNavigate={onNavigate} />
      <PlansTeaser onNavigate={onNavigate} />
      <Testimonials />
      <CTABanner onNavigate={onNavigate} />
    </div>
  );
}
