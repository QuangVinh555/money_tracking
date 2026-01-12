// --- HELPER FUNCTIONS ---
// Hàm định dạng số tiền
export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

export const formatDate = (date) => {
    if (!(date instanceof Date)) {
        date = new Date(date);
    }
    return new Intl.DateTimeFormat('vi-VN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }).format(date);
};

/**
 * Trả về chuỗi ISO 8601 (UTC)
 * Ví dụ: "2025-06-04T00:00:00.000Z"
 * Dùng để truyền xuống cho BE
 */
export const formatToUTCDateString = (date) => {
    if (!(date instanceof Date)) {
        date = new Date(date); // Trường hợp truyền vào là chuỗi ISO
    }
    return date.toISOString();
};

/**
 * Chuyển Date về local dạng "YYYY-MM-DD HH:MM:SS"
 * Nhận từ BE và convert sang local để hiển thị cho FE
 */
export const formatToLocalDateTimeString = (date) => {
    if (!(date instanceof Date)) {
        date = new Date(date);
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');
    const second = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
};

/**
 * Chuyển Date về local dạng "YYYY-MM-DD"
 * Không bao gồm giờ phút giây.
 * Dùng để so sánh ngày
 */
export const formatToLocalDateString = (date) => {
    if (!(date instanceof Date)) {
        date = new Date(date);
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // tháng: 0-11
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
};

// --- HELPER FUNCTIONS ---
// Lấy ngày đầu tiên của tháng hiện tại, trả về string "YYYY-MM-DD"
export const getFirstDayOfCurrentMonth = () => {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);

    const yyyy = firstDay.getFullYear();
    const mm = String(firstDay.getMonth() + 1).padStart(2, '0');
    const dd = String(firstDay.getDate()).padStart(2, '0');

    return `${yyyy}-${mm}-${dd}`;
};

// Lấy ngày hôm nay, trả về string "YYYY-MM-DD"
export const getTodayDate = () => {
    const today = new Date();

    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');

    return `${yyyy}-${mm}-${dd}`;
};


