import { useState, useCallback } from 'react';

export const useApi = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const request = useCallback(async (apiCall: () => Promise<unknown>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiCall();
      return response;
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { detail?: string } } };
      const detail = axiosErr?.response?.data?.detail;
      const message = typeof detail === 'string' ? detail : 'Terjadi kesalahan pada server';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, request };
};
