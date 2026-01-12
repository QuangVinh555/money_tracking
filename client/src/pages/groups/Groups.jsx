import React, { useEffect, useState } from 'react';
import { Users, Plus, TrendingUp, TrendingDown } from 'lucide-react';
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

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-gray-500">Đang tải...</div>
            </div>
        );
    }

    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Quỹ Nhóm</h1>
                    <p className="text-gray-600 mt-1">Quản lý tài chính chung với nhóm của bạn</p>
                </div>
                <button
                    onClick={() => setShowCreateDialog(true)}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <Plus size={20} />
                    Tạo nhóm mới
                </button>
            </div>

            {/* Groups Grid */}
            {groups.length === 0 ? (
                <div className="text-center py-12">
                    <Users size={64} className="mx-auto text-gray-300 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">Chưa có nhóm nào</h3>
                    <p className="text-gray-500 mb-4">Tạo nhóm đầu tiên để bắt đầu quản lý quỹ chung</p>
                    <button
                        onClick={() => setShowCreateDialog(true)}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Tạo nhóm ngay
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {groups.map((group) => (
                        <div
                            key={group.groupId}
                            onClick={() => navigate(`/groups/${group.groupId}`)}
                            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer border border-gray-200"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                        <Users size={24} className="text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-gray-800">{group.groupName}</h3>
                                        <p className="text-sm text-gray-500">{group.memberCount} thành viên</p>
                                    </div>
                                </div>
                            </div>

                            {group.description && (
                                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{group.description}</p>
                            )}

                            <div className="border-t pt-4">
                                <p className="text-xs text-gray-500">
                                    Tạo bởi: <span className="font-medium">{group.createdByUserName}</span>
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Create Group Dialog */}
            {showCreateDialog && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h2 className="text-2xl font-bold mb-4">Tạo nhóm mới</h2>
                        <form onSubmit={handleCreateGroup}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Tên nhóm <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={newGroup.groupName}
                                    onChange={(e) => setNewGroup({ ...newGroup, groupName: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Ví dụ: Quỹ gia đình"
                                    required
                                />
                            </div>
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Mô tả
                                </label>
                                <textarea
                                    value={newGroup.description}
                                    onChange={(e) => setNewGroup({ ...newGroup, description: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Mô tả về nhóm..."
                                    rows="3"
                                />
                            </div>
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowCreateDialog(false);
                                        setNewGroup({ groupName: '', description: '' });
                                    }}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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
