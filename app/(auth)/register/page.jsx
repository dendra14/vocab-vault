"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showPass, setShowPass] = useState(false);

  useEffect(() => {
    setTimeout(() => setMounted(true), 50);
  }, []);

  async function handleRegister(e) {
    e.preventDefault();
    if (password.length < 6) {
      setError("Password minimal 6 karakter.");
      return;
    }
    setLoading(true);
    setError("");
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
    window.location.href = "/vault";
  }

  const inputBase = {
    width: "100%",
    padding: "12px 14px",
    fontSize: "14px",
    border: "1.5px solid rgba(255,255,255,0.1)",
    borderRadius: "12px",
    background: "rgba(255,255,255,0.06)",
    color: "#f0f0ff",
    boxSizing: "border-box",
    fontFamily: "inherit",
    transition: "border-color 0.2s, background 0.2s, box-shadow 0.2s",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#080810",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background orbs */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-10%",
            left: "-8%",
            width: "clamp(250px,45vw,480px)",
            height: "clamp(250px,45vw,480px)",
            background:
              "radial-gradient(circle, rgba(6,214,214,0.18) 0%, transparent 65%)",
            borderRadius: "50%",
            animation: "orbFloat2 14s ease-in-out infinite",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-10%",
            right: "-8%",
            width: "clamp(200px,38vw,420px)",
            height: "clamp(200px,38vw,420px)",
            background:
              "radial-gradient(circle, rgba(124,109,250,0.15) 0%, transparent 65%)",
            borderRadius: "50%",
            animation: "orbFloat1 17s ease-in-out infinite",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "40%",
            left: "50%",
            width: "clamp(150px,28vw,280px)",
            height: "clamp(150px,28vw,280px)",
            background:
              "radial-gradient(circle, rgba(240,147,251,0.1) 0%, transparent 65%)",
            borderRadius: "50%",
            animation: "orbFloat3 20s ease-in-out infinite",
          }}
        />
      </div>

      {/* Card */}
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          position: "relative",
          zIndex: 1,
          opacity: mounted ? 1 : 0,
          transform: mounted
            ? "translateY(0) scale(1)"
            : "translateY(20px) scale(0.98)",
          transition:
            "opacity 0.5s cubic-bezier(0.16,1,0.3,1), transform 0.5s cubic-bezier(0.16,1,0.3,1)",
        }}
      >
        <div
          style={{
            padding: "1px",
            background:
              "linear-gradient(135deg, rgba(6,214,214,0.4), rgba(124,109,250,0.3), rgba(240,147,251,0.2))",
            borderRadius: "24px",
          }}
        >
          <div
            style={{
              background: "rgba(13,13,24,0.95)",
              borderRadius: "23px",
              padding: "clamp(28px,5vw,40px)",
            }}
          >
            {/* Logo */}
            <div style={{ marginBottom: "32px" }}>
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  background: "linear-gradient(135deg, #06d6d6, #7c6dfa)",
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontWeight: "800",
                  fontSize: "20px",
                  marginBottom: "16px",
                  boxShadow: "0 4px 20px rgba(6,214,214,0.35)",
                }}
              >
                V
              </div>
              <h1
                style={{
                  fontSize: "clamp(20px,4vw,24px)",
                  fontWeight: "800",
                  color: "#f0f0ff",
                  margin: "0 0 6px",
                  letterSpacing: "-0.02em",
                }}
              >
                Buat akun baru
              </h1>
              <p
                style={{
                  fontSize: "14px",
                  color: "rgba(240,240,255,0.45)",
                  margin: 0,
                }}
              >
                Mulai bangun kamus pribadimu
              </p>
            </div>

            <form
              onSubmit={handleRegister}
              style={{ display: "flex", flexDirection: "column", gap: "14px" }}
            >
              {/* Email */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "13px",
                    fontWeight: "600",
                    color: "rgba(240,240,255,0.7)",
                    marginBottom: "7px",
                  }}
                >
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="kamu@email.com"
                  style={inputBase}
                  onFocus={(e) => {
                    e.target.style.borderColor = "rgba(6,214,214,0.5)";
                    e.target.style.background = "rgba(255,255,255,0.08)";
                    e.target.style.boxShadow = "0 0 0 3px rgba(6,214,214,0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "rgba(255,255,255,0.1)";
                    e.target.style.background = "rgba(255,255,255,0.06)";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>

              {/* Password */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "13px",
                    fontWeight: "600",
                    color: "rgba(240,240,255,0.7)",
                    marginBottom: "7px",
                  }}
                >
                  Password
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showPass ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="min. 6 karakter"
                    style={{ ...inputBase, paddingRight: "44px" }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "rgba(6,214,214,0.5)";
                      e.target.style.background = "rgba(255,255,255,0.08)";
                      e.target.style.boxShadow =
                        "0 0 0 3px rgba(6,214,214,0.1)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "rgba(255,255,255,0.1)";
                      e.target.style.background = "rgba(255,255,255,0.06)";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    style={{
                      position: "absolute",
                      right: "12px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      color: "rgba(240,240,255,0.35)",
                      cursor: "pointer",
                      fontSize: "16px",
                      padding: "4px",
                      transition: "color 0.15s",
                    }}
                  >
                    {showPass ? "🙈" : "👁"}
                  </button>
                </div>
                <p
                  style={{
                    fontSize: "12px",
                    color: "rgba(240,240,255,0.3)",
                    margin: "6px 0 0",
                  }}
                >
                  Minimal 6 karakter
                </p>
              </div>

              {/* Error */}
              {error && (
                <div
                  className="fade-in"
                  style={{
                    background: "rgba(239,68,68,0.1)",
                    border: "1px solid rgba(239,68,68,0.25)",
                    borderRadius: "10px",
                    padding: "10px 13px",
                    fontSize: "13px",
                    color: "#fca5a5",
                  }}
                >
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="btn-press"
                style={{
                  width: "100%",
                  padding: "13px",
                  marginTop: "4px",
                  background: loading
                    ? "rgba(6,214,214,0.3)"
                    : "linear-gradient(135deg, #06d6d6, #7c6dfa)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "12px",
                  fontSize: "14px",
                  fontWeight: "700",
                  cursor: loading ? "not-allowed" : "pointer",
                  boxShadow: loading
                    ? "none"
                    : "0 4px 20px rgba(6,214,214,0.35)",
                  transition: "all 0.2s",
                  letterSpacing: "0.01em",
                }}
              >
                {loading ? "Mendaftar..." : "Buat Akun →"}
              </button>
            </form>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                margin: "24px 0",
              }}
            >
              <div
                style={{
                  flex: 1,
                  height: "1px",
                  background: "rgba(255,255,255,0.07)",
                }}
              />
              <span
                style={{ fontSize: "12px", color: "rgba(240,240,255,0.3)" }}
              >
                atau
              </span>
              <div
                style={{
                  flex: 1,
                  height: "1px",
                  background: "rgba(255,255,255,0.07)",
                }}
              />
            </div>

            <p
              style={{
                fontSize: "13px",
                color: "rgba(240,240,255,0.4)",
                textAlign: "center",
                margin: 0,
              }}
            >
              Sudah punya akun?{" "}
              <Link
                href="/login"
                style={{
                  color: "#06d6d6",
                  fontWeight: "700",
                  textDecoration: "none",
                }}
              >
                Masuk
              </Link>
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes orbFloat1 {
          0%,100% { transform: translate(0,0) scale(1); }
          33% { transform: translate(-20px,15px) scale(1.04); }
          66% { transform: translate(15px,-20px) scale(0.96); }
        }
        @keyframes orbFloat2 {
          0%,100% { transform: translate(0,0) scale(1); }
          33% { transform: translate(18px,-15px) scale(1.06); }
          66% { transform: translate(-15px,18px) scale(0.94); }
        }
        @keyframes orbFloat3 {
          0%,100% { transform: translate(-50%,0) scale(1); }
          50% { transform: translate(-50%,-25px) scale(1.08); }
        }
        @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
        * { box-sizing: border-box; }
      `}</style>
    </div>
  );
}
