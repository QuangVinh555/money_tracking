import { ShieldCheck, AlertTriangle} from 'lucide-react';
import { formatCurrency } from '../../utils/format';

const FixedExpenses = () => {
    const fixedExpenses = [
        { name: 'Tiền thuê nhà', amount: 4500000 },
        { name: 'Gửi tiết kiệm', amount: 3000000 },
        { name: 'Dự phòng phí', amount: 1000000 },
    ];
    const totalFixed = fixedExpenses.reduce((acc, item) => acc + item.amount, 0);
    return (
        <div className="p-6 bg-white rounded-2xl shadow-lg border h-full flex flex-col">
            <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-100 rounded-lg"><ShieldCheck className="text-blue-600" size={24}/></div>
                <div>
                    <h3 className="text-lg font-bold text-gray-800">Chi phí Cố định</h3>
                    <p className="text-xs text-gray-500">Dự trù & Bắt buộc</p>
                </div>
            </div>
            <div className="flex-grow space-y-3 overflow-y-auto max-h-32 pr-1 custom-scrollbar">
                {fixedExpenses.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-sm border-b border-gray-50 pb-2 last:border-0">
                        <span className="text-gray-700 font-medium">{item.name}</span>
                        <span className="font-bold text-gray-800">{formatCurrency(item.amount)}</span>
                    </div>
                ))}
            </div>
            <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-gray-700">Tổng cộng</span>
                    <span className="font-bold text-blue-600 text-lg">{formatCurrency(totalFixed)}</span>
                </div>
                <div className="flex items-start gap-2 text-xs text-amber-600 bg-amber-50 p-2 rounded-md">
                    <AlertTriangle size={14} className="mt-0.5 flex-shrink-0"/>
                    <p>Các khoản này không tính vào hạn mức chi tiêu hàng ngày.</p>
                </div>
            </div>
        </div>
    );
}

export default FixedExpenses