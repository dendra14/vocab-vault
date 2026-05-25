"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    if (password.length < 6) {
      setError("Password minimal 6 karakter.");
      setLoading(false);
      return;
    }
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    if (data?.user?.identities?.length === 0) {
      setError("Email sudah terdaftar.");
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
          "linear-gradient(135deg, #4facfe 0%, #f093fb 50%, #667eea 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      <div
        style={{
          position: "fixed",
          top: "-10%",
          left: "-5%",
          width: "400px",
          height: "400px",
          background: "rgba(255,255,255,0.1)",
          borderRadius: "50%",
          filter: "blur(60px)",
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
          boxShadow: "0 8px 40px rgba(0,0,0,0.12)",
        }}
      >
        <div style={{ marginBottom: "32px" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              marginBottom: "16px",
              background: "linear-gradient(135deg, #4facfe, #f093fb)",
              borderRadius: "14px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 12px rgba(79,172,254,0.4)",
            }}
          >
            <span style={{ fontSize: "22px" }}>✨</span>
          </div>
          <h1
            style={{
              fontSize: "24px",
              fontWeight: "700",
              color: "#1a1a2e",
              margin: "0 0 4px",
            }}
          >
            Buat Akun
          </h1>
          <p style={{ fontSize: "14px", color: "#888", margin: 0 }}>
            Mulai bangun kamus pribadimu
          </p>
        </div>

        <form onSubmit={handleRegister}>
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
                placeholder={i === 0 ? "kamu@email.com" : "min. 6 karakter"}
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
                  e.target.style.borderColor = "#4facfe";
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
                background: "#fff0f5",
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
              background: "linear-gradient(135deg, #4facfe, #764ba2)",
              color: "#fff",
              border: "none",
              borderRadius: "12px",
              fontSize: "15px",
              fontWeight: "600",
              cursor: loading ? "not-allowed" : "pointer",
              boxShadow: "0 4px 15px rgba(79,172,254,0.4)",
              opacity: loading ? 0.7 : 1,
              marginTop: "4px",
            }}
          >
            {loading ? "⏳ Mendaftar..." : "Buat Akun →"}
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
          Sudah punya akun?{" "}
          <Link
            href="/login"
            style={{
              color: "#4facfe",
              fontWeight: "600",
              textDecoration: "none",
            }}
          >
            Masuk
          </Link>
        </p>
      </div>
    </div>
  );
}
