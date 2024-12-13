import { getConfig } from './clireader';

export type Config = {
  interval: number;
  maxConcurrencyRequest: number;
  latencyLimit: number;
  verbose: boolean;
};
type Res = {
  url: string;
  statusCode: number;
  start: number;
  latency: number;
  slow: boolean;
};

type Client = (url: string) => Promise<Res>;

const cliConfig = getConfig();

if (!cliConfig.success) {
  throw new Error(cliConfig.error);
}

const { urls, config } = cliConfig;
console.log('TCL: config', config);

const client: Client = async (url: string) => {
  const start = Date.now();

  const statusCode: number = await fetch(url)
    .then(async (res): Promise<number> => {
      return res.status;
    })
    .catch(async (res): Promise<number> => {
      return res.status;
    });

  const latency = Date.now() - start;

  return {
    url,
    statusCode,
    start,
    latency,
    slow: false,
  };
};

const process1 = async (
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

      const res: Res = await client(url);

      responses.push(res);
    }
  };

  const promises = new Array(MAX).fill(() => {}).map(greenTread);
  await Promise.all(promises);
  return responses;
};

const printSilence = (responses: Array<Res>) => {};
const printVerbose = (responses: Array<Res>) => {
  console.log(responses);
};

const run = async (
  urls: Array<string>,
  client: Client,
  print: (responses: Array<Res>) => void,
  config: Config,
) => {
  let firstStart = false;
  let lastExecutionTime = 0;

  const processLoop = async () => {
    if (!firstStart) {
      firstStart = true;
      const responses = await process1(urls, client, config);
      lastExecutionTime = Date.now();
      print(responses);
    }
    if (Date.now() - lastExecutionTime >= config.interval) {
      const responses = await process1(urls, client, config);
      lastExecutionTime = Date.now();
      print(responses);
    }
  };

  while (true) {
    try {
      await processLoop();
      await new Promise((resolve) => setTimeout(resolve, 5000));
    } catch {
      break;
    }
  }
};

run(urls, client, config.verbose ? printVerbose : printSilence, config);
