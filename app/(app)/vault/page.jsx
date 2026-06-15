"use client";
import { useEffect, useState, useMemo, useRef } from "react";
import { createClient } from "@/lib/supabase";
import { getVocabs, deleteVocab, toggleFavorite } from "@/lib/vocab";
import { useTheme } from "@/lib/ThemeContext";
import { useToast } from "@/components/ui/useToast";

const CAT_COLORS = {
  tech: "linear-gradient(135deg, #667eea, #764ba2)",
  english: "linear-gradient(135deg, #4facfe, #00f2fe)",
  ekonomi: "linear-gradient(135deg, #43e97b, #38f9d7)",
  sains: "linear-gradient(135deg, #fa709a, #fee140)",
  lainnya: "linear-gradient(135deg, #a18cd1, #fbc2eb)",
  general: "linear-gradient(135deg, #f093fb, #f5576c)",
};

const SORT_OPTIONS = [
  { value: "newest", label: "Terbaru" },
  { value: "oldest", label: "Terlama" },
  { value: "az", label: "A → Z" },
  { value: "za", label: "Z → A" },
  { value: "fav", label: "Favorit dulu" },
];

function exportToCSV(vocabs) {
  const headers = [
    "Term",
    "Definition",
    "Example",
    "Category",
    "Favorite",
    "Created At",
  ];
  const rows = vocabs.map((v) => [
    `"${(v.term || "").replace(/"/g, '""')}"`,
    `"${(v.definition || "").replace(/"/g, '""')}"`,
    `"${(v.example || "").replace(/"/g, '""')}"`,
    v.category || "",
    v.is_favorite ? "Yes" : "No",
    new Date(v.created_at).toLocaleDateString("id-ID"),
  ]);
  const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `vocabvault-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// ── FIXED: kontras light mode diperbaiki ──
function theme(dark) {
  return {
    bgBase: dark ? "#0d0d18" : "#f4f4f8",
    bgCard: dark ? "#161628" : "#ffffff",
    bgCardHover: dark ? "#1c1c35" : "#f5f5fb",
    bgInput: dark ? "#1a1a2e" : "#ffffff",
    bgPill: dark ? "#1e1e35" : "#e8e8f4", // lebih gelap dari sebelumnya
    border: dark ? "#2a2a48" : "#d8d8e8", // lebih kontras
    borderHover: dark ? "#3a3a60" : "#b8b8d8",
    textPrimary: dark ? "#eeeeff" : "#13131f",
    textSub: dark ? "#9898c0" : "#3f3f5c", // lebih gelap, lebih terbaca
    textMuted: dark ? "#55557a" : "#6e6e90", // lebih gelap dari sebelumnya
    navBg: dark ? "#0d0d18" : "#ffffff",
    accent: "#7c6dfa",
    accentCyan: "#06d6d6",
  };
}

function VocabCard({ vocab, dark, c, onFav, onEdit, onDelete, index }) {
  const [hovered, setHovered] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), index * 50);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? c.bgCardHover : c.bgCard,
        borderRadius: "16px",
        border: `1px solid ${hovered ? c.borderHover : c.border}`,
        padding: "18px",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        transform: visible
          ? hovered
            ? "translateY(-3px)"
            : "translateY(0)"
          : "translateY(16px)",
        opacity: visible ? 1 : 0,
        boxShadow: hovered
          ? dark
            ? "0 8px 24px rgba(0,0,0,0.4)"
            : "0 8px 24px rgba(124,109,250,0.12)"
          : "none",
        transition:
          "opacity 0.35s ease, transform 0.35s ease, background 0.2s, border-color 0.2s, box-shadow 0.2s",
        cursor: "default",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: "8px",
        }}
      >
        <span
          style={{
            fontSize: "clamp(14px, 2.5vw, 16px)",
            fontWeight: "700",
            color: c.textPrimary,
            lineHeight: "1.3",
            letterSpacing: "-0.01em",
          }}
        >
          {vocab.term}
        </span>
        <span
          style={{
            fontSize: "11px",
            padding: "2px 9px",
            borderRadius: "99px",
            whiteSpace: "nowrap",
            background: CAT_COLORS[vocab.category] || CAT_COLORS.general,
            color: "#fff",
            fontWeight: "600",
            flexShrink: 0,
          }}
        >
          {vocab.category}
        </span>
      </div>

      {/* Definition */}
      <p
        style={{
          fontSize: "13px",
          color: c.textSub,
          lineHeight: "1.65",
          display: "-webkit-box",
          WebkitLineClamp: 3,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          margin: 0,
        }}
      >
        {vocab.definition}
      </p>

      {/* Example */}
      {vocab.example && (
        <p
          style={{
            fontSize: "12px",
            color: c.textMuted,
            fontStyle: "italic",
            lineHeight: "1.55",
            margin: 0,
            paddingLeft: "10px",
            borderLeft: `2px solid ${c.border}`,
          }}
        >
          "{vocab.example}"
        </p>
      )}

      {/* Actions */}
      <div style={{ display: "flex", gap: "6px", marginTop: "2px" }}>
        <button
          onClick={() => onFav(vocab.id, vocab.is_favorite, vocab.term)}
          style={{
            padding: "6px 10px",
            fontSize: "13px",
            borderRadius: "8px",
            border: `1px solid ${vocab.is_favorite ? "rgba(245,158,11,0.4)" : c.border}`,
            background: vocab.is_favorite
              ? "rgba(245,158,11,0.1)"
              : "transparent",
            color: vocab.is_favorite ? "#f59e0b" : c.textSub,
            cursor: "pointer",
            transition: "all 0.15s",
          }}
        >
          {vocab.is_favorite ? "★" : "☆"}
        </button>
        <button
          onClick={() => onEdit(vocab.id)}
          style={{
            flex: 1,
            padding: "6px",
            fontSize: "12px",
            fontWeight: "600",
            border: `1px solid ${c.border}`,
            background: "transparent",
            color: c.accent,
            borderRadius: "8px",
            cursor: "pointer",
            transition: "all 0.15s",
          }}
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(vocab.id, vocab.term)}
          style={{
            padding: "6px 11px",
            fontSize: "12px",
            fontWeight: "600",
            border: "1px solid rgba(239,68,68,0.25)",
            background: "transparent",
            color: "#ef4444",
            borderRadius: "8px",
            cursor: "pointer",
            transition: "all 0.15s",
          }}
        >
          Hapus
        </button>
      </div>
    </div>
  );
}

export default function VaultPage() {
  const { dark, toggle } = useTheme();
  const { showToast, ToastContainer } = useToast();
  const sortMenuRef = useRef(null);
  const c = theme(dark);

  const [vocabs, setVocabs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("semua");
  const [showFavOnly, setShowFavOnly] = useState(false);
  const [sortBy, setSortBy] = useState("newest");
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 620);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    async function init() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        window.location.href = "/login";
        return;
      }
      try {
        const data = await getVocabs();
        setVocabs(data || []);
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
      setTimeout(() => setReady(true), 50);
    }
    init();
  }, []);

  useEffect(() => {
    function onOut(e) {
      if (sortMenuRef.current && !sortMenuRef.current.contains(e.target))
        setShowSortMenu(false);
    }
    document.addEventListener("mousedown", onOut);
    return () => document.removeEventListener("mousedown", onOut);
  }, []);

  async function handleDelete(id, term) {
    if (!confirm(`Hapus "${term}"?`)) return;
    await deleteVocab(id);
    setVocabs((prev) => prev.filter((v) => v.id !== id));
    showToast(`"${term}" dihapus`, "info");
  }

  async function handleToggleFav(id, current, term) {
    const updated = await toggleFavorite(id, current);
    setVocabs((prev) => prev.map((v) => (v.id === id ? updated : v)));
    showToast(
      current ? "Dihapus dari favorit" : "Ditambahkan ke favorit ★",
      "success",
    );
  }

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  const categories = [
    "semua",
    ...new Set(vocabs.map((v) => v.category).filter(Boolean)),
  ];

  const filtered = useMemo(() => {
    let r = vocabs.filter((v) => {
      const s = search.toLowerCase();
      const matchSearch =
        v.term.toLowerCase().includes(s) ||
        v.definition.toLowerCase().includes(s);
      const matchCat =
        activeCategory === "semua" || v.category === activeCategory;
      const matchFav = showFavOnly ? v.is_favorite : true;
      return matchSearch && matchCat && matchFav;
    });
    if (sortBy === "newest")
      r = [...r].sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at),
      );
    if (sortBy === "oldest")
      r = [...r].sort(
        (a, b) => new Date(a.created_at) - new Date(b.created_at),
      );
    if (sortBy === "az")
      r = [...r].sort((a, b) => a.term.localeCompare(b.term));
    if (sortBy === "za")
      r = [...r].sort((a, b) => b.term.localeCompare(a.term));
    if (sortBy === "fav")
      r = [...r].sort((a, b) => b.is_favorite - a.is_favorite);
    return r;
  }, [vocabs, search, activeCategory, showFavOnly, sortBy]);

  const navBtn = {
    height: "34px",
    borderRadius: "8px",
    border: `1px solid ${c.border}`,
    background: "transparent",
    color: c.textSub,
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "border-color 0.15s, color 0.15s",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    whiteSpace: "nowrap",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: c.bgBase,
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        overflowX: "hidden",
        transition: "background 0.25s",
      }}
    >
      <ToastContainer />

      {/* Navbar */}
      <nav
        style={{
          background: c.navBg,
          borderBottom: `1px solid ${c.border}`,
          padding: `0 ${isMobile ? "14px" : "24px"}`,
          height: "58px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          zIndex: 100,
          width: "100%",
          boxSizing: "border-box",
          transition: "background 0.25s",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: "30px",
              height: "30px",
              background: "linear-gradient(135deg, #7c6dfa, #06d6d6)",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontWeight: "800",
              fontSize: "14px",
              flexShrink: 0,
            }}
          >
            V
          </div>
          {!isMobile && (
            <span
              style={{
                fontSize: "15px",
                fontWeight: "800",
                background: "linear-gradient(135deg, #7c6dfa, #06d6d6)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                letterSpacing: "-0.02em",
              }}
            >
              VocabVault
            </span>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <button
            onClick={toggle}
            style={{ ...navBtn, width: "34px", fontSize: "15px" }}
          >
            {dark ? "☀" : "☾"}
          </button>
          {!isMobile && (
            <button
              onClick={() => {
                exportToCSV(vocabs);
                showToast(`${vocabs.length} kata diexport!`, "success");
              }}
              style={{ ...navBtn, padding: "0 12px" }}
            >
              Export
            </button>
          )}
          <button
            onClick={() => (window.location.href = "/vault/new")}
            style={{
              height: "34px",
              padding: `0 ${isMobile ? "10px" : "14px"}`,
              background: "linear-gradient(135deg, #7c6dfa, #06d6d6)",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              fontSize: "13px",
              fontWeight: "700",
              cursor: "pointer",
              flexShrink: 0,
            }}
          >
            {isMobile ? "+" : "+ Tambah"}
          </button>
          <button
            onClick={handleLogout}
            style={{ ...navBtn, padding: "0 10px" }}
          >
            {isMobile ? "↩" : "Keluar"}
          </button>
        </div>
      </nav>

      {/* Main */}
      <main
        style={{
          maxWidth: "960px",
          margin: "0 auto",
          padding: `clamp(24px,4vw,36px) clamp(14px,4vw,24px)`,
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        {/* Header */}
        <div
          style={{
            marginBottom: "clamp(20px,4vw,28px)",
            opacity: ready ? 1 : 0,
            transform: ready ? "none" : "translateY(-10px)",
            transition: "opacity 0.4s ease, transform 0.4s ease",
          }}
        >
          <h1
            style={{
              fontSize: "clamp(20px,4vw,26px)",
              fontWeight: "800",
              color: c.textPrimary,
              margin: "0 0 4px",
              letterSpacing: "-0.02em",
            }}
          >
            Vault kamu
          </h1>
          <p style={{ fontSize: "13px", color: c.textMuted, margin: 0 }}>
            {vocabs.length} kata · {vocabs.filter((v) => v.is_favorite).length}{" "}
            favorit
          </p>
        </div>

        {/* Toolbar */}
        <div
          style={{
            display: "flex",
            gap: "8px",
            marginBottom: "12px",
            flexWrap: "wrap",
            width: "100%",
            boxSizing: "border-box",
          }}
        >
          {/* Search */}
          <div style={{ flex: "1 1 150px", minWidth: 0, position: "relative" }}>
            <span
              style={{
                position: "absolute",
                left: "11px",
                top: "50%",
                transform: "translateY(-50%)",
                color: c.textMuted,
                fontSize: "14px",
                pointerEvents: "none",
              }}
            >
              ⌕
            </span>
            <input
              type="text"
              placeholder="Cari kata..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "100%",
                padding: "9px 12px 9px 32px",
                fontSize: "13px",
                border: `1px solid ${c.border}`,
                borderRadius: "10px",
                background: c.bgInput,
                color: c.textPrimary,
                boxSizing: "border-box",
                outline: "none",
                transition: "border-color 0.15s",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#7c6dfa")}
              onBlur={(e) => (e.target.style.borderColor = c.border)}
            />
          </div>

          {/* Sort */}
          <div
            ref={sortMenuRef}
            style={{ position: "relative", flexShrink: 0 }}
          >
            <button
              onClick={() => setShowSortMenu((v) => !v)}
              style={{
                height: "38px",
                padding: "0 12px",
                fontSize: "13px",
                fontWeight: "600",
                border: `1px solid ${c.border}`,
                background: c.bgInput,
                color: c.textSub,
                borderRadius: "10px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "5px",
                whiteSpace: "nowrap",
                transition: "border-color 0.15s",
              }}
            >
              {SORT_OPTIONS.find((s) => s.value === sortBy)?.label}
              <span style={{ fontSize: "9px", opacity: 0.5 }}>▼</span>
            </button>
            {showSortMenu && (
              <div
                style={{
                  position: "absolute",
                  top: "calc(100% + 5px)",
                  right: 0,
                  background: c.bgCard,
                  border: `1px solid ${c.border}`,
                  borderRadius: "12px",
                  padding: "5px",
                  zIndex: 200,
                  boxShadow: dark
                    ? "0 8px 32px rgba(0,0,0,0.5)"
                    : "0 8px 24px rgba(0,0,0,0.12)",
                  minWidth: "148px",
                }}
              >
                {SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onMouseDown={() => {
                      setSortBy(opt.value);
                      setShowSortMenu(false);
                    }}
                    style={{
                      display: "block",
                      width: "100%",
                      textAlign: "left",
                      padding: "8px 12px",
                      fontSize: "13px",
                      fontWeight: sortBy === opt.value ? "700" : "400",
                      background:
                        sortBy === opt.value
                          ? dark
                            ? "rgba(124,109,250,0.15)"
                            : "rgba(124,109,250,0.08)"
                          : "transparent",
                      color: sortBy === opt.value ? "#7c6dfa" : c.textSub,
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer",
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Favorit */}
          <button
            onClick={() => setShowFavOnly(!showFavOnly)}
            style={{
              height: "38px",
              padding: "0 14px",
              fontSize: "13px",
              fontWeight: "600",
              border: `1px solid ${showFavOnly ? "#7c6dfa" : c.border}`,
              background: showFavOnly
                ? "linear-gradient(135deg, #7c6dfa, #06d6d6)"
                : c.bgInput,
              color: showFavOnly ? "#fff" : c.textSub,
              borderRadius: "10px",
              cursor: "pointer",
              transition: "all 0.2s",
              flexShrink: 0,
            }}
          >
            {isMobile ? "★" : "★ Favorit"}
          </button>
        </div>

        {/* Category Pills */}
        <div
          style={{
            display: "flex",
            gap: "6px",
            marginBottom: "clamp(18px,4vw,24px)",
            flexWrap: "wrap",
          }}
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: "5px clamp(10px,2vw,14px)",
                fontSize: "clamp(11px,2vw,12px)",
                fontWeight: "600",
                borderRadius: "99px",
                cursor: "pointer",
                border: `1px solid ${activeCategory === cat ? "transparent" : c.border}`,
                background:
                  activeCategory === cat
                    ? CAT_COLORS[cat] ||
                      "linear-gradient(135deg,#7c6dfa,#06d6d6)"
                    : c.bgPill,
                color: activeCategory === cat ? "#fff" : c.textSub,
                transition: "all 0.2s",
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        {loading ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fill, minmax(min(260px, 100%), 1fr))",
              gap: "10px",
            }}
          >
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                style={{
                  background: c.bgCard,
                  borderRadius: "16px",
                  border: `1px solid ${c.border}`,
                  height: "155px",
                  opacity: 0.6,
                  animation: `pulse 1.4s ease-in-out ${i * 0.1}s infinite`,
                }}
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "clamp(48px,8vw,80px) 24px",
            }}
          >
            <p
              style={{
                fontSize: "clamp(14px,2.5vw,16px)",
                fontWeight: "700",
                color: c.textSub,
                margin: "0 0 6px",
              }}
            >
              {vocabs.length === 0 ? "Vault masih kosong" : "Tidak ada hasil"}
            </p>
            <p
              style={{
                fontSize: "13px",
                color: c.textMuted,
                margin: "0 0 20px",
              }}
            >
              {vocabs.length === 0
                ? "Tambah kata pertamamu!"
                : "Coba kata kunci lain"}
            </p>
            {vocabs.length === 0 && (
              <button
                onClick={() => (window.location.href = "/vault/new")}
                style={{
                  padding: "10px 22px",
                  background: "linear-gradient(135deg, #7c6dfa, #06d6d6)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "10px",
                  fontSize: "13px",
                  fontWeight: "700",
                  cursor: "pointer",
                }}
              >
                + Tambah Kata Pertama
              </button>
            )}
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fill, minmax(min(260px, 100%), 1fr))",
              gap: "10px",
              width: "100%",
            }}
          >
            {filtered.map((vocab, i) => (
              <VocabCard
                key={vocab.id}
                vocab={vocab}
                dark={dark}
                c={c}
                index={i}
                onFav={handleToggleFav}
                onEdit={(id) => (window.location.href = `/vault/${id}`)}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </main>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.7; }
        }
        * { box-sizing: border-box; }
        html, body { overflow-x: hidden; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${dark ? "rgba(124,109,250,0.3)" : "rgba(0,0,0,0.12)"}; border-radius: 99px; }
      `}</style>
    </div>
  );
}
