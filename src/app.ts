import { cliReader, Config } from "./clireader";


type Res = {
  url: string,
  statusCode: number,
  start: number,
  latency: number, 
  slow: boolean,
}


type Client = (url: string) => Promise<Res>

const {urls, config} = cliReader.getConfig()



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

const process1 = async (queue: Array<string>, client: Client, print: (responses: Array<Res>) => void, config: Config | undefined): Promise<Array<Res>> => {
  const MAX = config?.maxConcurrencyRequest
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



const run = (urls: Array<string> , client: Client, print: (responses: Array<Res>) => void, config: Config | undefined) => {
  if(!urls.length && !config) return
  const responses = process1(urls, client,print , config)
  console.log(responses)
}

run(urls, client, true ? printVerbose : printSilence, config)
// --verbose -v


