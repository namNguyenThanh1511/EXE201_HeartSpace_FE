import { ReactNode, Suspense } from "react";
import { ThemeProvider } from "./theme-provider";
import { QueryProvider } from "./query-client-provider";
import { AuthProvider } from "./auth-provider";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <QueryProvider>
        <Suspense>
          <AuthProvider>{children}</AuthProvider>
        </Suspense>
      </QueryProvider>
    </ThemeProvider>
  );
}
