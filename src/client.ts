export const client: Client = async (url: string, latencyLimit: number) => {
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
    slow: latency >= latencyLimit,
  };
};
