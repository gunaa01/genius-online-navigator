import { useState } from 'react';

export function useApiError(): [string | null, (response: Response) => Promise<boolean>] {
  const [error, setError] = useState<string | null>(null);

  const handleError = async (response: Response): Promise<boolean> => {
    if (!response.ok) {
      let data;
      try {
        data = await response.json();
      } catch {
        setError('An error occurred');
        return true;
      }
      setError(data.error || 'An error occurred');
      return true;
    }
    setError(null);
    return false;
  };

  return [error, handleError];
}
