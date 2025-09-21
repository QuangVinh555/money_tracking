const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, children }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md flex flex-col">
                <div className="p-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-red-100 rounded-full"><AlertTriangle className="text-red-600" size={24} /></div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">{title}</h2>
                            <div className="text-gray-600 mt-2">{children}</div>
                        </div>
                    </div>
                </div>
                <div className="bg-gray-50 px-6 py-4 flex justify-end gap-4 rounded-b-2xl">
                    <button onClick={onClose} className="px-4 py-2 font-semibold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300">Hủy bỏ</button>
                    <button onClick={onConfirm} className="px-4 py-2 font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700">Xác nhận Xóa</button>
                </div>
            </div>
        </div>
    );
};
export default ConfirmationModal