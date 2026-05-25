"use client";
import { useEffect, useState } from "react";

export default function Toast({ message, type = "success", onClose }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300);
    }, 2500);
    return () => clearTimeout(t);
  }, []);

  const colors = {
    success: { bg: "linear-gradient(135deg, #43e97b, #38f9d7)", icon: "✓" },
    error: { bg: "linear-gradient(135deg, #f5576c, #f093fb)", icon: "✕" },
    info: { bg: "linear-gradient(135deg, #667eea, #764ba2)", icon: "ℹ" },
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: "24px",
        right: "24px",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        gap: "10px",
        background: colors[type].bg,
        color: "#fff",
        borderRadius: "14px",
        padding: "12px 18px",
        fontSize: "14px",
        fontWeight: "600",
        boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
        animation: visible
          ? "toastIn 0.3s ease forwards"
          : "fadeIn 0.3s ease reverse forwards",
        transition: "opacity 0.3s",
      }}
    >
      <span
        style={{
          width: "22px",
          height: "22px",
          background: "rgba(255,255,255,0.25)",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "12px",
          flexShrink: 0,
        }}
      >
        {colors[type].icon}
      </span>
      {message}
    </div>
  );
}
