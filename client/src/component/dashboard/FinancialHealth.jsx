import { Zap} from 'lucide-react';

const FinancialHealth = ({ income, expenses }) => {
    const savings = income - expenses;
    const savingsRate = income > 0 ? (savings / income) * 100 : 0;
    
    let level = 'Thấp';
    let color = 'text-red-500';
    let bgIcon = 'bg-red-100';
    let iconColor = 'text-red-600';
    let advice = 'Cần cân đối lại chi tiêu!';

    if (savingsRate >= 20) {
        level = 'Tuyệt vời';
        color = 'text-green-600';
        bgIcon = 'bg-green-100';
        iconColor = 'text-green-600';
        advice = 'Bạn đang quản lý rất tốt!';
    } else if (savingsRate >= 10) {
        level = 'Khá';
        color = 'text-blue-600';
        bgIcon = 'bg-blue-100';
        iconColor = 'text-blue-600';
        advice = 'Cố gắng tiết kiệm thêm nhé.';
    } else if (savingsRate < 0) {
        level = 'Cảnh báo';
        advice = 'Bạn đang chi tiêu vượt thu!';
    }

    return (
        <div className="p-6 bg-white rounded-2xl shadow-lg border h-full flex flex-col justify-between">
            <div className="flex items-center gap-3 mb-2">
                <div className={`p-2 ${bgIcon} rounded-lg`}><Zap className={iconColor} size={24}/></div>
                <h3 className="text-lg font-bold text-gray-800">Sức khỏe Tài chính</h3>
            </div>
            
            <div className="text-center py-2">
                <p className="text-sm text-gray-500 mb-1">Tỷ lệ tiết kiệm tháng</p>
                <div className="relative inline-flex items-center justify-center">
                    <svg className="w-24 h-24 transform -rotate-90">
                        <circle className="text-gray-200" strokeWidth="8" stroke="currentColor" fill="transparent" r="40" cx="48" cy="48" />
                        <circle className={`${iconColor} transition-all duration-1000`} strokeWidth="8" strokeDasharray={251.2} strokeDashoffset={251.2 - (251.2 * Math.max(0, Math.min(savingsRate, 100)) / 100)} strokeLinecap="round" stroke="currentColor" fill="transparent" r="40" cx="48" cy="48" />
                    </svg>
                    <span className={`absolute text-xl font-bold ${color}`}>{savingsRate.toFixed(1)}%</span>
                </div>
            </div>

            <div>
                <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-600">Mức độ:</span>
                    <span className={`font-bold ${color}`}>{level}</span>
                </div>
                <p className="text-xs text-gray-500 text-center italic">"{advice}"</p>
            </div>
        </div>
    );
}

export default FinancialHealth