import type { Metadata } from "next";
import "./globals.css";
import { TokenStatus, LogoutButton } from "@/components/status-bar";

export const metadata: Metadata = {
  title: "OfferTracker - Facebook Ad Library Monitor",
  description: "Monitor infoproduct offers via Facebook Ad Library",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="bg-[#f0f4f8] text-gray-900 min-h-screen">
        <header className="bg-white/80 backdrop-blur-md border-b border-gray-200/60 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
            <a href="/" className="flex items-center gap-2 group">
              <span className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center text-white text-sm font-bold shadow-sm">
                O
              </span>
              <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent group-hover:from-blue-700 group-hover:to-indigo-700 transition-all">
                OfferTracker
              </span>
            </a>
            <nav className="flex items-center gap-2 sm:gap-3">
              <a
                href="/"
                className="text-sm text-gray-500 hover:text-gray-900 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-all"
              >
                Dashboard
              </a>
              <a
                href="/offers/new"
                className="btn-primary text-sm"
              >
                + Nova Oferta
              </a>
              <LogoutButton />
            </nav>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <TokenStatus />
          <div className="mt-2 animate-fade-in">{children}</div>
        </main>
      </body>
    </html>
  );
}
