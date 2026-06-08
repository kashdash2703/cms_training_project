import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    root: '.',
    include: ['src/backend/**/*.test.ts'],
    environment: 'node',
  },
});