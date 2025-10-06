import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";
import { Providers } from "@/components/Providers";
import { fonts } from "@/lib/fonts";

export const metadata: Metadata = {
  title: "K.kits",
  description: "Application web de gestion d'entreprise commerciale",
  authors: [{ name: "Jason Kitio" }],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" suppressHydrationWarning className={fonts}>
      <body className="antialiased">
        <Providers>
          {children}
          <Toaster richColors position="bottom-right" />
        </Providers>
      </body>
    </html>
  );
}