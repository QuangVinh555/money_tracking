import {
    Utensils, ShoppingCart, Car, Home, DollarSign,
    Gamepad2, AlertCircle, Briefcase, Building2, ArrowRight
} from "lucide-react";
import { formatCurrency } from '../../utils/format';
import { TRANSACTIONS_TYPE } from '../../constants/common';

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

const RecentTransactions = ({ transactions }) => {
    // Xử lý toàn bộ giao dịch mới nhất
    const allTransactions = transactions.data
        ?.flatMap(group => group.transactions)
        ?.sort((a, b) => new Date(b.transactionDate) - new Date(a.transactionDate))
        ?.slice(0, 10);

    return (
        <div className="bg-gradient-to-br from-white to-emerald-50 p-6 rounded-2xl shadow-lg border border-emerald-100 h-full">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-800">Giao dịch gần đây</h3>
                <button className="text-sm text-emerald-600 font-semibold flex items-center gap-1 hover:text-teal-600 transition-colors">
                    Xem tất cả <ArrowRight size={14} />
                </button>
            </div>
            <div className="space-y-2">
                {allTransactions?.map((tx, i) => (
                    <div key={i} className="flex items-center p-3 rounded-lg hover:shadow-md transition-all">
                        <div className="p-3 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full mr-4 text-emerald-600 flex-shrink-0">
                            {getCategoryIcon(tx.categoryName)}
                        </div>
                        <div className="flex-grow min-w-0">
                            <p className="font-semibold text-gray-800 truncate">{tx.description}</p>
                            <p className="text-sm text-gray-500">{tx.transactionDate}</p>
                        </div>
                        <p className={`font-bold flex-shrink-0 ${tx.transactionType === TRANSACTIONS_TYPE.INCOME ? 'text-green-500' : 'text-red-500'}`}>
                            {tx.transactionType === TRANSACTIONS_TYPE.INCOME ? '+' : '-'} {formatCurrency(tx.amount)}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    )
};

export default RecentTransactions