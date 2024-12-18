import * as fs from 'fs';
import * as assert from 'assert';
import * as path from 'path';

import { fileURLToPath } from 'url';
import { getConfig } from '../src/clireader';


const createTempFile = (content: string, fileFormat = 'txt'): string => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const tempFilePath = path.join(__dirname, `temp-${Date.now()}.${fileFormat}`);
  fs.writeFileSync(tempFilePath, content, 'utf-8');
  return tempFilePath;
};


export const clireaderTest = async () => {

  // Test 1: Valid files
  const urlFile = createTempFile('http://example.com\nhttp://example.org');
  const configFile = createTempFile(
    JSON.stringify({
      config: { interval: 1000, maxConcurrencyRequest: 5, latencyLimit: 300 },
    }),
  'json');

  process.argv.push('-f', urlFile, '-c', configFile, '-v');
  const result1 = getConfig();

  assert.strictEqual(result1.success, true, 'Test 1 failed: success should be true');
  assert.deepStrictEqual(
    result1.urls,
    ['http://example.com', 'http://example.org'],
    'Test 1 failed: URLs do not match'
  );
  assert.strictEqual(result1.config.verbose, true, 'Test 1 failed: verbose should be true');
  assert.strictEqual(result1.config.interval, 1000, 'Test 1 failed: interval does not match');
  fs.unlinkSync(urlFile);
  fs.unlinkSync(configFile);

  // Test 2: Missing files
  process.argv = process.argv.slice(0, 2);
  process.argv.push('--file', 'missing.txt', '--config', 'missing.json');
  const result2 = getConfig();
  assert.strictEqual(result2.success, false, 'Test 2 failed: success should be false');
  assert.strictEqual(result2.urls.length, 0, 'Test 2 failed: URLs should be empty');
  assert.strictEqual(
    result2.error?.includes('Unable to read file'),
    true,
    'Test 2 failed: error message should include "Unable to read file"'
  );

  console.log('All tests for clireaderTest passed!')
}