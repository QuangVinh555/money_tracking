import { useState } from "react";
import {
    X
} from 'lucide-react';

import { formatCurrency } from "../../utils/format";
const SpendingLimitModal = ({ isOpen, onClose, currentLimit, onSetLimit, onChangeLimit }) => {
    if (!isOpen) return null;

    const [limit, setLimit] = useState(currentLimit);
    
    // Hạn mức mặc định
    const suggestions = [5000000, 10000000, 15000000, 20000000];
    const handleSubmit = (e) => {
        e.preventDefault();
        var newLimit = {
            Budgets_Limit_Total: Number(limit)
        }
        onChangeLimit(newLimit)
        onSetLimit(newLimit);
    };

    return (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm flex flex-col animate-scale-up">
                <div className="flex justify-between items-center p-5 border-b">
                    <h2 className="text-xl font-bold text-gray-800">Đặt Hạn Mức Chi Tiêu</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200"><X size={24} /></button>
                </div>
                <form onSubmit={handleSubmit} className="p-6">
                    <p className="text-gray-600 mb-4">Đặt ra một hạn mức hàng tháng để quản lý chi tiêu tốt hơn.</p>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Hạn mức của bạn</label>
                        <input type="number" value={limit} onChange={e => setLimit(e.target.value)} placeholder="Nhập số tiền" className="w-full p-2 text-lg font-bold border-2 border-blue-200 rounded-lg focus:ring-blue-500 focus:border-blue-500" required />
                    </div>
                    <div className="mb-6">
                        <p className="text-sm font-medium text-gray-700 mb-2">Hoặc chọn nhanh:</p>
                        <div className="grid grid-cols-2 gap-2">
                            {suggestions.map(s => <button key={s} type="button" onClick={() => setLimit(s)} className="p-2 border rounded-lg text-center hover:bg-gray-100 transition-colors">{formatCurrency(s)}</button>)}
                        </div>
                    </div>
                    <button type="submit" className="w-full py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold rounded-lg hover:opacity-90 transition-opacity">Lưu Hạn Mức</button>
                </form>
            </div>
        </div>
    );
};
export default SpendingLimitModal