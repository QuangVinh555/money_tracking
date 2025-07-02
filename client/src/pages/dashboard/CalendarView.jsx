import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { formatCurrency, formatToLocalDateString } from "../../utils/format";
formatCurrency
import { TRANSACTIONS_TYPE } from "../../constants/common";

const CalendarView = ({ transactions, onChangeDate, onDayClick }) => {
    const [currentDate, setCurrentDate] = useState(new Date());

    // Khi chuyển tháng kế tiếp hay tháng trước đó thì sẽ cập nhật lại tháng đó thành ngày 1
    const changeMonth = (amount) => setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + amount, 1));

    /* 
        Gọi onChangeDate mỗi khi currentDate thay đổi
        Vì chỗ này đang mặc định lúc nào cũng lấy ngày 1 nên nếu chuyển sang kiểu UTC thì sẽ bị sai(nó dời qua tháng 5)
        Và nó cũng chỉ là chủ yếu để check tháng năm nên giữ nguyên kiểu hệ thống sẽ không ảnh hưởng(không thể chênh lệch 1 tháng giữa kiểu UTC và local)
    */
    useEffect(() => {
        if (onChangeDate) {
            onChangeDate(currentDate);
        }
    }, [currentDate]);

    // Nếu ngày hiện tại không phải là ngày đầu tháng thì chuyển về ngày 1(đầu tháng)
    const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

    /*
        monthStart.getDay(): Lấy ra thứ trong ngày (bắt đầu = 0: 'CN', = 6: 'T7')
        startDate.getDate(): Lấy ra ngày (1/6/2024)
        VD: 
            - 1/6/2024 là thứ 4 
            - Ngày hiện tại là 1/6/2024 - 4 ngày để ra thứ bằng 0(tức là CN)
            - KQ là 28/5/2025 => Lịch sẽ hiện đúng 1 tuần bắt đầu từ CN - T7
    */
    const startDate = new Date(monthStart);
    startDate.setDate(startDate.getDate() - monthStart.getDay());

    /*
        - Đây là đoạn tạo ra mảng 42 ngày liên tiếp bắt đầu từ startDate, đủ để vẽ một lịch 6 hàng × 7 ngày.
        - 42 là con số chuẩn cho lịch kiểu lưới: luôn đủ chỗ cho mọi tháng (dù có tháng chỉ cần 5 tuần).
        - days sẽ là mảng dùng để render các ô ngày trong UI.
    */
    const days = [];
    let day = new Date(startDate);
    while (days.length < 42) {
        days.push(new Date(day));
        day.setDate(day.getDate() + 1);
    }

    const dayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

    return (
        <div className="bg-white p-6 rounded-2xl shadow-md">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-800">{`Tháng ${currentDate.getMonth() + 1}, ${currentDate.getFullYear()}`}</h3>
                <div className="flex items-center gap-2">
                    <button onClick={() => changeMonth(-1)} className="p-2 rounded-full hover:bg-gray-100 transition-colors"><ChevronLeft size={20} /></button>
                    <button onClick={() => changeMonth(1)} className="p-2 rounded-full hover:bg-gray-100 transition-colors"><ChevronRight size={20} /></button>
                </div>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-sm font-semibold text-gray-500">
                {dayNames.map(d => <div key={d} className="py-2">{d}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-2 mt-2">
                {days.map((day, i) => {
                    // Đưa từng ngày về kiểu ngày local của hệ thống vì datetime của api 
                    // cũng chỉ trả ra ngày làm key nên không sợ nhầm ngày giờ của UTC và của hệ thống
                    const dateDay = formatToLocalDateString(day);

                    // Tìm nhóm giao dịch trong mảng có dateTime trùng với ngày hiện tại
                    const dailyGroup = transactions.data?.find(group => group.dateTime === dateDay);
                    const dailyTransactions = dailyGroup?.transactions || [];

                    const isCurrentMonth = day.getMonth() === currentDate.getMonth();

                    return (
                        <div key={i} onClick={() => onDayClick(day)} className={`p-2 rounded-lg h-24 flex flex-col ${isCurrentMonth ? 'bg-white hover:bg-blue-50 cursor-pointer' : 'bg-gray-50/70'} border transition-colors`}>
                            <span className={`font-bold self-start ${isCurrentMonth ? 'text-gray-700' : 'text-gray-400'}`}>{day.getDate()}</span>
                            {dailyTransactions.length > 0 && (
                                <div className="mt-1 space-y-1 overflow-y-auto text-xs scrollbar-hide">
                                    {dailyTransactions.map(tr => (
                                        <div key={tr.transactionId} className={`p-1 truncate rounded ${tr.transactionType === TRANSACTIONS_TYPE.INCOME ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{formatCurrency(tr.amount)}</div>
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