import { useState, useEffect, useCallback } from 'react';
import api from '@/services/api';

interface PaginationParams {
  page?: number;
  page_size?: number;
  q?: string;
  sort_by?: string;
  sort_dir?: 'asc' | 'desc';
}

export const usePagination = <T>(endpoint: string, initialParams?: PaginationParams) => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(initialParams?.page || 1);
  const [pageSize] = useState(initialParams?.page_size || 20);
  const [search, setSearch] = useState(initialParams?.q || '');

  const fetchData = useCallback(async (params?: PaginationParams) => {
    setLoading(true);
    try {
      const res = await api.get(endpoint, {
        params: { page, page_size: pageSize, q: search, ...params }
      });
      setData(res.data.data || res.data.items || res.data);
      setTotal(res.data.total || res.data.count || 0);
    } catch {
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [endpoint, page, pageSize, search]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const totalPages = Math.ceil(total / pageSize);

  return { data, loading, total, page, setPage, totalPages, search, setSearch, refetch: fetchData };
};
