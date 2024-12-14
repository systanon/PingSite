import { strict as assert } from "assert";
import { client } from "../src/client";

(global as any).fetch = async (url: string) => {
  if (url === "https://example.com/success") {
    return { status: 200 };
  }
  if (url === "https://example.com/failure") {
    throw { status: 500 };
  }
  throw new Error("Network Error");
};

export const clientTest = async () => {
  try {
    console.log("Running tests for clientTest...");

    // Test 1: Successful request
    const result1 = await client("https://example.com/success");
    assert.strictEqual(result1.url, "https://example.com/success");
    assert.strictEqual(result1.statusCode, 200);
    assert.ok(result1.latency >= 0, "Latency should be non-negative");
    assert.strictEqual(result1.slow, false);
    console.log("Test 1 passed: Successful request");

    // Test 2: Request fails with status 500
    const result2 = await client("https://example.com/failure");
    assert.strictEqual(result2.url, "https://example.com/failure");
    assert.strictEqual(result2.statusCode, 500);
    assert.ok(result2.latency >= 0, "Latency should be non-negative");
    assert.strictEqual(result2.slow, false);
    console.log("Test 2 passed: Request fails with status 500");

    // Test 3: Network error
    const result3 = await client("https://example.com/error");
    assert.strictEqual(result3.url, "https://example.com/error");
    assert.strictEqual(result3.statusCode, undefined, "Should handle network errors without a status code");
    assert.ok(result3.latency >= 0, "Latency should be non-negative");
    assert.strictEqual(result3.slow, false);
    console.log("Test 3 passed: Network error");

    console.log("All tests for clientTest passed!");
  } catch (error) {
    console.error("A test for clientTest failed:", error.message);
    process.exit(1);
  }
};