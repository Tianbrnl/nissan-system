import {
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from "recharts";

const models = [
    { name: 'E26', data: 12 },
    { name: 'Kicks', data: 18 },
    { name: 'Prem', data: 7 },
    { name: 'NissanZ', data: 7 },
    { name: 'Livina', data: 9 },
    { name: 'Terra', data: 11 },
    { name: 'D23', data: 15 },
    { name: 'Patrol', data: 8 },
    { name: 'N18', data: 12 }
];

const COLORS = [
    "#3b82f6",
    "#10B981",
    "#F59E0B",
    "#3b82f6",
    "#10B981",
    "#F59E0B",
    "#3b82f6",
    "#10B981",
    "#F59E0B"
];

export default function ModelDistribution() {

    return (
        <ResponsiveContainer width="100%" height="100%">
            <PieChart>
                <Tooltip formatter={(value) => `${value}%`} />

                <Pie
                    data={models}
                    dataKey="data"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    labelLine={false}
                >
                    {models.map((entry, index) => (
                        <Cell
                            key={index}
                            fill={COLORS[index % COLORS.length]}
                        />
                    ))}
                </Pie>
            </PieChart>
        </ResponsiveContainer>
    );
}