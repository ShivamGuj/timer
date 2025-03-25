// This file sets up the test environment
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';
import { expect } from 'vitest';

// Extend Vitest's expect with Jest DOM matchers
expect.extend(matchers);

// Run cleanup after each test case
afterEach(() => {
  cleanup();
});

