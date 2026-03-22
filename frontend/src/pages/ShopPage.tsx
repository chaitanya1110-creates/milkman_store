// src/pages/ShopPage.tsx
import { useState } from "react";
import { Search } from "lucide-react";
import { useApp } from "../context/AppContext";
import { PRODUCTS } from "../data/mockData";

interface Props { onNavigate: (page: string) => void; }

const CATEGORIES = ["All", "milk", "butter", "yogurt", "cheese", "ghee", "cream"];

export default function ShopPage({ onNavigate: _onNavigate }: Props) {
  const { dispatch, state } = useApp();
  const [search, setSearch]     = useState("");
  const [category, setCategory] = useState("All");

  const filtered = PRODUCTS.filter((p) => {
    const matchCat  = category === "All" || p.category === category;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const addToCart = (product: typeof PRODUCTS[0]) => {
    if (!state.customer) {
      dispatch({ type: "OPEN_AUTH_MODAL", payload: "login" });
      return;
    }
    dispatch({
      type: "ADD_TO_CART",
      payload: { id: `product-${product.id}`, type: "product", name: product.name, price: product.price, qty: 1, emoji: product.emoji, productDetails: product },
    });
    dispatch({ type: "SET_NOTIFICATION", payload: { message: `${product.name} added`, type: "success" } });
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--ink)", paddingTop: "72px" }}>
      {/* Page header */}
      <div style={{ borderBottom: "1px solid var(--line)", padding: "4rem 2.5rem 3rem" }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
          <p className="t-label" style={{ marginBottom: "0.75rem" }}>Our Products</p>
          <h1 className="t-heading" style={{ fontSize: "clamp(2.5rem, 5vw, 4.5rem)", marginBottom: "2.5rem" }}>
            Everything fresh,<br /><em style={{ fontStyle: "italic", color: "var(--cream-dim)" }}>nothing added.</em>
          </h1>

          {/* Controls */}
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
            {/* Search */}
            <div style={{ position: "relative", flex: "1", maxWidth: "340px" }}>
              <Search size={14} style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "var(--cream-faint)" }} />
              <input
                className="input-field"
                style={{ paddingLeft: "2.5rem" }}
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Category filters */}
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  style={{
                    padding: "0.5rem 1.1rem",
                    borderRadius: "999px",
                    border: `1px solid ${category === cat ? "var(--cream)" : "var(--line-med)"}`,
                    background: category === cat ? "var(--cream)" : "transparent",
                    color: category === cat ? "var(--ink)" : "var(--cream-dim)",
                    fontFamily: "DM Sans, sans-serif",
                    fontWeight: 300,
                    fontSize: "0.7rem",
                    letterSpacing: "0.1em",
                    textTransform: "capitalize",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 2.5rem 6rem" }}>
        <div style={{ marginTop: "3rem", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "1px", background: "var(--line)" }}>
          {filtered.map((product) => (
            <div key={product.id} style={{ background: "var(--ink)", position: "relative", display: "flex", flexDirection: "column" }}>
              {/* Image */}
              <div style={{ height: "220px", overflow: "hidden", position: "relative" }}>
                <img
                  src={product.image_url}
                  alt={product.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.65) saturate(0.75)", transition: "transform 0.6s ease, filter 0.6s ease", display: "block" }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.07)"; e.currentTarget.style.filter = "brightness(0.8) saturate(0.9)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.filter = "brightness(0.65) saturate(0.75)"; }}
                />
                {product.badge && (
                  <span style={{ position: "absolute", top: "0.75rem", left: "0.75rem", background: "var(--cream)", color: "var(--ink)", padding: "0.2rem 0.65rem", borderRadius: "999px", fontSize: "0.58rem", fontFamily: "DM Sans, sans-serif", fontWeight: 400, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                    {product.badge}
                  </span>
                )}
              </div>

              {/* Info */}
              <div style={{ padding: "1.25rem 1.25rem 1.5rem", flex: 1, display: "flex", flexDirection: "column" }}>
                <p className="t-label" style={{ marginBottom: "0.3rem" }}>{product.category}</p>
                <h3 style={{ fontFamily: "Fraunces, serif", fontWeight: 200, fontSize: "1.1rem", color: "var(--cream)", letterSpacing: "-0.01em", marginBottom: "0.5rem", lineHeight: 1.25 }}>
                  {product.name}
                </h3>
                <p className="t-body" style={{ fontSize: "0.76rem", lineHeight: 1.65, marginBottom: "1.25rem", flex: 1, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                  {product.description}
                </p>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto" }}>
                  <span className="t-price" style={{ fontSize: "1.3rem" }}>₹{product.price}</span>
                  <button className="btn-ghost" style={{ padding: "0.45rem 1.1rem", fontSize: "0.65rem" }} onClick={() => addToCart(product)}>
                    + Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "6rem 0" }}>
            <p className="t-label" style={{ marginBottom: "0.5rem" }}>No results</p>
            <p className="t-body">Try a different search or category.</p>
          </div>
        )}
      </div>
    </div>
  );
}
