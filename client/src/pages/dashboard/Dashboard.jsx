import React, { useEffect, useRef, useState } from "react";
import { mockData } from "../../constants/mock_data.js";
import StatCard from "../../pages/dashboard/StatCard.jsx";
import CalendarView from "../../pages/dashboard/CalendarView.jsx";
import ExpensePieChart from "../../pages/dashboard/ExpensePieChart.jsx";
import RecentTransactions from "../../pages/dashboard/RecentTransactions.jsx";
import TransactionModal from "./TransactionModal.jsx";
import SpendingLimitModal from "./SpendingLimitModal.jsx";

import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  CreditCard,
  Download,
  PlusCircle
} from "lucide-react";
import useTransactions from "../../hook/transactions.js";
import ProfileDropdown from "./ProfileDropdown.jsx";
import { useNavigate } from "react-router-dom";
import { formatToLocalDateString, formatToUTCDateString } from "../../utils/format.js";
import useCategories from "../../hook/categories.js";

const Dashboard = () => {
  // State lưu giá trị datetime (click tháng trước, tháng sau) truyền component con(CalendarView) sang component cha
  const [changeDate, setChangeDate] = useState(formatToUTCDateString(new Date()));

  // List data fake tổng thu nhập, hạn mức, tổng chi tiêu,...
  const { stats } = mockData;
  // const balanceFake = stats.budgetLimit - stats.expenses;

  // List data fake transactions
  const [allTransactions, setAllTransactions] = useState(mockData.transactions);

  // List data transactions call API
  const { transactions, totalCard, createTransactions } = useTransactions(changeDate);

  // List data categories call API
  const {categories} = useCategories();

  const [isModalOpen, setModalOpen] = useState(false);
  const [isLimitModalOpen, setLimitModalOpen] = useState(false);

  const [selectedDate, setSelectedDate] = useState(null);

  const [isProfileOpen, setProfileOpen] = useState(false);

  const profileRef = useRef(null);

  const navigate = useNavigate();
  const handleLogOut = () => {
    localStorage.removeItem('access_token');
    navigate('/login');
  }

  /* 
    Truyền datetime từ component con lên component cha
    Đã note trường hợp này trong componet CalendarView
    Sẽ convert dang thứ ngày tiếng anh sang theo chuẩn "YYYY-MM-DD"
  */
  const handleDateChange = (date) => {
    setChangeDate(formatToLocalDateString(date));
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [profileRef]);

  const handleDayClick = (date) => {
    setSelectedDate(date);
    setModalOpen(true);
  };

  // Thêm giao dịch transactions
  const handleAddTransaction = (newTransaction) => {
    createTransactions(newTransaction);
  };

  const handleSetLimit = (newLimit) => {
    setAllTransactions(prev => ({ ...prev, stats: { ...prev.stats, spendingLimit: newLimit } }));
    setLimitModalOpen(false);
  };

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
              <p className="text-gray-500">
                Chào mừng trở lại, Vinh! Đây là báo cáo tài chính của bạn.
              </p>
            </div>
            <div className="flex items-center gap-4" ref={profileRef}>
              <button onClick={() => setProfileOpen(p => !p)} className="flex items-center gap-3 p-1 pr-3 rounded-full hover:bg-gray-200 transition-colors">
                <img src="https://placehold.co/40x40/e0e7ff/3730a3?text=A" alt="Avatar" className="w-10 h-10 rounded-full" />
                <span className="hidden sm:inline font-semibold text-gray-700">Quang Vinh</span>
              </button>
              {isProfileOpen && <ProfileDropdown onLogout={handleLogOut} />}
            </div>
          </header>

          {/* Stat Cards Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Tổng thu nhập"
              amount={totalCard.data?.income || 0}
              icon={<TrendingUp size={24} className="text-green-500" />}
              colorClass="bg-green-100"
            />
            <StatCard
              title="Hạn mức"
              amount={totalCard.data?.budgetLimit || 0}
              icon={<CreditCard size={24} className="text-green-500" />}
              colorClass="bg-green-100"
              onEdit={() => setLimitModalOpen(true)}
            />
            <StatCard
              title="Tổng chi"
              amount={totalCard.data?.expense || 0}
              icon={<TrendingDown size={24} className="text-red-500" />}
              colorClass="bg-red-100"
            />
            <StatCard
              title="Số dư"
              amount={totalCard.data?.balance || 0}
              icon={<DollarSign size={24} className="text-blue-500" />}
              colorClass="bg-blue-100"
            />
          </div>

          {/* Main Grid: Calendar and Charts */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2">
              <CalendarView
                transactions={transactions}
                onChangeDate={handleDateChange}
                onDayClick={handleDayClick}
              />
            </div>
            <div className="space-y-6">
              <RecentTransactions transactions={allTransactions} />
              {/* <ExpensePieChart data={expenseByCategory} /> */}
            </div>
          </div>
        </main>
      </div>
      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        selectedDate={selectedDate}
        transactions={allTransactions}
        categories={categories}
        onAddTransaction={handleAddTransaction}
      />
      <SpendingLimitModal isOpen={isLimitModalOpen} onClose={() => setLimitModalOpen(false)} currentLimit={stats.spendingLimit} onSetLimit={handleSetLimit} />
    </div>
  );
};
export default Dashboard;
