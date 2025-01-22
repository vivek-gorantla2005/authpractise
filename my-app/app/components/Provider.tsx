import { SessionProvider } from "next-auth/react";

// This is the wrapper component that wraps the session provider
const SessionProviderWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  );
};

export default SessionProviderWrapper;
