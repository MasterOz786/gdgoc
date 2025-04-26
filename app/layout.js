import { Navbar } from "@/components/layout/navbar";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "/app/context/AuthContext"; // <-- import your AuthProvider
import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>ConvoAI - AI-Powered Communication Platform</title>
        <meta
          name="description"
          content="AI-powered conversation environment for people with autism to improve communication skills"
        />
      </head>
      <body>
        <AuthProvider> {/* 🟰 wrap everything inside AuthProvider */}
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <Navbar />
            <main className="min-h-screen pt-16">
              {children}
            </main>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

export const metadata = {
  generator: "v0.dev",
};
