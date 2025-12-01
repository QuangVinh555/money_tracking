import React, { useEffect, useRef, useState } from "react";
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
  PieChartIcon,
} from "lucide-react";
import useTransactions from "../../hook/transactions.js";
import ProfileDropdown from "./ProfileDropdown.jsx";
import { useNavigate } from "react-router-dom";
import { formatToLocalDateString } from "../../utils/format.js";
import useBudgetsLimit from "../../hook/budgets_limit.js";
import BudgetOverview from "../budgetOverview/BudgetOverview.jsx";
import FixedExpenses from "../../component/dashboard/FixedExpenses.jsx";
import FinancialHealth from "../../component/dashboard/FinancialHealth.jsx";
const Dashboard = () => {
  // Lấy thông tin từ localstorage
  const userName = localStorage.getItem('userInfo');
  // Lấy chữ cái đầu tiên làm avatar logo
  const avatarLetter = userName?.charAt(0).toUpperCase() || 'A';

  // Set trạng thái loading
  // const [isLoading, setIsLoading] = useState(false);

  // State lưu giá trị datetime (click tháng trước, tháng sau) truyền component con(CalendarView) sang component cha
  const [changeDate, setChangeDate] = useState(formatToLocalDateString(new Date()));

  // Ngày được click chọn trên lịch
  const [selectedDate, setSelectedDate] = useState(null);

  // Popup hạn mức
  const [isLimitModalOpen, setLimitModalOpen] = useState(false);

  // Create data Budgets_Limit call API
  const { loadingBudgetsLimit, createBudgetsLimit } = useBudgetsLimit();

  // List data transactions call API
  const { transactions, totalCard, totalCardByDate, createTransactions, loading, fetchTotalCardTransactions, fetchTotalCardByDateTransactions } = useTransactions(changeDate);

  // Popup thêm giao dịch
  const [isModalOpen, setModalOpen] = useState(false);

  // Popup thông tin user
  const [isProfileOpen, setProfileOpen] = useState(false);

  const profileRef = useRef(null);

  const navigate = useNavigate();

  // Logout
  const handleLogOut = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('userInfo');
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

  // Click ở ngoài dropdown thì tắt popup của profile
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [profileRef]);

  // Vì ở componetn TransactionModal đang dùng hàm format để chuyển sang dạng khác nên chỗ này sẽ giữ nguyên
  // Và sẽ xử lý formatToLocalDateString nó ở TransactionModal
  const handleDayClick = (date) => {
    setSelectedDate(date);
    setModalOpen(true);
    // Vì đoạn này gọi api theo ngày đã chọn để tính toán nên phải format lại
    fetchTotalCardByDateTransactions(formatToLocalDateString(date));
  };

  // Thêm giao dịch transactions
  const handleAddTransaction = async (newTransaction) => {
    await createTransactions(newTransaction);
    await fetchTotalCardByDateTransactions(newTransaction.transaction_Date);
  };

  // Thêm hạn mức Budgets_limit
  const handleSetLimit = async (newLimit) => {
    await createBudgetsLimit(newLimit)
    await fetchTotalCardTransactions();
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
                Chào mừng trở lại, {userName}! Đây là báo cáo tài chính của bạn.
              </p>
            </div>
            <div className="flex items-center gap-4" ref={profileRef}>
              <button onClick={() => setProfileOpen(p => !p)} className="flex items-center gap-3 p-1 pr-3 rounded-full hover:bg-gray-200 transition-colors">
                <img src={`https://placehold.co/40x40/e0e7ff/3730a3?text=${avatarLetter}`} alt="Avatar" className="w-10 h-10 rounded-full" />
                <span className="hidden sm:inline font-semibold text-gray-700">{userName}</span>
              </button>
              {isProfileOpen && <ProfileDropdown userInfo={userName} onLogout={handleLogOut} />}
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
              title="Tổng chi tiêu"
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
            <StatCard
              title="Chi tiêu TB/ngày"
              amount={totalCard.data?.averageDailySpending || 0}
              icon={<PieChartIcon size={24} className="text-blue-500" />}
              colorClass="bg-blue-100"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <BudgetOverview totalCard={totalCard} changeDate={changeDate} onEditLimit={() => setLimitModalOpen(true)} />
            <FixedExpenses />
            <FinancialHealth income={10000000} expenses={8000000} />
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
              <RecentTransactions transactions={transactions} />
              {/* <ExpensePieChart data={expenseByCategory} /> */}
            </div>
          </div>
        </main>
      </div>
      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        selectedDate={selectedDate}
        transactions={transactions}
        totalCard={totalCardByDate}
        onAddTransaction={handleAddTransaction}
        isLoading={loading}
      />
      <SpendingLimitModal
        isOpen={isLimitModalOpen}
        onClose={() => setLimitModalOpen(false)}
        currentLimit={totalCard?.data?.budgetLimit}
        onSetLimit={handleSetLimit}
        isLoading={loadingBudgetsLimit}
      />
    </div>
  );
};
export default Dashboard;
