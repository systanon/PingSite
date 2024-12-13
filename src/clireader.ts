import { Command } from '@commander-js/extra-typings';
import * as fs from 'fs';

const program = new Command();

program
  .option('-f, --file <path>', 'specify the file containing URLs')
  .option('-c, --config <path>', 'specify the file containing config');

program.parse();

interface ProgramOptions {
  file: string;
  config: string;
}

export type CliConfig = {
  success: boolean;
  urls: Array<string>;
  config: {
    interval: number;
    maxConcurrencyRequest: number;
    latencyLimit: number;
  };
  error?: string;
};

export const getConfig = (): CliConfig => {
  try {
    const options = program.opts() as ProgramOptions;
    const _urls = fs.readFileSync(options.file, 'utf-8').trim().split(/\s+/);
    const _config = JSON.parse(fs.readFileSync(options.config, 'utf-8'));
    return {
      success: true,
      urls: _urls,
      config: _config,
    };
  } catch (error: unknown) {
    return {
      success: false,
      urls: [],
      config: {
        interval: 0,
        maxConcurrencyRequest: 0,
        latencyLimit: 0,
      },
      error: `Unable to read file ${error}`,
    };
  }
};
