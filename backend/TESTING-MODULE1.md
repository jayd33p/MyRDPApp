# Module 1 Testing Guide

## Overview

This guide explains how to test Module 1 (Configuration, Logging, Middleware, Utilities) to verify everything is working correctly.

## Prerequisites

1. Node.js 18+ installed
2. Backend dependencies installed:
   ```bash
   cd backend
   npm install
   ```
3. `.env` file configured (copy from `.env.example`)

## Test Files

### 1. Configuration Manager Tests (`tests/config.test.js`)

**What it tests:**
- Configuration loading from environment variables
- Server configuration (port, host, HTTPS)
- Database configuration
- RDP settings
- Authentication settings
- Session timeouts
- Security settings
- Rate limiting
- RDPWrap settings
- WebSocket configuration
- Logging configuration
- ConfigManager methods (get, set, getAll)
- Environment detection (isProduction, isDevelopment)

**Run the test:**
```bash
node tests/config.test.js
```

**Expected Output:**
```
=== Module 1: Configuration Manager Tests ===

--- Test Group 1: Configuration Loading ---
✅ PASSED: ConfigManager instance created
✅ PASSED: Config object exists

--- Test Group 2: Server Configuration ---
✅ PASSED: Server port configured
✅ PASSED: Server port is number
...

=== Test Summary ===
Total Tests:  XX
✅ Passed:    XX
❌ Failed:    0
Success Rate: 100.00%

✅ All tests passed!
```

### 2. Helper Functions Tests (`tests/helpers.test.js`)

**What it tests:**
- Session ID generation (unique, proper format)
- Request ID generation
- User ID generation
- Random string generation
- SHA-256 hash function
- Client IP extraction (including X-Forwarded-For)
- Email validation
- Windows username validation
- Delay function accuracy
- Format bytes (KB, MB, GB)
- Format duration (hours, minutes, seconds)
- isEmpty function
- deepMerge function

**Run the test:**
```bash
node tests/helpers.test.js
```

**Expected Output:**
```
=== Module 1: Helper Functions Tests ===

--- Test Group 1: Session ID Generation ---
✅ PASSED: Session ID generated
✅ PASSED: Session ID has correct prefix
✅ PASSED: Session IDs are unique
...

=== Test Summary ===
Total Tests:  XX
✅ Passed:    XX
❌ Failed:    0
Success Rate: 100.00%
```

### 3. Error Classes Tests (`tests/errors.test.js`)

**What it tests:**
- AppError base class
- AuthenticationError (401)
- AuthorizationError (403)
- ValidationError with error details
- NotFoundError (404)
- ConflictError (409)
- RateLimitError (429) with Retry-After
- RDPError (503)
- SessionError
- DatabaseError (500)

**Run the test:**
```bash
node tests/errors.test.js
```

**Expected Output:**
```
=== Module 1: Error Classes Tests ===

--- Test Group 1: AppError ---
✅ PASSED: AppError extends Error
✅ PASSED: Error message set correctly
...

=== Test Summary ===
Total Tests:  XX
✅ Passed:    XX
❌ Failed:    0
Success Rate: 100.00%
```

## Run All Tests

**Option 1: Run individually**
```bash
cd backend
node tests/config.test.js
node tests/helpers.test.js
node tests/errors.test.js
```

**Option 2: Create a test runner (add to package.json)**

Add to `backend/package.json`:
```json
"scripts": {
  "test:module1": "node tests/config.test.js && node tests/helpers.test.js && node tests/errors.test.js",
  "test": "npm run test:module1"
}
```

Then run:
```bash
npm run test:module1
```

## Environment Setup for Testing

### 1. Create a test `.env` file

```bash
cp backend/.env.example backend/.env
```

### 2. Edit `backend/.env` (minimal for testing)

```env
NODE_ENV=development
PORT=8443
HOST=0.0.0.0
HTTPS=false
DB_TYPE=sqlite
DB_PATH=./data/test.db
AUTH_TYPE=windows
JWT_SECRET=test-secret-key-change-in-production
LOG_LEVEL=debug
```

### 3. Create required directories

```bash
mkdir -p backend/data
mkdir -p backend/logs
mkdir -p backend/certs
```

## What Each Test Validates

### Configuration Tests
- ✅ All environment variables load correctly
- ✅ Default values are applied when env vars missing
- ✅ Configuration validation catches errors
- ✅ Directories are created automatically
- ✅ Dot notation access works (e.g., `get('server.port')`)
- ✅ Configuration can be updated at runtime

### Helper Function Tests
- ✅ ID generation creates unique values
- ✅ Hash function is deterministic
- ✅ IP extraction handles proxy headers
- ✅ Validation functions work correctly
- ✅ Formatting functions produce correct output
- ✅ Utilities handle edge cases

### Error Class Tests
- ✅ All error types inherit from AppError
- ✅ HTTP status codes are correct
- ✅ Error codes are properly set
- ✅ Stack traces are captured
- ✅ Error details can be extended

## Troubleshooting

### Issue: "Cannot find module 'express'"
**Solution:** Install dependencies
```bash
cd backend
npm install
```

### Issue: "ENOENT: no such file or directory, open '.env'"
**Solution:** Create .env file
```bash
cp backend/.env.example backend/.env
```

### Issue: Tests hang or timeout
**Solution:** Some tests include a delay. This is normal and tests a 100ms delay function.

### Issue: "Port already in use"
**Solution:** This is only for configuration testing. The actual port isn't used in tests.

## Verification Checklist

After running all tests, verify:

- [ ] All configuration values load without errors
- [ ] Environment detection works correctly
- [ ] Helper functions generate unique IDs
- [ ] Error classes have correct status codes
- [ ] Logs directory is created
- [ ] Database directory is created
- [ ] No sensitive data in logs
- [ ] All assertion messages are clear

## Next Steps

Once Module 1 tests pass:

1. Proceed to **Module 2: Authentication Layer** testing
2. Ensure all 3 test suites pass before moving to Module 3
3. Keep test results for documentation

## Manual Testing

You can also manually test configuration:

```javascript
// In backend/test-manual.js
import configManager from './src/config/configManager.js';

console.log('Server Port:', configManager.get('server.port'));
console.log('DB Type:', configManager.get('database.type'));
console.log('Auth Type:', configManager.get('auth.type'));
console.log('Is Production:', configManager.isProduction());
```

Run:
```bash
node test-manual.js
```

## Performance Baseline

Module 1 tests should complete in < 1 second:

```
Configuration Tests:   ~100ms
Helper Functions:      ~100ms (includes 100ms delay test)
Error Classes:         ~50ms
---
Total:                 ~250ms
```

## Success Criteria

✅ **Module 1 is working correctly if:**

1. All 3 test suites pass 100%
2. No errors in test output
3. All directories created successfully
4. Configuration values match expectations
5. Helper functions generate unique IDs
6. Error classes have correct properties
7. Tests complete within reasonable time

---

**Module 1 Status: Ready for Testing** ✅
