import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft, TrendingDown, Wallet,
    UserPlus, Settings, Trash2, Edit, Search, X, MoreVertical,
    ChevronLeft, ChevronRight, Calendar
} from 'lucide-react';
import groupApi from '../../api/modules/groupApi';
import transactionsApi from '../../api/modules/transactions';
import TransactionModal from '../dashboard/TransactionModal';
import SpendingLimitModal from '../dashboard/SpendingLimitModal';
import { formatCurrency, formatToLocalDateString, formatToLocalDateTimeString } from '../../utils/format';

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
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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

    const handleRemoveMember = async (userId) => {
        if (!window.confirm("Bạn chắc chắn muốn xóa thành viên này?")) return;
        try {
            const res = await groupApi.removeMember(groupId, userId);
            if (res.data.success) {
                fetchGroupData();
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
    const balance = (dashboard?.income || 0) - (dashboard?.expense || 0);
    const budgetLimit = groupDetail.budgetLimit || 0;
    const currentExpense = dashboard?.expense || 0;
    const progressPercent = budgetLimit > 0 ? Math.min((currentExpense / budgetLimit) * 100, 100) : 0;
    const totalPages = Math.ceil(pagination.total / pagination.limit);

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
                <div>
                    <button onClick={() => navigate('/groups')} className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-2">
                        <ArrowLeft size={20} /> Quay lại
                    </button>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                        {groupDetail.groupName}
                        {isAdmin && (
                            <button onClick={() => setShowEditGroup(true)} className="text-gray-400 hover:text-blue-600 p-1">
                                <Edit size={18} />
                            </button>
                        )}
                    </h1>
                    <p className="text-gray-600 mt-1">{groupDetail.description}</p>
                </div>

                <div className="flex gap-2">
                    {isAdmin && (
                        <button onClick={() => setShowAddMember(true)} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm font-medium">
                            <UserPlus size={18} /> <span className="hidden sm:inline">Thêm thành viên</span>
                        </button>
                    )}
                    {isAdmin && (
                        <div className="relative settings-menu-container">
                            <button
                                onClick={() => setShowSettingsMenu(!showSettingsMenu)}
                                className="p-2 bg-white border rounded-lg hover:bg-gray-100"
                            >
                                <MoreVertical size={20} />
                            </button>
                            {showSettingsMenu && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border animate-fade-in">
                                    <button onClick={() => { setShowEditGroup(true); setShowSettingsMenu(false); }} className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                        <Settings size={16} className="mr-2" /> Cài đặt nhóm
                                    </button>
                                    <button onClick={() => { setShowDeleteConfirm(true); setShowSettingsMenu(false); }} className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                                        <Trash2 size={16} className="mr-2" /> Xóa nhóm
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Stats Cards - Updated Layout */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Card 1: Budget Level (Replaces Total Income) */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-shadow" onClick={() => isAdmin && setShowLimitModal(true)}>
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-500 font-medium">Hạn mức chi tiêu</span>
                        <span className="p-2 bg-indigo-100 text-indigo-600 rounded-lg"><Settings size={20} /></span>
                    </div>
                    {budgetLimit > 0 ? (
                        <div>
                            <div className="flex justify-between items-end mb-1">
                                <p className="text-2xl font-bold text-gray-800">{formatCurrency(budgetLimit)}</p>
                                <span className={`text-xs font-bold ${progressPercent > 100 ? 'text-red-500' : 'text-gray-500'}`}>
                                    {progressPercent.toFixed(0)}%
                                </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className={`h-2 rounded-full ${progressPercent > 100 ? 'bg-red-500' : 'bg-blue-600'}`} style={{ width: `${progressPercent}%` }}></div>
                            </div>
                            <p className="text-xs text-gray-400 mt-2">
                                {progressPercent > 100 ? 'Đã vượt quá hạn mức' : `Còn lại ${formatCurrency(budgetLimit - currentExpense)}`}
                            </p>
                        </div>
                    ) : (
                        <div className="flex flex-col h-full justify-center">
                            <p className="text-gray-400 text-sm">Chưa thiết lập</p>
                            <p className="text-blue-500 text-xs mt-1">Bấm để cài đặt</p>
                        </div>
                    )}
                </div>

                {/* Card 2: Total Expense */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-gray-500 font-medium">Tổng chi</span>
                        <span className="p-2 bg-red-100 text-red-600 rounded-lg"><TrendingDown size={20} /></span>
                    </div>
                    <p className="text-3xl font-bold text-gray-800">{formatCurrency(dashboard?.expense || 0)}</p>
                </div>

                {/* Card 3: Balance */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-gray-500 font-medium">Số dư</span>
                        <span className="p-2 bg-blue-100 text-blue-600 rounded-lg"><Wallet size={20} /></span>
                    </div>
                    <p className={`text-3xl font-bold ${balance >= 0 ? 'text-blue-600' : 'text-orange-500'}`}>
                        {formatCurrency(balance)}
                    </p>
                </div>
            </div>

            {/* Main Content: Members then Transactions */}
            <div className="space-y-8">
                {/* Members Section - Full Width */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-800 mb-4 text-lg">Thành viên ({groupDetail.members.length})</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {groupDetail.members.map(member => (
                            <div key={member.groupMemberId} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                                <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm">
                                    {member.fullName?.charAt(0).toUpperCase() || 'U'}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-800 truncate">{member.fullName}</p>
                                    <p className="text-xs text-gray-500">{member.role === 'admin' ? 'Quản trị viên' : 'Thành viên'}</p>
                                </div>
                                {isAdmin && member.userId !== groupDetail.createdByUserId && (
                                    <button
                                        onClick={() => handleRemoveMember(member.userId)}
                                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                    >
                                        <X size={16} />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Transactions Section - Full Width with Pagination */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                        <div className="flex items-center gap-2">
                            <h3 className="font-bold text-gray-800 text-lg">Lịch sử giao dịch</h3>
                            <div className="relative">
                                <input
                                    type="date"
                                    value={selectedDate}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                    className="pl-3 pr-2 py-1 text-sm border rounded-lg text-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        <button
                            onClick={() => {
                                // Don't change filters here, just open modal
                                setShowTransactionModal(true);
                            }}
                            className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm transition-colors"
                        >
                            + Thêm giao dịch
                        </button>
                    </div>

                    {/* Transaction Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-sm text-gray-500 border-b">
                                    <th className="py-3 font-medium">Ngày</th>
                                    <th className="py-3 font-medium">Nội dung</th>
                                    <th className="py-3 font-medium">Người tạo</th>
                                    <th className="py-3 font-medium">Danh mục</th>
                                    <th className="py-3 font-medium text-right">Số tiền</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {transactions.length > 0 ? (
                                    transactions.map(tx => (
                                        <tr key={tx.transactionId} className="border-b last:border-0 hover:bg-gray-50">
                                            <td className="py-3 text-gray-600 whitespace-nowrap">{tx.transactionDate}</td>
                                            <td className="py-3 font-medium text-gray-900">{tx.description || tx.categoryName}</td>
                                            <td className="py-3 text-gray-600">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-600">
                                                        {tx.fullName?.charAt(0).toUpperCase()}
                                                    </div>
                                                    {tx.fullName}
                                                </div>
                                            </td>
                                            <td className="py-3 text-gray-600">{tx.categoryName}</td>
                                            <td className={`py-3 text-right font-bold ${tx.transactionType === 1 ? 'text-green-600' : 'text-red-600'}`}>
                                                {tx.transactionType === 1 ? '+' : '-'}{formatCurrency(tx.amount)}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="py-8 text-center text-gray-400">Không có giao dịch nào trong khoảng thời gian này</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-center items-center gap-4 mt-6">
                            <button
                                onClick={() => handlePageChange(pagination.page - 1)}
                                disabled={pagination.page === 1}
                                className="p-2 rounded-lg border hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronLeft size={20} />
                            </button>
                            <span className="text-sm font-medium text-gray-600">
                                Trang {pagination.page} / {totalPages}
                            </span>
                            <button
                                onClick={() => handlePageChange(pagination.page + 1)}
                                disabled={pagination.page >= totalPages}
                                className="p-2 rounded-lg border hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* --- Modals --- */}

            <TransactionModal
                isOpen={showTransactionModal}
                onClose={() => setShowTransactionModal(false)}
                selectedDate={new Date(selectedDate)} // Must be Date object
                transactions={null} // Don't show existing transactions list in strict mode to avoid complex structure
                totalCard={{ data: dashboard }}
                onAddTransaction={handleCreateTransaction}
                isLoading={false}
            />

            <SpendingLimitModal
                isOpen={showLimitModal}
                onClose={() => setShowLimitModal(false)}
                currentLimit={budgetLimit}
                onSetLimit={handleUpdateLimit}
            />

            {showAddMember && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 animate-scale-up">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-gray-800">Thêm thành viên</h3>
                            <button onClick={() => setShowAddMember(false)} className="p-2 hover:bg-gray-100 rounded-full"><X size={20} /></button>
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tìm kiếm bằng email</label>
                            <div className="relative">
                                <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="nhập email..."
                                    value={searchEmail}
                                    onChange={(e) => handleSearchUsers(e.target.value)}
                                    autoFocus
                                />
                            </div>
                        </div>
                        <div className="max-h-60 overflow-y-auto mb-6 border rounded-lg divide-y bg-gray-50 min-h-[100px]">
                            {searching ? (
                                <div className="p-4 text-center text-gray-400">Đang tìm...</div>
                            ) : searchResults.length > 0 ? (
                                searchResults.map(user => (
                                    <div
                                        key={user.userId}
                                        onClick={() => setSelectedUserToAdd(user)}
                                        className={`p-3 flex items-center justify-between cursor-pointer hover:bg-white transition-colors ${selectedUserToAdd?.userId === user.userId ? 'bg-blue-50 border-l-4 border-blue-500' : ''}`}
                                    >
                                        <div>
                                            <p className="font-medium text-gray-800">{user.fullName}</p>
                                            <p className="text-xs text-gray-500">{user.email}</p>
                                        </div>
                                        {selectedUserToAdd?.userId === user.userId && <span className="text-blue-600 text-xs font-bold bg-blue-100 px-2 py-1 rounded-full">Đã chọn</span>}
                                    </div>
                                ))
                            ) : (
                                searchEmail.length > 2 && <div className="p-4 text-center text-gray-400">Không tìm thấy user nào</div>
                            )}
                        </div>
                        <div className="flex gap-3">
                            <button onClick={() => setShowAddMember(false)} className="flex-1 py-2 border rounded-lg hover:bg-gray-50 font-medium">Hủy</button>
                            <button
                                onClick={handleAddMember}
                                disabled={!selectedUserToAdd}
                                className="flex-1 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                            >
                                Thêm vào nhóm
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showEditGroup && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in">
                    <div className="bg-white rounded-xl w-full max-w-md p-6 animate-scale-up">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-gray-800">Cài đặt nhóm</h3>
                            <button onClick={() => setShowEditGroup(false)} className="p-2 hover:bg-gray-100 rounded-full"><X size={20} /></button>
                        </div>
                        <form onSubmit={handleUpdateGroup}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tên nhóm</label>
                                <input type="text" required className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" value={editForm.groupName} onChange={(e) => setEditForm({ ...editForm, groupName: e.target.value })} />
                            </div>
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                                <textarea className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" rows="3" value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}></textarea>
                            </div>
                            <div className="flex gap-3">
                                <button type="button" onClick={() => setShowEditGroup(false)} className="flex-1 py-2 border rounded-lg hover:bg-gray-50 font-medium">Hủy</button>
                                <button type="submit" className="flex-1 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700">Lưu thay đổi</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in">
                    <div className="bg-white rounded-xl w-full max-w-sm p-6 text-center animate-scale-up">
                        <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4"><Trash2 className="text-red-600" /></div>
                        <h3 className="text-lg font-bold mb-2 text-gray-900">Xóa nhóm này?</h3>
                        <p className="text-gray-500 mb-6">Hành động này không thể hoàn tác.</p>
                        <div className="flex gap-3">
                            <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 py-2 border rounded-lg hover:bg-gray-50 font-medium">Hủy</button>
                            <button onClick={handleDeleteGroup} className="flex-1 py-2 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700">Xóa vĩnh viễn</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GroupDetail;
