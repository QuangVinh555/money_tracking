import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import { Menu } from "lucide-react";
import MoneyBot from "./Moneybot";

const Layout = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50 flex flex-col">
      {/* Header nhỏ có nút menu cho mobile */}
      <header className="lg:hidden fixed top-0 left-0 w-full z-40 bg-white flex items-center justify-between p-4">
        <button onClick={() => setMobileMenuOpen(true)}>
          <Menu size={24} />
        </button>
        <h1 className="text-2xl font-bold text-emerald-600 lg:block">Expense Money</h1>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          isMobileMenuOpen={isMobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
        />

        {/* Main */}
        <main className="bg-gradient-to-b from-emerald-50/30 to-teal-50/20 flex-1 overflow-auto p-4 pt-16 lg:pt-4 lg:ml-64 ">
          <Outlet />
        </main>
      </div>
      <MoneyBot />
      <Footer />
    </div>
  );
};

export default Layout;
