import { printTests } from "./print.test";
import { clientTest } from "./client.test";
import { clireaderTest } from "./clireader.test";

const runTests = async () => {
  await clientTest();
  printTests();
  clireaderTest()
};

runTests();