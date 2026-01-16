import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft, TrendingDown, Wallet,
    UserPlus, Settings, Trash2, Edit, Search, X, MoreVertical,
    ChevronLeft, ChevronRight, AlertTriangle, Shield, Calendar,
    Utensils, ShoppingCart, Car, Home, DollarSign,
    Gamepad2, AlertCircle, Briefcase, Building2
} from 'lucide-react';
import groupApi from '../../api/modules/groupApi';
import transactionsApi from '../../api/modules/transactions';
import TransactionModal from '../dashboard/TransactionModal';
import SpendingLimitModal from '../dashboard/SpendingLimitModal';
import ConfirmationModal from '../../component/modals/ConfirmationModal';
import { formatCurrency, formatToLocalDateString } from '../../utils/format';
import { TRANSACTIONS_TYPE } from '../../constants/common';

// --- ICON MAPPING ---
const categoryIcons = {
    'Ăn uống': <Utensils size={20} className="text-orange-500" />,
    'Giải trí': <Gamepad2 size={20} className="text-pink-500" />,
    'Mua sắm': <ShoppingCart size={20} className="text-blue-500" />,
    'Lương': <DollarSign size={20} className="text-emerald-500" />,
    'Di chuyển': <Car size={20} className="text-green-500" />,
    'Chi phí phát sinh': <AlertCircle size={20} className="text-red-500" />,
    'Thu nhập thêm': <Briefcase size={20} className="text-indigo-500" />,
    'Tiền thuê trọ': <Building2 size={20} className="text-yellow-600" />,
    'Chi phí sinh hoạt': <Home size={20} className="text-purple-500" />,
    'Default': <DollarSign size={20} className="text-gray-500" />,
};

const getCategoryIcon = (category) => categoryIcons[category] || categoryIcons['Default'];

