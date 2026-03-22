// src/components/Notification.tsx
import { useEffect } from "react";
import { CheckCircle, XCircle, Info, X } from "lucide-react";
import { useApp } from "../context/AppContext";

export default function Notification() {
  const { state, dispatch } = useApp();

  useEffect(() => {
    if (!state.notification) return;
    const t = setTimeout(() => dispatch({ type: "CLEAR_NOTIFICATION" }), 3500);
    return () => clearTimeout(t);
  }, [state.notification, dispatch]);

  if (!state.notification) return null;

  const { message, type } = state.notification;

  const iconMap = {
    success: <CheckCircle size={15} strokeWidth={1.5} />,
    error:   <XCircle    size={15} strokeWidth={1.5} />,
    info:    <Info       size={15} strokeWidth={1.5} />,
  };

  const colorMap = {
    success: "var(--amber)",
    error:   "#ef4444",
    info:    "var(--cream-dim)",
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: "2rem",
        right: "2rem",
        zIndex: 300,
        background: "var(--ink-3)",
        border: `1px solid ${colorMap[type]}30`,
        borderLeft: `2px solid ${colorMap[type]}`,
        padding: "1rem 1.25rem",
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
        maxWidth: "320px",
        minWidth: "240px",
      }}
      className="anim-fade-up"
    >
      <span style={{ color: colorMap[type], flexShrink: 0 }}>{iconMap[type]}</span>
      <p style={{ fontFamily: "DM Sans, sans-serif", fontWeight: 300, fontSize: "0.82rem", color: "var(--cream)", flex: 1, lineHeight: 1.4 }}>
        {message}
      </p>
      <button onClick={() => dispatch({ type: "CLEAR_NOTIFICATION" })}
        style={{ background: "none", border: "none", cursor: "pointer", color: "var(--cream-faint)", flexShrink: 0 }}>
        <X size={13} />
      </button>
    </div>
  );
}
