import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import EnhancedAudioPlayer from "@/src/components/player/EnhancedAudioPlayer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MusicStream - Play & Create Music",
  description:
    "A dual-platform music streaming service with integrated music creation tools",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} bg-linear-to-br from-gray-950 to-purple-950`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <div className="min-h-screen text-white">
            {children}
            <EnhancedAudioPlayer />
            <Toaster
              position="bottom-right"
              toastOptions={{
                style: {
                  background: "#1f2937",
                  color: "#fff",
                  border: "1px solid #374151",
                },
              }}
            />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
