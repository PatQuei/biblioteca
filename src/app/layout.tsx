import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "../components/components/navbar";
import { Footer } from "../components/components/footer";
import { ThemeProvider } from "@/contexts/ThemeContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Biblioteca DOMinadores",
  description: "Sua estante de livros digital.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="h-full">
      <body
        className={`${inter.className} flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200`}
      >
        <ThemeProvider>
          <Navbar />
          <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
