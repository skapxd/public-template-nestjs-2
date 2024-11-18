import 'dotenv/config';

import { resolve } from 'node:path';

import swc from 'unplugin-swc';
import { configDefaults, defineConfig } from 'vitest/config';

import { duration } from './src/utils/duration';

const testResultDir = resolve(__dirname, 'test-reporter');

export default defineConfig({
  test: {
    setupFiles: './setup-expect.vitest.ts',
    hookTimeout: duration({ minute: 1 }),
    testTimeout: duration({ minute: 1 }),
    coverage: {
      enabled: true,
      // provider: 'istanbul',
      provider: 'v8',
      reporter: ['html', 'clover'],
      reportsDirectory: resolve(testResultDir, 'coverage'),
      include: ['src/**/*.ts'],
      exclude: [
        ...(configDefaults.coverage.exclude ?? []),
        'src/**/**.module.ts',
        'src/main.ts',
      ],
      thresholds: {
        branches: 50,
        functions: 50,
        lines: 50,
        statements: 50,
      },
    },
    outputFile: {
      html: resolve(testResultDir, 'index.html'),
      junit: resolve(testResultDir, 'junit-report.xml'),
    },
    reporters: ['default', 'html', ['junit', { suiteName: 'UI tests' }]],
    globals: true,
    root: './',
  },
  resolve: {
    alias: {
      '#/': resolve(__dirname),
    },
  },
  plugins: [
    // @ts-expect-error: ERR
    swc.vite({
      module: { type: 'es6' },
    }),
  ],
});
