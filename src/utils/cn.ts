import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines multiple class names into a single string using clsx and tailwind-merge
 * This utility helps with conditional classes and prevents class conflicts
 * 
 * @example
 * cn("text-red-500", isActive && "bg-blue-500", "p-4")
 * 
 * @param inputs - Class values to be combined
 * @returns Merged class string
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
