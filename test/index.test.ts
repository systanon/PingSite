import { printTests } from "./print.test";
import { clientTest } from "./client.test";

const runTests = async () => {
  await printTests();
  await clientTest();
};

runTests();