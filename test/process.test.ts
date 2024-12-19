import { describe, it } from 'node:test';
import { strict as assert } from 'assert';

import { processCheck } from '../src/processCheck';

describe('Process', () => {
  const mockClientFunction = async (url, latencyLimit) => {
    return {
      url,
      latency: Math.min(latencyLimit, 100),
      statusCode: 200,
      start: Date.now(),
      slow: false,
    };
  };

  const mockUrls = ['http://example.com', 'http://example.org', 'http://example.net'];
  const mockConfig = {
    interval: 1000,
    maxConcurrencyRequest: 2,
    latencyLimit: 300,
    verbose: true,
  };

  it('processCheck responses', async () => {
    const responses = await processCheck(mockUrls, mockClientFunction, mockConfig);
    assert.strictEqual(responses.length, mockUrls.length, 'Not all URLs were processed.');
    const responseUrls = responses.map((res) => res.url).sort();
    const inputUrls = [...mockUrls].sort();
    assert.deepStrictEqual(responseUrls, inputUrls, 'Processed URLs do not match input URLs.');
  });
});
