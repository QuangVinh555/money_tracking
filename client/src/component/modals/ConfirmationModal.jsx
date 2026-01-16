import {
    PieChart as PieChartIcon, AlertTriangle
} from 'lucide-react';
const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, children, loading }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md flex flex-col">
                <div className="p-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-emerald-100 rounded-full">
                            <AlertTriangle className="text-emerald-600" size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">{title}</h2>
                            <div className="text-gray-600 mt-2">{children}</div>
                        </div>
                    </div>
                </div>
                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 px-6 py-4 flex justify-end gap-4 rounded-b-2xl">
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="px-4 py-2 font-semibold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50"
                    >
                        Hủy bỏ
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className="px-4 py-2 font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {loading && (
                            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                            </svg>
                        )}
                        {loading ? "Đang xóa..." : "Xác nhận Xóa"}
                    </button>
                </div>
            </div>
        </div>
    );
};
export default ConfirmationModal;
