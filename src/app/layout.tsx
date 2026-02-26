import type { Metadata } from "next";
import "./globals.css";

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
      <body className="bg-gray-50 text-gray-900 min-h-screen">
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <a href="/" className="text-xl font-bold text-blue-600">
              OfferTracker
            </a>
            <nav className="flex gap-4">
              <a
                href="/"
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Dashboard
              </a>
              <a
                href="/offers/new"
                className="text-sm bg-blue-600 text-white px-3 py-1.5 rounded-md hover:bg-blue-700"
              >
                Nova Oferta
              </a>
            </nav>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 py-6">{children}</main>
      </body>
    </html>
  );
}
