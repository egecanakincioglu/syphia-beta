import { promisify } from "util";

export const createTimeout = promisify(setTimeout);

export function capitalize(string: string): string {
  const [first = "", ...others] = string;
  return `${first.toLocaleLowerCase(), others.join("")}`; 
}