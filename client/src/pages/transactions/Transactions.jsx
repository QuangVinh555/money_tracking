import { Search, Filter, Plus } from "lucide-react";
import { useState, useMemo } from "react";
import { formatToLocalDateString } from "../../utils/format";
import useTransactions from "../../hook/transactions";
import { TRANSACTIONS_TYPE } from "../../constants/common";

export default function Transactions() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    category: "",
    account: "",
    type: "expense",
    date: ""
  });

const today = useMemo(() => formatToLocalDateString(new Date()), []);
const { transactions } = useTransactions(today);
  const allTransactions = transactions.data
    ?.flatMap(group => group.transactions);
  console.log('allTransactions', allTransactions)

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form data:', formData);
    setIsDialogOpen(false);
    setFormData({
      description: "",
      amount: "",
      category: "",
      account: "",
      type: "expense",
      date: ""
    });
  };

  return (
    <div className="bg-gray-100 min-h-screen text-gray-800 font-sans">
      <div className="flex">
        <main className="flex-1 p-6 lg:p-8 flex flex-col">
          <div className="mb-8 flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Quản lý giao dịch</h1>
            <button
              onClick={() => setIsDialogOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Thêm giao dịch
            </button>
          </div>

          {/* Filters */}
          <div className="mb-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm giao dịch..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <button className="border border-gray-300 hover:bg-gray-50 px-4 py-2 rounded-md flex items-center gap-2 transition-colors">
                <Filter className="h-4 w-4" />
                Bộ lọc
              </button>
            </div>
          </div>

          {/* Transactions List */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Danh sách giao dịch</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {allTransactions?.map((transaction) => (
                  <div key={transaction.transactionId} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{transaction.description}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-sm text-gray-500">{transaction.transactionDate}</span>
                            <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                              {transaction.category}
                            </span>
                            {/* <span className="text-sm text-gray-500">• {transaction.account}</span> */}
                          </div>
                        </div>
                        <div className={`text-lg font-semibold ${transaction.transactionType === TRANSACTIONS_TYPE.INCOME ? 'text-green-600' : 'text-red-600'}`}>
                          {transaction.amount > 0 ? '+' : ''}{formatCurrency(transaction.amount)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Add Transaction Dialog */}
          {isDialogOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                <h3 className="text-lg font-semibold mb-4">Thêm giao dịch mới</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                    <input
                      type="text"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Nhập mô tả giao dịch"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Số tiền</label>
                    <input
                      type="number"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="0"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Loại</label>
                    <div className="flex gap-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          value="income"
                          checked={formData.type === "income"}
                          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                          className="mr-2"
                        />
                        Thu nhập
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          value="expense"
                          checked={formData.type === "expense"}
                          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                          className="mr-2"
                        />
                        Chi tiêu
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">Chọn danh mục</option>
                      <option value="Ăn uống">Ăn uống</option>
                      <option value="Di chuyển">Di chuyển</option>
                      <option value="Mua sắm">Mua sắm</option>
                      <option value="Thu nhập">Thu nhập</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tài khoản</label>
                    <select
                      value={formData.account}
                      onChange={(e) => setFormData({ ...formData, account: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">Chọn tài khoản</option>
                      <option value="Tiền mặt">Tiền mặt</option>
                      <option value="Ngân hàng">Ngân hàng</option>
                      <option value="Thẻ tín dụng">Thẻ tín dụng</option>
                      <option value="Ví điện tử">Ví điện tử</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ngày</label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setIsDialogOpen(false)}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Thêm
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
