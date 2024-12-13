import { getConfig } from "./clireader";

export type Config = {
    interval: number;
    maxConcurrencyRequest: number;
    latencyLimit: number;
    verbose: boolean;

}; 
type Res = {
  url: string,
  statusCode: number,
  start: number,
  latency: number, 
  slow: boolean,
}


type Client = (url: string) => Promise<Res>

const cliConfig = getConfig()

if (!cliConfig.success) {
  throw new Error(cliConfig.error)
}

const { urls, config } = cliConfig


const client: Client = async (url: string) => {
  const start = Date.now()

  const statusCode: number = await fetch(url).then(async (res): Promise<number> => {
    return res.status
  }).catch(async (res): Promise<number> => {
    return res.status
  })
  
  const latency = Date.now() - start

  return {
    url,
    statusCode,
    start,
    latency,
    slow: false,
  }
}

const process1 = async (queue: Array<string>, client: Client, print: (responses: Array<Res>) => void, config: Config): Promise<Array<Res>> => {
  const MAX = config.maxConcurrencyRequest
  const responses: Array<Res> = []
  const greenTread = async () => {
    while (queue.length > 0) {
      const url = queue.pop()
      if (!url) break

      const res: Res = await client(url)

      responses.push(res)
    }
  }

  const promises = new Array(MAX).fill(() => {}).map(greenTread)
  await Promise.all(promises)
  print(responses)
  return responses
}

const printSilence = (responses: Array<Res>) => { }
const printVerbose = (responses: Array<Res>) => { console.log(responses)}



const run = (urls: Array<string>, client: Client, print: (responses: Array<Res>) => void, config: Config) => {
  const responses = process1(urls, client,print , config)
}

run(urls, client, config.verbose ? printVerbose : printSilence, config)


