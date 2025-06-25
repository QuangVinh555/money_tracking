import { formatCurrency } from '../../utils/format.js'
import {
    Edit
} from 'lucide-react';
const StatCard = ({ title, amount, icon, colorClass, onEdit, children }) => (
    <div className="bg-white p-6 rounded-2xl shadow-md transition-all group relative">
        <div className="flex items-center justify-between">
            <div>
                <p className="text-gray-500 text-sm font-medium">{title}</p>
                <p className="text-2xl font-bold text-gray-800">{formatCurrency(amount)}</p>
            </div>
            <div className={`p-3 rounded-full ${colorClass}`}>{icon}</div>
        </div>
        {children}
        {onEdit && (
            <button onClick={onEdit} className="absolute top-2 right-2 p-1.5 rounded-full bg-gray-100 text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-200">
                <Edit size={16} />
            </button>
        )}
    </div>
);

export default StatCard