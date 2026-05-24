/**
 * Module 1 - Helper Functions Tests
 * Test utility functions
 */

import * as helpers from '../src/utils/helpers.js';

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

function assertExists(value, message) {
  assert(value !== undefined && value !== null, message);
}

console.log('\n=== Module 1: Helper Functions Tests ===\n');

// Test Session ID generation
console.log('\n--- Test Group 1: Session ID Generation ---');
const sessionId1 = helpers.generateSessionId();
const sessionId2 = helpers.generateSessionId();
assertExists(sessionId1, 'Session ID generated');
assert(sessionId1.startsWith('sess_'), 'Session ID has correct prefix');
assert(sessionId1 !== sessionId2, 'Session IDs are unique');
assert(sessionId1.length > 10, 'Session ID has sufficient length');

// Test Request ID generation
console.log('\n--- Test Group 2: Request ID Generation ---');
const requestId1 = helpers.generateRequestId();
const requestId2 = helpers.generateRequestId();
assertExists(requestId1, 'Request ID generated');
assert(requestId1.startsWith('req_'), 'Request ID has correct prefix');
assert(requestId1 !== requestId2, 'Request IDs are unique');

// Test User ID generation
console.log('\n--- Test Group 3: User ID Generation ---');
const userId1 = helpers.generateUserId();
const userId2 = helpers.generateUserId();
assertExists(userId1, 'User ID generated');
assert(userId1.startsWith('user_'), 'User ID has correct prefix');
assert(userId1 !== userId2, 'User IDs are unique');

// Test Random String generation
console.log('\n--- Test Group 4: Random String Generation ---');
const randomStr = helpers.generateRandomString(32);
assertExists(randomStr, 'Random string generated');
assert(randomStr.length === 64, 'Random string has correct length (32 bytes = 64 hex chars)');
assert(/^[a-f0-9]+$/.test(randomStr), 'Random string contains only hex characters');

// Test Hash function
console.log('\n--- Test Group 5: Hash Function ---');
const testData = 'test-password-123';
const hash1 = helpers.hashData(testData);
const hash2 = helpers.hashData(testData);
assertExists(hash1, 'Hash generated');
assert(hash1 === hash2, 'Same input produces same hash');
assert(hash1.length === 64, 'Hash has correct length (SHA-256)');
assert(/^[a-f0-9]+$/.test(hash1), 'Hash contains only hex characters');

// Test Client IP extraction
console.log('\n--- Test Group 6: Client IP Extraction ---');
const mockReq1 = {
  headers: { 'x-forwarded-for': '192.168.1.100, 10.0.0.1' },
  ip: '127.0.0.1',
};
const ip1 = helpers.getClientIp(mockReq1);
assertExists(ip1, 'Client IP extracted');
assert(ip1 === '192.168.1.100', 'X-Forwarded-For IP extracted correctly');

const mockReq2 = {
  headers: {},
  ip: '192.168.1.200',
};
const ip2 = helpers.getClientIp(mockReq2);
assert(ip2 === '192.168.1.200', 'Fallback to req.ip works');

// Test Email validation
console.log('\n--- Test Group 7: Email Validation ---');
assert(helpers.isValidEmail('user@example.com'), 'Valid email accepted');
assert(helpers.isValidEmail('test.user+tag@example.co.uk'), 'Valid email with special chars accepted');
assert(!helpers.isValidEmail('invalid.email'), 'Invalid email rejected');
assert(!helpers.isValidEmail('user@'), 'Incomplete email rejected');
assert(!helpers.isValidEmail('@example.com'), 'Email without username rejected');

// Test Windows username validation
console.log('\n--- Test Group 8: Windows Username Validation ---');
assert(helpers.isValidWindowsUsername('Administrator'), 'Valid username accepted');
assert(helpers.isValidWindowsUsername('user123'), 'Username with numbers accepted');
assert(helpers.isValidWindowsUsername('john_doe'), 'Username with underscore accepted');
assert(!helpers.isValidWindowsUsername('user@domain'), 'Username with @ rejected');
assert(!helpers.isValidWindowsUsername('user"name'), 'Username with quotes rejected');
assert(!helpers.isValidWindowsUsername('a'.repeat(21)), 'Username exceeding 20 chars rejected');
assert(!helpers.isValidWindowsUsername(''), 'Empty username rejected');

// Test Delay function
console.log('\n--- Test Group 9: Delay Function ---');
const startTime = Date.now();
await helpers.delay(100);
const endTime = Date.now();
const elapsed = endTime - startTime;
assert(elapsed >= 100, `Delay works (${elapsed}ms >= 100ms)`);
assert(elapsed < 200, `Delay is accurate (${elapsed}ms < 200ms)`);

// Test Format Bytes
console.log('\n--- Test Group 10: Format Bytes ---');
assertExists(helpers.formatBytes(0), 'Format zero bytes');
assertExists(helpers.formatBytes(1024), 'Format kilobytes');
assertExists(helpers.formatBytes(1048576), 'Format megabytes');
assertExists(helpers.formatBytes(1073741824), 'Format gigabytes');

// Test Format Duration
console.log('\n--- Test Group 11: Format Duration ---');
const duration1 = helpers.formatDuration(1000);
assert(duration1.includes('1s'), 'Format seconds');

const duration2 = helpers.formatDuration(60000);
assert(duration2.includes('1m'), 'Format minutes');

const duration3 = helpers.formatDuration(3600000);
assert(duration3.includes('1h'), 'Format hours');

// Test isEmpty
console.log('\n--- Test Group 12: isEmpty Function ---');
assert(helpers.isEmpty({}), 'Empty object detected');
assert(!helpers.isEmpty({ key: 'value' }), 'Non-empty object detected');

// Test deepMerge
console.log('\n--- Test Group 13: Deep Merge Function ---');
const obj1 = { a: 1, b: { c: 2 } };
const obj2 = { b: { d: 3 }, e: 4 };
const merged = helpers.deepMerge(obj1, obj2);
assert(merged.a === 1, 'Original property preserved');
assert(merged.b.c === 2, 'Original nested property preserved');
assert(merged.b.d === 3, 'New nested property added');
assert(merged.e === 4, 'New property added');

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
