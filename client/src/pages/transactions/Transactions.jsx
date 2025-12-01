import { Search, PlusCircle, ChevronLeft, ChevronRight, Edit, Trash2 } from "lucide-react";
import {
  Utensils, ShoppingCart, Car, Home, DollarSign,
  Gamepad2, AlertCircle, Briefcase, Building2
} from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { formatToLocalDateString, getFirstDayOfCurrentMonth, getTodayDate } from "../../utils/format";
import useTransactions from "../../hook/transactions";
import { TRANSACTIONS_TYPE } from "../../constants/common";
import ConfirmationModal from "../../component/modals/ConfirmationModal";
import TransactionModal from "../dashboard/TransactionModal";
import { formatCurrency } from "../../utils/format";

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
  const { loading, allTransactions, fetchAllTransactions, updateTransactions, deleteTransactions } = useTransactions(today);
  
  // Pagination state(mặc định trang 1, 10 item/trang)
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  // const initialQueryParams = useMemo(() => ({
  //   descriptions: "",
  //   transactionType: "",
  //   fromDate: getFirstDayOfCurrentMonth(),
  //   toDate: getTodayDate(),
  // }), []);
  // const [queryParams, setQueryParams] = useState(initialQueryParams);
  const [queryParams, setQueryParams] = useState({
    descriptions: "",
    transactionType: "",
    fromDate: getFirstDayOfCurrentMonth(),
    toDate: getTodayDate(),
  });
  // Input tìm kiếm (debounce) descriptions
  const [descriptionsInput, setDescriptionsInput] = useState('');

  const [isModalOpen, setModalOpen] = useState(false);
  const [transactionToEdit, setTransactionToEdit] = useState(null);
  const [transactionToDelete, setTransactionToDelete] = useState(null);

  // Reset về trang 1 khi filter thay đổi
  useEffect(() => {
    setPageNumber(1);
    setPageSize(10) // thêm để khỏi bị warning
  }, [queryParams]);

  // Debounce cho input descriptions
  useEffect(() => {
    const handler = setTimeout(() => {
      // Cập nhật queryParams khi người dùng ngừng gõ 500ms
      setQueryParams(prev => ({ ...prev, descriptions: descriptionsInput }));
    }, 500); // 700ms là thời gian chờ, có thể chỉnh

    return () => clearTimeout(handler); // clear timeout nếu user gõ tiếp
  }, [descriptionsInput]);

  // Khi pageNumber hoặc pageSize thay đổi thì fetch lại data
  useEffect(() => {
    fetchAllTransactions(pageNumber, pageSize, queryParams);
  }, [pageNumber, pageSize, queryParams]);

  // Mở modal chỉnh sửa giao dịch
  const openEditModal = (tx) => {
    setTransactionToEdit(tx);
    setModalOpen(true);
  };
  // Chỉnh sửa giao dịch -> Gọi API
  const handleUpdateTransaction = async (transactionId, data) => {
    await updateTransactions(transactionId, data);
    await fetchAllTransactions(pageNumber, pageSize, queryParams);
    setModalOpen(false);
  };

  // Mở modal xóa giao dịch
  const openDeleteConfirm = (tx) => { setTransactionToDelete(tx); };
  // Xóa giao dịch -> Gọi API
  const handleDeleteTransaction = async () => {
    if (!transactionToDelete) return;
    await deleteTransactions(transactionToDelete.transactionId);
    await fetchAllTransactions(pageNumber, pageSize, queryParams);
    setTransactionToDelete(null);
  };

  // Tính toán thông tin phân trang
  const pagination = useMemo(() => {
    const totalCount = allTransactions.data?.totalCount || 0;
    const totalPages = allTransactions.data?.totalPages || 1;
    // Tính toán startItem và endItem dựa trên pageNumber, pageSize và totalCount
    const startItem = totalCount === 0 ? 0 : (pageNumber - 1) * pageSize + 1;
    const endItem = Math.min(pageNumber * pageSize, totalCount);

    return { totalCount, totalPages, startItem, endItem };
  }, [allTransactions.data, pageNumber, pageSize]);

  const gotoPage = (p) => {
    if (p < 1 || p > pagination.totalPages) return;
    setPageNumber(p);
  };

  const handleQueryParamChange = (key, value) => {
    setQueryParams(prev => ({ ...prev, [key]: value }));
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
              <input 
                type="text" 
                placeholder="Tên giao dịch..." 
                value={descriptionsInput}
                onChange={e => setDescriptionsInput(e.target.value)} 
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-purple-500 focus:border-purple-500" 
              />            
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-600 mb-1 block">Loại giao dịch</label>
              <select 
                value={queryParams.transactionType}
                onChange={e => handleQueryParamChange('transactionType', e.target.value)} 
                className="w-full px-3 py-2 border rounded-lg bg-white focus:ring-purple-500 focus:border-purple-500"
              >                
                <option value="">Tất cả</option>
                <option value="1">Thu nhập</option>
                <option value="2">Chi tiêu</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <div>
                <label className="text-sm font-semibold text-gray-600 mb-1 block">Từ ngày</label>
                <input 
                  type="date" 
                  value={queryParams.fromDate}
                  onChange={e => handleQueryParamChange('fromDate', e.target.value)} 
                  className="w-full border rounded-lg px-3 py-2" 
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-600 mb-1 block">Đến ngày</label>
                <input 
                  type="date" 
                  value={queryParams.toDate}
                  onChange={e => handleQueryParamChange('toDate', e.target.value)} 
                  className="w-full border rounded-lg px-3 py-2" 
                />              
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-green-100 border border-green-200 p-4 rounded-lg">
            <p className="text-sm text-green-800 font-semibold">Tổng thu nhập (lọc)</p>
            <p className="text-xl font-bold text-green-700">{allTransactions.data?.items[0]?.income ?? 0}</p>
          </div>
          <div className="bg-red-100 border border-red-200 p-4 rounded-lg">
            <p className="text-sm text-red-800 font-semibold">Tổng chi tiêu (lọc)</p>
            <p className="text-xl font-bold text-red-700">{allTransactions.data?.items[0]?.expense ?? 0}</p>
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
              {allTransactions.data?.items?.map(tx => (
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
                  <td className={`p-4 font-bold text-right ${tx.transactionType === TRANSACTIONS_TYPE.INCOME ? 'text-green-600' : 'text-red-600'}`}>
                    {tx.transactionType === TRANSACTIONS_TYPE.INCOME ? '+' : '-'} {formatCurrency(tx.amount)}
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
          <p className="text-sm text-gray-600">
            Hiển thị {pagination.startItem} - {pagination.endItem} của {pagination.totalCount} giao dịch
          </p>
          <div className="flex items-center gap-2">
            <button onClick={() => gotoPage(pageNumber - 1)} disabled={pageNumber <= 1} className="px-3 py-1 border rounded-lg hover:bg-gray-100 disabled:opacity-50">
              <ChevronLeft size={16} />
            </button>
            {/* render a small page list (you can limit number of page buttons shown) */}
            {Array.from({ length: pagination.totalPages }).map((_, idx) => {
              const p = idx + 1;
              return (
                <button
                  key={p}
                  onClick={() => gotoPage(p)}
                  className={`px-3 py-1 border rounded-lg ${p === pageNumber ? 'bg-purple-600 text-white' : 'hover:bg-gray-100'}`}
                >
                  {p}
                </button>
              );
            })}
            <button onClick={() => gotoPage(pageNumber + 1)} disabled={pageNumber >= pagination.totalPages} className="px-3 py-1 border rounded-lg hover:bg-gray-100 disabled:opacity-50">
              <ChevronRight size={16} />
            </button>
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
