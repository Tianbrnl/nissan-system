import { useEffect, useState } from "react";
import { Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { fetchUnitDestribution } from "../services/vehicleSales";

export default function UnitDistribution({ monthYear = '' }) {
    const [data, setData] = useState([]);

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AA336A', '#33AA99'];

    useEffect(() => {
        const load = async () => {
            try {
                const { success, message, data: apiData } = await fetchUnitDestribution(monthYear);
                if (success) setData(apiData);
                else console.error(message);
            } catch (error) {
                console.error(error);
            }
        }
        load();
    }, [monthYear]);

    return (
        <div style={{ width: '100%', height: 300 }}>
            {data.length > 0 ?
                <ResponsiveContainer>
                    <PieChart>
                        <Tooltip formatter={(value) => `${value}%`} />
                        <Pie
                            data={data}
                            dataKey="count"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            labelLine={false}
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
                :
                <div className="text-center p-4">
                    <h3>NO DATA</h3>
                </div>
            }
        </div>
    );
}