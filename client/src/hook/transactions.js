import { useState, useEffect } from 'react';
import transactionsApi from '../api/modules/transactions';

export default function useTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = async () => {
    try {
      const res = await transactionsApi.getAll();
      setTransactions(res.data);
    } catch (err) {
      console.error('Lỗi fetch transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  const createTransactions = async (data) => {
    await transactionsApi.create(data);
    await fetchTransactions();
  };

  const updateTransactions = async (id, data) => {
    await transactionsApi.update(id, data);
    await fetchTransactions();
  };

  const deleteTransactions = async (id) => {
    await transactionsApi.delete(id);
    await fetchTransactions();
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return {
    transactions,
    loading,
    createTransactions,
    updateTransactions,
    deleteTransactions,
  };
}
