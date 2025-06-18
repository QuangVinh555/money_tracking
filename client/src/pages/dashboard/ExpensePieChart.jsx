import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { COLORS } from '../../constants/mock_data';
import { formatCurrency } from '../../utils/format';

const ExpensePieChart = ({ data }) => (
    <div className="bg-white p-6 rounded-2xl shadow-md h-full">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Phân tích Chi tiêu</h3>
        <div style={{ width: '100%', height: 250 }}>
            <ResponsiveContainer>
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                </PieChart>
            </ResponsiveContainer>
        </div>
    </div>
);

export default ExpensePieChart