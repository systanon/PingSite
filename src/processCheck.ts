export const processCheck = async (
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
