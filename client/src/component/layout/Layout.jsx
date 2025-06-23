import React from 'react';
import { Outlet } from "react-router-dom";
import Sidebar from './Sidebar';
const Layout = () => {
    return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <main className="flex-1 overflow-auto">
          <Outlet />
      </main>
    </div>
    )
}

export default Layout