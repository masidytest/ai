
import type { Metadata } from "next";
import "./globals.css";
import "../styles/globals.css";
import { ThemeProvider } from "../components/ThemeProvider";
import { ConditionalNavbar } from "../components/ConditionalNavbar";

export const metadata: Metadata = {
  title: "Masidy — The AI Agent for Product, Design, and Code",
  description: "Build full-stack apps, automate workflows, and deploy to the cloud from a single prompt.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-app-bg text-app-text min-h-screen transition-colors duration-300">
        <ThemeProvider>
          <ConditionalNavbar />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
