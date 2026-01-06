import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { get as lodashGet } from "lodash";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const get = lodashGet;
