import { useState, useEffect } from 'react';
import transactionsApi from '../api/modules/transactions';

export default function useTransactions(datetime) {
  const [transactions, setTransactions] = useState([]);
  const [totalCard, setTotalCard] = useState(0);
  const [totalCardByDate, setTotalCardByDate] = useState(0);
  const [loading, setLoading] = useState(false);

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

    // Tính thu nhập chi tiêu các giao dịch trong một ngày được chọn
    const fetchTotalCardByDateTransactions = async (selectedDate) => {
    try {
      const res = await transactionsApi.getTotalCardByDate(selectedDate);
      setTotalCardByDate(res.data);
    } catch (err) {
      console.error('Lỗi fetch transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  const createTransactions = async (data) => {
    try {
      setLoading(true);
      await transactionsApi.create(data);
      await fetchTransactions();
    } catch (err) {
      console.error('Lỗi tạo transactions:', err);
    } finally {
      setLoading(false);
    }
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

  // Khi nào transactions không [](có data) thì mới gọi api tính toán
  useEffect(() => {
    fetchTotalCardTransactions();
  }, [transactions]);

  return {
    transactions,
    totalCard,
    totalCardByDate,
    loading,
    createTransactions,
    updateTransactions,
    deleteTransactions,
    fetchTransactions,
    fetchTotalCardTransactions,
    fetchTotalCardByDateTransactions
  };
}
