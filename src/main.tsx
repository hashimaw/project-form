import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { MantineProvider } from '@mantine/core';
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <MantineProvider>
    <BrowserRouter>
      <StrictMode>
      <QueryClientProvider client={queryClient}> 
        <App /> 
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
      </StrictMode>,
    </BrowserRouter>
</MantineProvider>
)