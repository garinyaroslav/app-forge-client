import {
  createSystem,
  defaultBaseConfig,
  defineConfig,
} from '@chakra-ui/react';

const customConfig = defineConfig({
  theme: {
    tokens: {
      colors: {
        accent: { value: '#10b981' },
      },
      fonts: {
        // body: { value: 'system-ui, sans-serif' },
      },
    },
  },
});

export const system = createSystem(defaultBaseConfig, customConfig);
