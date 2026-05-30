import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Router from './router/Router';
import '../styles/App.css';
import '../styles/Chat.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
    </QueryClientProvider>
  );
};

export default App;