"use client"
// src/app/providers.tsx
import { ClerkProvider } from "@clerk/nextjs";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// Add other providers here if necessary (e.g., theme provider, state manager, etc.)
import { ReactNode, useState } from "react";

// Create a Providers component that will wrap the children with all providers
const Providers = ({ children }: { children: ReactNode }) => {
  const [ queryClient] =  useState(()=> new QueryClient())
  return (
    <QueryClientProvider client={queryClient}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <ClerkProvider>
          {/* Add other providers here if needed */}
          {children}
          <ReactQueryDevtools initialIsOpen={false} />
        </ClerkProvider>
      </LocalizationProvider>
    </QueryClientProvider>
  );
};

export default Providers;
