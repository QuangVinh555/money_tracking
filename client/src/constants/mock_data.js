// --- MOCK DATA ---
// Dữ liệu giả lập cho ứng dụng
export const mockData = {
    stats: {
        income: 25000000,
        expenses: 12580000,
        budgetLimit: 50000000
    },
    transactions: [
        { id: 1, type: 'expense', category: 'Ăn uống', description: 'Ăn trưa với đối tác', amount: 350000, date: '2025-06-15' },
        { id: 2, type: 'income', category: 'Lương', description: 'Lương tháng 6', amount: 25000000, date: '2025-06-05' },
        { id: 3, type: 'expense', category: 'Mua sắm', description: 'Mua quần áo mới', amount: 1200000, date: '2025-06-12' },
        { id: 4, type: 'expense', category: 'Di chuyển', description: 'Tiền xăng xe tháng 6', amount: 800000, date: '2025-06-01' },
        { id: 5, type: 'expense', category: 'Nhà cửa', description: 'Thanh toán tiền điện', amount: 550000, date: '2025-06-10' },
        { id: 6, type: 'expense', category: 'Ăn uống', description: 'Cà phê cuối tuần', amount: 150000, date: '2025-06-08' },
        { id: 7, type: 'expense', category: 'Mua sắm', description: 'Sách mới', amount: 230000, date: '2025-06-03' },
    ],
    expenseByCategory: [
        { name: 'Ăn uống', value: 4500000 },
        { name: 'Mua sắm', value: 3200000 },
        { name: 'Di chuyển', value: 1500000 },
        { name: 'Nhà cửa', value: 2500000 },
        { name: 'Giải trí', value: 880000 },
    ],
};

export const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];
