import { useState, useEffect } from 'react';
import transactionsApi from '../api/modules/transactions';

export default function useTransactions(datetime) {
  const [transactions, setTransactions] = useState([]);
  const [totalCard, setTotalCard] = useState(0);
  const [loading, setLoading] = useState(true);

  // Lấy những giao dịch theo tháng được group by theo từng ngày
  const fetchTransactions = async () => {
    try {
      const res = await transactionsApi.getAllTransactionsByGroupDate(datetime);
      setTransactions(res.data);
    } catch (err) {
      console.error('Lỗi fetch transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  // Tính thu nhập chi tiêu các giao dịch trong một tháng
    const fetchTotalCardTransactions = async () => {
    try {
      const res = await transactionsApi.getTotalCard(datetime);
      setTotalCard(res.data);
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
  }, [datetime]);

  useEffect(() => {
    fetchTotalCardTransactions();
  }, [transactions]);

  return {
    transactions,
    totalCard,
    loading,
    createTransactions,
    updateTransactions,
    deleteTransactions,
  };
}
