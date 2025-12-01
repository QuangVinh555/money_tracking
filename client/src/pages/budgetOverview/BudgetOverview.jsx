import React from 'react'
import { Edit, Lightbulb } from 'lucide-react'
import { formatCurrency } from '../../utils/format';

const BudgetOverview = ({ totalCard, changeDate, onEditLimit }) => {
    const nowMonth = new Date(changeDate).getMonth() + 1;
    const expenseProgressRaw = (totalCard.data?.expense / totalCard.data?.budgetLimit) * 100;
    const expenseProgress = isNaN(expenseProgressRaw) ? 0 : expenseProgressRaw;
    let progressGradient = 'from-purple-500 to-blue-500';
    if (expenseProgress > 75) progressGradient = 'from-red-500 to-orange-500';
    else if (expenseProgress > 50) progressGradient = 'from-amber-500 to-yellow-500';

    // Tính toán dự báo
    const today = new Date();
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    const currentDay = today.getDate();
    const remainingDays = daysInMonth - currentDay;

    // Gợi ý chi tiêu mỗi ngày cho những ngày còn lại
    const recommendedDaily = remainingDays > 0 ? Math.max(0, totalCard.data?.remainingLimit / remainingDays) : 0;

    // Dự báo dư/thiếu cuối tháng dựa trên tốc độ hiện tại
    const dailyAvg = totalCard.data?.expense / currentDay;
    const projectedTotal = dailyAvg * daysInMonth;
    const projectedBalance = totalCard.data?.budgetLimit - projectedTotal;

    return (
        <div className="mb-8 p-6 bg-white rounded-2xl shadow-lg border h-full">
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
                {/* Phần thông tin bổ sung để lấp đầy khoảng trống */}
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <h4 className="text-xs font-bold text-gray-500 uppercase mb-3 flex items-center gap-1">
                        <Lightbulb size={14} className="text-yellow-500" /> Phân tích & Gợi ý
                    </h4>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-600">Gợi ý tiêu/ngày ({remainingDays} ngày còn):</span>
                            <span className="font-bold text-gray-800">{formatCurrency(recommendedDaily)}</span>
                        </div>
                        <div className="w-full h-px bg-gray-200"></div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-600">Dự báo cuối tháng:</span>
                            <span className={`font-bold ${projectedBalance >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                                {projectedBalance >= 0 ? 'Dư ' : 'Thiếu '} {formatCurrency(Math.abs(projectedBalance))}
                            </span>
                        </div>
                        <p className={`text-xs mt-1 italic ${projectedBalance >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                            {projectedBalance >= 0
                                ? "Tốt lắm! Bạn đang kiểm soát ngân sách rất ổn."
                                : "Cảnh báo: Bạn cần giảm chi tiêu ngay!"}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BudgetOverview