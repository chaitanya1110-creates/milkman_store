// src/components/Navbar.tsx
import { useState, useEffect } from "react";
import { ShoppingCart, User, LogOut, Menu, X } from "lucide-react";
import { useApp } from "../context/AppContext";

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export default function Navbar({ currentPage, onNavigate }: NavbarProps) {
  const { state, dispatch, cartCount } = useApp();
  const [scrolled, setScrolled]       = useState(false);
  const [mobileOpen, setMobileOpen]   = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const nav = [
    { id: "home",  label: "Home"  },
    { id: "shop",  label: "Shop"  },
    { id: "plans", label: "Plans" },
    { id: "about", label: "About" },
  ];

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
    onNavigate("home");
    setMobileOpen(false);
  };

  return (
    <>
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          background: scrolled ? "rgba(13,12,10,0.96)" : "transparent",
          backdropFilter: scrolled ? "blur(20px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "1px solid transparent",
          transition: "all 0.4s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 2.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", height: "72px" }}>

          {/* Logo */}
          <button
            onClick={() => onNavigate("home")}
            style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.6rem" }}
          >
            {/* Minimal milk drop logo */}
            <svg width="24" height="28" viewBox="0 0 24 28" fill="none">
              <path d="M12 2C12 2 4 10 4 17a8 8 0 0016 0C20 10 12 2 12 2z" fill="var(--cream)" fillOpacity="0.9"/>
              <path d="M9 18a3 3 0 006 0" stroke="var(--ink)" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <span style={{ fontFamily: "Fraunces, serif", fontWeight: 200, fontSize: "1.35rem", color: "var(--cream)", letterSpacing: "-0.02em" }}>
              Milkman
            </span>
          </button>

          {/* Desktop nav */}
          <div style={{ display: "flex", alignItems: "center", gap: "2.5rem" }} className="hidden md:flex">
            {nav.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`nav-link ${currentPage === item.id ? "active" : ""}`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Right actions */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            {/* Cart */}
            <button
              onClick={() => onNavigate("cart")}
              className="btn-icon"
              style={{ position: "relative" }}
            >
              <ShoppingCart size={16} strokeWidth={1.5} />
              {cartCount > 0 && (
                <span style={{
                  position: "absolute",
                  top: "-4px",
                  right: "-4px",
                  background: "var(--cream)",
                  color: "var(--ink)",
                  borderRadius: "50%",
                  width: "17px",
                  height: "17px",
                  fontSize: "0.6rem",
                  fontWeight: 500,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                  {cartCount}
                </span>
              )}
            </button>

            {state.customer ? (
              <>
                <button className="btn-icon" title={state.customer.name}>
                  <User size={16} strokeWidth={1.5} />
                </button>
                <button className="btn-icon" onClick={handleLogout} title="Sign out">
                  <LogOut size={16} strokeWidth={1.5} />
                </button>
              </>
            ) : (
              <button
                className="btn-primary hidden md:inline-flex"
                style={{ padding: "0.6rem 1.4rem", fontSize: "0.7rem" }}
                onClick={() => dispatch({ type: "OPEN_AUTH_MODAL", payload: "login" })}
              >
                Sign In
              </button>
            )}

            {/* Mobile menu toggle */}
            <button className="btn-icon md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 90,
            background: "var(--ink)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "2.5rem",
          }}
          className="anim-fade-in"
        >
          {nav.map((item, i) => (
            <button
              key={item.id}
              onClick={() => { onNavigate(item.id); setMobileOpen(false); }}
              className={`anim-fade-up anim-delay-${i + 1}`}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontFamily: "Fraunces, serif",
                fontWeight: 100,
                fontSize: "3rem",
                color: currentPage === item.id ? "var(--cream)" : "var(--cream-faint)",
                letterSpacing: "-0.02em",
              }}
            >
              {item.label}
            </button>
          ))}
          <div className="divider" style={{ width: "120px" }} />
          {state.customer ? (
            <button className="btn-ghost anim-fade-up anim-delay-4" onClick={handleLogout}>
              Sign Out
            </button>
          ) : (
            <button
              className="btn-primary anim-fade-up anim-delay-4"
              onClick={() => { dispatch({ type: "OPEN_AUTH_MODAL", payload: "login" }); setMobileOpen(false); }}
            >
              Sign In
            </button>
          )}
        </div>
      )}
    </>
  );
}
