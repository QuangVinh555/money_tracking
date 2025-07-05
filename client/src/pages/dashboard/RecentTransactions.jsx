import { DollarSign, ArrowRight, ShoppingCart, Utensils, Car, Home } from 'lucide-react';
import { formatCurrency } from '../../utils/format';
import { TRANSACTIONS_TYPE } from '../../constants/common';

// --- ICON MAPPING ---
// Map danh mục với icon tương ứng
const categoryIcons = {
    'Ăn uống': <Utensils size={20} className="text-orange-500" />,
    'Mua sắm': <ShoppingCart size={20} className="text-blue-500" />,
    'Di chuyển': <Car size={20} className="text-green-500" />,
    'Nhà cửa': <Home size={20} className="text-purple-500" />,
    'Lương': <DollarSign size={20} className="text-emerald-500" />,
    'Default': <DollarSign size={20} className="text-gray-500" />,
};

const getCategoryIcon = (category) => categoryIcons[category] || categoryIcons['Default'];

const RecentTransactions = ({ transactions }) => {
    // Xử lý toàn bộ giao dịch mới nhất
    const allTransactions = transactions.data
        ?.flatMap(group => group.transactions)
        ?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        ?.slice(0, 10);

    return (
        <div className="bg-white p-6 rounded-2xl shadow-md h-full">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-800">Giao dịch gần đây</h3>
                <button className="text-sm text-blue-600 font-semibold flex items-center gap-1">
                    Xem tất cả <ArrowRight size={14} />
                </button>
            </div>
            <div className="space-y-4">
                {allTransactions?.map((tx,i) => (
                    <div key={i} className="flex items-center">
                        <div className="p-3 bg-gray-100 rounded-full mr-4">
                            {getCategoryIcon(tx.categoryName)}
                        </div>
                        <div className="flex-grow">
                            <p className="font-semibold text-gray-800">{tx.description}</p>
                            <p className="text-sm text-gray-500">{tx.transactionDate}</p>
                        </div>
                        <p className={`font-bold ${tx.transactionType === TRANSACTIONS_TYPE.INCOME ? 'text-green-500' : 'text-red-500'}`}>
                            {tx.transactionType === TRANSACTIONS_TYPE.INCOME ? '+' : '-'} {formatCurrency(tx.amount)}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    )
};

export default RecentTransactions