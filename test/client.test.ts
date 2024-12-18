import { describe, it } from 'node:test';
import { strict as assert } from 'assert';
import { client } from '../src/client';
import { delay } from '../src/helpers/delay';

describe('Using client', () => {
  (global as any).fetch = async (url: string) => {
    if (url === 'https://example.com/success') {
      await delay(500);
      return { status: 200 };
    }
    if (url === 'https://example.com/failure') {
      await delay(500);
      throw { status: 500 };
    }
    throw new Error('Network Error');
  };
  it('Successful request', async () => {
    const result1 = await client('https://example.com/success', 300);
    assert.strictEqual(result1.url, 'https://example.com/success');
    assert.strictEqual(result1.statusCode, 200);
    assert.ok(result1.latency >= 0, 'Latency should be non-negative');
    assert.strictEqual(result1.slow, true);
  });
  it('Failed request', async () => {
    const result2 = await client('https://example.com/failure', 600);
    assert.strictEqual(result2.url, 'https://example.com/failure');
    assert.strictEqual(result2.statusCode, 500);
    assert.ok(result2.latency >= 0, 'Latency should be non-negative');
    assert.strictEqual(result2.slow, false);
  });
  it('Network error', async () => {
    const result3 = await client('https://example.com/error', 500);
    assert.strictEqual(result3.url, 'https://example.com/error');
    assert.strictEqual(
      result3.statusCode,
      undefined,
      'Should handle network errors without a status code',
    );
    assert.ok(result3.latency >= 0, 'Latency should be non-negative');
    assert.strictEqual(result3.slow, false);
  });
});