import axiosClient from '../axiosClient.js';

const groupApi = {
    // Lấy danh sách nhóm
    getGroups: () => axiosClient.get('/groups'),

    // Lấy chi tiết nhóm
    getGroupDetail: (groupId) => axiosClient.get(`/groups/${groupId}`),

    // Tạo nhóm mới
    createGroup: (data) => axiosClient.post('/groups', data),

    // Cập nhật nhóm
    updateGroup: (groupId, data) => axiosClient.put(`/groups/${groupId}`, data),

    // Xóa nhóm
    deleteGroup: (groupId) => axiosClient.delete(`/groups/${groupId}`),

    // Thêm thành viên
    addMember: (groupId, data) => axiosClient.post(`/groups/${groupId}/members`, data),

    // Xóa thành viên
    removeMember: (groupId, userId) => axiosClient.delete(`/groups/${groupId}/members/${userId}`),

    // Tìm kiếm user theo email
    searchUsers: (email) => axiosClient.get('/groups/search-users', {
        params: { email }
    }),

    // Lấy dashboard nhóm
    getGroupDashboard: (groupId, datetime) => axiosClient.get(`/groups/${groupId}/dashboard`, {
        params: { optionDate: datetime }
    }),

    // Lấy giao dịch nhóm
    getGroupTransactions: (groupId, params = {}) => axiosClient.get(`/groups/${groupId}/transactions`, {
        params: params
    }),

    // Lấy giao dịch nhóm theo ngày
    getGroupTransactionsByDate: (groupId, datetime) => axiosClient.get(`/groups/${groupId}/transactions/group-by-date`, {
        params: { optionDate: datetime }
    }),
};

export default groupApi;
