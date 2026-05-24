/**
 * Module 1 - Error Classes Tests
 * Test custom error handling
 */

import {
  AppError,
  AuthenticationError,
  AuthorizationError,
  ValidationError,
  NotFoundError,
  ConflictError,
  RateLimitError,
  RDPError,
  SessionError,
  DatabaseError,
} from '../src/utils/errors.js';

const TEST_RESULTS = {
  total: 0,
  passed: 0,
  failed: 0,
  errors: [],
};

function assert(condition, message) {
  TEST_RESULTS.total++;
  if (!condition) {
    TEST_RESULTS.failed++;
    TEST_RESULTS.errors.push(`❌ ${message}`);
    console.log(`\n❌ FAILED: ${message}`);
  } else {
    TEST_RESULTS.passed++;
    console.log(`✅ PASSED: ${message}`);
  }
}

function assertEquals(actual, expected, message) {
  const passed = actual === expected;
  if (!passed) {
    console.log(`   Expected: ${expected}`);
    console.log(`   Actual:   ${actual}`);
  }
  assert(passed, message);
}

console.log('\n=== Module 1: Error Classes Tests ===\n');

// Test AppError
console.log('\n--- Test Group 1: AppError ---');
try {
  const error = new AppError('Test error', 400, 'TEST_ERROR');
  assert(error instanceof Error, 'AppError extends Error');
  assertEquals(error.message, 'Test error', 'Error message set correctly');
  assertEquals(error.statusCode, 400, 'Status code set correctly');
  assertEquals(error.code, 'TEST_ERROR', 'Error code set correctly');
  assertEquals(error.name, 'AppError', 'Error name set correctly');
} catch (e) {
  assert(false, `AppError instantiation failed: ${e.message}`);
}

// Test AuthenticationError
console.log('\n--- Test Group 2: AuthenticationError ---');
try {
  const error = new AuthenticationError('Invalid credentials', 'INVALID_CREDS');
  assert(error instanceof AppError, 'AuthenticationError extends AppError');
  assertEquals(error.statusCode, 401, 'Status code is 401 Unauthorized');
  assertEquals(error.name, 'AuthenticationError', 'Error name set correctly');
} catch (e) {
  assert(false, `AuthenticationError instantiation failed: ${e.message}`);
}

// Test AuthorizationError
console.log('\n--- Test Group 3: AuthorizationError ---');
try {
  const error = new AuthorizationError('Admin access required', 'ADMIN_ONLY');
  assert(error instanceof AppError, 'AuthorizationError extends AppError');
  assertEquals(error.statusCode, 403, 'Status code is 403 Forbidden');
  assertEquals(error.name, 'AuthorizationError', 'Error name set correctly');
} catch (e) {
  assert(false, `AuthorizationError instantiation failed: ${e.message}`);
}

// Test ValidationError
console.log('\n--- Test Group 4: ValidationError ---');
try {
  const errors = { email: 'Invalid email', password: 'Too short' };
  const error = new ValidationError('Validation failed', errors, 'VALIDATION_FAILED');
  assert(error instanceof AppError, 'ValidationError extends AppError');
  assertEquals(error.statusCode, 400, 'Status code is 400 Bad Request');
  assertEquals(error.errors.email, 'Invalid email', 'Error details stored correctly');
} catch (e) {
  assert(false, `ValidationError instantiation failed: ${e.message}`);
}

// Test NotFoundError
console.log('\n--- Test Group 5: NotFoundError ---');
try {
  const error = new NotFoundError('User not found', 'USER_NOT_FOUND');
  assert(error instanceof AppError, 'NotFoundError extends AppError');
  assertEquals(error.statusCode, 404, 'Status code is 404 Not Found');
} catch (e) {
  assert(false, `NotFoundError instantiation failed: ${e.message}`);
}

// Test ConflictError
console.log('\n--- Test Group 6: ConflictError ---');
try {
  const error = new ConflictError('User already exists', 'USER_EXISTS');
  assert(error instanceof AppError, 'ConflictError extends AppError');
  assertEquals(error.statusCode, 409, 'Status code is 409 Conflict');
} catch (e) {
  assert(false, `ConflictError instantiation failed: ${e.message}`);
}

// Test RateLimitError
console.log('\n--- Test Group 7: RateLimitError ---');
try {
  const error = new RateLimitError('Too many login attempts', 60, 'RATE_LIMITED');
  assert(error instanceof AppError, 'RateLimitError extends AppError');
  assertEquals(error.statusCode, 429, 'Status code is 429 Too Many Requests');
  assertEquals(error.retryAfter, 60, 'Retry-After value stored');
} catch (e) {
  assert(false, `RateLimitError instantiation failed: ${e.message}`);
}

// Test RDPError
console.log('\n--- Test Group 8: RDPError ---');
try {
  const error = new RDPError('RDP connection timeout', 'RDP_TIMEOUT');
  assert(error instanceof AppError, 'RDPError extends AppError');
  assertEquals(error.statusCode, 503, 'Status code is 503 Service Unavailable');
} catch (e) {
  assert(false, `RDPError instantiation failed: ${e.message}`);
}

// Test SessionError
console.log('\n--- Test Group 9: SessionError ---');
try {
  const error = new SessionError('Session expired', 'SESSION_EXPIRED');
  assert(error instanceof AppError, 'SessionError extends AppError');
  assertEquals(error.statusCode, 400, 'Status code is 400 Bad Request');
} catch (e) {
  assert(false, `SessionError instantiation failed: ${e.message}`);
}

// Test DatabaseError
console.log('\n--- Test Group 10: DatabaseError ---');
try {
  const error = new DatabaseError('Connection failed', 'DB_CONNECTION_FAILED');
  assert(error instanceof AppError, 'DatabaseError extends AppError');
  assertEquals(error.statusCode, 500, 'Status code is 500 Internal Server Error');
} catch (e) {
  assert(false, `DatabaseError instantiation failed: ${e.message}`);
}

// Summary
console.log('\n\n=== Test Summary ===');
console.log(`Total Tests:  ${TEST_RESULTS.total}`);
console.log(`✅ Passed:    ${TEST_RESULTS.passed}`);
console.log(`❌ Failed:    ${TEST_RESULTS.failed}`);
console.log(`Success Rate: ${((TEST_RESULTS.passed / TEST_RESULTS.total) * 100).toFixed(2)}%`);

if (TEST_RESULTS.failed > 0) {
  console.log('\n--- Failures ---');
  TEST_RESULTS.errors.forEach((error) => console.log(error));
  process.exit(1);
} else {
  console.log('\n✅ All tests passed!');
  process.exit(0);
}
