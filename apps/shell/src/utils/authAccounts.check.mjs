import assert from 'node:assert';
import { getMockAccount, MOCK_ACCOUNTS } from './authAccounts.ts';

// 1. Default should return SC70629
const def = getMockAccount();
assert.strictEqual(def.userId, 'SC70629');
assert.strictEqual(def.role, 'sales');
assert.strictEqual(def.defaultRoute, '/initial-data-entry');

// 2. Preset DE001
const de = getMockAccount('DE001');
assert.strictEqual(de.userId, 'DE001');
assert.strictEqual(de.role, 'de');

// 3. Preset SPV001
const spv = getMockAccount('SPV001');
assert.strictEqual(spv.userId, 'SPV001');
assert.strictEqual(spv.role, 'spv_ca');

// 4. Preset CA001
const ca = getMockAccount('CA001');
assert.strictEqual(ca.userId, 'CA001');
assert.strictEqual(ca.role, 'ca');
assert.strictEqual(ca.defaultRoute, '/credit-analyst');

// 5. Custom user fallback
const custom = getMockAccount('tester123');
assert.strictEqual(custom.userId, 'tester123');
assert.strictEqual(custom.role, 'sales');

console.log('✓ All authAccounts bypass self-checks passed!');
