/**
 * Module 1 - Configuration Manager Tests
 * Test all configuration loading, validation, and access methods
 */

import configManager from '../src/config/configManager.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

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
  const passed = JSON.stringify(actual) === JSON.stringify(expected);
  if (!passed) {
    console.log(`   Expected: ${JSON.stringify(expected)}`);
    console.log(`   Actual:   ${JSON.stringify(actual)}`);
  }
  assert(passed, message);
}

function assertExists(value, message) {
  assert(value !== undefined && value !== null, message);
}

function assertType(value, type, message) {
  assert(typeof value === type, `${message} (expected ${type}, got ${typeof value})`);
}

console.log('\n=== Module 1: Configuration Manager Tests ===\n');

// Test 1: Configuration loads without errors
console.log('\n--- Test Group 1: Configuration Loading ---');
assertExists(configManager, 'ConfigManager instance created');
assertExists(configManager.config, 'Config object exists');

// Test 2: Server configuration
console.log('\n--- Test Group 2: Server Configuration ---');
assertExists(configManager.get('server.port'), 'Server port configured');
assertType(configManager.get('server.port'), 'number', 'Server port is number');
assertExists(configManager.get('server.nodeEnv'), 'Node environment configured');
assertExists(configManager.get('server.host'), 'Server host configured');
assert(configManager.get('server.port') > 0, 'Server port is valid');

// Test 3: Database configuration
console.log('\n--- Test Group 3: Database Configuration ---');
assertExists(configManager.get('database.type'), 'Database type configured');
assertType(configManager.get('database.type'), 'string', 'Database type is string');
const dbType = configManager.get('database.type');
assert(
  dbType === 'sqlite' || dbType === 'postgres',
  `Database type is valid (sqlite or postgres), got: ${dbType}`
);

if (dbType === 'sqlite') {
  assertExists(configManager.get('database.path'), 'SQLite path configured');
  assertType(configManager.get('database.path'), 'string', 'SQLite path is string');
}

// Test 4: RDP configuration
console.log('\n--- Test Group 4: RDP Configuration ---');
assertExists(configManager.get('rdp.host'), 'RDP host configured');
assertExists(configManager.get('rdp.port'), 'RDP port configured');
assertType(configManager.get('rdp.port'), 'number', 'RDP port is number');
assertType(configManager.get('rdp.enableClipboard'), 'boolean', 'RDP clipboard is boolean');
assertType(configManager.get('rdp.frameRate'), 'number', 'RDP frame rate is number');
assertType(configManager.get('rdp.quality'), 'number', 'RDP quality is number');

const frameRate = configManager.get('rdp.frameRate');
assert(frameRate >= 1 && frameRate <= 60, `Frame rate valid (1-60): ${frameRate}`);

const quality = configManager.get('rdp.quality');
assert(quality >= 10 && quality <= 100, `Quality valid (10-100): ${quality}`);

// Test 5: Authentication configuration
console.log('\n--- Test Group 5: Authentication Configuration ---');
assertExists(configManager.get('auth.type'), 'Auth type configured');
const authType = configManager.get('auth.type');
assert(
  authType === 'windows' || authType === 'ldap' || authType === 'active-directory',
  `Auth type is valid: ${authType}`
);

// Test 6: Session configuration
console.log('\n--- Test Group 6: Session Configuration ---');
assertExists(configManager.get('session.timeout'), 'Session timeout configured');
assertType(configManager.get('session.timeout'), 'number', 'Session timeout is number');
assertExists(configManager.get('session.idleTimeout'), 'Idle timeout configured');
assertType(configManager.get('session.idleTimeout'), 'number', 'Idle timeout is number');
assertType(configManager.get('session.maxPerUser'), 'number', 'Max sessions per user is number');

const sessionTimeout = configManager.get('session.timeout');
assert(sessionTimeout > 0, `Session timeout is positive: ${sessionTimeout}ms`);

