import { useCallback } from 'react';
import { useApi } from './useApi';
import api from '@/services/api';

export const useProducts = () => {
  const { loading, error, request } = useApi();

  const getProducts = useCallback((params?: Record<string, unknown>) =>
    request(() => api.get('/v1/products', { params })), []);

  const getProduct = useCallback((id: number) =>
    request(() => api.get(`/v1/products/${id}`)), []);

  const createProduct = useCallback((data: Record<string, unknown>) =>
    request(() => api.post('/v1/products', data)), []);

  const updateProduct = useCallback((id: number, data: Record<string, unknown>) =>
    request(() => api.put(`/v1/products/${id}`, data)), []);

  const deleteProduct = useCallback((id: number) =>
    request(() => api.delete(`/v1/products/${id}`)), []);

  return { loading, error, getProducts, getProduct, createProduct, updateProduct, deleteProduct };
};

export const useUsers = () => {
  const { loading, error, request } = useApi();

  const getUsers = useCallback((params?: Record<string, unknown>) =>
    request(() => api.get('/v1/users', { params })), []);

  const getUser = useCallback((id: number) =>
    request(() => api.get(`/v1/users/${id}`)), []);

  const createUser = useCallback((data: Record<string, unknown>) =>
    request(() => api.post('/v1/users', data)), []);

  const updateUser = useCallback((id: number, data: Record<string, unknown>) =>
    request(() => api.put(`/v1/users/${id}`, data)), []);

  const deleteUser = useCallback((id: number) =>
    request(() => api.delete(`/v1/users/${id}`)), []);

  return { loading, error, getUsers, getUser, createUser, updateUser, deleteUser };
};

export const useTransactions = () => {
  const { loading, error, request } = useApi();

  const getTransactions = useCallback((params?: Record<string, unknown>) =>
    request(() => api.get('/v1/transactions', { params })), []);

  const getTransaction = useCallback((id: number) =>
    request(() => api.get(`/v1/transactions/${id}`)), []);

  const createTransaction = useCallback((data: Record<string, unknown>) =>
    request(() => api.post('/v1/transactions', data)), []);

  return { loading, error, getTransactions, getTransaction, createTransaction };
};

export const useKategori = () => {
  const { loading, error, request } = useApi();

  const getKategoris = useCallback((params?: Record<string, unknown>) =>
    request(() => api.get('/v1/kategoris', { params })), []);

  const createKategori = useCallback((data: Record<string, unknown>) =>
    request(() => api.post('/v1/kategoris', data)), []);

  const updateKategori = useCallback((id: number, data: Record<string, unknown>) =>
    request(() => api.put(`/v1/kategoris/${id}`, data)), []);

  const deleteKategori = useCallback((id: number) =>
    request(() => api.delete(`/v1/kategoris/${id}`)), []);

  return { loading, error, getKategoris, createKategori, updateKategori, deleteKategori };
};
