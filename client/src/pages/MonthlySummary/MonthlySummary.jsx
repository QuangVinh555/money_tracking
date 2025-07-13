import { formatCurrency } from "../../utils/format";

const MonthlySummary = ({ data }) => (
    <div className="p-6 bg-white rounded-2xl shadow-lg border">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Lịch sử các tháng trước</h3>
        <div className="space-y-3">
            {data?.map(month => (
                <div key={month.name} className="p-3 bg-gray-50 rounded-lg border">
                    <p className="font-bold text-gray-700">{month.name}</p>
                    <div className="flex justify-between items-center mt-2 text-sm">
                        <span className="text-green-600 font-medium">Thu: {formatCurrency(month.income)}</span>
                        <span className="text-red-600 font-medium">Chi: {formatCurrency(month.expenses)}</span>
                        <span className={`font-bold ${month.balance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                            Dư: {formatCurrency(month.balance)}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

export default MonthlySummary