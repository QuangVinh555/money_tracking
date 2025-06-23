import React from 'react';
import { mockData } from '../../constants/mock_data.js';
import StatCard from '../../pages/dashboard/StatCard.jsx'
import CalendarView from '../../pages/dashboard/CalendarView.jsx'
import ExpensePieChart from '../../pages/dashboard/ExpensePieChart.jsx'
import RecentTransactions from '../../pages/dashboard/RecentTransactions.jsx'
import {
    ChevronLeft, ChevronRight, DollarSign, TrendingUp, TrendingDown, ArrowRight,
    ShoppingCart, Utensils, Car, Home, LayoutDashboard, Repeat, BarChart3,
    Wallet, Settings, Gem, Download, PlusCircle
} from 'lucide-react';
import Sidebar from '../../component/layout/Sidebar.jsx';

const Dashboard = () => {
    const { stats, transactions, expenseByCategory } = mockData;
    const balance = stats.income - stats.expenses;

    return (
        <div className="bg-gray-100 min-h-screen text-gray-800 font-sans">
            <div className="flex">
                {/* Sidebar */}
                {/* <Sidebar /> */}
                {/* Main Content - Nội dung chính */}
                <main className="flex-1 p-6 lg:p-8 flex flex-col">
                    <header className="mb-8 flex justify-between items-center">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900">Tổng quan</h2>
                            <p className="text-gray-500">Chào mừng trở lại, Vinh! Đây là báo cáo tài chính của bạn.</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <button className="hidden sm:flex items-center gap-2 bg-white border border-gray-300 text-gray-700 font-semibold px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                                <Download size={16} />
                                <span>Tải báo cáo</span>
                            </button>
                            <button className="flex items-center gap-2 bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
                                <PlusCircle size={16} />
                                <span>Thêm giao dịch</span>
                            </button>
                        </div>
                    </header>

                    {/* Stat Cards Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
                        <StatCard title="Tổng thu" amount={stats.income} icon={<TrendingUp size={24} className="text-green-500" />} colorClass="bg-green-100" />
                        <StatCard title="Tổng thu" amount={stats.income} icon={<TrendingUp size={24} className="text-green-500" />} colorClass="bg-green-100" />
                        <StatCard title="Tổng chi" amount={stats.expenses} icon={<TrendingDown size={24} className="text-red-500" />} colorClass="bg-red-100" />
                        <StatCard title="Số dư" amount={balance} icon={<DollarSign size={24} className="text-blue-500" />} colorClass="bg-blue-100" />
                    </div>

                    {/* Main Grid: Calendar and Charts */}
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                        <div className="xl:col-span-2">
                            <CalendarView transactions={transactions} />
                        </div>
                        <div className="space-y-6">
                            {/* <ExpensePieChart data={expenseByCategory} /> */}
                            <RecentTransactions transactions={transactions} />
                        </div>
                    </div>

                    {/* Footer */}
                    <footer className="text-center mt-auto py-4 text-sm text-gray-500 border-t border-gray-200">
                        <p>© 2025 Expense. All Rights Reserved.</p>
                    </footer>
                </main>
            </div>
        </div>
    )
}
export default Dashboard