import { validateUrl } from "./validation.ts";

export function readArg(): string[] {
  const args: string[] = process.argv.slice(2)
  if (!args.length) {
    console.warn('Empty arguments')
    return args
  } 
  return args.map(validateUrl);
}