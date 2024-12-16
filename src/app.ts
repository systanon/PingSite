import { getConfig } from './clireader';
import { printVerbose, printSilence} from './prints'
import { client } from './client'



const cliConfig = getConfig();

if (!cliConfig.success) {
  throw new Error(cliConfig.error);
}

const { urls, config } = cliConfig;

const processCheck = async (
  urls: Array<string>,
  client: Client,
  config: Config,
): Promise<Array<Res>> => {
  const _urls = [...urls];
  const MAX = config.maxConcurrencyRequest;
  const responses: Array<Res> = [];
  const greenTread = async () => {
    while (_urls.length > 0) {
      const url = _urls.pop();
      if (!url) break;

      const res: Res = await client(url, config.latencyLimit);

      responses.push(res);
    }
  };

  const promises = new Array(MAX).fill(() => {}).map(greenTread);
  await Promise.all(promises);
  return responses;
};

const run = async (
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
