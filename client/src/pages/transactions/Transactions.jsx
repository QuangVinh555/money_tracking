import { Search, PlusCircle, ChevronLeft, ChevronRight, Edit, Trash2 } from "lucide-react";
import {
  Utensils, ShoppingCart, Car, Home, DollarSign,
  Gamepad2, AlertCircle, Briefcase, Building2
} from "lucide-react";
import { useState, useMemo } from "react";
import { formatToLocalDateString } from "../../utils/format";
import useTransactions from "../../hook/transactions";
import { TRANSACTIONS_TYPE } from "../../constants/common";
import ConfirmationModal from "../../component/modals/ConfirmationModal";
import TransactionModal from "../dashboard/TransactionModal";

// --- ICON MAPPING ---
// Map danh mục với icon tương ứng
const categoryIcons = {
  'Ăn uống': <Utensils size={20} className="text-orange-500" />,
  'Giải trí': <Gamepad2 size={20} className="text-pink-500" />,
  'Mua sắm': <ShoppingCart size={20} className="text-blue-500" />,
  'Lương': <DollarSign size={20} className="text-emerald-500" />,
  'Di chuyển': <Car size={20} className="text-green-500" />,
  'Chi phí phát sinh': <AlertCircle size={20} className="text-red-500" />,
  'Thu nhập thêm': <Briefcase size={20} className="text-indigo-500" />,
  'Tiền thuê trọ': <Building2 size={20} className="text-yellow-600" />,
  'Chi phí sinh hoạt': <Home size={20} className="text-purple-500" />,
  'Default': <DollarSign size={20} className="text-gray-500" />,
};

const getCategoryIcon = (category) => categoryIcons[category] || categoryIcons['Default'];

