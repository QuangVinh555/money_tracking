import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { formatCurrency } from "../../utils/format";
 formatCurrency

const CalendarView = ({ transactions }) => {
    const [currentDate, setCurrentDate] = useState(new Date(2025, 5, 1)); // Tháng 6 2025

    const transactionsByDate = useMemo(() => {
        return transactions.reduce((acc, tx) => {
            const date = tx.date.split('T')[0];
            if (!acc[date]) {
                acc[date] = [];
            }
            acc[date].push(tx);
            return acc;
        }, {});
    }, [transactions]);
    
    const changeMonth = (amount) => {
        setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + amount, 1));
    };

    const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const startDate = new Date(monthStart);
    startDate.setDate(startDate.getDate() - monthStart.getDay());
    const endDate = new Date(monthEnd);
    endDate.setDate(endDate.getDate() + (6 - monthEnd.getDay()));

    const days = [];
    let day = new Date(startDate);
    while (day <= endDate) {
        days.push(new Date(day));
        day.setDate(day.getDate() + 1);
    }
    
    const dayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

    return (
        <div className="bg-white p-6 rounded-2xl shadow-md">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-800">
                    {`Tháng ${currentDate.getMonth() + 1}, ${currentDate.getFullYear()}`}
                </h3>
                <div className="flex items-center gap-2">
                    <button onClick={() => changeMonth(-1)} className="p-2 rounded-full hover:bg-gray-100">
                        <ChevronLeft size={20} />
                    </button>
                    <button onClick={() => changeMonth(1)} className="p-2 rounded-full hover:bg-gray-100">
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center text-sm font-semibold text-gray-500">
                {dayNames.map(d => <div key={d}>{d}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-2 mt-2">
                {days.map((d, i) => {
                    const dateString = d.toISOString().split('T')[0];
                    const dailyTx = transactionsByDate[dateString] || [];
                    const isCurrentMonth = d.getMonth() === currentDate.getMonth();
                    
                    return (
                        <div key={i} className={`p-2 rounded-lg h-24 flex flex-col ${isCurrentMonth ? 'bg-white' : 'bg-gray-50'} border`}>
                            <span className={`font-bold ${isCurrentMonth ? 'text-gray-700' : 'text-gray-400'}`}>{d.getDate()}</span>
                            {dailyTx.length > 0 && (
                                <div className="mt-1 space-y-1 overflow-y-auto text-xs">
                                    {dailyTx.map(tx => (
                                        <div key={tx.id} className={`p-1 rounded ${tx.type === 'income' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {formatCurrency(tx.amount)}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
export default CalendarView