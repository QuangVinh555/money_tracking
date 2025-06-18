// --- HELPER FUNCTIONS ---
// Hàm định dạng số tiền
export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};