import { useState, useEffect } from "react";
import { formatCurrency, formatDate, formatToLocalDateString } from "../../utils/format";
import {
  DollarSign,
  ShoppingCart,
  Utensils,
  Car,
  Home,
  Building2,
  Wallet,
  X,
  Loader2
} from "lucide-react";
import { TRANSACTIONS_TYPE } from "../../constants/common";
import useCategories from "../../hook/categories"

// --- ICON MAPPING ---
const categoryIcons = {
  "Ăn uống": <Utensils size={20} className="text-orange-500" />,
  "Mua sắm": <ShoppingCart size={20} className="text-blue-500" />,
  "Di chuyển": <Car size={20} className="text-green-500" />,
  "Nhà cửa": <Home size={20} className="text-purple-500" />,
  "Lương": <DollarSign size={20} className="text-emerald-500" />,
  "Đóng tiền trọ": <Building2 size={20} className="text-pink-500" />,
  "Chi phí khác": <Wallet size={20} className="text-yellow-500" />,
  "Default": <DollarSign size={20} className="text-gray-500" />,
};
const getCategoryIcon = (category) =>
  categoryIcons[category] || categoryIcons["Default"];

const TransactionModal = ({
  isOpen,
  onClose,
  selectedDate,
  transactions,
  transactionToEdit,
  totalCard,
  onAddTransaction,
  onUpdateTransaction,
  isLoading
}) => {

  // List data categories call API
  const { categories } = useCategories();

  // State quản lý loại giao dịch (1: thu nhập, 2: chi tiêu)
  const [txType, setTxType] = useState(TRANSACTIONS_TYPE.EXPENSE);
  const [amount, setAmount] = useState("");
  // State quản lý danh mục giao dịch
  const [category, setCategory] = useState(1); // Mặc định số 1: danh mục ăn uống
  const [description, setDescription] = useState("");

  // Sync khi transactionToEdit thay đổi
  useEffect(() => {
    if (transactionToEdit) {
      setTxType(transactionToEdit.transactionType);
      setAmount(transactionToEdit.amount);
      setCategory(transactionToEdit.categoryId ?? 1);
      setDescription(transactionToEdit.description || '');
    } else {
      // reset khi thêm mới
      setTxType(TRANSACTIONS_TYPE.EXPENSE);
      setAmount('');
      setCategory(1);
      setDescription('');
    }
  }, [transactionToEdit]);

  if (!isOpen) return null;

  // Thêm mới: transactions mới có data
  // Chỉnh sửa: transactions rỗng
  let transactionsForDate = [];
  if (transactions) {
    transactionsForDate = transactions.data?.filter(
      (tx) => tx.dateTime === formatToLocalDateString(selectedDate)
    ) || [];
  }

  const handleSetCategory = (e) => {
    const selectedId = Number(e.target.value);
    setCategory(selectedId);

    // Tìm category object trong categories
    const selectedCategory = categories?.data.find(
      (c) => c.categoryId === selectedId
    );

    // Nếu tìm thấy thì tự động set txType
    if (selectedCategory) {
      setTxType(selectedCategory.type);
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const newTransaction = {
      categoryId: category,
      amount: parseInt(amount, 10),
      /* 
        Nếu gửi không kèm giờ thì nên gửi thằng dạng "YYYY-MM-DD", 
        Nếu kèm giờ phút giây thì phải convert sang UTC
        DB đã chỉnh lại kiểu date = "YYYY-MM-DD"
      */
      transaction_Date: formatToLocalDateString(selectedDate),
      transaction_Type: txType,
      description,
    };
    transactionToEdit 
      ? onUpdateTransaction(transactionToEdit.transactionId ,newTransaction) 
      : onAddTransaction(newTransaction);
    // Reset form
    setTxType(TRANSACTIONS_TYPE.EXPENSE);
    setCategory(1);
    setAmount("");
    setDescription("");
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-scale-up">
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b bg-gradient-to-r from-blue-50 to-indigo-100 rounded-t-2xl">
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              Giao dịch trong ngày
            </h2>
            <p className="text-gray-600 font-semibold">
              {transactionToEdit ? selectedDate : formatDate(selectedDate)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-200"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 flex-grow overflow-y-auto">
          {/* Daily Summary */}
          {
            transactionToEdit ? '' :
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                  <p className="text-sm text-green-700">Tổng thu</p>
                  <p className="text-lg font-bold text-green-600">
                    {formatCurrency(totalCard.data?.income)}
                  </p>
                </div>
                <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                  <p className="text-sm text-red-700">Tổng chi</p>
                  <p className="text-lg font-bold text-red-600">
                    {formatCurrency(totalCard.data?.expense)}
                  </p>
                </div>
              </div>
          }

          {/* Add new transaction form */}
          <div className="bg-gray-50 p-4 rounded-lg border mb-6">
            <h3 className="font-bold text-gray-700 mb-4">{transactionToEdit ? 'Chỉnh sửa giao dịch' : 'Thêm giao dịch mới'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setTxType(TRANSACTIONS_TYPE.EXPENSE)}
                  className={`flex-1 py-2 rounded-lg font-semibold transition-colors ${txType === TRANSACTIONS_TYPE.EXPENSE
                    ? "bg-red-500 text-white"
                    : "bg-gray-200"
                    }`}
                >
                  Chi tiêu
                </button>
                <button
                  type="button"
                  onClick={() => setTxType(TRANSACTIONS_TYPE.INCOME)}
                  className={`flex-1 py-2 rounded-lg font-semibold transition-colors ${txType === TRANSACTIONS_TYPE.INCOME
                    ? "bg-green-500 text-white"
                    : "bg-gray-200"
                    }`}
                >
                  Thu nhập
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <select
                  value={category}
                  onChange={(e) => { handleSetCategory(e) }}
                  className="w-full p-2 border rounded-lg bg-white"
                >
                  {categories?.data.map((c) => (
                    <option key={c.categoryId} value={c.categoryId}>
                      {c.categoryName}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Số tiền"
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Mô tả (ví dụ: Cà phê, đi chợ...)"
                className="w-full p-2 border rounded-lg"
                required
              />
              <button
                type="submit"
                className="w-full py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (transactionToEdit ? 'Lưu thay đổi' : 'Thêm giao dịch')}
              </button>
            </form>
          </div>

          {/* Transaction List */}
          {
            transactionToEdit ? '' :
              <div>
                <h3 className="font-bold text-gray-700 mb-2">
                  Các giao dịch trong ngày
                </h3>
                <div className="space-y-3">
                  {transactionsForDate.length > 0 ? (
                    transactionsForDate[0]?.transactions.map((tx, i) => (
                      <div
                        key={i}
                        className="flex items-center bg-white p-3 rounded-lg border"
                      >
                        <div className="p-2 bg-gray-100 rounded-full mr-3">
                          {getCategoryIcon(tx.categoryName)}
                        </div>
                        <div className="flex-grow">
                          <p className="font-semibold">{tx.description}</p>
                        </div>
                        <p
                          className={`font-bold ${tx.transactionType === TRANSACTIONS_TYPE.INCOME ? "text-green-500" : "text-red-500"
                            }`}
                        >
                          {tx.transactionType === TRANSACTIONS_TYPE.INCOME ? "+" : "-"}{" "}
                          {formatCurrency(tx.amount)}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-4">
                      Chưa có giao dịch nào trong ngày này.
                    </p>
                  )}
                </div>
              </div>
          }
        </div>
      </div>
      <style>{`
                @keyframes fade-in { 0% { opacity: 0; } 100% { opacity: 1; } }
                @keyframes scale-up { 0% { transform: scale(0.95); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
                .animate-fade-in { animation: fade-in 0.2s ease-out forwards; }
                .animate-scale-up { animation: scale-up 0.2s ease-out forwards; }
            `}</style>
    </div>
  );
};

export default TransactionModal;
