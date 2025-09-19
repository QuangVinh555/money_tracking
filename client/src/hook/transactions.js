import { useState, useEffect } from 'react';
import transactionsApi from '../api/modules/transactions';

export default function useTransactions(datetime) {
  // Danh sach giao dịch theo tháng được nhóm theo từng ngày(Chức năng hiển thị ở màn hình dashboard)
  const [transactions, setTransactions] = useState([]);
  // Danh sách tất cả giao dịch trong tháng hiện tại(Dùng cho chức năng tìm kiếm ở màn hình quản lý giao dịch)
  const [allTransactions, setAllTransactions] = useState([]);
  // Tính tổng thu nhập cả tháng
  const [totalCard, setTotalCard] = useState(0);
  // Tính tổng thu nhập theo từng ngày nhất định(khi người dùng click vào ngày bất kì để xem giao dịch)
  const [totalCardByDate, setTotalCardByDate] = useState(0);
  // Loading
  const [loading, setLoading] = useState(false);

  // Lấy ra tất cả giao dịch trong tháng hiện tại
  const fetchAllTransactions = async () => {
    try {
      const res = await transactionsApi.getAllTransactions(datetime);
      setAllTransactions(res.data);
    } catch (err) {
      console.error('Lỗi fetch transactions:', err);
    } finally {
      setLoading(false);
    }
  };

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

  // Tạo mới giao dịch
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

  // Cập nhật giao dịch
  const updateTransactions = async (id, data) => {
    await transactionsApi.update(id, data);
    await fetchTransactions();
  };

  // Xóa giao dịch
  const deleteTransactions = async (id) => {
    await transactionsApi.delete(id);
    await fetchTransactions();
  };

  // Render danh sách giao dịch được nhóm theo từng ngày trong tháng
  // Render danh sách tất cả giao dịch
  useEffect(() => {
    fetchTransactions();
    fetchAllTransactions();
  }, [datetime]);

  // Khi nào transactions không [](có data) thì mới gọi api tính toán
  useEffect(() => {
    fetchTotalCardTransactions();
  }, [transactions]);

  return {
    transactions,
    allTransactions,
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
