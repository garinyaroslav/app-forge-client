import { createRoot } from 'react-dom/client';
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import { ThemeProvider } from 'next-themes';
// import system from './theme';
import { App } from './App';

createRoot(document.getElementById('root') as HTMLElement).render(
  <ChakraProvider value={defaultSystem}>
    <ThemeProvider attribute="class" disableTransitionOnChange>
      <App />
    </ThemeProvider>
  </ChakraProvider>,
);
