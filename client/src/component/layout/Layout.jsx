import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
const Layout = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 ml-20 lg:ml-64 overflow-auto">
          <Outlet />
        </main>
      </div>
      {/* Footer nằm dưới cùng, không bị chia ngang */}
      <div className="flex-1 ml-20 lg:ml-64">
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
