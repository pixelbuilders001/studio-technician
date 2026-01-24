import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { get as lodashGet } from "lodash";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const get = lodashGet;

export function formatSkillName(skill: string | undefined | null): string {
  if (!skill) return "Not mentioned";
  return skill
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
