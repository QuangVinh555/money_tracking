import { useState } from "react";
import { formatCurrency, formatDate } from "../../utils/format";
import {
  ChevronLeft,
  ChevronRight,
  DollarSign,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  ShoppingCart,
  Utensils,
  Car,
  Home,
  LayoutDashboard,
  Repeat,
  BarChart3,
  Wallet,
  Settings,
  Gem,
  Target,
  PlusCircle,
  Download,
  X,
  List,
  Tag,
  Type,
} from "lucide-react";

// --- ICON MAPPING ---
const categoryIcons = {
  "Ăn uống": <Utensils size={20} className="text-orange-500" />,
  "Mua sắm": <ShoppingCart size={20} className="text-blue-500" />,
  "Di chuyển": <Car size={20} className="text-green-500" />,
  "Nhà cửa": <Home size={20} className="text-purple-500" />,
  Lương: <DollarSign size={20} className="text-emerald-500" />,
  Default: <DollarSign size={20} className="text-gray-500" />,
};
const getCategoryIcon = (category) =>
  categoryIcons[category] || categoryIcons["Default"];
const TransactionModal = ({
  isOpen,
  onClose,
  selectedDate,
  transactions,
  categories,
  onAddTransaction,
}) => {
if (!isOpen) return null;

const [txType, setTxType] = useState("expense");
const [amount, setAmount] = useState("");
const [category, setCategory] = useState(categories[0]);
const [description, setDescription] = useState("");

  const transactionsForDate = transactions.filter(
    (tx) => tx.date === selectedDate.toISOString().split("T")[0]
  );
  const dailyTotal = transactionsForDate.reduce(
    (acc, tx) => {
      if (tx.type === "income") acc.income += tx.amount;
      else acc.expense += tx.amount;
      return acc;
    },
    { income: 0, expense: 0 }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    const newTransaction = {
      id: Date.now(),
      type: txType,
      category,
      description,
      amount: parseInt(amount, 10),
      date: selectedDate.toISOString().split("T")[0],
    };
    onAddTransaction(newTransaction);
    // Reset form
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
              {formatDate(selectedDate)}
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
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
              <p className="text-sm text-green-700">Tổng thu</p>
              <p className="text-lg font-bold text-green-600">
                {formatCurrency(dailyTotal.income)}
              </p>
            </div>
            <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
              <p className="text-sm text-red-700">Tổng chi</p>
              <p className="text-lg font-bold text-red-600">
                {formatCurrency(dailyTotal.expense)}
              </p>
            </div>
          </div>

          {/* Add new transaction form */}
          <div className="bg-gray-50 p-4 rounded-lg border mb-6">
            <h3 className="font-bold text-gray-700 mb-4">Thêm giao dịch mới</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setTxType("expense")}
                  className={`flex-1 py-2 rounded-lg font-semibold transition-colors ${
                    txType === "expense"
                      ? "bg-red-500 text-white"
                      : "bg-gray-200"
                  }`}
                >
                  Chi tiêu
                </button>
                <button
                  type="button"
                  onClick={() => setTxType("income")}
                  className={`flex-1 py-2 rounded-lg font-semibold transition-colors ${
                    txType === "income"
                      ? "bg-green-500 text-white"
                      : "bg-gray-200"
                  }`}
                >
                  Thu nhập
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Số tiền"
                  className="w-full p-2 border rounded-lg"
                  required
                />
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-2 border rounded-lg bg-white"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
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
                className="w-full py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors"
              >
                Thêm giao dịch
              </button>
            </form>
          </div>

          {/* Transaction List */}
          <div>
            <h3 className="font-bold text-gray-700 mb-2">
              Các giao dịch trong ngày
            </h3>
            <div className="space-y-3">
              {transactionsForDate.length > 0 ? (
                transactionsForDate.map((tx) => (
                  <div
                    key={tx.id}
                    className="flex items-center bg-white p-3 rounded-lg border"
                  >
                    <div className="p-2 bg-gray-100 rounded-full mr-3">
                      {getCategoryIcon(tx.category)}
                    </div>
                    <div className="flex-grow">
                      <p className="font-semibold">{tx.description}</p>
                    </div>
                    <p
                      className={`font-bold ${
                        tx.type === "income" ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      {tx.type === "income" ? "+" : "-"}{" "}
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
