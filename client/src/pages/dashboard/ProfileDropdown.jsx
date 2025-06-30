import React from 'react'
import {LogOut, User, Settings, HelpCircle} from 'lucide-react';
const ProfileDropdown = ({onLogout}) => {
    return (
        <div className="absolute top-14 right-0 w-60 bg-white rounded-lg shadow-xl border z-50 animate-fade-in-up" style={{ animationDuration: '0.3s' }}>
            <div className="p-2">
                <div className="flex items-center gap-3 px-3 py-2">
                    <img src="https://placehold.co/40x40/e0e7ff/3730a3?text=A" alt="Avatar" className="w-10 h-10 rounded-full" />
                    <div>
                        <p className="font-bold text-gray-800">Anh Nguyễn</p>
                        <p className="text-sm text-gray-500">Người dùng Pro</p>
                    </div>
                </div>
                <div className="border-t my-1"></div>
                <a href="#" className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"><User size={16} /><span>Thông tin tài khoản</span></a>
                <a href="#" className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"><Settings size={16} /><span>Cài đặt</span></a>
                <a href="#" className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"><HelpCircle size={16} /><span>Trợ giúp & Hỗ trợ</span></a>
                <div className="border-t my-1"></div>
                <button onClick={onLogout} className="w-full text-left flex items-center gap-3 px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded-md"><LogOut size={16} /><span>Đăng xuất</span></button>
            </div>
        </div>
    )
}

export default ProfileDropdown