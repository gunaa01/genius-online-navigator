
/**
 * Utility functions for safely working with arrays
 */

/**
 * Safely filters an array with type checking
 * @param arr The array to filter or any value
 * @param predicate The filter function
 * @returns Filtered array or empty array if input is not an array
 */
export function safeFilter<T>(
  arr: T[] | null | undefined, 
  predicate: (value: T, index: number, array: T[]) => boolean
): T[] {
  if (!Array.isArray(arr)) {
    console.warn('safeFilter: Expected an array but received:', arr);
    return [];
  }
  return arr.filter(predicate);
}

/**
 * Safely maps an array with type checking
 * @param arr The array to map or any value
 * @param mapper The mapping function
 * @returns Mapped array or empty array if input is not an array
 */
export function safeMap<T, U>(
  arr: T[] | null | undefined, 
  mapper: (value: T, index: number, array: T[]) => U
): U[] {
  if (!Array.isArray(arr)) {
    console.warn('safeMap: Expected an array but received:', arr);
    return [];
  }
  return arr.map(mapper);
}

/**
 * Safely gets array length with type checking
 * @param arr The array or any value
 * @returns Length of array or 0 if input is not an array
 */
export function safeLength(arr: any[] | null | undefined): number {
  if (!Array.isArray(arr)) {
    return 0;
  }
  return arr.length;
}

/**
 * Safely checks if an array includes a value with type checking
 * @param arr The array or any value
 * @param value The value to check
 * @returns True if array includes value, false otherwise
 */
export function safeIncludes<T>(
  arr: T[] | null | undefined, 
  value: T
): boolean {
  if (!Array.isArray(arr)) {
    return false;
  }
  return arr.includes(value);
}

/**
 * Safely gets an array element at an index with type checking
 * @param arr The array or any value
 * @param index The index to access
 * @returns Element at index or undefined if not found/not an array
 */
export function safeGet<T>(
  arr: T[] | null | undefined, 
  index: number
): T | undefined {
  if (!Array.isArray(arr) || index < 0 || index >= arr.length) {
    return undefined;
  }
  return arr[index];
}

/**
 * Ensures a value is an array
 * @param value The value to check
 * @param defaultValue Optional default array to return if value is not an array
 * @returns The array or defaultValue/empty array if not an array
 */
export function ensureArray<T>(
  value: T[] | T | null | undefined, 
  defaultValue: T[] = []
): T[] {
  if (Array.isArray(value)) {
    return value;
  }
  
  if (value === null || value === undefined) {
    return defaultValue;
  }
  
  return [value as T];
}
