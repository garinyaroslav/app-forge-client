import { createRoot } from 'react-dom/client';
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import { ThemeProvider } from 'next-themes';
// import system from './theme';
import { MemoryRouter } from 'react-router-dom';
import { App } from './App';

createRoot(document.getElementById('root') as HTMLElement).render(
  <ChakraProvider value={defaultSystem}>
    <ThemeProvider attribute="class" disableTransitionOnChange>
      <MemoryRouter>
        <App />
      </MemoryRouter>
    </ThemeProvider>
  </ChakraProvider>,
);
