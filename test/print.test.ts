import { describe, it } from 'node:test';
import { strict as assert } from 'assert';
import { Res } from '../src/types/global';
import { printSilence, validate } from '../src/prints';

describe('Print result', () => {
  describe('Validate response', () => {
    it('Failed requests', () => {
      assert.strictEqual(
        validate({
          statusCode: 400,
          url: 'https://example.com',
          start: Date.now(),
          latency: 200,
          slow: false,
        }),
        true,
      );
      assert.strictEqual(
        validate({
          statusCode: 500,
          url: 'https://example.com',
          start: Date.now(),
          latency: 200,
          slow: false,
        }),
        true,
      );
      assert.strictEqual(
        validate({
          statusCode: 304,
          url: 'https://example.com',
          start: Date.now(),
          latency: 200,
          slow: false,
        }),
        true,
      );
      assert.strictEqual(
        validate({
          statusCode: 200,
          url: 'https://example.com',
          start: Date.now(),
          latency: 200,
          slow: true,
        }),
        true,
      );
    });
    it('successful requests', () => {
      assert.strictEqual(
        validate({
          statusCode: 200,
          url: 'https://example.com',
          start: Date.now(),
          latency: 200,
          slow: false,
        }),
        false,
      );
      assert.strictEqual(
        validate({
          statusCode: 200,
          url: 'https://example.com',
          start: Date.now(),
          latency: 201,
          slow: false,
        }),
        false,
      );
    });

    it('with delayed response', () => {
      assert.strictEqual(
        validate({
          statusCode: 200,
          url: 'https://example.com',
          start: Date.now(),
          latency: 200,
          slow: true,
        }),
        true,
      );
    });
  });
  describe('Print silence', () => {
    const mockConsoleLog = () => {
      const logs: any[] = [];
      const originalConsoleLog = console.log;

      console.log = (...args: any[]) => {
        logs.push(...args);
      };

      return {
        logs,
        restore: () => {
          console.log = originalConsoleLog;
        },
      };
    };
    const mockResponses: Res[] = [
      { statusCode: 400, url: 'https://example.com', start: Date.now(), latency: 200, slow: false },
      { statusCode: 400, url: 'https://example.com', start: Date.now(), latency: 200, slow: false },
      { statusCode: 500, url: 'https://example.com', start: Date.now(), latency: 200, slow: false },
      { statusCode: 200, url: 'https://example.com', start: Date.now(), latency: 200, slow: true },
      { statusCode: 200, url: 'https://example.com', start: Date.now(), latency: 200, slow: false },
    ];

    const expectedOutput = [
      { statusCode: 400, url: 'https://example.com', start: Date.now(), latency: 200, slow: false },
      { statusCode: 400, url: 'https://example.com', start: Date.now(), latency: 200, slow: false },
      { statusCode: 500, url: 'https://example.com', start: Date.now(), latency: 200, slow: false },
      { statusCode: 200, url: 'https://example.com', start: Date.now(), latency: 200, slow: true },
    ];

    it('Print only failed response and with lond answers', () => {
      const mock = mockConsoleLog();
      printSilence(mockResponses);
      mock.restore();

      assert.deepStrictEqual(mock.logs, [expectedOutput]);
    });
  });
});
