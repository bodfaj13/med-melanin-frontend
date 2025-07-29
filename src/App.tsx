import { RouterProvider } from 'react-router';
import { ChakraProvider } from '@chakra-ui/react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { store, persistor } from '@/store';
import { router } from '@/routes/index.tsx';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <QueryClientProvider client={queryClient}>
          <ChakraProvider>
            <RouterProvider router={router} />
          </ChakraProvider>
        </QueryClientProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;
