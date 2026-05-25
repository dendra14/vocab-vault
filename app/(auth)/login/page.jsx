"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setError("Email atau password salah.");
      setLoading(false);
      return;
    }
    router.push("/vault");
    router.refresh();
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #667eea 0%, #f093fb 50%, #4facfe 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      {/* Floating blobs */}
      <div
        style={{
          position: "fixed",
          top: "-10%",
          right: "-5%",
          width: "400px",
          height: "400px",
          background: "rgba(255,255,255,0.1)",
          borderRadius: "50%",
          filter: "blur(60px)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "fixed",
          bottom: "-10%",
          left: "-5%",
          width: "500px",
          height: "500px",
          background: "rgba(255,255,255,0.08)",
          borderRadius: "50%",
          filter: "blur(80px)",
          pointerEvents: "none",
        }}
      />

      <div
        className="scale-in"
        style={{
          width: "100%",
          maxWidth: "400px",
          background: "rgba(255,255,255,0.92)",
          backdropFilter: "blur(20px)",
          borderRadius: "24px",
          border: "1px solid rgba(255,255,255,0.6)",
          padding: "40px",
          boxShadow:
            "0 8px 40px rgba(0,0,0,0.12), 0 1px 0 rgba(255,255,255,0.8) inset",
        }}
      >
        {/* Logo */}
        <div style={{ marginBottom: "32px" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              marginBottom: "16px",
              background: "linear-gradient(135deg, #667eea, #f093fb)",
              borderRadius: "14px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 12px rgba(102,126,234,0.4)",
            }}
          >
            <span style={{ fontSize: "22px" }}>📖</span>
          </div>
          <h1
            style={{
              fontSize: "24px",
              fontWeight: "700",
              color: "#1a1a2e",
              margin: "0 0 4px",
            }}
          >
            VocabVault
          </h1>
          <p style={{ fontSize: "14px", color: "#888", margin: 0 }}>
            Masuk ke kamus pribadimu
          </p>
        </div>

        <form onSubmit={handleLogin}>
          {["Email", "Password"].map((label, i) => (
            <div key={label} style={{ marginBottom: "16px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "13px",
                  fontWeight: "600",
                  color: "#555",
                  marginBottom: "6px",
                }}
              >
                {label}
              </label>
              <input
                type={i === 1 ? "password" : "email"}
                value={i === 0 ? email : password}
                onChange={(e) =>
                  i === 0
                    ? setEmail(e.target.value)
                    : setPassword(e.target.value)
                }
                required
                placeholder={i === 0 ? "kamu@email.com" : "••••••••"}
                style={{
                  width: "100%",
                  padding: "11px 14px",
                  fontSize: "14px",
                  border: "2px solid #f0f0f5",
                  borderRadius: "12px",
                  background: "#fafafe",
                  color: "#1a1a2e",
                  boxSizing: "border-box",
                  transition: "border-color 0.2s, background 0.2s",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#667eea";
                  e.target.style.background = "#fff";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#f0f0f5";
                  e.target.style.background = "#fafafe";
                }}
              />
            </div>
          ))}

          {error && (
            <div
              className="fade-in"
              style={{
                background: "linear-gradient(135deg, #fff0f5, #fff5f0)",
                border: "1px solid #ffcdd6",
                borderRadius: "10px",
                padding: "10px 14px",
                fontSize: "13px",
                color: "#e53e3e",
                marginBottom: "16px",
              }}
            >
              ⚠️ {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-press"
            style={{
              width: "100%",
              padding: "13px",
              background: "linear-gradient(135deg, #667eea, #764ba2)",
              color: "#fff",
              border: "none",
              borderRadius: "12px",
              fontSize: "15px",
              fontWeight: "600",
              cursor: loading ? "not-allowed" : "pointer",
              boxShadow: "0 4px 15px rgba(102,126,234,0.4)",
              opacity: loading ? 0.7 : 1,
              marginTop: "4px",
            }}
          >
            {loading ? "⏳ Masuk..." : "Masuk →"}
          </button>
        </form>

        <p
          style={{
            fontSize: "13px",
            color: "#999",
            textAlign: "center",
            marginTop: "24px",
          }}
        >
          Belum punya akun?{" "}
          <Link
            href="/register"
            style={{
              color: "#667eea",
              fontWeight: "600",
              textDecoration: "none",
            }}
          >
            Daftar gratis
          </Link>
        </p>
      </div>
    </div>
  );
}
