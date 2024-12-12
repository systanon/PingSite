import { Command } from '@commander-js/extra-typings';
import * as fs from 'fs';

const program = new Command();
  
program
.option('-f, --file <path>', 'specify the file containing a list of URLs and config');

program.parse();

interface ProgramOptions {
  file?: string;
}

export type Config = {
  interval: string,
  maxConcurrencyRequest: number,
  latencyLimit: number,
}
type CliConfig = {
  urls: Array<string> | []; 
  config: Config | undefined;
}

export class CliReader {
    private fileReader: any
    private cliParser: Command
    constructor(fs: any, cliParser: Command) {
      
      this.fileReader = fs
      this.cliParser = cliParser
    }

    cliRead() {
      return this.cliParser.opts();
    }

    getConfig (): CliConfig {
      try {
        const options: ProgramOptions = this.cliRead()
        const content = this.fileReader.readFileSync(options.file, 'utf-8');
        const data: CliConfig = JSON.parse(content);
        const {urls, config} = data
        return {
          urls,
          config
        };
      } catch {
        return {
            urls: [],
            config: undefined
        }  
      }

    }
}

export const cliReader = new CliReader(fs, program)
