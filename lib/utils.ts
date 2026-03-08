import { clsx } from "clsx"

// merge class names just like before
export function cn(...inputs: unknown[]) {
  // clsx already handles arrays / objects / strings
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return clsx(...inputs)
}
