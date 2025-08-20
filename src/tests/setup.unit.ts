import { vi,  afterEach } from 'vitest';

// Example: reset timers/mocks between tests
afterEach(() => {
  vi.useRealTimers();
  vi.clearAllMocks();
});

// If you add custom matchers later, extend here
// e.g., import * as matchers from '@testing-library/jest-dom/matchers';
// expect.extend(matchers);
