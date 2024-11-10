
'use client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

// Create a QueryClient instance
const queryClient = new QueryClient();
  

export const ReactQueryProvider = ({ children }:{children:React.ReactNode}):JSX.Element => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>


// import { useQuery } from '@tanstack/react-query';

  );
};
