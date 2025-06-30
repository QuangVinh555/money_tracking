import React from "react";
import {
  DollarSign,
  LayoutDashboard,
  Repeat,
  Wallet,
  Settings,
  Gem,
  CreditCard,
} from "lucide-react";
import { useLocation } from "react-router-dom";

export const menuItems = [
  {
    name: "Tổng quan",
    icon: <LayoutDashboard />,
    path: "/",
    active: true,
  },
  { name: "Giao dịch", icon: <Repeat />, path: "/transactions", active: false },
  {
    name: "Danh mục",
    icon: <CreditCard />,
    path: "/categories",
    active: false,
  },
  { name: "Ngân sách", icon: <Wallet />, path: "/budgets", active: false },
  // { name: 'Báo cáo', icon: <BarChart3 />, active: false },
//   { name: "Cài đặt", icon: <Settings />, path: "/setting", active: false },
];

const Sidebar = () => {
  const location = useLocation();

  return (
    <aside className="w-20 lg:w-64 bg-white p-4 lg:p-6 flex flex-col border-r h-screen fixed top-0">
      <a
        href="#"
        className="flex items-center gap-2 mb-10 self-center lg:self-start"
      >
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <DollarSign size={20} className="text-white" />
        </div>
        <h1 className="text-2xl font-bold text-blue-600 hidden lg:block whitespace-nowrap">
          Expense Money
        </h1>
      </a>

      <nav className="flex-grow">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={`${item.name}`}>
                <a
                  href={item.path}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-blue-50 text-blue-600 font-bold"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {React.cloneElement(item.icon, {
                    size: 22,
                    className: `flex-shrink-0 ${
                      item.active ? "text-blue-600" : "text-gray-500"
                    }`,
                  })}
                  <span className="hidden lg:block">{item.name}</span>
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Upgrade Card */}
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

      {/* User Profile */}
      {/* <div className="flex items-center gap-3 mt-6 border-t pt-6">
        <img
          src="https://placehold.co/40x40/e0e7ff/3730a3?text=A"
          alt="Avatar"
          className="w-10 h-10 rounded-full"
        />
        <div className="hidden lg:block">
          <p className="font-bold">Quang Vinh</p>
          <p className="text-sm text-gray-500">voquangvinh555@gmail.com</p>
        </div>
      </div> */}
    </aside>
  );
};
export default Sidebar;
