import React from 'react'
import { Edit } from 'lucide-react'
import { formatCurrency } from '../../utils/format';

const BudgetOverview = ({ totalCard, changeDate, onEditLimit }) => {
    const nowMonth = new Date(changeDate).getMonth() + 1;
    const expenseProgressRaw = (totalCard.data?.expense / totalCard.data?.budgetLimit) * 100;
    const expenseProgress = isNaN(expenseProgressRaw) ? 0 : expenseProgressRaw;
    let progressGradient = 'from-purple-500 to-blue-500';
    if (expenseProgress > 75) progressGradient = 'from-red-500 to-orange-500';
    else if (expenseProgress > 50) progressGradient = 'from-amber-500 to-yellow-500';

    return (
        <div className="mb-8 p-6 bg-white rounded-2xl shadow-lg border">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-bold text-gray-800">Ngân sách tháng {nowMonth}</h3>
                    <p className="text-2xl font-bold text-purple-700">{formatCurrency(totalCard.data?.remainingLimit)} <span className="text-base font-normal text-gray-500">còn lại</span></p>
                </div>
                <button onClick={onEditLimit} className="flex items-center gap-2 text-sm font-semibold text-purple-600 hover:text-purple-800">
                    <Edit size={16} />
                    Chỉnh sửa hạn mức
                </button>
            </div>
            <div className="mt-4">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Đã chi: {formatCurrency(totalCard.data?.expense)}</span>
                    <span>Hạn mức: {formatCurrency(totalCard.data?.budgetLimit)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className={`bg-gradient-to-r ${progressGradient} rounded-full h-3 transition-all duration-500`} style={{ width: `${Math.min(expenseProgress, 100)}%` }}></div>
                </div>
            </div>
        </div>
    );
}

export default BudgetOverview