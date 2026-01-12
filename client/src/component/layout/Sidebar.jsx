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
        className={`fixed top-0 left-0 h-screen bg-white p-4 flex flex-col z-50
        transform transition-transform duration-300
        ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0 lg:fixed lg:w-64`}
      >
        {/* Logo */}
        <a href="#" className="flex items-center gap-2 mb-10">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <DollarSign size={20} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-blue-600">
            Expense Money
          </h1>
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
                    className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${isActive
                      ? "bg-blue-50 text-blue-600 font-bold"
                      : "hover:bg-gray-100 text-gray-600"
                      }`}
                  >
                    {React.cloneElement(item.icon, {
                      size: 22,
                      className: isActive ? "text-blue-600" : "text-gray-500",
                    })}
                    <span>{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Upgrade card */}
        <div className="hidden lg:block bg-gradient-to-br from-blue-500 to-indigo-600 text-white p-4 rounded-lg text-center mt-6">
          <div className="p-3 bg-white/20 rounded-full inline-block mb-2">
            <Gem size={24} />
          </div>
          <h4 className="font-bold">Nâng cấp Pro</h4>
          <p className="text-xs text-blue-200 mt-1 mb-3">
            Mở khóa tất cả tính năng và nhận báo cáo không giới hạn.
          </p>
          <button className="bg-white text-blue-600 font-bold w-full py-2 rounded-lg text-sm hover:bg-blue-50 transition-colors">
            Nâng cấp
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
