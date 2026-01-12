import React, { useEffect, useState } from 'react';
import { Users, Plus, Calendar, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import groupApi from '../../api/modules/groupApi';

const Groups = () => {
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [newGroup, setNewGroup] = useState({ groupName: '', description: '' });
    const navigate = useNavigate();

    useEffect(() => {
        fetchGroups();
    }, []);

    const fetchGroups = async () => {
        try {
            const response = await groupApi.getGroups();
            if (response.data.success) {
                setGroups(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching groups:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateGroup = async (e) => {
        e.preventDefault();
        try {
            const response = await groupApi.createGroup(newGroup);
            if (response.data.success) {
                setShowCreateDialog(false);
                setNewGroup({ groupName: '', description: '' });
                fetchGroups();
            }
        } catch (error) {
            console.error('Error creating group:', error);
        }
    };

    // Grouping Logic: CreatedAt -> Month/Year
    const groupedGroups = groups.reduce((acc, group) => {
        const date = new Date(group.createdAt);
        const monthYear = `Tháng ${date.getMonth() + 1}/${date.getFullYear()}`;
        if (!acc[monthYear]) {
            acc[monthYear] = [];
        }
        acc[monthYear].push(group);
        return acc;
    }, {});

    // Convert to array and sort (Recent months first) -> Actually groups are already sorted by CreatedAt descending from backend
    // but object keys iteration might be arbitrary? Better keep valid sort.
    // We can rely on original 'groups' order if we iterate unique keys based on appearance.
    const sortedMonthKeys = Object.keys(groupedGroups).sort((a, b) => {
        // Parse "Tháng M/YYYY"
        const [mA, yA] = a.replace('Tháng ', '').split('/').map(Number);
        const [mB, yB] = b.replace('Tháng ', '').split('/').map(Number);
        if (yA !== yB) return yB - yA;
        return mB - mA;
    });


    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="p-6 min-h-screen bg-gray-50 font-sans">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                        Quỹ Nhóm
                    </h1>
                    <p className="text-gray-500 mt-2 font-medium">Quản lý ngân sách chung cho các kế hoạch của bạn</p>
                </div>
                <button
                    onClick={() => setShowCreateDialog(true)}
                    className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:shadow-lg hover:opacity-95 transition-all font-bold shadow-md transform hover:-translate-y-0.5"
                >
                    <Plus size={20} />
                    Tạo nhóm mới
                </button>
            </div>

            {/* Groups List */}
            {groups.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl shadow-sm border border-gray-100 text-center">
                    <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-6">
                        <Users size={48} className="text-blue-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Chưa có quỹ nhóm nào</h3>
                    <p className="text-gray-500 mb-8 max-w-md">Hãy tạo nhóm đầu tiên để bắt đầu quản lý chi tiêu chung cùng bạn bè và người thân.</p>
                    <button
                        onClick={() => setShowCreateDialog(true)}
                        className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
                    >
                        Bắt đầu ngay
                    </button>
                </div>
            ) : (
                <div className="space-y-10">
                    {sortedMonthKeys.map(month => (
                        <div key={month} className="animate-fade-in-up">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                                    <Calendar size={20} />
                                </div>
                                <h2 className="text-xl font-bold text-gray-800 uppercase tracking-wide">{month}</h2>
                                <div className="h-px bg-gray-200 flex-1 ml-4"></div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {groupedGroups[month].map((group) => (
                                    <div
                                        key={group.groupId}
                                        onClick={() => navigate(`/groups/${group.groupId}`)}
                                        className="group bg-white rounded-2xl p-6 hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 relative overflow-hidden transform hover:-translate-y-1"
                                    >
                                        <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-blue-500 to-indigo-600"></div>

                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-indigo-50 rounded-2xl flex items-center justify-center text-blue-600 shadow-inner group-hover:scale-110 transition-transform">
                                                    <Users size={28} />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-xl text-gray-800 group-hover:text-blue-600 transition-colors">{group.groupName}</h3>
                                                    <p className="text-sm font-medium text-gray-400">{group.memberCount} thành viên</p>
                                                </div>
                                            </div>
                                        </div>

                                        {group.description && (
                                            <p className="text-gray-500 text-sm mb-6 line-clamp-2 pl-2 border-l-2 border-gray-100 italic">
                                                "{group.description}"
                                            </p>
                                        )}

                                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-semibold text-gray-400 uppercase">Admin</span>
                                                <span className="text-sm font-medium text-gray-700">{group.createdByUserName}</span>
                                            </div>
                                            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                                <ArrowRight size={16} />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Create Group Dialog - Styled */}
            {showCreateDialog && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm animate-fade-in p-4">
                    <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl animate-scale-up">
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-3 text-blue-600">
                                <Plus size={32} />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800">Tạo nhóm quỹ mới</h2>
                            <p className="text-gray-500">Thiết lập không gian chung cho chi tiêu</p>
                        </div>

                        <form onSubmit={handleCreateGroup}>
                            <div className="mb-5">
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    Tên nhóm <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={newGroup.groupName}
                                    onChange={(e) => setNewGroup({ ...newGroup, groupName: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 hover:bg-white"
                                    placeholder="Ví dụ: Du lịch Đà Nẵng 2026"
                                    required
                                    autoFocus
                                />
                            </div>
                            <div className="mb-8">
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    Mô tả ngắn
                                </label>
                                <textarea
                                    value={newGroup.description}
                                    onChange={(e) => setNewGroup({ ...newGroup, description: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 hover:bg-white"
                                    placeholder="Mô tả mục đích của nhóm..."
                                    rows="3"
                                />
                            </div>
                            <div className="flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowCreateDialog(false);
                                        setNewGroup({ groupName: '', description: '' });
                                    }}
                                    className="flex-1 px-6 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 font-bold text-gray-600 transition-colors"
                                >
                                    Hủy bỏ
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold hover:shadow-lg hover:opacity-95 transition-all shadow-md"
                                >
                                    Tạo nhóm
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Groups;
