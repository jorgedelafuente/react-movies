import '@testing-library/jest-dom/vitest';

import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

expect.extend(matchers);

afterEach(() => {
   cleanup();
});

Object.defineProperty(window, 'matchMedia', {
   writable: true,
   value: vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(), // deprecated
      removeListener: vi.fn(), // deprecated
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
   })),
});

export const handlers = [
   http.get('/user', async () => {
      return HttpResponse.json({
         id: '15d42a4d-1948-4de4-ba78-b8a893feaf45',
         firstName: 'John',
      });
   }),
   http.get('/greeting', async () => HttpResponse.text('Hello world'), {
      once: true,
   }),
];

export const server = setupServer(...handlers);

// Establish API mocking before all tests.
beforeAll(() => server.listen());
// Reset any request handlers that we may add during the tests,
// so they don't affect other tests.
afterEach(() => server.resetHandlers());
// Clean up after the tests are finished.
afterAll(() => server.close());
