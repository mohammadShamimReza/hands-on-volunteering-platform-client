import Footer from "@/components/Structure/Footer";
import Navbar from "@/components/Structure/Navbar";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { NavigationProvider } from "@/contexts/NavigatoinContext";
import Providers from "@/lib/provider/Providers";
import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";

const open_sens = Open_Sans({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Universal Volunteer",
  description:
    "Universal Volunteer is a platform for volunteers to find and join volunteer opportunities",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={open_sens.className} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
      </head>
      <body>
        <Providers>
          <NavigationProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <Navbar />
              <div className="mx-auto max-w-6xl min-h-screen">{children}</div>

              <Footer />
              <Toaster />
            </ThemeProvider>
          </NavigationProvider>
        </Providers>
      </body>
    </html>
  );
}
