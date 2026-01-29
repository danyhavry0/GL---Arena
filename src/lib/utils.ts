import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Email case-insensitive: normalizza sempre in minuscolo e trim. */
export function normalizeEmail(email: string): string {
  return String(email ?? "").trim().toLowerCase();
}
