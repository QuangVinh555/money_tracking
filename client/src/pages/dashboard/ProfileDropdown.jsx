import React from 'react'
import {LogOut, User, Settings, HelpCircle} from 'lucide-react';
const ProfileDropdown = ({userInfo, onLogout}) => {
    return (
        <div className="absolute top-14 right-0 w-60 bg-gradient-to-br from-white to-emerald-50 rounded-xl shadow-2xl border border-emerald-100 z-50 animate-fade-in-up backdrop-blur-sm" style={{ animationDuration: '0.3s' }}>
            <div className="p-3">
                <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg mb-2">
                    <img src="https://placehold.co/40x40/10b981/ffffff?text=A" alt="Avatar" className="w-10 h-10 rounded-full ring-2 ring-emerald-300" />
                    <div>
                        <p className="font-bold text-gray-800">{userInfo}</p>
                        <p className="text-xs text-emerald-600 font-semibold">Người dùng Pro</p>
                    </div>
                </div>
                <div className="border-t border-emerald-100 my-2"></div>
                <a href="#" className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 hover:bg-emerald-100 hover:text-emerald-700 rounded-lg transition-colors"><User size={16} /><span>Thông tin tài khoản</span></a>
                <a href="#" className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 hover:bg-emerald-100 hover:text-emerald-700 rounded-lg transition-colors"><Settings size={16} /><span>Cài đặt</span></a>
                <a href="#" className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 hover:bg-emerald-100 hover:text-emerald-700 rounded-lg transition-colors"><HelpCircle size={16} /><span>Trợ giúp & Hỗ trợ</span></a>
                <div className="border-t border-emerald-100 my-2"></div>
                <button onClick={onLogout} className="w-full text-left flex items-center gap-3 px-3 py-2.5 text-sm text-emerald-600 hover:bg-emerald-100 font-semibold rounded-lg transition-colors"><LogOut size={16} /><span>Đăng xuất</span></button>
            </div>
        </div>
    )
}

export default ProfileDropdown