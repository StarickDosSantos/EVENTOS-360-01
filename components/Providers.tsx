"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider
      // Relative path — evita CLIENT_FETCH_ERROR quando o host do browser
      // (ex.: 127.0.0.1, IP da rede) ≠ NEXTAUTH_URL (localhost)
      basePath="/api/auth"
      refetchInterval={0}
      refetchOnWindowFocus={false}
      // Não faz refetch automático se a rede falhar uma vez
      refetchWhenOffline={false}
    >
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        {children}
      </ThemeProvider>
    </SessionProvider>
  );
}
