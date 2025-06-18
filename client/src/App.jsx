import React from 'react';
import { mockData } from './constants/mock_data.js';
import StatCard from './pages/dashboard/StatCard.jsx'
import CalendarView from './pages/dashboard/CalendarView.jsx'
import ExpensePieChart from './pages/dashboard/ExpensePieChart.jsx'
import RecentTransactions from './pages/dashboard/RecentTransactions.jsx'
import {
    ChevronLeft, ChevronRight, DollarSign, TrendingUp, TrendingDown, ArrowRight,
    ShoppingCart, Utensils, Car, Home, LayoutDashboard, Repeat, BarChart3,
    Wallet, Settings, Gem, Download, PlusCircle
} from 'lucide-react';

export const menuItems = [
    { name: 'Tổng quan', icon: <LayoutDashboard />, active: true },
    { name: 'Giao dịch', icon: <Repeat />, active: false },
    { name: 'Báo cáo', icon: <BarChart3 />, active: false },
    { name: 'Ngân sách', icon: <Wallet />, active: false },
    { name: 'Cài đặt', icon: <Settings />, active: false },
];

function App() {
    const { stats, transactions, expenseByCategory } = mockData;
    const balance = stats.income - stats.expenses;

    return (
        <div className="bg-gray-100 min-h-screen text-gray-800 font-sans">
            <div className="flex">
                {/* Sidebar - Cột bên trái */}
                <aside className="w-20 lg:w-64 bg-white p-4 lg:p-6 flex flex-col border-r h-screen sticky top-0">
                   <a href="#" className="flex items-center gap-2 mb-10 self-center lg:self-start">
                       <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                           <DollarSign size={20} className="text-white"/>
                       </div>
                       <h1 className="text-2xl font-bold text-blue-600 hidden lg:block whitespace-nowrap">Expense Money</h1>
                   </a>
                   
                   <nav className="flex-grow">
                        <ul className="space-y-2">
                            {menuItems.map(item => (
                                <li key={item.name}>
                                    <a href="#" className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${item.active ? 'bg-blue-50 text-blue-600 font-bold' : 'hover:bg-gray-100'}`}>
                                        {React.cloneElement(item.icon, { size: 22, className: `flex-shrink-0 ${item.active ? 'text-blue-600' : 'text-gray-500'}` })}
                                        <span className="hidden lg:block">{item.name}</span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                   </nav>
                   
                   {/* Upgrade Card */}
                   <div className="hidden lg:block bg-gradient-to-br from-blue-500 to-indigo-600 text-white p-4 rounded-lg text-center mt-6">
                        <div className="p-3 bg-white/20 rounded-full inline-block mb-2">
                            <Gem size={24} />
                        </div>
                        <h4 className="font-bold">Nâng cấp Pro</h4>
                        <p className="text-xs text-blue-200 mt-1 mb-3">Mở khóa tất cả tính năng và nhận báo cáo không giới hạn.</p>
                        <button className="bg-white text-blue-600 font-bold w-full py-2 rounded-lg text-sm hover:bg-blue-50 transition-colors">Nâng cấp</button>
                   </div>

                   {/* User Profile */}
                   <div className="flex items-center gap-3 mt-6 border-t pt-6">
                       <img src="https://placehold.co/40x40/e0e7ff/3730a3?text=A" alt="Avatar" className="w-10 h-10 rounded-full" />
                       <div className="hidden lg:block">
                           <p className="font-bold">Quang Vinh</p>
                           <p className="text-sm text-gray-500">voquangvinh555@gmail.com</p>
                       </div>
                   </div>
                </aside>

                {/* Main Content - Nội dung chính */}
                <main className="flex-1 p-6 lg:p-8 flex flex-col">
                    <header className="mb-8 flex justify-between items-center">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900">Tổng quan</h2>
                            <p className="text-gray-500">Chào mừng trở lại, Vinh! Đây là báo cáo tài chính của bạn.</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <button className="hidden sm:flex items-center gap-2 bg-white border border-gray-300 text-gray-700 font-semibold px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                                <Download size={16}/>
                                <span>Tải báo cáo</span>
                            </button>
                             <button className="flex items-center gap-2 bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
                                <PlusCircle size={16}/>
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

export default App
