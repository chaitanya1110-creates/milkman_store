// src/components/AuthModal.tsx
import { useState } from "react";
import { X, Eye, EyeOff } from "lucide-react";
import { useApp } from "../context/AppContext";

export default function AuthModal() {
  const { state, dispatch } = useApp();
  const [name, setName]       = useState("");
  const [email, setEmail]     = useState("");
  const [phone, setPhone]     = useState("");
  const [password, setPass]   = useState("");
  const [showPass, setShowP]  = useState(false);
  const [loading, setLoading] = useState(false);

  if (!state.isAuthModalOpen) return null;

  const isLogin = state.authMode === "login";

  const handleSubmit = async () => {
    if (!email || !password || (!isLogin && !name)) {
      dispatch({ type: "SET_NOTIFICATION", payload: { message: "Please fill all required fields", type: "error" } });
      return;
    }
    setLoading(true);
    
    try {
      const endpoint = isLogin ? "/api/customers/login/" : "/api/customers/register/";
      const payload = isLogin 
        ? { email, password } 
        : { name, email, phone: phone || "", password };

      const res = await fetch(`http://127.0.0.1:8000${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        dispatch({
          type: "SET_CUSTOMER",
          payload: {
            customer: data.customer,
            token: data.token,
          },
        });
        localStorage.setItem("milkman_token", data.token);
        localStorage.setItem("milkman_customer", JSON.stringify(data.customer));
        dispatch({ type: "CLOSE_AUTH_MODAL" });
        dispatch({ type: "SET_NOTIFICATION", payload: { message: isLogin ? "Welcome back!" : `Welcome, ${data.customer.name}!`, type: "success" } });
      } else {
        // Collect field-specific errors if available
        let errorMsg = data.error || data.non_field_errors?.[0];
        
        if (!errorMsg) {
          const fieldErrors = Object.entries(data)
            .filter(([key]) => key !== "error" && key !== "non_field_errors")
            .map(([key, val]) => {
              const msg = Array.isArray(val) ? val[0] : val;
              return `${key}: ${msg}`;
            });
          
          if (fieldErrors.length > 0) {
            errorMsg = fieldErrors.join(" | ");
          }
        }
        
        errorMsg = errorMsg || "Authentication failed";
        dispatch({ type: "SET_NOTIFICATION", payload: { message: errorMsg, type: "error" } });
      }
    } catch (err) {
      dispatch({ type: "SET_NOTIFICATION", payload: { message: "Connection error. Is the backend running?", type: "error" } });
    } finally {
      setLoading(false);
    }
  };

  const toggle = () => dispatch({ type: "OPEN_AUTH_MODAL", payload: isLogin ? "register" : "login" });

  return (
    <div
      style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem", background: "rgba(13,12,10,0.88)", backdropFilter: "blur(12px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) dispatch({ type: "CLOSE_AUTH_MODAL" }); }}
    >
      <div style={{ background: "var(--ink-2)", border: "1px solid var(--line-med)", width: "100%", maxWidth: "420px", padding: "2.5rem", position: "relative" }} className="anim-fade-up">
        {/* Close */}
        <button
          onClick={() => dispatch({ type: "CLOSE_AUTH_MODAL" })}
          className="btn-icon"
          style={{ position: "absolute", top: "1.25rem", right: "1.25rem", width: "32px", height: "32px" }}
        >
          <X size={14} />
        </button>

        {/* Header */}
        <div style={{ marginBottom: "2rem" }}>
          <p className="t-label" style={{ marginBottom: "0.5rem" }}>{isLogin ? "Welcome back" : "Create account"}</p>
          <h2 className="t-heading" style={{ fontSize: "1.8rem" }}>
            {isLogin ? "Sign In" : "Join Milkman"}
          </h2>
        </div>

        {/* Fields */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "1.5rem" }}>
          {!isLogin && (
            <div>
              <label className="t-label" style={{ display: "block", marginBottom: "0.4rem" }}>Full Name</label>
              <input className="input-field" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
          )}
          <div>
            <label className="t-label" style={{ display: "block", marginBottom: "0.4rem" }}>Email</label>
            <input className="input-field" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          {!isLogin && (
            <div>
              <label className="t-label" style={{ display: "block", marginBottom: "0.4rem" }}>Phone (optional)</label>
              <input className="input-field" type="tel" placeholder="+91 98765 43210" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
          )}
          <div>
            <label className="t-label" style={{ display: "block", marginBottom: "0.4rem" }}>Password</label>
            <div style={{ position: "relative" }}>
              <input
                className="input-field"
                type={showPass ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPass(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                style={{ paddingRight: "3rem" }}
              />
              <button
                onClick={() => setShowP(!showPass)}
                style={{ position: "absolute", right: "1rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--cream-faint)" }}
              >
                {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>
        </div>

        <button
          className="btn-primary"
          style={{ width: "100%", justifyContent: "center", opacity: loading ? 0.7 : 1, marginBottom: "1.25rem" }}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Please wait…" : isLogin ? "Sign In" : "Create Account"}
        </button>

        <div style={{ borderTop: "1px solid var(--line)", paddingTop: "1.25rem", textAlign: "center" }}>
          <span className="t-body" style={{ fontSize: "0.78rem" }}>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
          </span>
          <button onClick={toggle} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--cream)", fontFamily: "DM Sans, sans-serif", fontWeight: 400, fontSize: "0.78rem", textDecoration: "underline" }}>
            {isLogin ? "Register" : "Sign In"}
          </button>
        </div>
      </div>
    </div>
  );
}
