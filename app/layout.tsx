import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "sonner";
import { QueryProvider } from "@/providers/query-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import { ReactQueryProvider } from "@/providers/react-query";
import { AuthProvider } from "@/providers/auth-provider";

const bricolageGrotesque = localFont({
  src: "../public/fonts/Bricolage_Grotesque/BricolageGrotesque-VariableFont_opsz,wdth,wght.ttf",
  variable: "--font-bricolage-grotesque",
});

const manjari = localFont({
  src: "../public/fonts/Manjari/Manjari-Regular.ttf",
  variable: "--font-manjari",
});

const ibmPlexSans = localFont({
  src: "../public/fonts/IBM_Plex_Sans/static/IBMPlexSans-Regular.ttf",
  variable: "--font-ibm-plex-sans",
});

const ibmPlexMono = localFont({
  src: "../public/fonts/IBM_Plex_Mono/IBMPlexMono-Regular.ttf",
  variable: "--font-ibm-plex-mono",
});

export const metadata: Metadata = {
  title: "K.kits",
  description: "Application web de gestion d'entreprise commerciale",
  authors: [{ name: "Jason Kitio" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      suppressHydrationWarning
      className={`${bricolageGrotesque.variable} ${manjari.variable} ${ibmPlexSans.variable} ${ibmPlexMono.variable}`}
    >
      <body className="antialiased">
        <ReactQueryProvider>
          <AuthProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {children}
              <Toaster richColors position="bottom-right" />
            </ThemeProvider>
          </AuthProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}