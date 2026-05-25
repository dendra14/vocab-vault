"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";

export default function AppLayout({ children }) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.replace("/login");
        return;
      }
      setChecking(false);
    }
    checkAuth();
  }, []);

  if (checking)
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f7f8fc",
          fontFamily: "-apple-system, sans-serif",
          fontSize: "14px",
          color: "#aaa",
        }}
      >
        Memuat...
      </div>
    );

  return <>{children}</>;
}
