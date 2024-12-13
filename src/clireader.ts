import { Command } from '@commander-js/extra-typings';
import * as fs from 'fs';

const program = new Command();

program
  .option('-f, --file <path>', 'specify the file containing URLs')
  .option('-c, --config <path>', 'specify the file containing config')
  .option('-v, --verbose', 'flag to print result');

program.parse();

export const getConfig = (): CliConfig => {
  try {
    const options = program.opts() as ProgramOptions;
    const verbose = options.verbose ?? false
    const _urls = fs.readFileSync(options.file, 'utf-8').trim().split(/\s+/);
    const { config } = JSON.parse(fs.readFileSync(options.config, 'utf-8'));
    return {
      success: true,
      urls: _urls,
      config: { ...config, verbose},
    };
  } catch (error: unknown) {
    return {
      success: false,
      urls: [],
      config: {
        interval: 0,
        maxConcurrencyRequest: 0,
        latencyLimit: 0,
        verbose: false
      },
      error: `Unable to read file ${error}`,
    };
  }
};
