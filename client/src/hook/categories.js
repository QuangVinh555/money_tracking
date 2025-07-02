import { useState, useEffect } from 'react';
import categoriesApi from '../api/modules/categories';

export default function useCategories() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    // Lấy ra tất cả danh mục
    const fetchCategories = async () => {
        try {
            const res = await categoriesApi.getAll();
            setCategories(res.data);
        } catch (err) {
            console.error('Lỗi fetch categories:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    return {
        categories,
        loading,
        // createTransactions,
        // updateTransactions,
        // deleteTransactions,
    };
}