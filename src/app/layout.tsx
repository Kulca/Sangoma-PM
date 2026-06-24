import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import BottomNav from "@/components/BottomNav";
import { AuthProvider } from "@/context/AuthContext";
import ConnectButton from "@/components/ConnectButton";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sangoma Alpha | Prediction Marketplace",
  description: "Predict the future of South Africa's markets, politics, and more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          <header className="p-4 flex justify-between items-center bg-white border-b border-sangoma-green/10">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-sangoma-green rounded-lg flex items-center justify-center text-white font-black text-xs">S</div>
              <span className="font-black text-sangoma-green tracking-tighter uppercase text-sm">Sangoma Alpha</span>
            </div>
            <ConnectButton />
          </header>
          <main className="flex-1 pb-32">
            {children}
          </main>
          <BottomNav />
        </AuthProvider>
      </body>
    </html>
  );
}
