import { getConfig } from './clireader';
import { printVerbose, printSilence } from './prints';
import { client } from './client';
import { processCheck } from './processCheck';

const cliConfig = getConfig();

if (!cliConfig.success) {
  throw new Error(cliConfig.error);
}

const { urls, config } = cliConfig;

export const run = async (
  urls: Array<string>,
  client: Client,
  print: (responses: Array<Res>) => void,
  config: Config,
) => {
  let lastExecutionTime = 0;
  try {
    const responses = await processCheck(urls, client, config);
    lastExecutionTime = Date.now();
    print(responses);
  } catch (error) {
    throw new Error('Error during initial processCheck:', { cause: error });
  }

  while (true) {
    try {
      if (Date.now() - lastExecutionTime >= config.interval) {
        const responses = await processCheck(urls, client, config);
        lastExecutionTime = Date.now();
        print(responses);
      }
    } catch (error) {
      console.error('Error in processLoop:', error);
      break;
    }
  }
};

run(urls, client, config.verbose ? printVerbose : printSilence, config);
