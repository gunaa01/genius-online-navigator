import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility function to merge class names with Tailwind CSS
 * Combines the functionality of clsx and tailwind-merge
 * 
 * @example
 * cn("text-red-500", isActive && "bg-blue-500", "p-4")
 * 
 * @param inputs - Class values to be combined
 * @returns Merged class string
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
