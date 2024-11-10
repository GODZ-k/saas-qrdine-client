// src/app/providers.tsx
import { ClerkProvider } from "@clerk/nextjs";
// Add other providers here if necessary (e.g., theme provider, state manager, etc.)
import { ReactNode } from "react";
import { ReactQueryProvider } from "../ReactQueryProvider";

// Create a Providers component that will wrap the children with all providers
const Providers = ({ children }: { children: ReactNode }):JSX.Element => {
  return (
    <ReactQueryProvider>
      <ClerkProvider>
        {/* Add other providers here if needed */}
        {children}
      </ClerkProvider>
    </ReactQueryProvider>
  );
};

export default Providers;