export default function Transactions() {

  const today = useMemo(() => formatToLocalDateString(new Date()), []);
  // API Transactions
  const { loading, transactions, allTransactions, fetchAllTransactions, updateTransactions, deleteTransactions } = useTransactions(today);

  // const [searchTerm, setSearchTerm] = useState('');
  // const [typeFilter, setTypeFilter] = useState('all');
  // const [startDate, setStartDate] = useState('');
  // const [endDate, setEndDate] = useState('');

  const [isModalOpen, setModalOpen] = useState(false);
  const [transactionToEdit, setTransactionToEdit] = useState(null);
  const [transactionToDelete, setTransactionToDelete] = useState(null);

  // const filteredTransactions = useMemo(() => {
  //   return transactions.data?.filter(tx => {
  //     const txDate = new Date(tx.date);
  //     if (searchTerm && !tx.description.toLowerCase().includes(searchTerm.toLowerCase())) return false;
  //     if (typeFilter !== 'all' && tx.type !== typeFilter) return false;
  //     if (startDate && txDate < new Date(startDate)) return false;
  //     if (endDate && txDate > new Date(endDate)) return false;
  //     return true;
  //   });
  // }, [transactions, searchTerm, typeFilter, startDate, endDate]);

  // const filteredTotal = useMemo(() => {
  //   return filteredTransactions?.reduce((acc, tx) => {
  //     if (tx.type === 'income') acc.income += tx.amount;
  //     else acc.expense += tx.amount;
  //     return acc;
  //   }, { income: 0, expense: 0 });
  // }, [filteredTransactions]);

  // const openAddModal = () => {
  //   setTransactionToEdit(null);
  //   setModalOpen(true);
  // };

  // Mở modal chỉnh sửa giao dịch
  const openEditModal = (tx) => {
    setTransactionToEdit(tx);
    setModalOpen(true);
  };
  // Chỉnh sửa giao dịch -> Gọi API
  const handleUpdateTransaction = async (transactionId, data) => {
    await updateTransactions(transactionId, data);
    await fetchAllTransactions();
    setModalOpen(false);
  };

  // Mở modal xóa giao dịch
  const openDeleteConfirm = (tx) => { setTransactionToDelete(tx); };
  // Xóa giao dịch -> Gọi API
  const handleDeleteTransaction = async () => {
    if (!transactionToDelete) return;
    await deleteTransactions(transactionToDelete.transactionId);
    await fetchAllTransactions();
    setTransactionToDelete(null);
  };

  return (
    <>
      <div className="bg-gray-100 p-6 rounded-2xl">
        <div className="p-4 rounded-lg bg-gradient-to-r from-purple-50 to-blue-50 border border-gray-200 mb-6">
          <div className="mb-8 flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Quản lý giao dịch</h1>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            <div className="relative">
              <label className="text-sm font-semibold text-gray-600 mb-1 block">Tìm kiếm</label>
              <Search className="absolute left-3 top-10 text-gray-400" size={20} />
              <input type="text" placeholder="Tên giao dịch..." onChange={e => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-purple-500 focus:border-purple-500" />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-600 mb-1 block">Loại giao dịch</label>
              <select onChange={e => setTypeFilter(e.target.value)} className="w-full px-3 py-2 border rounded-lg bg-white focus:ring-purple-500 focus:border-purple-500">
                <option value="all">Tất cả</option>
                <option value="income">Thu nhập</option>
                <option value="expense">Chi tiêu</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <div>
                <label className="text-sm font-semibold text-gray-600 mb-1 block">Từ ngày</label>
                <input type="date" onChange={e => setStartDate(e.target.value)} className="w-full border rounded-lg px-3 py-2" />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-600 mb-1 block">Đến ngày</label>
                <input type="date" onChange={e => setEndDate(e.target.value)} className="w-full border rounded-lg px-3 py-2" />
              </div>
            </div>
            {/* <button onClick={openAddModal} className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-blue-500 text-white font-semibold px-4 py-2 rounded-lg hover:opacity-90 shadow-md">
              <PlusCircle size={18} />
              <span>Thêm giao dịch</span>
            </button> */}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-green-100 border border-green-200 p-4 rounded-lg">
            <p className="text-sm text-green-800 font-semibold">Tổng thu nhập (lọc)</p>
            <p className="text-xl font-bold text-green-700">{10000000}</p>
          </div>
          <div className="bg-red-100 border border-red-200 p-4 rounded-lg">
            <p className="text-sm text-red-800 font-semibold">Tổng chi tiêu (lọc)</p>
            <p className="text-xl font-bold text-red-700">{5000000}</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="p-4 font-semibold">Tên giao dịch</th>
                <th className="p-4 font-semibold">Ngày</th>
                <th className="p-4 font-semibold">Loại</th>
                <th className="p-4 font-semibold text-right">Số tiền</th>
                <th className="p-4 font-semibold text-center">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {allTransactions.data?.map(tx => (
                <tr key={tx.transactionId} className="border-b hover:bg-gray-50">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-100 rounded-full">{getCategoryIcon(tx.categoryName)}</div>
                      <div>
                        <p className="font-semibold text-gray-800">{tx.description}</p>
                        <p className="text-sm text-gray-500">{tx.category}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-gray-600">{tx.transactionDate}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${tx.transactionType === TRANSACTIONS_TYPE.INCOME ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {tx.transactionType === TRANSACTIONS_TYPE.INCOME ? 'Thu nhập' : 'Chi tiêu'}
                    </span>
                  </td>
                  <td className={`p-4 font-bold text-right ${tx.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                    {tx.type === 'income' ? '+' : '-'} {(tx.amount)}
                  </td>
                  <td className="p-4 text-center">
                    <button onClick={() => openEditModal(tx)} className="p-2 text-gray-500 hover:text-blue-600"><Edit size={18} /></button>
                    <button onClick={() => openDeleteConfirm(tx)} className="p-2 text-gray-500 hover:text-red-600"><Trash2 size={18} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-between items-center mt-6">
          <p className="text-sm text-gray-600">Hiển thị {allTransactions.data?.length} của {allTransactions.data?.length} giao dịch</p>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 border rounded-lg hover:bg-gray-100"><ChevronLeft size={16} /></button>
            <button className="px-3 py-1 border rounded-lg bg-purple-600 text-white">1</button>
            <button className="px-3 py-1 border rounded-lg hover:bg-gray-100">2</button>
            <button className="px-3 py-1 border rounded-lg hover:bg-gray-100"><ChevronRight size={16} /></button>
          </div>
        </div>
      </div>
      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onUpdateTransaction={handleUpdateTransaction}
        transactionToEdit={transactionToEdit}
        selectedDate={transactionToEdit?.transactionDate}
      />
      <ConfirmationModal
        isOpen={!!transactionToDelete}
        onClose={() => setTransactionToDelete(null)}
        onConfirm={handleDeleteTransaction}
        title="Xác nhận Xóa Giao dịch"
        loading={loading}
      >
        <p>
          Bạn có chắc chắn muốn xóa giao dịch
          <span className="mx-1 font-semibold text-red-600">
            ({transactionToDelete?.description}) 
          </span> 
          này không? Hành động này không thể hoàn tác.
        </p>      
      </ConfirmationModal>
    </>
  );
}
