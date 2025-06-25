import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route
} from 'react-router-dom';
import Layout from './component/layout/Layout';
import Dashboard from './pages/dashboard/Dashboard';
import Transactions from './pages/transactions/Transactions';
import Categories from './pages/categories/Categories';
import Budgets from './pages/budgets/Budgets';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="transactions" element={<Transactions />} />
                    <Route path="categories" element={<Categories />} />
                    <Route path="budgets" element={<Budgets />} />
                    {/* <Route path="accounts" element={<Accounts />} />
                    <Route path="goals" element={<Goals />} /> */}
                </Route>
                {/* <Route path="*" element={<NotFound />} /> */}
            </Routes>
        </BrowserRouter>
    )
}

export default App
