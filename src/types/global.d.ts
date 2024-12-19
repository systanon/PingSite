declare global {
  type Config = {
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

  type Client = (url: string, latencyLimit: number) => Promise<Res>;

  type CliConfig = {
    success: boolean;
    urls: Array<string>;
    config: {
      interval: number;
      maxConcurrencyRequest: number;
      latencyLimit: number;
      verbose: boolean;
    };
    error?: string;
  };

  interface ProgramOptions {
    file: string;
    config: string;
    verbose: boolean;
  }
}

export { Res };
