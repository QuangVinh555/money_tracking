import { formatCurrency } from '../../utils/format.js'
const StatCard = ({ title, amount, icon, colorClass }) => (
    <div className="bg-white p-6 rounded-2xl shadow-md flex items-center justify-between transition-transform transform hover:-translate-y-1">
        <div>
            <p className="text-gray-500 text-sm font-medium">{title}</p>
            <p className="text-2xl font-bold text-gray-800">{formatCurrency(amount)}</p>
        </div>
        <div className={`p-3 rounded-full ${colorClass}`}>
            {icon}
        </div>
    </div>
);

export default StatCard