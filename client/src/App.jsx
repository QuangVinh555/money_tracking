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
import Login from './pages/login/Login';
import GuestRoute from './pages/login/GuestRoute';
import PrivateRoute from './pages/login/PrivateRoute';
import Groups from './pages/groups/Groups';
import GroupDetail from './pages/groups/GroupDetail';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="login" element={<GuestRoute><Login /></GuestRoute>} />
                <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
                    <Route index element={<Dashboard />} />
                    <Route path="transactions" element={<Transactions />} />
                    <Route path="categories" element={<Categories />} />
                    <Route path="groups" element={<Groups />} />
                    <Route path="groups/:groupId" element={<GroupDetail />} />
                    {/* <Route path="budgets" element={<Budgets />} /> */}
                    {/* <Route path="accounts" element={<Accounts />} />
                    <Route path="goals" element={<Goals />} /> */}
                </Route>
                {/* <Route path="*" element={<NotFound />} /> */}
            </Routes>
        </BrowserRouter>
    )
}

export default App
