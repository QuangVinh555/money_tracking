import React from "react";
import { DollarSign, LayoutDashboard, Repeat, CreditCard, Wallet, Gem, Users } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const menuItems = [
  { name: "Tổng quan", icon: <LayoutDashboard />, path: "/" },
  { name: "Giao dịch", icon: <Repeat />, path: "/transactions" },
  // { name: "Danh mục", icon: <CreditCard />, path: "/categories" },
  // { name: "Ngân sách", icon: <Wallet />, path: "/budgets" },
  { name: "Quỹ nhóm", icon: <Users />, path: "/groups" },
];

const Sidebar = ({ isMobileMenuOpen, setMobileMenuOpen }) => {
  const location = useLocation();

  return (
    <>
      {/* Overlay cho mobile */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        ></div>
      )}

      <aside
        className={`fixed top-0 left-0 h-screen bg-gradient-to-b from-white via-emerald-50 to-teal-50 p-4 flex flex-col z-50 shadow-xl
        transform transition-transform duration-300
        ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0 lg:fixed lg:w-64`}
      >
        {/* Logo */}
        <a href="#" className="flex items-center gap-2 mb-6 pb-4 border-b-2 border-emerald-200">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center shadow-lg">
            <DollarSign size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-600">
              Expense
            </h1>
            <p className="text-xs font-semibold text-teal-600">Money</p>
          </div>
        </a>

        {/* Menu */}
        <nav className="flex-grow">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group ${
                      isActive
                        ? "bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 font-bold shadow-md border-l-4 border-emerald-600"
                        : "text-gray-600 hover:bg-white/60 hover:shadow-sm hover:text-emerald-600"
                    }`}
                  >
                    {React.cloneElement(item.icon, {
                      size: 22,
                      className: isActive ? "text-emerald-600" : "text-gray-400 group-hover:text-emerald-500 transition-colors",
                    })}
                    <span>{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Upgrade card */}
        <div className="hidden lg:block bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 text-white p-5 rounded-2xl text-center mt-6 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="p-3 bg-white/30 rounded-full inline-block mb-3 backdrop-blur-sm">
            <Gem size={28} className="text-yellow-200" />
          </div>
          <h4 className="font-bold text-lg">Nâng cấp Pro</h4>
          <p className="text-xs text-emerald-100 mt-2 mb-4 leading-relaxed">
            Mở khóa tất cả tính năng và nhận báo cáo không giới hạn.
          </p>
          <button className="bg-white text-emerald-600 font-bold w-full py-2.5 rounded-xl text-sm hover:bg-yellow-50 hover:shadow-lg transition-all duration-200 transform hover:scale-105">
            Nâng cấp ngay
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
