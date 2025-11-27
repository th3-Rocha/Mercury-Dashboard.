import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthHeader from "@/components/ui/auth-header";
import MouseLight from "@/src/components/MouseLight";
import GridBackground from "@/components/ui/grid-background";
import { Providers } from "@/contexts/providers";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mercury Dashboard",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-full w-full`}
      >
        <Providers>
          <div className="fixed inset-0 z-[-1]">
            <GridBackground />
            <div className="absolute inset-0 w-full h-full z-0">
              <MouseLight />
            </div>
          </div>

          <div className="relative flex flex-col h-full w-full overflow-hidden">
            <div className="flex-none z-10">
              <AuthHeader linkHref="/login" linkText="Login" />
            </div>
            <main className="flex-1 overflow-y-auto overflow-x-hidden p-6">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
