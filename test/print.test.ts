import { strict as assert } from "assert";
import { Res } from "../src/types/global"
import { printSilence, errorStatus } from "../src/prints"; 

export const printTests = () => {
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

try {
  console.log("Testing errorStatus...");

  assert.strictEqual(errorStatus({ statusCode: 400, url: "https://example.com", start: Date.now(), latency: 200, slow: false }), true);
  assert.strictEqual(errorStatus({ statusCode: 500, url: "https://example.com", start: Date.now(), latency: 200, slow: false  }), true);
  assert.strictEqual(errorStatus({ statusCode: 200, url: "https://example.com", start: Date.now(), latency: 200, slow: false }), false);
  assert.strictEqual(errorStatus({ statusCode: 304, url: "https://example.com", start: Date.now(), latency: 200, slow: false  }), true);

  console.log("Test for errorStatus Done!");

  console.log("Testing printSilence...");

  const mockResponses: Res[] = [
    { statusCode: 400, url: "https://example.com", start: Date.now(), latency: 200, slow: false },
    { statusCode: 400, url: "https://example.com", start: Date.now(), latency: 200, slow: false },
    { statusCode: 500, url: "https://example.com", start: Date.now(), latency: 200, slow: false  },
  ];

  const expectedOutput = [
    { statusCode: 400, url: "https://example.com", start: Date.now(), latency: 200, slow: false },
    { statusCode: 400, url: "https://example.com", start: Date.now(), latency: 200, slow: false },
    { statusCode: 500, url: "https://example.com", start: Date.now(), latency: 200, slow: false  },
  ];

  const mock = mockConsoleLog();
  printSilence(mockResponses);
  mock.restore();

  assert.deepStrictEqual(mock.logs, [expectedOutput]);

  console.log("Test for printTests done!");

  console.log("All tests for printTests passed successfully!");
} catch (error) {
  console.error("Tests for printTests failed:");
  console.error(error.message);
  process.exit(1);
}

}