const GroupDetail = () => {
    const { groupId } = useParams();
    const navigate = useNavigate();

    // State for data
    const [groupDetail, setGroupDetail] = useState(null);
    const [dashboard, setDashboard] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });
    const [loading, setLoading] = useState(true);

    // State for selections
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]); // Used for Month filter

    // Modals state
    const [showTransactionModal, setShowTransactionModal] = useState(false);
    const [showLimitModal, setShowLimitModal] = useState(false);
    const [showAddMember, setShowAddMember] = useState(false);
    const [showEditGroup, setShowEditGroup] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false); // Only for Group

    // Transaction Edit/Delete state
    const [transactionToEdit, setTransactionToEdit] = useState(null);
    const [transactionToDelete, setTransactionToDelete] = useState(null); // Only for Transaction
    const [permissionError, setPermissionError] = useState(null); // Permission Error Warning

    // Member Remove Modal state
    const [showRemoveMemberConfirm, setShowRemoveMemberConfirm] = useState(false);
    const [memberToRemove, setMemberToRemove] = useState(null);

    // Settings Menu state
    const [showSettingsMenu, setShowSettingsMenu] = useState(false);

    // Search Users state
    const [searchEmail, setSearchEmail] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [searching, setSearching] = useState(false);
    const [selectedUserToAdd, setSelectedUserToAdd] = useState(null);

    // Edit Group state
    const [editForm, setEditForm] = useState({ groupName: '', description: '' });

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showSettingsMenu && !event.target.closest('.settings-menu-container')) {
                setShowSettingsMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showSettingsMenu]);

    useEffect(() => {
        fetchGroupData();
        fetchTransactions();
    }, [groupId, selectedDate]);

    // Fetch transactions independently when page changes
    useEffect(() => {
        fetchTransactions();
    }, [pagination.page]);

    const fetchGroupData = async () => {
        try {
            const [detailRes, dashboardRes] = await Promise.all([
                groupApi.getGroupDetail(groupId),
                groupApi.getGroupDashboard(groupId, selectedDate)
            ]);

            if (detailRes.data.success) {
                setGroupDetail(detailRes.data.data);
                setEditForm({
                    groupName: detailRes.data.data.groupName,
                    description: detailRes.data.data.description || ''
                });
            }
            if (dashboardRes.data.success) {
                setDashboard(dashboardRes.data.data);
            }
        } catch (error) {
            console.error('Error fetching group data:', error);
            if (error.response?.status === 404) {
                alert("Nhóm không tồn tại");
                navigate('/groups');
            }
        } finally {
            setLoading(false);
        }
    };

    const fetchTransactions = async () => {
        try {
            const res = await groupApi.getGroupTransactions(groupId, {
                optionDate: selectedDate,
                pageNumber: pagination.page,
                pageSize: pagination.limit
            });
            if (res.data.success) {
                setTransactions(res.data.data.items);
                setPagination(prev => ({
                    ...prev,
                    total: res.data.data.totalCount
                }));
            }
        } catch (error) {
            console.error("Error fetching transactions", error);
        }
    };

    // --- Handlers ---
    const handleSearchUsers = async (email) => {
        setSearchEmail(email);
        if (email.length < 3) {
            setSearchResults([]);
            return;
        }
        setSearching(true);
        try {
            const res = await groupApi.searchUsers(email);
            if (res.data.success) {
                setSearchResults(res.data.data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setSearching(false);
        }
    };

    const handleCreateTransaction = async (newTransaction) => {
        try {
            const transactionData = { ...newTransaction, groupId: parseInt(groupId) };
            const res = await transactionsApi.create(transactionData);
            if (res.data.success) {
                setShowTransactionModal(false);
                fetchGroupData();
                fetchTransactions();
            }
        } catch (error) {
            alert("Lỗi khi tạo giao dịch");
        }
    };

    const handleUpdateTransaction = async (id, data) => {
        try {
            const res = await transactionsApi.update(id, data);
            if (res.data.success) {
                setShowTransactionModal(false);
                setTransactionToEdit(null);
                fetchGroupData();
                fetchTransactions();
            }
        } catch (error) {
            console.error("Lỗi update giao dịch", error);
            alert("Cập nhật giao dịch thất bại");
        }
    };

    const handleDeleteTransaction = async () => {
        if (!transactionToDelete) return;
        try {
            const res = await transactionsApi.delete(transactionToDelete.transactionId);
            if (res.data.success) {
                setTransactionToDelete(null);
                fetchGroupData();
                fetchTransactions();
            }
        } catch (error) {
            console.error("Delete transaction error:", error);
            setTransactionToDelete(null); // Close confirm modal first
            /* CHÚ Ý:
            // Tại vì do BE chưa làm check phân quyền nên check trường hợp xóa giao dịch
            // không phải của mình thì mặc định là người khác đang xóa, nên sẽ báo lỗi không
            // có quyền xóa giao dịch của người khác
            // Check for specific permission error or general error
            // if (error.response?.status === 403 || error.response?.status === 401) {
            //     setPermissionError("Bạn không thể xóa giao dịch do người khác tạo.");
            // } else {
            //     setPermissionError(error.response?.data?.message || "Đã xảy ra lỗi khi xóa giao dịch.");
            // }
            */
            setPermissionError("Bạn không thể xóa giao dịch do người khác tạo.");
        }
    }

    const handleUpdateLimit = async (limitData) => {
        try {
            const limit = limitData.Budgets_Limit_Total;
            const res = await groupApi.updateGroup(groupId, {
                ...editForm,
                budgetLimit: limit
            });
            if (res.data.success) {
                setShowLimitModal(false);
                fetchGroupData();
            }
        } catch (error) {
            console.error("Error updating limit", error);
        }
    };

    const handleUpdateGroup = async (e) => {
        e.preventDefault();
        try {
            const res = await groupApi.updateGroup(groupId, {
                ...editForm,
                budgetLimit: groupDetail.budgetLimit
            });
            if (res.data.success) {
                setShowEditGroup(false);
                fetchGroupData();
            }
        } catch (error) {
            alert("Cập nhật thất bại");
        }
    };

    const handleDeleteGroup = async () => {
        try {
            const res = await groupApi.deleteGroup(groupId);
            if (res.data.success) {
                navigate('/groups');
            }
        } catch (error) {
            alert(error.response?.data?.message || "Không thể xóa nhóm");
        }
    };

    const handleAddMember = async () => {
        if (!selectedUserToAdd) return;
        try {
            const res = await groupApi.addMember(groupId, {
                userIdToAdd: selectedUserToAdd.userId,
                role: 'member'
            });
            if (res.data.success) {
                setShowAddMember(false);
                setSearchEmail('');
                setSelectedUserToAdd(null);
                setSearchResults([]);
                fetchGroupData();
            }
        } catch (error) {
            alert(error.response?.data?.message || "Lỗi thêm thành viên");
        }
    };

    const confirmRemoveMember = (member) => {
        setMemberToRemove(member);
        setShowRemoveMemberConfirm(true);
    }

    const handleRemoveMember = async () => {
        if (!memberToRemove) return;
        try {
            const res = await groupApi.removeMember(groupId, memberToRemove.userId);
            if (res.data.success) {
                fetchGroupData();
                setShowRemoveMemberConfirm(false);
                setMemberToRemove(null);
            }
        } catch (error) {
            alert(error.response?.data?.message || "Lỗi xóa thành viên");
        }
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= Math.ceil(pagination.total / pagination.limit)) {
            setPagination(prev => ({ ...prev, page: newPage }));
        }
    };

    if (loading) return <div className="flex h-screen items-center justify-center text-gray-500">Đang tải...</div>;
    if (!groupDetail) return null;

    const isAdmin = groupDetail.currentUserRole === 'admin';
    const budgetLimit = groupDetail.budgetLimit || 0;
    const currentExpense = dashboard?.expense || 0;
    // Số dư = Hạn mức - Tổng chi (Theo yêu cầu)
    const remainingBalance = (budgetLimit) - (currentExpense);

    const progressPercent = budgetLimit > 0 ? Math.min((currentExpense / budgetLimit) * 100, 100) : 0;
    const totalPages = Math.ceil(pagination.total / pagination.limit);

    return (
        <div className="p-6 bg-gradient-to-br from-gray-50 to-emerald-50 min-h-screen font-sans">
            {/* Header */}
            <div className="flex justify-between items-start mb-8">
                <div>
                    <button onClick={() => navigate('/groups')} className="flex items-center gap-2 text-gray-500 hover:text-emerald-600 mb-2 transition-colors">
                        <ArrowLeft size={20} /> Quay lại
                    </button>
                    <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600 flex items-center gap-3">
                        {groupDetail.groupName}
                        {isAdmin && (
                            <button onClick={() => setShowEditGroup(true)} className="text-gray-400 hover:text-emerald-600 p-1 transition-colors">
                                <Edit size={20} />
                            </button>
                        )}
                    </h1>
                    <p className="text-gray-600 mt-2 font-medium">{groupDetail.description}</p>
                </div>

                <div className="flex gap-3">
                    {isAdmin && (
                        <button
                            onClick={() => setShowAddMember(true)}
                            className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-5 py-2.5 rounded-xl hover:shadow-lg hover:opacity-90 transition-all font-semibold shadow-md"
                        >
                            <UserPlus size={18} /> <span className="hidden sm:inline">Thêm thành viên</span>
                        </button>
                    )}
                    {isAdmin && (
                        <div className="relative settings-menu-container">
                            <button
                                onClick={() => setShowSettingsMenu(!showSettingsMenu)}
                                className="p-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 shadow-sm transition-colors text-gray-700"
                            >
                                <MoreVertical size={20} />
                            </button>
                            {showSettingsMenu && (
                                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl py-2 z-20 border border-gray-100 animate-fade-in divide-y divide-gray-100">
                                    <button onClick={() => { setShowEditGroup(true); setShowSettingsMenu(false); }} className="flex w-full items-center px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                                        <Settings size={18} className="mr-3 text-gray-400" /> Cài đặt nhóm
                                    </button>
                                    <button onClick={() => { setShowDeleteConfirm(true); setShowSettingsMenu(false); }} className="flex w-full items-center px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors">
                                        <Trash2 size={18} className="mr-3" /> Xóa nhóm
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Card 1: Budget Limit */}
                <div
                    className="group relative bg-gradient-to-br from-emerald-500 to-teal-600 p-6 rounded-2xl shadow-lg text-white cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                    onClick={() => isAdmin && setShowLimitModal(true)}
                >
                    <div className="absolute top-0 right-0 p-4 opacity-20">
                        <Settings size={48} />
                    </div>
                    <div className="relative z-10">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-emerald-100 font-medium text-sm uppercase tracking-wide">Hạn mức chi tiêu</span>
                        </div>
                        {budgetLimit > 0 ? (
                            <div>
                                <p className="text-3xl font-bold mb-3">{formatCurrency(budgetLimit)}</p>
                                <div className="w-full bg-black/20 rounded-full h-2 mb-2 backdrop-blur-sm">
                                    <div className={`h-2 rounded-full ${progressPercent > 100 ? 'bg-red-400' : 'bg-white'}`} style={{ width: `${progressPercent}%` }}></div>
                                </div>
                                <p className="text-xs text-emerald-100 font-medium">
                                    {progressPercent > 100 ? '⚠️ Đã vượt quá hạn mức' : `Đã dùng ${progressPercent.toFixed(0)}%`}
                                </p>
                            </div>
                        ) : (
                            <div className="flex flex-col h-full py-2">
                                <p className="text-emerald-100 text-lg font-medium opacity-80">Chưa thiết lập</p>
                                <p className="text-white text-xs mt-1 underline decoration-white/50">Bấm để cài đặt</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Card 2: Total Expense */}
                <div className="relative bg-gradient-to-br from-rose-500 to-red-600 p-6 rounded-2xl shadow-lg text-white hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                    <div className="absolute top-0 right-0 p-4 opacity-20">
                        <TrendingDown size={48} />
                    </div>
                    <div className="relative z-10">
                        <span className="text-rose-100 font-medium text-sm uppercase tracking-wide">Tổng chi tiêu</span>
                        <p className="text-3xl font-bold mt-2">{formatCurrency(dashboard?.expense || 0)}</p>
                        <p className="text-xs text-rose-100 mt-2 font-medium opacity-80">Trong tháng này</p>
                    </div>
                </div>

                {/* Card 3: Balance */}
                <div className="relative bg-gradient-to-br from-emerald-500 to-teal-600 p-6 rounded-2xl shadow-lg text-white hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                    <div className="absolute top-0 right-0 p-4 opacity-20">
                        <Wallet size={48} />
                    </div>
                    <div className="relative z-10">
                        <span className="text-emerald-100 font-medium text-sm uppercase tracking-wide">Số dư khả dụng</span>
                        <p className="text-3xl font-bold mt-2">{formatCurrency(remainingBalance)}</p>
                        <p className="text-xs text-emerald-100 mt-2 font-medium opacity-80">= Hạn mức - Tổng chi</p>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="space-y-8">
                {/* Members Section */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-800 mb-6 text-xl flex items-center gap-2">
                        <Shield size={20} className="text-emerald-500" /> Thành viên ({groupDetail.members.length})
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {groupDetail.members.map(member => (
                            <div key={member.groupMemberId} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-transparent hover:border-emerald-100 hover:bg-white hover:shadow-md transition-all group">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 text-slate-700 flex items-center justify-center font-bold text-lg shadow-inner">
                                    {member.fullName?.charAt(0).toUpperCase() || 'U'}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-base font-bold text-gray-800 truncate">{member.fullName}</p>
                                    <p className={`text-xs font-semibold uppercase tracking-wider ${member.role === 'admin' ? 'text-emerald-600' : 'text-gray-500'}`}>
                                        {member.role === 'admin' ? 'Quản trị viên' : 'Thành viên'}
                                    </p>
                                </div>
                                {isAdmin && member.userId !== groupDetail.createdByUserId && (
                                    <button
                                        onClick={() => confirmRemoveMember(member)}
                                        className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                                        title="Xóa thành viên"
                                    >
                                        <X size={18} />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
                {/* Transactions Section - Enhaced UI */}
                <div className="bg-gradient-to-br from-white to-emerald-50 p-8 rounded-2xl shadow-lg border border-emerald-100">
                    <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
                        <div className="flex items-center gap-4">
                            <h3 className="font-bold text-gray-800 text-xl flex items-center gap-2">
                                <Calendar size={20} className="text-emerald-500" />
                                <span className="hidden sm:inline">Lịch sử giao dịch</span>
                                <span className="inline sm:hidden">Giao dịch</span>
                            </h3>
                            <div className="relative group">
                                <input
                                    type="month"
                                    value={selectedDate.substring(0, 7)}
                                    onChange={(e) => setSelectedDate(e.target.value + "-01")}
                                    className="pl-3 pr-2 py-1.5 text-sm font-medium border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent cursor-pointer bg-gray-50 hover:bg-white transition-colors"
                                />
                            </div>
                        </div>

                        <button
                            onClick={() => { setTransactionToEdit(null); setShowTransactionModal(true); }}
                            className="w-full sm:w-auto bg-gray-900 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-800 shadow-md transition-all flex items-center justify-center gap-2"
                        >
                            + Thêm giao dịch
                        </button>
                    </div>

                    {/* Transaction Table */}
                    <div className="overflow-x-auto rounded-xl border border-gray-100">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-50">
                                <tr className="text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                                    <th className="px-6 py-4">Ngày</th>
                                    <th className="px-6 py-4">Giao dịch</th>
                                    <th className="px-6 py-4">Người tạo</th>
                                    <th className="px-6 py-4 text-right">Số tiền</th>
                                    <th className="px-6 py-4 text-center">Hành động</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm divide-y divide-gray-50">
                                {transactions.length > 0 ? (
                                    transactions.map(tx => (
                                        <tr key={tx.transactionId} className="hover:bg-emerald-50/30 transition-colors">
                                            {/* Date */}
                                            <td className="px-6 py-4 text-gray-600 font-medium whitespace-nowrap">
                                                {formatToLocalDateString(tx.transactionDate)}
                                            </td>

                                            {/* Main Info: Icon + Description */}
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-gray-100 rounded-full flex-shrink-0">
                                                        {getCategoryIcon(tx.categoryName)}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="font-bold text-gray-900 truncate">
                                                            {tx.description || tx.categoryName}
                                                        </p>
                                                        <div className="flex items-center gap-2 mt-0.5">
                                                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full border border-gray-200">
                                                                {tx.categoryName}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Creator */}
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-600">
                                                        {tx.fullName?.charAt(0).toUpperCase()}
                                                    </div>
                                                    <span className="text-gray-700">{tx.fullName}</span>
                                                </div>
                                            </td>

                                            {/* Amount */}
                                            <td className={`px-6 py-4 text-right font-bold text-base ${tx.transactionType === 1 ? 'text-green-600' : 'text-red-600'}`}>
                                                {tx.transactionType === 1 ? '+' : '-'}{formatCurrency(tx.amount)}
                                            </td>

                                            {/* Actions */}
                                            <td className="px-6 py-4 text-center">
                                                <div className="flex items-center justify-center gap-1">
                                                    <button
                                                        onClick={() => { setTransactionToEdit(tx); setShowTransactionModal(true); }}
                                                        className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                                                        title="Sửa"
                                                    >
                                                        <Edit size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => setTransactionToDelete(tx)}
                                                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Xóa"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center text-gray-400 font-medium bg-gray-50/50">
                                            Không có giao dịch nào trong tháng này
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-center items-center gap-4 mt-8">
                            <button
                                onClick={() => handlePageChange(pagination.page - 1)}
                                disabled={pagination.page === 1}
                                className="p-2.5 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-gray-600"
                            >
                                <ChevronLeft size={20} />
                            </button>
                            <span className="text-sm font-semibold text-gray-700 bg-gray-100 px-4 py-2 rounded-lg">
                                Trang <span className="text-blue-600">{pagination.page}</span> / {totalPages}
                            </span>
                            <button
                                onClick={() => handlePageChange(pagination.page + 1)}
                                disabled={pagination.page >= totalPages}
                                className="p-2.5 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-gray-600"
                            >
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* --- Modals --- */}

            {/* Transaction Edit/Create Modal */}
            <TransactionModal
                isOpen={showTransactionModal}
                onClose={() => { setShowTransactionModal(false); setTransactionToEdit(null); }}
                selectedDate={transactionToEdit ? new Date(transactionToEdit.transactionDate) : new Date(selectedDate)}
                transactions={null}
                totalCard={{ data: dashboard }}
                onAddTransaction={handleCreateTransaction} // for Create
                onUpdateTransaction={handleUpdateTransaction} // for Edit
                transactionToEdit={transactionToEdit} // Pass the tx to edit
                isLoading={false}
            />

            {/* Spending Limit Modal */}
            <SpendingLimitModal
                isOpen={showLimitModal}
                onClose={() => setShowLimitModal(false)}
                currentLimit={budgetLimit}
                onSetLimit={handleUpdateLimit}
            />

            {/* Transaction Delete Confirm */}
            <ConfirmationModal
                isOpen={!!transactionToDelete}
                onClose={() => setTransactionToDelete(null)}
                onConfirm={handleDeleteTransaction}
                title="Xác nhận xóa giao dịch"
                loading={loading}
            >
                <p className="text-gray-600">
                    Bạn có chắc chắn muốn xóa giao dịch <span className="font-bold">{transactionToDelete?.description}</span> không?
                </p>
            </ConfirmationModal>

            {/* Add Member Modal */}
            {showAddMember && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-scale-up border border-gray-100">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-gray-800">Thêm thành viên</h3>
                            <button onClick={() => setShowAddMember(false)} className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"><X size={20} /></button>
                        </div>
                        <div className="mb-6">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Tìm kiếm bằng email</label>
                            <div className="relative">
                                <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder-gray-400"
                                    placeholder="Nhập email người dùng..."
                                    value={searchEmail}
                                    onChange={(e) => handleSearchUsers(e.target.value)}
                                    autoFocus
                                />
                            </div>
                        </div>
                        <div className="max-h-60 overflow-y-auto mb-6 border border-gray-100 rounded-xl divide-y divide-gray-50 bg-gray-50/50 min-h-[120px]">
                            {searching ? (
                                <div className="h-full flex flex-col items-center justify-center py-8 text-gray-400 gap-2">
                                    <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                    <span className="text-sm">Đang tìm kiếm...</span>
                                </div>
                            ) : searchResults.length > 0 ? (
                                searchResults.map(user => (
                                    <div
                                        key={user.userId}
                                        onClick={() => setSelectedUserToAdd(user)}
                                        className={`p-3 flex items-center justify-between cursor-pointer hover:bg-white transition-all ${selectedUserToAdd?.userId === user.userId ? 'bg-blue-50 ring-1 ring-blue-500' : ''}`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                                                {user.fullName?.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="flex flex-col">
                                                <p className="font-semibold text-gray-800 text-sm">{user.fullName}</p>
                                                <p className="text-xs text-gray-500">{user.email}</p>
                                            </div>
                                        </div>
                                        {selectedUserToAdd?.userId === user.userId && <span className="text-blue-600 text-xs font-bold bg-blue-100 px-2 py-1 rounded-md">Đã chọn</span>}
                                    </div>
                                ))
                            ) : (
                                searchEmail.length > 2 && <div className="py-8 text-center text-gray-400 text-sm">Không tìm thấy user nào</div>
                            )}
                        </div>
                        <div className="flex gap-3">
                            <button onClick={() => setShowAddMember(false)} className="flex-1 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 font-semibold text-gray-600 transition-colors">Hủy</button>
                            <button
                                onClick={handleAddMember}
                                disabled={!selectedUserToAdd}
                                className="flex-1 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold hover:shadow-lg disabled:opacity-50 disabled:shadow-none transition-all"
                            >
                                Thêm vào nhóm
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Remove Member Confirmation Modal */}
            {showRemoveMemberConfirm && memberToRemove && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-sm p-6 text-center animate-scale-up shadow-2xl">
                        <div className="mx-auto w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4 ring-8 ring-red-50/50">
                            <AlertTriangle className="text-red-500" size={32} />
                        </div>
                        <h3 className="text-xl font-bold mb-2 text-gray-900">Xóa thành viên?</h3>
                        <p className="text-gray-500 mb-6 px-4">
                            Bạn có chắc chắn muốn xóa <span className="font-bold text-gray-800">{memberToRemove.fullName}</span> khỏi nhóm này không?
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => { setShowRemoveMemberConfirm(false); setMemberToRemove(null); }}
                                className="flex-1 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 font-semibold text-gray-600 transition-colors"
                            >
                                Hủy bỏ
                            </button>
                            <button
                                onClick={handleRemoveMember}
                                className="flex-1 py-2.5 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-colors shadow-lg shadow-red-200"
                            >
                                Đồng ý xóa
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Group Modal */}
            {showEditGroup && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-md p-6 animate-scale-up shadow-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-gray-800">Cài đặt nhóm</h3>
                            <button onClick={() => setShowEditGroup(false)} className="p-2 hover:bg-gray-100 rounded-full text-gray-500"><X size={20} /></button>
                        </div>
                        <form onSubmit={handleUpdateGroup}>
                            <div className="mb-4">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Tên nhóm</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                    value={editForm.groupName}
                                    onChange={(e) => setEditForm({ ...editForm, groupName: e.target.value })}
                                />
                            </div>
                            <div className="mb-6">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Mô tả</label>
                                <textarea
                                    className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                    rows="3"
                                    value={editForm.description}
                                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                ></textarea>
                            </div>
                            <div className="flex gap-3">
                                <button type="button" onClick={() => setShowEditGroup(false)} className="flex-1 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 font-semibold text-gray-600">Hủy</button>
                                <button type="submit" className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-md">Lưu thay đổi</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Group Confirm */}
            {showDeleteConfirm && !transactionToDelete && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-sm p-6 text-center animate-scale-up shadow-2xl">
                        <div className="mx-auto w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4 ring-8 ring-red-50/50"><Trash2 className="text-red-600" size={32} /></div>
                        <h3 className="text-xl font-bold mb-2 text-gray-900">Xóa nhóm này?</h3>
                        <p className="text-gray-500 mb-6">Hành động này không thể hoàn tác. Tất cả dữ liệu sẽ bị mất vĩnh viễn.</p>
                        <div className="flex gap-3">
                            <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 font-semibold text-gray-600">Hủy</button>
                            <button onClick={handleDeleteGroup} className="flex-1 py-2.5 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 shadow-lg shadow-red-200">Xóa vĩnh viễn</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Permission/Error Warning Modal */}
            {permissionError && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-sm p-6 text-center animate-scale-up shadow-2xl border border-gray-100">
                        <div className="mx-auto w-16 h-16 bg-yellow-50 rounded-full flex items-center justify-center mb-4 ring-8 ring-yellow-50/50">
                            <AlertTriangle className="text-yellow-500" size={32} />
                        </div>
                        <h3 className="text-xl font-bold mb-2 text-gray-900">Không thể xóa</h3>
                        <p className="text-gray-600 mb-6 px-2 leading-relaxed">
                            {permissionError}
                        </p>
                        <button
                            onClick={() => setPermissionError(null)}
                            className="w-full py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-all shadow-lg"
                        >
                            Đã hiểu
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GroupDetail;