// Test 7: Security configuration
console.log('\n--- Test Group 7: Security Configuration ---');
assertExists(configManager.get('security.jwtSecret'), 'JWT secret configured');
assertType(configManager.get('security.jwtSecret'), 'string', 'JWT secret is string');
assertExists(configManager.get('security.jwtExpiry'), 'JWT expiry configured');
assertExists(configManager.get('security.allowedOrigins'), 'Allowed origins configured');
assertType(configManager.get('security.allowedOrigins'), 'object', 'Allowed origins is array');

// Test 8: Rate limiting configuration
console.log('\n--- Test Group 8: Rate Limiting Configuration ---');
assertExists(configManager.get('rateLimit.windowMs'), 'Rate limit window configured');
assertType(configManager.get('rateLimit.windowMs'), 'number', 'Rate limit window is number');
assertExists(configManager.get('rateLimit.maxRequests'), 'Rate limit max requests configured');
assertType(configManager.get('rateLimit.maxRequests'), 'number', 'Rate limit max is number');

// Test 9: RDPWrap configuration
console.log('\n--- Test Group 9: RDPWrap Configuration ---');
assertExists(configManager.get('rdpwrap.enabled'), 'RDPWrap enabled flag configured');
assertType(configManager.get('rdpwrap.enabled'), 'boolean', 'RDPWrap enabled is boolean');
assertExists(configManager.get('rdpwrap.maxSessions'), 'RDPWrap max sessions configured');
assertType(configManager.get('rdpwrap.maxSessions'), 'number', 'RDPWrap max sessions is number');

// Test 10: WebSocket configuration
console.log('\n--- Test Group 10: WebSocket Configuration ---');
assertExists(configManager.get('websocket.pingInterval'), 'WS ping interval configured');
assertType(configManager.get('websocket.pingInterval'), 'number', 'WS ping interval is number');
assertExists(configManager.get('websocket.pingTimeout'), 'WS ping timeout configured');
assertType(configManager.get('websocket.pingTimeout'), 'number', 'WS ping timeout is number');

// Test 11: Logging configuration
console.log('\n--- Test Group 11: Logging Configuration ---');
assertExists(configManager.get('logging.level'), 'Log level configured');
assertType(configManager.get('logging.level'), 'string', 'Log level is string');
assertExists(configManager.get('logging.file'), 'Log file path configured');
assertType(configManager.get('logging.file'), 'string', 'Log file path is string');

// Test 12: Get method with dot notation
console.log('\n--- Test Group 12: ConfigManager Get Method ---');
const port = configManager.get('server.port');
assertType(port, 'number', 'get() method returns correct type');

const defaultValue = configManager.get('non.existent.path', 'default');
equals(defaultValue, 'default', 'get() returns default value for non-existent paths');

function equals(a, b, msg) {
  assert(a === b, msg);
}

// Test 13: Set method
console.log('\n--- Test Group 13: ConfigManager Set Method ---');
configManager.set('test.property', 'testValue');
const testValue = configManager.get('test.property');
equals(testValue, 'testValue', 'set() method stores value correctly');

// Test 14: getAll method
console.log('\n--- Test Group 14: ConfigManager GetAll Method ---');
const allConfig = configManager.getAll();
assertExists(allConfig, 'getAll() returns config object');
assertExists(allConfig.server, 'getAll() includes server config');
assertExists(allConfig.database, 'getAll() includes database config');
assertExists(allConfig.rdp, 'getAll() includes RDP config');

// Test 15: Environment detection
console.log('\n--- Test Group 15: Environment Detection ---');
assertType(configManager.isProduction(), 'boolean', 'isProduction() returns boolean');
assertType(configManager.isDevelopment(), 'boolean', 'isDevelopment() returns boolean');
const isProd = configManager.isProduction();
const isDev = configManager.isDevelopment();
assert(
  (isProd && !isDev) || (!isProd && isDev) || (!isProd && !isDev),
  'Environment state is consistent'
);

// Test 16: Feature flags
console.log('\n--- Test Group 16: Feature Flags ---');
assertExists(configManager.get('features.sessionRecording'), 'Session recording flag exists');
assertType(configManager.get('features.sessionRecording'), 'boolean', 'Session recording flag is boolean');
assertExists(configManager.get('features.mfa'), 'MFA flag exists');
assertType(configManager.get('features.mfa'), 'boolean', 'MFA flag is boolean');

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
