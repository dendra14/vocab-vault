import { Geist } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/lib/ThemeContext";

const geist = Geist({ subsets: ["latin"] });

export const metadata = {
  title: "VocabVault",
  description: "Kamus pribadi yang terasa milikmu sendiri",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className={geist.className}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
