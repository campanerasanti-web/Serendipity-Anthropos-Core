/**
 * Jest Setup File
 * Runs before each test suite
 */

// Mock global objects if needed
global.console = {
  ...console,
  error: jest.fn(),
  warn: jest.fn(),
};

// Setup test timeout
jest.setTimeout(30000);

// Mock React if needed
jest.mock('react', () => ({
  __esModule: true,
  ...jest.requireActual('react'),
}));
